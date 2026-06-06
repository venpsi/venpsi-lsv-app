//  VENPSI LSV — Punto de entrada principal
// ============================================================
import {
  state,
  getNombreUsuario,
  getPtsTotales,
  getRacha,
  getLeccionesCompletadas,
  marcarCompletada,
} from "./lib/state.js";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  signUp,
  signIn,
  signOut,
  resetPassword,
  getUsuario,
  getProgreso,
  upsertProgreso,
  updateUsuarioPuntos,
} from "./lib/supabase.js";
import {
  SECCIONES,
  LECCIONES,
  getQuizImgUrl,
  shuffle,
  buildQuizOptions,
} from "./lib/data.js";


// ── Screen navigation ─────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  
  // CORRECCIÓN: Ejecuta automáticamente la función que libera el scroll en móviles
  if (typeof updateAppScroll === 'function') {
    updateAppScroll(id);
  }
}




// ── WELCOME ───────────────────────────────────────────────────
window.onClickRegister = () => {
  switchAuthTab("register");
  show("auth");
};
window.onClickLogin = () => {
  switchAuthTab("login");
  show("auth");
};
window.onClickGuest = () => {
  state.isGuest = true;
  state.usuario = {
    nombre: "Invitado",
    pts_totales: 0,
    racha: 1,
    created_at: new Date().toISOString(),
  };
  renderHome();
  show("home");
};

// ── AUTH ──────────────────────────────────────────────────────
window.switchAuthTab = (tab) => {
  ["register", "login"].forEach((t) => {
    document.getElementById("form-" + t).style.display =
      t === tab ? "flex" : "none";
    document.getElementById("tab-" + t).classList.toggle("active", t === tab);
  });
  if (tab === "register")
    document.getElementById("form-register").style.flexDirection = "column";
  if (tab === "login")
    document.getElementById("form-login").style.flexDirection = "column";
};

window.doRegister = async () => {
  const f = (id) => document.getElementById(id)?.value?.trim();
  const err = document.getElementById("reg-error");
  err.classList.remove("show");
  const nombre = f("reg-nombre"),
    apellido = f("reg-apellido");
  const edad = f("reg-edad"),
    email = f("reg-email"),
    pass = f("reg-pass");
  if (!nombre || !email || !pass) {
    err.textContent = "Completa todos los campos obligatorios.";
    err.classList.add("show");
    return;
    
  }
  if (pass.length < 6) {
    err.textContent = "La contraseña debe tener al menos 6 caracteres.";
    err.classList.add("show");
    return;
  }
  try {
    const data = await signUp({
      email,
      password: pass,
      nombre,
      apellido,
      edad,
    });
    state.session = data.session;
    state.usuario = {
      nombre: `${nombre} ${apellido}`.trim(),
      email,
      edad,
      pts_totales: 0,
      racha: 1,
      created_at: new Date().toISOString(),
      id: data.user?.id,
    };
    state.isGuest = false;
    renderHome();
    show("home");
  } catch (e) {
    err.textContent = e.message || "Error al registrar.";
    err.classList.add("show");
  }
};

window.doLogin = async () => {
  const f = (id) => document.getElementById(id)?.value?.trim();
  const err = document.getElementById("log-error");
  err.classList.remove("show");
  const email = f("log-email"),
    pass = f("log-pass");
  if (!email || !pass) {
    err.textContent = "Ingresa tu correo y contraseña.";
    err.classList.add("show");
    return;
  }
  try {
    const data = await signIn({ email, password: pass });
    state.session = data;
    const meta = data.user?.user_metadata || {};
    const nombreCompleto = (meta.nombre || email.split("@")[0]).split(" ");
    const userId = data.user?.id;
    let usuarioDB = null;
    if (userId) {
      usuarioDB = await getUsuario(userId);
      const prog = await getProgreso(userId);
      prog.forEach((p) => {
        if (p.completado)
          state.progreso[p.leccion_id] = {
            completado: true,
            puntaje: p.puntaje,
          };
      });
    }
    state.usuario = usuarioDB || {
      nombre: nombreCompleto.join(" "),
      email,
      pts_totales: 0,
      racha: 1,
      created_at: data.user?.created_at || new Date().toISOString(),
      id: userId,
    };
    state.isGuest = false;
    renderHome();
    show("home");
  } catch (e) {
    err.textContent = e.message || "Credenciales incorrectas.";
    err.classList.add("show");
  }
};

