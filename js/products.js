// Catálogo de ejemplo (semilla inicial). Una vez que el sitio se usa en el
// navegador, las categorías, productos y reseñas se guardan y editan desde el
// panel "Editar sitio" (⚙️) y quedan almacenados en el propio navegador.
// "image" puede ser una URL o quedar vacío para mostrar el emoji como imagen provisional.

const CATEGORIES = [
  {
    id: 1,
    name: "Llaveros",
    emoji: "🔑",
    image: "",
    desc: "Llaveros 3D con diseños divertidos: animales, personajes, iniciales y lo que se te ocurra."
  },
  {
    id: 2,
    name: "Figuras",
    emoji: "🐉",
    image: "",
    desc: "Figuras articuladas, decorativas y personalizadas, ideales para regalar o coleccionar."
  },
  {
    id: 3,
    name: "Hogar",
    emoji: "🪴",
    image: "",
    desc: "Macetas, posavasos y detalles para darle vida a tu espacio."
  },
  {
    id: 4,
    name: "Organización",
    emoji: "🗂️",
    image: "",
    desc: "Organizadores de escritorio, cables y accesorios prácticos para el día a día."
  },
  {
    id: 5,
    name: "Accesorios",
    emoji: "💍",
    image: "",
    desc: "Pulseras, dijes y pequeños accesorios impresos en 3D."
  },
  {
    id: 6,
    name: "Lámparas",
    emoji: "💡",
    image: "",
    desc: "Lámparas decorativas impresas en 3D con distintas texturas y estilos, pensadas para transformar cualquier rincón de tu casa."
  }
];

