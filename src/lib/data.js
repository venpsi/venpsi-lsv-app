// ============================================================
//  VENPSI LSV — Datos locales de lecciones
//  (espejo del INSERT en la BD; permite operar offline/demo)
// ============================================================

export const SECCIONES = [
  { id: 'abc', nombre: 'Abecedario', descripcion: 'Alfabeto dactilológico — 29 letras', orden: 1, emoji: '🤟' },
  { id: 'col', nombre: 'Colores',    descripcion: 'Vocabulario básico de colores',        orden: 2, emoji: '🖌️' },
];

const BASE = 'https://jgynbubbhxftlzstmwjq.supabase.co/storage/v1/object/public';


// Rutas base hacia tus carpetas en Supabase
const RUTA_ABECEDARIO = BASE + '/videos/Abecedario'; 
const RUTA_COLORES = BASE + '/Imagenes/colores';

export const LECCIONES = {
  // SECCIÓN DEL ABECEDARIO
  abc: [
    { 
      id: 'la01', 
      titulo: 'Letra A',  
      descripcion: 'Puno cerrado, pulgar a un lado.',
      video: RUTA_ABECEDARIO + '/a.mp4',
      imagenPng: RUTA_ABECEDARIO + '/a.png',
      leccionJpg: RUTA_ABECEDARIO + '/a.jpg', // <-- ¡Falta una coma aquí al final de esta línea!
      img_key: 'a'
    },
    { 
      id: 'la02', 
      titulo: 'Letra B',  
      descripcion: 'Cuatro dedos extendidos juntos, pulgar doblado en la palma.',
      video: RUTA_ABECEDARIO + '/b.mp4',
      imagenPng: RUTA_ABECEDARIO + '/b.png',
      leccionJpg: RUTA_ABECEDARIO + '/b.jpg',
      img_key: 'b'
    },
    { 
      id: 'la03', 
      titulo: 'Letra C',  
      descripcion: 'Mano en forma de C semicircular.',
      video: RUTA_ABECEDARIO + '/c.mp4',
      imagenPng: RUTA_ABECEDARIO + '/c.png',
      leccionJpg: RUTA_ABECEDARIO + '/c.jpg',
      img_key: 'c'
    },
    { 
      id: 'la04', 
      titulo: 'Letra D',  
      descripcion: 'Dedo indice apuntando hacia arriba, los demas dedos forman un circulo con el pulgar.',
      video: RUTA_ABECEDARIO + '/d.mp4',
      imagenPng: RUTA_ABECEDARIO + '/d.png',
      leccionJpg: RUTA_ABECEDARIO + '/d.jpg',
      img_key: 'd'
    },
    { 
      id: 'la05', 
      titulo: 'Letra E',  
      descripcion: 'Todos los dedos doblados hacia la palma, mostrando las unas.',
      video: RUTA_ABECEDARIO + '/e.mp4',
      imagenPng: RUTA_ABECEDARIO + '/e.png',
      leccionJpg: RUTA_ABECEDARIO + '/e.jpg',
      img_key: 'e'
    },
    { 
      id: 'la06', 
      titulo: 'Letra F',  
      descripcion: 'Indice y pulgar se tocan formando un circulo, los otros tres dedos extendidos hacia arriba.',
      video: RUTA_ABECEDARIO + '/f.mp4',
      imagenPng: RUTA_ABECEDARIO + '/f.png',
      leccionJpg: RUTA_ABECEDARIO + '/f.jpg',
      img_key: 'f'
    },
    { 
      id: 'la07', 
      titulo: 'Letra G',  
      descripcion: 'Indice y pulgar extendidos horizontalmente paralelos, los demas doblados.',
      video: RUTA_ABECEDARIO + '/g.mp4',
      imagenPng: RUTA_ABECEDARIO + '/g.png',
      leccionJpg: RUTA_ABECEDARIO + '/g.jpg',
      img_key: 'g'
    },
    { 
      id: 'la08', 
      titulo: 'Letra H',  
      descripcion: 'Dedos indice y medio extendidos horizontalmente juntos, los demas doblados.',
      video: RUTA_ABECEDARIO + '/h.mp4',
      imagenPng: RUTA_ABECEDARIO + '/h.png',
      leccionJpg: RUTA_ABECEDARIO + '/h.jpg',
      img_key: 'h'
    },
    { 
      id: 'la09', 
      titulo: 'Letra I',  
      descripcion: 'Dedo menique apuntando hacia arriba, los demas cerrados en un puno.',
      video: RUTA_ABECEDARIO + '/i.mp4',
      imagenPng: RUTA_ABECEDARIO + '/i.png',
      leccionJpg: RUTA_ABECEDARIO + '/i.jpg',
      img_key: 'i'
    },
    { 
      id: 'la10', 
      titulo: 'Letra J',  
      descripcion: 'Dedo menique dibuja la forma de una J en el aire.',
      video: RUTA_ABECEDARIO + '/j.mp4',
      imagenPng: RUTA_ABECEDARIO + '/j.png',
      leccionJpg: RUTA_ABECEDARIO + '/j.jpg',
      img_key: 'j'
    },
    { 
      id: 'la11', 
      titulo: 'Letra K',  
      descripcion: 'Indice y medio extendidos en V, el pulgar apoya en el medio. Se hace un movimiento hacia arriba.',
      video: RUTA_ABECEDARIO + '/k.mp4',
      imagenPng: RUTA_ABECEDARIO + '/k.png',
      leccionJpg: RUTA_ABECEDARIO + '/k.jpg',
      img_key: 'k'
    },
    { 
      id: 'la12', 
      titulo: 'Letra L',  
      descripcion: 'Indice apuntando hacia arriba y pulgar horizontal, formando una L.',
      video: RUTA_ABECEDARIO + '/l.mp4',
      imagenPng: RUTA_ABECEDARIO + '/l.png',
      leccionJpg: RUTA_ABECEDARIO + '/l.jpg',
      img_key: 'l'
    },
    { 
      id: 'la13', 
      titulo: 'Letra LL',  
      descripcion: 'Forma una L y desplazala lateralmente hacia la derecha.',
      video: RUTA_ABECEDARIO + '/ll.mp4',
      imagenPng: RUTA_ABECEDARIO + '/ll.png',
      leccionJpg: RUTA_ABECEDARIO + '/ll.jpg',
      img_key: 'll'
    },
    { 
      id: 'la14', 
      titulo: 'Letra M',  
      descripcion: 'Tres dedos (indice, medio, anular) doblados hacia abajo sobre el pulgar.',
      video: RUTA_ABECEDARIO + '/m.mp4',
      imagenPng: RUTA_ABECEDARIO + '/m.png',
      leccionJpg: RUTA_ABECEDARIO + '/m.jpg',
      img_key: 'm'
    },
    { 
      id: 'la15', 
      titulo: 'Letra N',  
      descripcion: 'Dos dedos (indice y medio) doblados hacia abajo sobre el pulgar.',
      video: RUTA_ABECEDARIO + '/n.mp4',
      imagenPng: RUTA_ABECEDARIO + '/n.png',
      leccionJpg: RUTA_ABECEDARIO + '/n.jpg',
      img_key: 'n'
    },
    { 
      id: 'la16', 
      titulo: 'Letra N',  
      descripcion: 'Forma la N y realiza un ligero movimiento oscilatorio o de lado a lado.',
      video: RUTA_ABECEDARIO + '/n_enie.mp4',
      imagenPng: RUTA_ABECEDARIO + '/n_enie.png',
      leccionJpg: RUTA_ABECEDARIO + '/n_enie.jpg',
      img_key: 'n_enie'
    },
    { 
      id: 'la17', 
      titulo: 'Letra O',  
      descripcion: 'Todos los dedos se curvan y se tocan por las puntas formando un circulo.',
      video: RUTA_ABECEDARIO + '/o.mp4',
      imagenPng: RUTA_ABECEDARIO + '/o.png',
      leccionJpg: RUTA_ABECEDARIO + '/o.jpg',
      img_key: 'o'
    },
    { 
      id: 'la18', 
      titulo: 'Letra P',  
      descripcion: 'Posicion de la K pero fija y apuntando ligeramente hacia abajo.',
      video: RUTA_ABECEDARIO + '/p.mp4',
      imagenPng: RUTA_ABECEDARIO + '/p.png',
      leccionJpg: RUTA_ABECEDARIO + '/p.jpg',
      img_key: 'p'
    },
    { 
      id: 'la19', 
      titulo: 'Letra Q',  
      descripcion: 'Mano apuntando hacia abajo en forma de garra, similar a la G pero invertida.',
      video: RUTA_ABECEDARIO + '/q.mp4',
      imagenPng: RUTA_ABECEDARIO + '/q.png',
      leccionJpg: RUTA_ABECEDARIO + '/q.jpg',
      img_key: 'q'
    },
    { 
      id: 'la20', 
      titulo: 'Letra R',  
      descripcion: 'Dedos indice y medio cruzados, los demas doblados.',
      video: RUTA_ABECEDARIO + '/r.mp4',
      imagenPng: RUTA_ABECEDARIO + '/r.png',
      leccionJpg: RUTA_ABECEDARIO + '/r.jpg',
      img_key: 'r'
    },
    { 
      id: 'la21', 
      titulo: 'Letra RR',  
      descripcion: 'Forma la R y desplaza la mano lateralmente hacia la derecha.',
      video: RUTA_ABECEDARIO + '/rr.mp4',
      imagenPng: RUTA_ABECEDARIO + '/rr.png',
      leccionJpg: RUTA_ABECEDARIO + '/rr.jpg',
      img_key: 'rr'
    },
    { 
      id: 'la22', 
      titulo: 'Letra S',  
      descripcion: 'Puno completamente cerrado con el pulgar cruzado por delante de los dedos.',
      video: RUTA_ABECEDARIO + '/s.mp4',
      imagenPng: RUTA_ABECEDARIO + '/s.png',
      leccionJpg: RUTA_ABECEDARIO + '/s.jpg',
      img_key: 's'
    },
    { 
      id: 'la23', 
      titulo: 'Letra T',  
      descripcion: 'Puno cerrado con el dedo pulgar metido entre los dedos indice y medio.',
      video: RUTA_ABECEDARIO + '/t.mp4',
      imagenPng: RUTA_ABECEDARIO + '/t.png',
      leccionJpg: RUTA_ABECEDARIO + '/t.jpg',
      img_key: 't'
    },
    { 
      id: 'la24', 
      titulo: 'Letra U',  
      descripcion: 'Dedos indice y medio extendidos rectos hacia arriba juntos.',
      video: RUTA_ABECEDARIO + '/u.mp4',
      imagenPng: RUTA_ABECEDARIO + '/u.png',
      leccionJpg: RUTA_ABECEDARIO + '/u.jpg',
      img_key: 'u'
    },
    { 
      id: 'la25', 
      titulo: 'Letra V',  
      descripcion: 'Dedos indice y medio extendidos hacia arriba en forma de V.',
      video: RUTA_ABECEDARIO + '/v.mp4',
      imagenPng: RUTA_ABECEDARIO + '/v.png',
      leccionJpg: RUTA_ABECEDARIO + '/v.jpg',
      img_key: 'v'
    },
    { 
      id: 'la26', 
      titulo: 'Letra W',  
      descripcion: 'Dedos indice, medio y anular extendidos hacia arriba en forma de W.',
      video: RUTA_ABECEDARIO + '/w.mp4',
      imagenPng: RUTA_ABECEDARIO + '/w.png',
      leccionJpg: RUTA_ABECEDARIO + '/w.jpg',
      img_key: 'w'
    },
    { 
      id: 'la27', 
      titulo: 'Letra X',  
      descripcion: 'Dedo indice curvado en forma de gancho, realizando un movimiento hacia ti.',
      video: RUTA_ABECEDARIO + '/x.mp4',
      imagenPng: RUTA_ABECEDARIO + '/x.jpg',
      leccionJpg: RUTA_ABECEDARIO + '/x.jpg',
      img_key: 'x'
    },
    { 
      id: 'la28', 
      titulo: 'Letra Y',  
      descripcion: 'Dedos pulgar y menique completamente extendidos, los dedos centrales doblados.',
      video: RUTA_ABECEDARIO + '/y.mp4',
      imagenPng: RUTA_ABECEDARIO + '/y.png',
      leccionJpg: RUTA_ABECEDARIO + '/y.jpg',
      img_key: 'y'
    },
    { 
      id: 'la29', 
      titulo: 'Letra Z',  
      descripcion: 'Dedo indice extendido dibuja la forma de una Z en el aire.',
      video: RUTA_ABECEDARIO + '/z.mp4',
      imagenPng: RUTA_ABECEDARIO + '/z.png',
      leccionJpg: RUTA_ABECEDARIO + '/z.jpg',
      img_key: 'z'
    }
  ],

  // SECCIÓN DE LOS COLORES
  col: [
    {
      id: 'lc01',
      titulo: 'Los Colores',
      descripcion: 'Dedo índices extendidos frente a frente, realizando movimientos circulares alternados hacia adelante.',
      video: RUTA_COLORES + '/colores.png',
      imagenPng: RUTA_COLORES + '/colores.png',
      leccionJpg: RUTA_COLORES + '/colores.jpg',
      img_key: 'colores' // <-- AGREGA ESTA LÍNEA (nombre exacto de la foto del quiz)
    },
    {
      id: 'lc02',
      titulo: 'Blanco',
      descripcion: 'Mano cerrada cruzando el pecho horizontalmente, abriéndose con dedos extendidos al final.',
      video: RUTA_COLORES + '/blanco.png',
      imagenPng: RUTA_COLORES + '/blanco.png',
      leccionJpg: RUTA_COLORES + '/blanco.jpg',
      img_key: 'blanco' // <-- AGREGA ESTA LÍNEA
    },
    {
      id: 'lc03',
      titulo: 'Amarillo',
      descripcion: 'Dedo índice y pulgar en pinza junto a la boca, desplazándose en diagonal hacia la mejilla.',
      video: RUTA_COLORES + '/amarillo.png',
      imagenPng: RUTA_COLORES + '/amarillo.png',
      leccionJpg: RUTA_COLORES + '/amarillo.jpg',
      img_key: 'amarillo' // <-- AGREGA ESTA LÍNEA
    },
    {
      id: 'lc04',
      titulo: 'Rojo',
      descripcion: 'Dedo índice tocando el labio inferior con movimiento corto hacia abajo.',
      video: RUTA_COLORES + '/rojo.png',
      imagenPng: RUTA_COLORES + '/rojo.png',
      img_key: 'rojo' // <-- AGREGA ESTA LÍNEA
    },
    {
      id: 'lc05',
      titulo: 'Marron',
      descripcion: 'Dedo índice extendido horizontalmente debajo de la barbilla, realizando pequeños movimientos circulares.',
      video: RUTA_COLORES + '/marron.png',
      imagenPng: RUTA_COLORES + '/marron.png',
      img_key: 'marron' // <-- AGREGA ESTA LÍNEA
    },
    {
      id: 'lc06',
      titulo: 'Azul',
      descripcion: 'Dedo índice y pulgar unidos junto al ojo, abriéndose hacia afuera extendiendo toda la mano.',
      video: RUTA_COLORES + '/azul.png',
      imagenPng: RUTA_COLORES + '/azul.png',
      img_key: 'azul' // <-- AGREGA ESTA LÍNEA
    },
    {
      id: 'lc07',
      titulo: 'Morado',
      descripcion: 'Dedo índice debajo del ojo, realizando un semicírculo hacia afuera sobre el pómulo.',
      video: RUTA_COLORES + '/morado.png',
      imagenPng: RUTA_COLORES + '/morado.png',
      img_key: 'morado' // <-- AGREGA ESTA LÍNEA
    }
  ]
};

