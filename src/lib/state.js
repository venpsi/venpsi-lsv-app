// ============================================================
//  VENPSI LSV — Estado global de la aplicación (en memoria)
// ============================================================

export const state = {
  // Auth
  session: null,       // objeto sesión de Supabase
  usuario: null,       // fila de tabla `usuarios`
  isGuest: false,

  // Datos cargados
  secciones: [],
  leccionesPorSeccion: {},   // { seccionId: [lección, ...] }

  // Navegación
  seccionActual: null,
  leccionActual: null,

  // Progreso (leccionId → { completado, puntaje })
  progreso: {},

  // Quiz en curso
  quiz: {
    questions: [],
    index: 0,
    score: 0,
    answered: false,
  },
};

// Helpers de lectura rápida
export function getNombreUsuario() {
  if (state.isGuest) return 'Invitado';
  const u = state.usuario;
  if (!u) return 'Usuario';
  const meta = u.nombre || '';
  return meta;
}

export function getPtsTotales() {
  return state.usuario?.pts_totales ?? 0;
}

export function getRacha() {
  return state.usuario?.racha ?? 1;
}

export function getLeccionesCompletadas() {
  return Object.values(state.progreso).filter(p => p?.completado).length;
}

export function marcarCompletada(leccionId, puntaje) {
  state.progreso[leccionId] = { completado: true, puntaje };
  if (state.usuario) {
    state.usuario.pts_totales = (state.usuario.pts_totales || 0) + puntaje;
  }
}