window.doForgotPassword = async () => {
  const email = document.getElementById("log-email")?.value?.trim();
  const err = document.getElementById("log-error");
  err.removeAttribute("style");
  err.classList.remove("show");

  if (!email) {
    err.textContent = "Ingresa tu correo primero.";
    err.classList.add("show");
    return;
  }

  try {
    await resetPassword(email);
    err.style.background = "#D1FAE5";
    err.style.borderColor = "#6EE7B7";
    err.style.color = "#065F46";
    err.textContent = "✅ Correo enviado. Revisa tu bandeja de entrada.";
    err.classList.add("show");
  } catch (e) {
    err.textContent = e.message || "Error al enviar el correo.";
    err.classList.add("show");
  }
};

// ── HOME ──────────────────────────────────────────────────────
function renderHome() {
  const nombre = getNombreUsuario();
  const initials = state.isGuest
    ? "👤"
    : nombre
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?";
  set("home-name", nombre);
  set("home-avatar", initials);
  set("stat-pts", getPtsTotales());
  set("stat-racha", getRacha());
  set("stat-lecc", getLeccionesCompletadas());

  const list = document.getElementById("sections-list");
  if (!list) return;
  list.innerHTML = "";
  SECCIONES.forEach((sec) => {
    const lessons = LECCIONES[sec.id] || [];
    const done = lessons.filter((l) => state.progreso[l.id]?.completado).length;
    const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
    const badge = sec.id === "abc" ? "badge-blue" : "badge-green";
    list.innerHTML += `
      <div class="section-card" onclick="openSection('${sec.id}')">
        <div class="section-card-header">
          <div>
            <div class="section-card-name">${sec.emoji} ${sec.nombre}</div>
            <div class="section-card-desc">${sec.descripcion}</div>
          </div>
          <span class="badge ${badge}">${lessons.length} lec.</span>
        </div>
        <div class="section-card-prog">
          <div class="prog-row">
            <span class="prog-row-label">${done} de ${lessons.length} completadas</span>
            <span class="prog-row-pct">${pct}%</span>
          </div>
          <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
        </div>
      </div>`;
  });
}

window.goProfile = () => {
  renderProfile();
  show("profile");
};


// ── LESSONS ───────────────────────────────────────────────────
window.openSection = (secId) => {
 state.seccionActual = secId;
 const sec = SECCIONES.find((s) => s.id === secId);
 const lessons = LECCIONES[secId] || [];
 set("lessons-sec-name", sec.emoji + " " + sec.nombre);
 set("lessons-count", lessons.length + " lecciones");
 const list = document.getElementById("lessons-list");
 list.innerHTML = "";
 
 lessons.forEach((l) => {
 const done = state.progreso[l.id]?.completado;
 
 // 1. CORRECCIÓN CLAVE: Agregamos "col" que es tu ID real
 const idLimpio = String(secId).toLowerCase().trim();
 const esColores = (idLimpio === "col" || idLimpio === "colores" || idLimpio === "colors"); 

 // 2. Contenido del círculo
 let contenidoCirculo = "";
 if (esColores) {
   // Si está completada muestra el check, si no, carga la imagen de la paleta
   contenidoCirculo = done 
     ? `<span style="font-size:16px; font-weight:800; color:#fff;">✓</span>` 
     : `<img src="paleta.png" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" onerror="this.src='/paleta.png';">`;
 } else {
   // El abecedario se mantiene 100% intacto y protegido aquí
   contenidoCirculo = done ? "✓" : l.titulo.replace("Letra ", "");
 }

 // 3. Estilos del contenedor del círculo
 const estiloFondoCirculo = esColores && !done
   ? `background: transparent !important; border: none !important; padding: 0 !important; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;`
   : `font-size: 16px; font-weight: 800; text-transform: uppercase;`;

 list.innerHTML += `
 <div class="lesson-row" onclick="openLesson('${secId}','${l.id}')">
 <div class="lesson-num${done ? " done" : ""}" style="${estiloFondoCirculo}">
 ${contenidoCirculo}
 </div>
 <div style="flex:1">
 <div class="lesson-name">${l.titulo}</div>
 <div class="lesson-desc">${l.descripcion}</div>
 </div>
 <span class="lesson-arrow">›</span>
 </div>`;
 });
 show("lessons");
};