// URLs de imágenes JPG para el quiz
export function getQuizImgUrl(seccionId, imgKey) {
  if (!imgKey) return ''; 

  // Forzamos la extensión .jpg que es la que tienen tus archivos reales
  const cleanKey = imgKey.replace(/\.[^/.]+$/, "") + ".jpg";

  if (seccionId === 'abc') {
    // CORRECCIÓN ABSOLUTA: Bucket 'Imagenes' (Mayúscula) y carpeta 'abecedario' (Minúscula)
    return `${BASE}/Imagenes/abecedario/${cleanKey}`;
  }
  // Para los colores, tu bucket 'Imagenes' y carpeta 'colores'
  return `${BASE}/Imagenes/colores/${cleanKey}`;
}

// 2. Mezclador de arreglos (Fisher-Yates)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 3. Generador de opciones para el Quiz (Correcta + Incorrectas)
export function buildQuizOptions(leccionCorrecta, seccionId) {
  // Obtenemos todas las lecciones de la sección actual ('abc' o 'col')
  const todasLasLecciones = LECCIONES[seccionId] || [];
  
  // Filtramos para sacar la lección correcta y quedarnos solo con las incorrectas
  const incorrectas = todasLasLecciones.filter(l => l.id !== leccionCorrecta.id);
  
  // Mezclamos las incorrectas y tomamos 2 para tener 3 opciones en total (1 correcta + 2 falsas)
  const incorrectasMezcladas = shuffle(incorrectas).slice(0, 2);
  
  // Creamos el arreglo final de opciones estructurado
  const opciones = [
    { leccion: leccionCorrecta, correct: true },
    ...incorrectasMezcladas.map(l => ({ leccion: l, correct: false }))
  ];
  
  // Mezclamos el resultado final para que la opción correcta no salga siempre en el mismo lugar
  return shuffle(opciones);
}

