// ============================================================
//  VENPSI LSV — Supabase client
//  Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY con tus valores
//  desde: https://app.supabase.com → Settings → API
// ============================================================

export const SUPABASE_URL = 'https://jgynbubbhxftlzstmwjq.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpneW5idWJiaHhmdGx6c3Rtd2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTExMzgsImV4cCI6MjA5NTMyNzEzOH0.8iMPqnYaIHU7SmrvMkR4XKn2yodUH0cv2IP5BhY0eaA';

const headers = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_ANON_KEY,
};

let _session = null;

function authHeaders() {
  return _session
    ? { ...headers, Authorization: `Bearer ${_session.access_token}` }
    : headers;
}

// ── AUTH ──────────────────────────────────────────────────────
export async function signUp({ email, password, nombre, apellido, edad }) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      password,
      data: { nombre: `${nombre} ${apellido}`.trim(), edad },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  if (data.session) _session = data.session;
  return data;
}

export async function signIn({ email, password }) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  _session = data;
  return data;
}

export function signOut() { _session = null; }
export function getSession() { return _session; }

// ── DB helpers ─────────────────────────────────────────────────
async function dbGet(table, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { ...authHeaders(), Prefer: 'return=representation' },
  });
  return res.json();
}

async function dbPost(table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...authHeaders(), Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function dbPatch(table, params, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    method: 'PATCH',
    headers: { ...authHeaders(), Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── Secciones & Lecciones ──────────────────────────────────────
export async function getSecciones() {
  return dbGet('secciones', 'order=orden.asc');
}

export async function getLecciones(seccionId) {
  return dbGet('lecciones', `seccion_id=eq.${seccionId}&order=orden.asc`);
}

export async function getQuizzesForLeccion(leccionId) {
  return dbGet('quizzes', `leccion_id=eq.${leccionId}`);
}

export async function getOpcionesForQuiz(quizId) {
  return dbGet('opciones_quiz', `quiz_id=eq.${quizId}`);
}

// ── Lecciones de la misma seccion (para distractores quiz) ─────
export async function getLeccionesDeSeccion(seccionId, excludeId) {
  const all = await getLecciones(seccionId);
  return all.filter(l => l.id !== excludeId);
}

// ── Usuario ────────────────────────────────────────────────────
export async function getUsuario(userId) {
  const rows = await dbGet('usuarios', `id=eq.${userId}`);
  return rows[0] || null;
}

export async function updateUsuarioPuntos(userId, pts_totales) {
  return dbPatch('usuarios', `id=eq.${userId}`, { pts_totales });
}

// ── Progreso ───────────────────────────────────────────────────
export async function getProgreso(userId) {
  return dbGet(
    'progreso_usuario',
    `user_id=eq.${userId}&select=leccion_id,completado,puntaje`
  );
}

export async function upsertProgreso(userId, leccionId, puntaje) {
  const existing = await dbGet(
    'progreso_usuario',
    `user_id=eq.${userId}&leccion_id=eq.${leccionId}`
  );
  if (existing.length > 0) {
    return dbPatch(
      'progreso_usuario',
      `user_id=eq.${userId}&leccion_id=eq.${leccionId}`,
      { completado: true, puntaje, updated_at: new Date().toISOString() }
    );
  }
  return dbPost('progreso_usuario', {
    user_id: userId,
    leccion_id: leccionId,
    completado: true,
    puntaje,
  });
}

// ── Storage ────────────────────────────────────────────────────
export function getStorageUrl(bucket, path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function resetPassword(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}