const PRODUCTS = [
  {
    id: 1,
    name: "Llavero tiburón",
    category: "Llaveros",
    price: 3990,
    image: "",
    emoji: "🦈",
    desc: "Llavero con forma de tiburón, impreso en una sola pieza. Varios colores disponibles.",
    featured: true,
    colors: [
      { name: "Gris", hex: "#7d8b96", image: "" },
      { name: "Azul", hex: "#3d8bd6", image: "" },
      { name: "Negro", hex: "#2c2c2c", image: "" }
    ]
  },
  {
    id: 2,
    name: "Llavero dinosaurio",
    category: "Llaveros",
    price: 3990,
    image: "",
    emoji: "🦕",
    desc: "Llavero con forma de dinosaurio, resistente y liviano. Ideal para mochilas y llaves.",
    featured: false,
    colors: []
  },
  {
    id: 3,
    name: "Llavero personalizado (nombre)",
    category: "Llaveros",
    price: 4990,
    image: "",
    emoji: "🔑",
    desc: "Llavero con el nombre o iniciales que quieras, a elección de color.",
    featured: true,
    colors: [
      { name: "Rojo", hex: "#e0503f", image: "" },
      { name: "Azul", hex: "#3d8bd6", image: "" },
      { name: "Verde", hex: "#4caf7d", image: "" },
      { name: "Negro", hex: "#2c2c2c", image: "" },
      { name: "Blanco", hex: "#f2f2f2", image: "" }
    ]
  },
  {
    id: 4,
    name: "Dije mini llavero",
    category: "Llaveros",
    price: 990,
    image: "",
    emoji: "🔑",
    desc: "Mini dije decorativo para llavero o mochila. Varios colores disponibles.",
    featured: false,
    colors: [
      { name: "Rosado", hex: "#ff8fc4", image: "" },
      { name: "Lila", hex: "#a78bfa", image: "" },
      { name: "Amarillo", hex: "#ffcf5c", image: "" },
      { name: "Blanco", hex: "#f2f2f2", image: "" }
    ]
  },
  {
    id: 5,
    name: "Adorno navideño",
    category: "Figuras",
    price: 1990,
    image: "",
    emoji: "🎄",
    desc: "Adorno navideño personalizable con nombre, ideal para el árbol.",
    featured: false,
    colors: []
  },
  {
    id: 6,
    name: "Dragón articulado",
    category: "Figuras",
    price: 13990,
    image: "",
    emoji: "🐉",
    desc: "Figura articulada impresa en PLA, se mueve completa. Ideal para regalo.",
    featured: true,
    colors: []
  },
  {
    id: 7,
    name: "Figura a pedido (chica)",
    category: "Figuras",
    price: 15990,
    image: "",
    emoji: "🧙",
    desc: "Figura estilo chibi de tu personaje favorito, tamaño hasta 10 cm.",
    featured: false,
    colors: []
  },
  {
    id: 8,
    name: "Figura a pedido (grande) + pintado",
    category: "Figuras",
    price: 45990,
    image: "",
    emoji: "🏆",
    desc: "Figura de gran formato (hasta 25 cm), pintada a mano con acabados de detalle.",
    featured: false,
    colors: []
  },
  {
    id: 9,
    name: "Posavasos (set de 4)",
    category: "Hogar",
    price: 5990,
    image: "",
    emoji: "🥤",
    desc: "Set de 4 posavasos con diseño geométrico, resistentes al agua.",
    featured: false,
    colors: []
  },
  {
    id: 10,
    name: "Maceta geométrica",
    category: "Hogar",
    price: 6990,
    image: "",
    emoji: "🪴",
    desc: "Maceta de diseño low-poly, incluye plato base. Varios colores.",
    featured: false,
    colors: [
      { name: "Terracota", hex: "#c96f4a", image: "" },
      { name: "Blanco", hex: "#f2f2f2", image: "" },
      { name: "Verde salvia", hex: "#8faa8b", image: "" },
      { name: "Negro", hex: "#2c2c2c", image: "" }
    ]
  },
  {
    id: 11,
    name: "Maceta colgante",
    category: "Hogar",
    price: 9990,
    image: "",
    emoji: "🌿",
    desc: "Maceta colgante con cuerdas incluidas, perfecta para suculentas.",
    featured: false,
    colors: []
  },
  {
    id: 12,
    name: "Lámpara luna",
    category: "Lámparas",
    price: 21990,
    compareAtPrice: 24990,
    image: "",
    emoji: "🌙",
    desc: "Lámpara decorativa con textura lunar realista, incluye base LED.",
    featured: true,
    colors: []
  },
  {
    id: 17,
    name: "Lámpara prisma",
    category: "Lámparas",
    price: 25990,
    compareAtPrice: 28990,
    image: "",
    emoji: "🔺",
    desc: "Lámpara de líneas geométricas con luz cálida, ideal como velador o para un rincón de lectura.",
    featured: true,
    colors: [
      { name: "Blanco", hex: "#f2f2f2", image: "" },
      { name: "Negro", hex: "#2c2c2c", image: "" },
      { name: "Madera", hex: "#a9784f", image: "" }
    ]
  },
  {
    id: 13,
    name: "Organizador de cables",
    category: "Organización",
    price: 2490,
    image: "",
    emoji: "🔌",
    desc: "Clips organizadores de cables para escritorio, pack de 5 unidades.",
    featured: false,
    colors: []
  },
  {
    id: 14,
    name: "Soporte para celular",
    category: "Organización",
    price: 6990,
    image: "",
    emoji: "📱",
    desc: "Soporte ajustable para escritorio, compatible con la mayoría de smartphones.",
    featured: false,
    colors: []
  },
  {
    id: 15,
    name: "Organizador de escritorio",
    category: "Organización",
    price: 8990,
    image: "",
    emoji: "🗂️",
    desc: "Organizador modular para lápices, clips y notas adhesivas.",
    featured: false,
    colors: []
  },
  {
    id: 16,
    name: "Pulsera articulada",
    category: "Accesorios",
    price: 5990,
    image: "",
    emoji: "💍",
    desc: "Pulsera flexible impresa en una sola pieza, sin ensamblaje.",
    featured: false,
    colors: []
  }
];

// Reseñas de ejemplo. Se administran desde ⚙️ → Reseñas (solo el dueño las agrega,
// no hay formulario público porque este sitio no tiene servidor propio).
const REVIEWS = [
  {
    id: 1,
    name: "Camila R.",
    rating: 5,
    comment: "Pedí un llavero personalizado para un regalo y quedó perfecto. Llegó rápido y con excelente calidad.",
    date: "2026-05-12"
  },
  {
    id: 2,
    name: "Matías G.",
    rating: 5,
    comment: "La figura que pedí quedó mejor de lo que esperaba. Muy buena atención por WhatsApp durante todo el proceso.",
    date: "2026-06-03"
  },
  {
    id: 3,
    name: "Fernanda P.",
    rating: 4,
    comment: "Buenos productos y buen precio. El envío se demoró un par de días más de lo estimado, pero valió la pena.",
    date: "2026-06-20"
  }
];
