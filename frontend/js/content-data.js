/* ==================================================
   DATOS CENTRALIZADOS DEL CONTENIDO
   Editar este archivo o usar el panel de administración
   para actualizar imágenes, años de actividad, etc.
================================================== */

const contentData = {
    // Información general
    school: {
        name: "I.E. Javier Pérez de Cuéllar",
        location: "Yauli, Junín, Perú",
        founded: 1923,
        currentYear: 2026,
        yearsOfActivity: 103,
        level: "Primaria",
        facebook: "https://www.facebook.com/31166JPCYauliJunin?locale=es_LA",
        motto: "Educación, Tradición y Futuro"
    },

    // Imagen del hero
    hero: {
        image: "img/hero/escuela.webp",
        title: "I.E. Javier Pérez de Cuéllar",
        subtitle: "103 años formando ciudadanos del futuro",
        stats: [
            { label: "Años de tradición", value: 103, suffix: "+" },
            { label: "Estudiantes", value: 350, suffix: "+" },
            { label: "Docentes", value: 18, suffix: "+" },
            { label: "Satisfacción", value: 100, suffix: "%" }
        ]
    },

    // Presentación / Misión y Visión
    presentation: {
        mission: "Brindar una educación integral de calidad que potencie las capacidades, valores y competencias de nuestros estudiantes, formándolos como ciudadanos responsables y comprometidos con el desarrollo de Yauli y del país.",
        vision: "Ser la institución educativa líder en la región Junín, reconocida por su excelencia académica, su compromiso con la inclusión y su aporte a la construcción de una sociedad justa y solidaria.",
        badgeText: "Años de excelencia educativa"
    },

    // Historia — Línea de tiempo
    history: [
        { year: 1923, title: "Fundación", text: "La escuela fue fundada como centro educativo primario en el distrito de Yauli, provincia de Yaucos, departamento de Junín, atendiendo a los niños de la comunidad minera." },
        { year: 1950, title: "Primera ampliación", text: "Se construyeron nuevas aulas para atender la creciente demanda de la población escolar, ampliando la cobertura educativa en la zona." },
        { year: 1975, title: "Reconocimiento oficial", text: "La institución obtiene su reconocimiento oficial del Ministerio de Educación, consolidando su labor pedagógica en la región." },
        { year: 1990, title: "Infraestructura moderna", text: "Se remodela la infraestructura con nuevos pabellones, laboratorio y biblioteca, modernizando los espacios de aprendizaje." },
        { year: 2000, title: "Integración tecnológica", text: "Se incorpora la sala de cómputo y se inicia el proceso de integración de las TIC en la enseñanza cotidiana." },
        { year: 2010, title: "Renombre nacional", text: "La I.E. recibe reconocimientos nacionales por su desempeño en concursos de ciencias, deportes y arte." },
        { year: 2023, title: "Centenario", text: "Se celebra el 100.° aniversario con actividades cívicas, culturales y deportivas, reafirmando el compromiso con la educación de calidad." },
        { year: 2026, title: "Hoy", text: "Continuamos creciendo con 103 años de historia, innovando en pedagogía y fortaleciendo nuestra comunidad educativa." }
    ],

    // Niveles educativos
    levels: [
        { name: "1.° y 2.° Grado", icon: "fa-seedling", description: "Inicio del aprendizaje formal con enfoque lúdico y creativo." },
        { name: "3.° y 4.° Grado", icon: "fa-book-open", description: "Fortalecimiento de competencias y pensamiento crítico." },
        { name: "5.° y 6.° Grado", icon: "fa-graduation-cap", description: "Preparación integral para la secundaria y la vida." }
    ],

    // Infraestructura
    infrastructure: [
        { title: "Aulas modernas", icon: "fa-chalkboard-teacher", image: "img/galeria/02-aula.webp", description: "Aulas amplias, iluminadas y equipadas para un aprendizaje efectivo." },
        { title: "Laboratorio", icon: "fa-flask", image: "img/actividades/ciencias.webp", description: "Espacio para experimentación y descubrimiento científico." },
        { title: "Biblioteca", icon: "fa-book", image: "img/galeria/01-fachada.webp", description: "Amplio acervo bibliográfico y recursos digitales." },
        { title: "Sala de cómputo", icon: "fa-desktop", image: "img/actividades/ciencias.webp", description: "Equipamiento tecnológico actualizado para educación digital." },
        { title: "Cancha deportiva", icon: "fa-futbol", image: "img/actividades/deportes.webp", description: "Espacios deportivos para educación física y recreación." },
        { title: "Taller de arte", icon: "fa-palette", image: "img/actividades/arte.webp", description: "Fomento de la creatividad y expresión artística." },
        { title: "Quiosco escolar", icon: "fa-store", image: "img/galeria/01-fachada.webp", description: "Alimentación saludable y segura para los estudiantes." },
        { title: "Áreas verdes", icon: "fa-tree", image: "img/galeria/01-fachada.webp", description: "Espacios naturales para esparcimiento y contacto con la naturaleza." }
    ],

    // Actividades
    activities: [
        { title: "Ciencias y Tecnología", icon: "fa-atom", image: "img/actividades/ciencias.webp", description: "Ferias de ciencias, robótica y proyectos de innovación." },
        { title: "Deportes", icon: "fa-running", image: "img/actividades/deportes.webp", description: "Fútbol, atletismo, voleibol y más disciplinas deportivas." },
        { title: "Arte y Cultura", icon: "fa-music", image: "img/actividades/arte.webp", description: "Danza, teatro, música y expresiones culturales locales." },
        { title: "Concursos Académicos", icon: "fa-award", image: "img/actividades/ciencias.webp", description: "Olimpiadas matemáticas, comunicativas y de conocimiento." },
        { title: "Valores y Civismo", icon: "fa-hands-helping", image: "img/actividades/deportes.webp", description: "Formación en valores, liderazgo y participación comunitaria." },
        { title: "Medio Ambiente", icon: "fa-leaf", image: "img/actividades/arte.webp", description: "Huerto escolar, reciclaje y conciencia ecológica." }
    ],

    // Cita inspiradora
    quote: {
        text: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
        author: "Nelson Mandela"
    },

    // Himno
    hymn: {
        title: "Himno de la I.E. Javier Pérez de Cuéllar",
        audioSrc: "",
        lyrics: ""
    },

    // Galería de imágenes
    gallery: [
    { src: "img/galeria/01-fachada.webp",     alt: "Fachada de la I.E.",                    category: "infraestructura" },
    { src: "img/galeria/02-aula.webp",        alt: "Sala de cómputo",                        category: "infraestructura" },
    { src: "img/galeria/03-canto.webp",       alt: "Concurso de canto 'Voces que Brillan'",  category: "cultura" },
    { src: "img/galeria/04-ciencia.webp",     alt: "Feria de Ciencia y Tecnología 2026",     category: "actividades" },
    { src: "img/galeria/05-campeonato.webp",  alt: "Campeonato interssecciones",             category: "deportes" },
    { src: "img/galeria/06-aniversario.webp", alt: "103 Años de Historia",                   category: "actividades" }
    ],

        // Información de contacto
    contact: {
        address: "Yauli, Junín, Perú",
        phone: "956937972",
        email: "",
        hours: "Lunes a Viernes: 8:30 a.m. – 1:30 p.m.",
        facebook: "https://www.facebook.com/31166JPCYauliJunin?locale=es_LA"
    },

    // Flyers / Carteles institucionales
    flyers: [
      { image: "img/flyers/01-aniversario.webp",    title: "103 Años de Historia",                       description: "CIII Aniversario Institucional", category: "aniversario" },
      { image: "img/flyers/02-fachada.webp",        title: "Nuestra Institución",                        description: "Estudio · Trabajo · Disciplina", category: "logro" },
      { image: "img/flyers/03-concurso-canto.webp", title: "Concurso de Canto 'Voces que Brillan'",      description: "FELIZ ANIVERSARIO 103 AÑOS",     category: "aniversario" },
      { image: "img/flyers/04-feria-ciencia.webp",  title: "Feria Nacional Escolar de Ciencia y Tecnología", description: "Feria 2026",                 category: "logro" },
      { image: "img/flyers/05-campeonato.webp",     title: "Campeonato Interssecciones",                 description: "FELIZ ANIVERSARIO 103 AÑOS",     category: "aniversario" }
    ]
};

// Exponer globalmente
window.contentData = contentData;