window.openLesson = (secId, lessonId) => {
 const lesson = (LECCIONES[secId] || []).find((l) => l.id === lessonId);
 if (!lesson) return;
 state.leccionActual = { ...lesson, secId };
 set("lv-title", lesson.titulo);
 set("lv-desc", lesson.descripcion);
 const media = document.getElementById("lv-media");
 const url = lesson.video || "";
 const isVid = /\.(mp4|webm|ogg)$/i.test(url);
 const isImg = /\.(png|jpg|jpeg|gif|webp)$/i.test(url);
 
 media.style.height = "";
 media.style.padding = "";
 
 if (isVid) {
   // playsinline impide que iOS y Android abran el video en el reproductor nativo del sistema
   media.innerHTML = `<video src="${url}" controls playsinline autoplay loop muted class="responsive-media"></video>`;
 } else if (isImg) {
   media.innerHTML = `<img src="${url}" alt="${lesson.titulo}" class="responsive-media" />`;
 } else {
   media.innerHTML = `<div class="lv-media-ph"><div class="big"> </div></div>`;
 }
 show("lesson-view");
};


window.backFromLesson = () => {
  if (state.seccionActual) openSection(state.seccionActual);
  else show("home");
};

// ── QUIZ ──────────────────────────────────────────────────────
window.startQuiz = () => {
 const l = state.leccionActual;
 if (!l) return;
 
 // CORRECCIÓN: Usamos state.seccionActual en lugar de l.secId
 const finalSeccionId = state.seccionActual || "abc";
 const opts = buildQuizOptions(l, finalSeccionId);
 
 state.quiz = {
   questions: [
     {
       pregunta: `¿Cuál imagen representa "${l.titulo}"?`,
       options: opts,
       leccion: l,
     },
   ],
   index: 0,
   score: 0,
   answered: false,
 };
 renderQuizQ();
 show("quiz");
};

function renderQuizQ() {
  const q = state.quiz;
  const cur = q.questions[q.index];
  set("quiz-q-num", `Pregunta ${q.index + 1} de ${q.questions.length}`);
  set("quiz-q-title", cur.leccion.titulo);
  set("quiz-question", cur.pregunta);
  
  const pct = Math.round((q.index / q.questions.length) * 100);
  document.getElementById("quiz-prog-fill").style.width = pct + "%";
  
  const fb = document.getElementById("quiz-feedback");
  fb.className = "quiz-feedback";
  fb.textContent = "";
  document.getElementById("quiz-next-btn").style.display = "none";
  q.answered = false;
  
  const grid = document.getElementById("quiz-grid");
  grid.innerHTML = "";

  cur.options.forEach((opt, i) => {
    // Enviamos el identificador del archivo limpio directo a Supabase
    const finalSeccionId = state.seccionActual || "abc";
    const finalImgKey = opt.leccion.img_key || "";
    const imgUrl = getQuizImgUrl(finalSeccionId, finalImgKey);
    
    const isThird = i === 2;
    const div = document.createElement("div");
    div.className = "quiz-option" + (isThird ? " quiz-third" : "");
    div.dataset.correct = opt.correct;
    
    div.innerHTML = `
      <img src="${imgUrl}" alt="${opt.leccion.titulo}" 
           style="width:100%; max-width:180px; height:120px; object-fit:contain; margin:0 auto; display:block; border-radius:8px;"
           onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
      <div class="quiz-option-fallback" style="display:none; height:120px; flex-direction:column; align-items:center; justify-content:center;">
        <div class="big">✋</div>
        <div class="lbl">${opt.leccion.titulo}</div>
      </div>
    `;

    
    div.onclick = () => selectOption(div, opt.correct, cur);
    grid.appendChild(div);
  });
} 

