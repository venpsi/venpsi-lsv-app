# VENPSI LSV.APP

Aplicación web responsive para el aprendizaje de la **Lengua de Señas Venezolana (LSV)**.

---

## Estructura del proyecto

```
venpsi-lsv/
├── index.html              ← Punto de entrada
├── src/
│   ├── main.js             ← Lógica principal + navegación + HTML de pantallas
│   ├── styles.css          ← Estilos globales
│   └── lib/
│       ├── supabase.js     ← Cliente Supabase (auth + DB + storage)
│       ├── state.js        ← Estado global en memoria
│       └── data.js         ← Datos locales de lecciones + helpers de quiz
└── README.md
```

---

## Configuración de Supabase

1. Abre `src/lib/supabase.js`
2. Reemplaza `TU_ANON_KEY_AQUI` con tu **anon public key**:
   - Ve a https://app.supabase.com
   - Tu proyecto → Settings → API → `anon public`
3. La URL ya está configurada: `https://jymvrgxqtkgrmgrsshjg.supabase.co`

---

## Cómo agregar tu video/imagen de bienvenida

En `index.html`, dentro de `<div id="screen-welcome">`, busca el bloque:
```html
<!-- REEMPLAZA ESTE BLOQUE con <video> o <img> cuando tengas tu archivo -->
<div class="welcome-media-ph"> ... </div>
```

Reemplázalo con:
```html
<!-- Opción A: video -->
<video src="public/bienvenida.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover"></video>

<!-- Opción B: imagen -->
<img src="public/bienvenida.jpg" alt="Bienvenida" style="width:100%;height:100%;object-fit:cover">
```

Coloca el archivo en la carpeta `/public/`.

---

## Cómo correr localmente

Necesitas un servidor local (no abrir el archivo directo por módulos ES6):

```bash
# Opción 1: Python
python3 -m http.server 3000

# Opción 2: Node.js
npx serve .

# Opción 3: VS Code
Instala la extensión "Live Server" → clic derecho en index.html → "Open with Live Server"
```

Luego abre: http://localhost:3000

---

## Cómo desplegar (producción)

### Vercel (recomendado, gratis)
```bash
npm i -g vercel
vercel
```

### Netlify
Arrastra la carpeta `venpsi-lsv/` al panel de Netlify.

### GitHub Pages
Sube el proyecto a un repositorio público y activa GitHub Pages desde Settings → Pages.

---

## Estructura de Storage en Supabase

Los archivos deben estar en los siguientes buckets (ya configurados en el código):

```
videos/
  abecedario/    → a.mp4, b.mp4, c.mp4 ... z.mp4, rr.mp4, no.mp4 (para Ñ), etc.

imagenes/
  colores/       → rojo.png, azul.png, colores.png, amarillo.png, blanco.png, marron.png, morado.png

quizz/
  abecedario/    → a.jpg, b.jpg, c.jpg ... (imágenes JPG para el quiz)
  colores/       → rojo.jpg, azul.jpg, etc.
```

---

## Flujo de pantallas

```
Splash (3s) → Bienvenida
                ├── Con registro → Auth (Registro / Login) → Home
                └── Sin registro → Home (modo invitado)

Home → Sección → Lista de lecciones → Ver lección → Quiz → Resultado
Home → Perfil
```

---

## Agregar más secciones o lecciones

Edita `src/lib/data.js`:
1. Agrega la sección a `SECCIONES[]`
2. Agrega sus lecciones a `LECCIONES['nuevo-id']`
3. Asegúrate de que existan los archivos correspondientes en Storage

La app los mostrará automáticamente sin cambiar más código.

---

## Notas importantes

- El **progreso se guarda en Supabase** para usuarios registrados (tabla `progreso_usuario`)
- Los **invitados** ven el progreso solo durante la sesión actual (se pierde al cerrar)
- El quiz siempre muestra **3 opciones aleatorias** (1 correcta + 2 distractores de la misma sección)
- La posición de la respuesta correcta se **aleatoriza** en cada intento