window.selectOption = (el, isCorrect, cur) => {
  if (state.quiz.answered) return;
  state.quiz.answered = true;

  document.querySelectorAll(".quiz-option").forEach((o) => {
    if (o.dataset.correct === "true") o.classList.add("correct");
  });

  const fb = document.getElementById("quiz-feedback");
  if (isCorrect) {
    el.classList.add("correct");
    fb.textContent = "✅ ¡Correcto! Bien hecho.";
    fb.className = "quiz-feedback show feedback-ok";
    state.quiz.score += 10;
    marcarCompletada(cur.leccion.id, 10);
    // Guarda en Supabase si hay sesión
    if (state.session && state.usuario?.id) {
      upsertProgreso(state.usuario.id, cur.leccion.id, 10).catch(() => {});
      updateUsuarioPuntos(state.usuario.id, state.usuario.pts_totales).catch(
        () => {},
      );
    }
  } else {
    el.classList.add("wrong");
    fb.textContent = "❌ Incorrecto. La respuesta correcta está resaltada.";
    fb.className = "quiz-feedback show feedback-fail";
  }
  document.getElementById("quiz-next-btn").style.display = "block";
};

window.nextQuestion = () => {
  state.quiz.index++;
  if (state.quiz.index < state.quiz.questions.length) {
    renderQuizQ();
    return;
  }
  // Resultado
  const total = state.quiz.questions.length * 10;
  const score = state.quiz.score;
  const pct = Math.round((score / total) * 100);
  set("result-score", score);
  set("result-max", `/ ${total} pts`);
  if (pct === 100) {
    set("result-emoji", "🏆");
    set("result-title", "¡Perfecto!");
    set(
      "result-msg",
      "¡Respondiste todo correctamente! Eres un crack de la LSV.",
    );
  } else if (pct >= 60) {
    set("result-emoji", "🎉");
    set("result-title", "¡Muy bien!");
    set(
      "result-msg",
      "Buen resultado. ¡Sigue practicando para alcanzar el 100%!",
    );
  } else {
    set("result-emoji", "💪");
    set("result-title", "¡Sigue adelante!");
    set("result-msg", "Repasa la lección y vuelve a intentarlo. ¡Tú puedes!");
  }
  renderHome();
  show("result");
};

window.retryQuiz = () => {
 state.quiz.index = 0;
 state.quiz.score = 0;
 
 const cur = state.quiz.questions[0];
 
 // CORRECCIÓN: Cambiamos cur.leccion.secId por state.seccionActual
 const finalSeccionId = state.seccionActual || "abc";
 cur.options = buildQuizOptions(cur.leccion, finalSeccionId);
 
 renderQuizQ();
 show("quiz");
};

window.goHome = () => {
  renderHome();
  show("home");
};

// ── PROFILE ───────────────────────────────────────────────────
function renderProfile() {
  const u = state.usuario;
  const nombre = getNombreUsuario();
  const initials = state.isGuest
    ? "👤"
    : nombre
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?";
  set("prof-avatar", initials);
  set("prof-name", nombre);
  set("prof-email", u?.email || "");
  set("prof-pts", getPtsTotales());
  set("prof-racha", getRacha());
  set("prof-lecc", getLeccionesCompletadas());
  set("prof-email-val", u?.email || "—");
  set("prof-edad-val", u?.edad ? u.edad + " años" : "—");
  const d = new Date(u?.created_at || Date.now());
  set(
    "prof-desde",
    d.toLocaleDateString("es-VE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );

  document.getElementById("prof-info-section").style.display = state.isGuest
    ? "none"
    : "block";
  document.getElementById("prof-guest-section").style.display = state.isGuest
    ? "block"
    : "none";
}

window.doLogout = () => {
  signOut();
  Object.assign(state, {
    session: null,
    usuario: null,
    isGuest: false,
    progreso: {},
    seccionActual: null,
    leccionActual: null,
  });
  show("welcome");
};

// ── Util ──────────────────────────────────────────────────────
function set(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}


// ── HTML template ─────────────────────────────────────────────
function buildHTML() {
  return `
    <!-- SPLASH (UNICO Y CORREGIDO) -->
    <div id="screen-splash" class="screen active">
      <!-- El logo circular blanco integrado usando tus estilos nativos -->
      <div class="splash-logo" style="background:#ffffff; border-radius:50%; box-shadow:0 4px 15px rgba(0,0,0,0.15); padding:10px;">
        <img src="/logo.png" alt="Logo" style="width:100%; height:100%; object-fit:contain; border-radius:50%;">
      </div>
      <div class="splash-appname">VENPSI LSV.APP</div>
      <div class="splash-sub">Lengua de Señas Venezolana</div>
      <div class="splash-bar-wrap"><div class="splash-bar-fill"></div></div>
    </div>

    <!-- WELCOME (CON VIDEO REAL DE CANVA) -->
    <div id="screen-welcome" class="screen">
      <!-- Mantenemos la proporción del 42% del alto de la pantalla -->
      <div class="welcome-media" style="height: 42vh; min-height: 42vh; background: #0D3F6E; display: flex; justify-content: center; align-items: center; overflow: hidden;">
        
        <!-- REPRODUCTOR DE VIDEO CONECTADO A SUPABASE -->
        <video 
          src="https://jgynbubbhxftlzstmwjq.supabase.co/storage/v1/object/public/videos/lsv-presentacion.mp4" 
          autoplay 
          loop 
          muted 
          playsinline 
          style="width: 100%; height: 100%; object-fit: cover;">
        </video>

      </div>

      <!-- Ajustamos el cuerpo del texto para que no empuje el footer blanco -->
 <div class="scroll" style="background: #ffffff;">
 <div class="welcome-body" style="padding: 12px 24px 8px;">
 <div class="welcome-logo-row" style="margin-bottom: 6px;">
 <!-- Mini logo circular integrado de forma sutil -->
 <img src="/logo.png" alt="Logo" style="width: 38px; height: 38px; object-fit: contain; border-radius: 50%; background: #fff; padding: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.08); margin-right: 8px;">
 <div>
 <div class="welcome-appname">VENPSI LSV.APP</div>
 <div class="welcome-tagline">Aprende · Practica · Comunica</div>
 </div>
 </div>

 <div class="welcome-desc" style="font-size: 13px; line-height: 1.5; color: #555;">
 <!-- Párrafo principal -->
 <p style="margin-bottom: 12px;">
 Aprende la Lengua de Señas Venezolana con lecciones en video, contenidos ilustrados y quizzes interactivos con imágenes.
 </p>
 
 <!-- Nota de desarrollo -->
 <p style="margin-bottom: 16px; font-style: italic; color: #777;">
 Aplicación en desarrollo para optar al título de Bachiller de la República Bolivariana de Venezuela.
 </p>
 
 <!-- Título del proyecto en mayúsculas destacado -->
 <p style="margin-bottom: 16px; font-weight: bold; color: #222; text-transform: uppercase; font-size: 12px; letter-spacing: 0.3px;">
 INCLUSIÓN DE LA LENGUA DE SEÑAS VENEZOLANA EN EL PÉNSUM DE ESTUDIOS DE LA U.E.C. "EL BUEN PASTOR II" A TRAVÉS DE UNA APLICACIÓN MÓVIL.
 </p>

 <!-- Participantes -->
 <div style="margin-top: 12px;">
 <span style="font-weight: bold; color: #333; display: block; margin-bottom: 6px;">
 Participantes del 5to "B"
 </span>
 <ul style="list-style-type: disc; margin: 0; padding-left: 20px; color: #444;">
 <li style="margin-bottom: 4px;">Moncada Isabella</li>
 <li style="margin-bottom: 4px;">Olivares Andrés</li>
 <li style="margin-bottom: 4px;">Olivares Júlia</li>
 </ul>
 </div>
 </div> <!-- Cierra .welcome-desc -->
 </div> <!-- Cierra .welcome-body -->
 </div> <!-- Cierra .scroll -->

 <!-- El recuadro blanco de los botones se queda abajo fijo tal como te gusta -->
 <div class="welcome-footer">
 <button class="btn btn-accent" onclick="onClickRegister()">🎓 Comenzar con registro</button>
 <button class="btn btn-primary" onclick="onClickLogin()">Iniciar sesión</button>
 <button class="btn btn-ghost" onclick="onClickGuest()">👤 Continuar sin registro</button>
 </div>
 </div> <!-- Cierra #screen-welcome de forma correcta para no asfixiar a los demás componentes -->

    <!-- AUTH -->
    <div id="screen-auth" class="screen">
      <div class="auth-hero">
        <button class="back-btn" onclick="show('welcome')" style="width:36px;height:36px">←</button>
        <img src="/logo.png" alt="Logo VENPSI" style="width: 40px; height: 40px; object-fit: contain; margin: 10px auto 5px auto; display: block; border-radius: 6px;">
        <div class="auth-hero-title">Bienvenido/a</div>
        <div class="auth-hero-sub">Crea tu cuenta o inicia sesión para guardar tu progreso</div>
      </div>
      <div class="auth-body">
        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-register" onclick="switchAuthTab('register')">Registro</button>
          <button class="auth-tab"        id="tab-login"    onclick="switchAuthTab('login')">Iniciar sesión</button>
        </div>
        <div id="form-register" style="display:flex;flex-direction:column;gap:14px">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Nombre *</label><input class="form-input" id="reg-nombre" placeholder="Ana" /></div>
            <div class="form-group"><label class="form-label">Apellido *</label><input class="form-input" id="reg-apellido" placeholder="García" /></div>
          </div>
          <div class="form-group"><label class="form-label">Edad</label><input type="number" class="form-input" id="reg-edad" placeholder="25" min="5" max="99" /></div>
          <div class="form-group"><label class="form-label">Correo electrónico *</label><input type="email" class="form-input" id="reg-email" placeholder="ana@email.com" /></div>
          <div class="form-group"><label class="form-label">Contraseña *</label><input type="password" class="form-input" id="reg-pass" placeholder="Mínimo 6 caracteres" /></div>
          <div class="form-error" id="reg-error"></div>
          <button class="btn btn-primary" onclick="doRegister()">Crear cuenta →</button>
        </div>
        <div id="form-login" style="display:none;flex-direction:column;gap:14px">
          <div class="form-group"><label class="form-label">Correo electrónico</label><input type="email" class="form-input" id="log-email" placeholder="ana@email.com" /></div>
          <div class="form-group"><label class="form-label">Contraseña</label><input type="password" class="form-input" id="log-pass" placeholder="Tu contraseña" /></div>
          <div class="form-error" id="log-error"></div>
<button class="btn btn-primary" onclick="doLogin()">Iniciar sesión →</button>
<button class="btn btn-ghost" onclick="doForgotPassword()" style="font-size:13px; padding:10px">
  ¿Olvidaste tu contraseña?
</button>
        </div>
      </div>
    </div>

    <!-- HOME -->
    <div id="screen-home" class="screen">
      <div class="home-topbar">
        <div class="home-greeting">
          <div class="home-greeting-hi">Bienvenido/a</div>
          <div class="home-greeting-name" id="home-name">...</div>
        </div>
        <div class="home-avatar" id="home-avatar" onclick="goProfile()">?</div>
      </div>
      <div class="home-stats">
   <div><div class="stat-num" id="stat-pts">0</div><div class="stat-lbl">Puntos</div></div>
   <div><div class="stat-num" id="stat-racha">1</div><div class="stat-lbl">&#x1F525; Racha</div></div>
   <div><div class="stat-num" id="stat-lecc">0</div><div class="stat-lbl">Lecciones</div></div>
 </div>
      <div class="scroll" style="padding:20px">
        <div class="section-title">Secciones</div>
        <div id="sections-list"></div>
      </div>
      <div class="bottom-nav">
        <button class="nav-btn active" onclick="goHome()"><span class="nav-icon">🏠</span><span class="nav-label">Inicio</span></button>
        <button class="nav-btn" onclick="if(state.seccionActual) openSection(state.seccionActual); else openSection('abc')"><span class="nav-icon">📚</span><span class="nav-label">Lecciones</span></button>
        <button class="nav-btn" onclick="goProfile()"><span class="nav-icon nav-icon-svg">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
</span><span class="nav-label">Perfil</span></button>
      </div>
    </div>

    <!-- LESSONS LIST -->
    <div id="screen-lessons" class="screen">
      <div class="lessons-header">
        <button class="back-btn" onclick="show('home')">←</button>
        <div class="lessons-header-info">
          <div class="lessons-header-name"  id="lessons-sec-name">Sección</div>
          <div class="lessons-header-count" id="lessons-count">0 lecciones</div>
        </div>
      </div>
      <div class="scroll" style="padding:16px">
        <div id="lessons-list"></div>
      </div>
    </div>

    <!-- LESSON VIEW -->
    <div id="screen-lesson-view" class="screen">
      <div class="lv-header">
        <button class="back-btn" onclick="backFromLesson()">←</button>
        <div class="lv-header-title" id="lv-title">Lección</div>
      </div>
      <div class="lv-media" id="lv-media">
        <div class="lv-media-ph"><div class="big">🎥</div></div>
      </div>
      <div class="lv-body">
        <div class="card lv-desc-card">
          <div class="lv-card-lbl">Descripción del signo</div>
          <div class="lv-desc-text" id="lv-desc">—</div>
        </div>
      </div>
      <div class="lv-footer">
        <button class="btn btn-accent" onclick="startQuiz()">🧠 Ir al quiz</button>
        <button class="btn btn-ghost"  onclick="backFromLesson()">← Volver a lecciones</button>
      </div>
    </div>

    <!-- QUIZ -->
    <div id="screen-quiz" class="screen">
      <div class="quiz-header">
        <button class="back-btn" onclick="backFromLesson()">←</button>
        <div class="quiz-info">
          <div class="quiz-q-num"   id="quiz-q-num">Pregunta 1 de 1</div>
          <div class="quiz-q-title" id="quiz-q-title">Quiz</div>
        </div>
      </div>
      <div class="quiz-prog-wrap">
        <div class="quiz-prog-bar"><div class="quiz-prog-fill" id="quiz-prog-fill" style="width:0%"></div></div>
      </div>
      <div class="quiz-body scroll">
        <div class="quiz-question" id="quiz-question">¿Cuál imagen representa este signo?</div>
        <div class="quiz-grid" id="quiz-grid"></div>
        <div class="quiz-feedback" id="quiz-feedback"></div>
        <button class="btn btn-primary" id="quiz-next-btn" style="display:none;margin-top:8px" onclick="nextQuestion()">
          Siguiente →
        </button>
      </div>
    </div>

    <!-- RESULT -->
    <div id="screen-result" class="screen">
      <div class="card result-card">
        <div class="result-emoji" id="result-emoji">🎉</div>
        <div class="result-title" id="result-title">¡Muy bien!</div>
        <div style="margin-bottom:20px">
          <span class="result-score" id="result-score">0</span>
          <span class="result-max"   id="result-max"> / 10 pts</span>
        </div>
        <div class="result-msg" id="result-msg">Sigue practicando para mejorar tu LSV.</div>
        <div class="result-btns">
          <button class="btn btn-accent"   onclick="retryQuiz()">🔄 Repetir quiz</button>
          <button class="btn btn-primary"  onclick="goHome()">🏠 Volver al inicio</button>
        </div>
      </div>
    </div>

    <!-- PROFILE -->
    <div id="screen-profile" class="screen">
      <div class="profile-hero">
        <button class="back-btn profile-back" onclick="show('home')">←</button>
        <div class="profile-avatar" id="prof-avatar">?</div>
        <div class="profile-name"   id="prof-name">Usuario</div>
        <div class="profile-email"  id="prof-email">—</div>
      </div>
      <div class="profile-body scroll">
        <div class="profile-stats">
          <div class="profile-stat"><div class="profile-stat-num" id="prof-pts">0</div><div class="profile-stat-lbl">Puntos</div></div>
          <div class="profile-stat"><div class="profile-stat-num" id="prof-racha">1</div><div class="profile-stat-lbl">🔥 Racha</div></div>
          <div class="profile-stat"><div class="profile-stat-num" id="prof-lecc">0</div><div class="profile-stat-lbl">Completadas</div></div>
        </div>

        <div class="profile-section" id="prof-info-section">
          <div class="profile-sec-title">Información personal</div>
          <div class="profile-row"><span class="profile-row-icon">✉️</span><span class="profile-row-label">Correo</span><span class="profile-row-value" id="prof-email-val">—</span></div>
          <div class="profile-row"><span class="profile-row-icon">🎂</span><span class="profile-row-label">Edad</span><span class="profile-row-value" id="prof-edad-val">—</span></div>
          <div class="profile-row"><span class="profile-row-icon">📅</span><span class="profile-row-label">Miembro desde</span><span class="profile-row-value" id="prof-desde">—</span></div>
        </div>

        <div id="prof-guest-section" style="display:none">
          <div class="guest-banner">
            <div style="font-size:28px;margin-bottom:8px">⚠️</div>
            <div class="guest-banner-title">Modo invitado</div>
            <div class="guest-banner-desc">Tu progreso no se guarda. Regístrate para conservarlo y ver tus estadísticas.</div>
            <button class="btn btn-primary" onclick="switchAuthTab('register'); show('auth')">Crear cuenta gratis →</button>
          </div>
        </div>

        <button class="btn btn-danger" onclick="doLogout()" style="margin-top:8px">Cerrar sesión</button>
      </div>
    </div>
    
    <!-- RESET PASSWORD -->
<div id="screen-reset-password" class="screen">
  <div class="auth-hero">
    <img src="/logo.png" style="width:40px;height:40px;object-fit:contain;margin:10px auto 5px;display:block;border-radius:6px;">
    <div class="auth-hero-title">Nueva contraseña</div>
    <div class="auth-hero-sub">Elige una contraseña segura para tu cuenta</div>
  </div>
  <div class="auth-body">
    <div class="form-group">
      <label class="form-label">Nueva contraseña</label>
      <input type="password" class="form-input" id="reset-pass" placeholder="Mínimo 6 caracteres" />
    </div>
    <div class="form-error" id="reset-error"></div>
    <button class="btn btn-primary" onclick="doResetPassword()">Guardar contraseña →</button>
  </div>
</div>

    <!-- FONDO MUSICAL -->
    <audio id="bg-music" loop>
      <source src="/musica.mp3" type="audio/mpeg">
    </audio>

    <!-- BOTÓN MÚSICA -->
    <button id="music-toggle" onclick="toggleMusic()"
      style="position:fixed; bottom:70px; right:16px; z-index:999;
             background:#0D3F6E; color:#fff; border:none; border-radius:50%;
             width:38px; height:38px; font-size:18px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.2)">
      🎵
    </button>

  `;
}

window.doResetPassword = async () => {
  const newPass = document.getElementById("reset-pass")?.value?.trim();
  const err = document.getElementById("reset-error");
  err.removeAttribute("style");
  err.classList.remove("show");

  if (!newPass || newPass.length < 6) {
    err.textContent = "La contraseña debe tener al menos 6 caracteres.";
    err.classList.add("show");
    return;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${window._recoveryToken}`,
      },
      body: JSON.stringify({ password: newPass }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    err.style.background = "#D1FAE5";
    err.style.borderColor = "#6EE7B7";
    err.style.color = "#065F46";
    err.textContent = "✅ Contraseña actualizada. Ya puedes iniciar sesión.";
    err.classList.add("show");
    setTimeout(() => { window.location.hash = ""; show("welcome"); }, 2500);
  } catch(e) {
    err.textContent = e.message || "Error al actualizar la contraseña.";
    err.classList.add("show");
  }
};

// ── Detectar enlace de recuperación de contraseña ─────────────
const hash = window.location.hash;
if (hash.includes("type=recovery") && hash.includes("access_token")) {
  const params = new URLSearchParams(hash.replace("#", ""));
  const accessToken = params.get("access_token");
  
  // Guardamos el token para usarlo al cambiar la contraseña
  window._recoveryToken = accessToken;
  
  // Saltamos el splash y mostramos pantalla de nueva contraseña
  document.getElementById("app").innerHTML = buildHTML();
  show("reset-password");
} else {
  document.getElementById("app").innerHTML = buildHTML();
  setTimeout(() => show("welcome"), 3000);
}


// Exponer show() globalmente para onclick en templates
window.show = show;
window.state = state;

// ── FONDO MUSICAL ─────────────────────────────────────────────
const bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.05; // volumen suave (0.0 a 1.0)

// Inicia la música cuando el usuario interactúa por primera vez
function startMusic() {
  bgMusic.play().catch(() => {}); // catch por políticas del navegador
  document.removeEventListener("click", startMusic);
  document.removeEventListener("touchstart", startMusic);
}

document.addEventListener("click", startMusic);
document.addEventListener("touchstart", startMusic);


// Botón para silenciar / reanudar
window.toggleMusic = () => {
  const btn = document.getElementById("music-toggle");
  if (bgMusic.paused) {
    bgMusic.play();
    btn.textContent = "🎵";
  } else {
    bgMusic.pause();
    btn.textContent = "🔇";
  }
};

// ── Scroll natural para lesson-view ──────────────────────
function updateAppScroll(screenId) {
  const app = document.getElementById('app');
  if (screenId === 'lesson-view') {
    app.style.overflowY = 'auto';
    app.style.height = 'auto';
    app.style.minHeight = '100dvh';
  } else {
    app.style.overflowY = 'hidden';
    app.style.height = '100dvh';
    app.style.minHeight = '';
  }
}

