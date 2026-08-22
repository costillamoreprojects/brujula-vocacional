import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Compass, Code2, HeartPulse, FlaskConical, Wrench, Palette, Megaphone,
  Briefcase, Users, ChevronRight, X, RotateCcw, Sparkles, Clock,
  TrendingUp, Wallet, ArrowRight, Check, Send, MessageCircle, BookOpen,
  Lightbulb, Rocket, RefreshCw, Trophy, Puzzle, Quote, Sun, Moon, Scale, Building2, ExternalLink
} from "lucide-react";

/* ---------------------------------------------------------
   DATA
--------------------------------------------------------- */

const AREAS = [
  { id: "tecnologia", label: "Tecnología", icon: Code2, angle: 0 },
  { id: "salud", label: "Salud", icon: HeartPulse, angle: 45 },
  { id: "ciencias_exactas", label: "Ciencias Exactas", icon: FlaskConical, angle: 90 },
  { id: "ingenieria", label: "Ingeniería", icon: Wrench, angle: 135 },
  { id: "artes", label: "Artes y Diseño", icon: Palette, angle: 180 },
  { id: "comunicacion", label: "Comunicación", icon: Megaphone, angle: 225 },
  { id: "negocios", label: "Negocios", icon: Briefcase, angle: 270 },
  { id: "sociales", label: "Ciencias Sociales", icon: Users, angle: 315 },
];

const areaById = Object.fromEntries(AREAS.map(a => [a.id, a]));

const QUESTIONS = [
  { text: "Me gusta resolver problemas lógicos o acertijos matemáticos.", areas: ["tecnologia", "ciencias_exactas"] },
  { text: "Me interesa entender cómo funciona el cuerpo humano y la salud.", areas: ["salud"] },
  { text: "Disfruto dibujar, diseñar o crear cosas visualmente atractivas.", areas: ["artes"] },
  { text: "Me gusta armar, desarmar o reparar cosas con las manos.", areas: ["ingenieria"] },
  { text: "Me gusta escribir, hablar en público o contar historias.", areas: ["comunicacion"] },
  { text: "Me interesa entender por qué las personas piensan y actúan como actúan.", areas: ["sociales"] },
  { text: "Me imagino liderando mi propio proyecto o negocio en el futuro.", areas: ["negocios"] },
  { text: "Me gusta programar, crear apps o entender cómo funcionan los videojuegos.", areas: ["tecnologia"] },
  { text: "Disfruto cuidar, acompañar o ayudar a otras personas.", areas: ["salud"] },
  { text: "Me atrae investigar fenómenos naturales o hacer experimentos.", areas: ["ciencias_exactas"] },
  { text: "Me gustaría diseñar estructuras, planos o maquetas.", areas: ["ingenieria", "artes"] },
  { text: "Tengo buen ojo estético y me importa mucho cómo se ve algo.", areas: ["artes"] },
  { text: "Se me da bien convencer, negociar o vender una idea.", areas: ["negocios"] },
  { text: "Sigo de cerca las noticias, redes sociales o el mundo de los medios.", areas: ["comunicacion"] },
  { text: "Me preocupan los problemas sociales, la justicia o la política.", areas: ["sociales"] },
  { text: "Paso horas investigando temas de tecnología o ciencia por pura curiosidad.", areas: ["tecnologia", "ciencias_exactas"] },
  { text: "Me gustaría entender cómo funcionan las finanzas y el dinero.", areas: ["negocios"] },
  { text: "Disfruto participar en debates o discusiones de ideas.", areas: ["sociales", "comunicacion"] },
  { text: "Me atrae la idea de enseñar o explicarle cosas a otros.", areas: ["sociales"] },
  { text: "Me gusta trabajar con números y hacer cálculos precisos.", areas: ["ciencias_exactas"] },
  { text: "Me interesa cómo se crean las apps y páginas web que uso todos los días.", areas: ["tecnologia"] },
  { text: "Me gustaría diseñar productos u objetos que la gente use a diario.", areas: ["artes", "ingenieria"] },
  { text: "Me imagino trabajando en un hospital o centro de salud.", areas: ["salud"] },
  { text: "Me gusta organizar eventos, grupos o actividades.", areas: ["negocios", "comunicacion"] },
];

const ANSWER_SCALE = [
  { value: 1, label: "Nada" },
  { value: 2, label: "Poco" },
  { value: 3, label: "Algo" },
  { value: 4, label: "Bastante" },
  { value: 5, label: "Mucho" },
];

const CAREERS = [
  {
    id: "sistemas", area: "tecnologia", nombre: "Ingeniería en Sistemas / Informática",
    descripcion: "Diseñás y programás software, aplicaciones y sistemas que resuelven problemas reales, desde apps hasta inteligencia artificial.",
    duracion: "5 años", salida: "Alta demanda en empresas de software, bancos, startups y trabajo remoto para el exterior.",
    sueldoMin: 900000, sueldoMax: 2200000, habilidades: ["Lógica", "Programación", "Resolución de problemas"],
    materias: ["Matemática", "Programación", "Física"],
    testimonio: { nombre: "Bruno, 2do año", texto: "Pensé que iba a programar todo el día solo, pero paso más tiempo resolviendo problemas en equipo de lo que imaginaba." }
  },
  {
    id: "datos", area: "tecnologia", nombre: "Ciencia de Datos",
    descripcion: "Analizás grandes volúmenes de información para encontrar patrones y ayudar a tomar mejores decisiones.",
    duracion: "4 años", salida: "Muy buscada por empresas de tecnología, finanzas y marketing.",
    sueldoMin: 850000, sueldoMax: 2000000, habilidades: ["Estadística", "Programación", "Pensamiento analítico"],
    materias: ["Matemática", "Estadística", "Tecnología"],
    testimonio: { nombre: "Male, 3er año", texto: "Al principio la estadística me costaba, pero cuando empezás a ver patrones en datos reales, se vuelve adictivo." }
  },
  {
    id: "videojuegos", area: "tecnologia", nombre: "Desarrollo de Videojuegos",
    descripcion: "Programás y diseñás videojuegos, combinando lógica, arte y narrativa interactiva.",
    duracion: "3-4 años", salida: "Estudios de videojuegos, apps interactivas, animación y freelance internacional.",
    sueldoMin: 600000, sueldoMax: 1600000, habilidades: ["Programación", "Creatividad", "Trabajo en equipo"],
    materias: ["Matemática", "Tecnología", "Arte"],
    testimonio: { nombre: "Fran, 1er año", texto: "Programar mi primer nivel jugable fue una locura, sentí que hice magia con código." }
  },
  {
    id: "telecomunicaciones", area: "tecnologia", nombre: "Ingeniería en Telecomunicaciones",
    descripcion: "Diseñás redes y sistemas de comunicación que conectan personas y dispositivos a distancia.",
    duracion: "5 años", salida: "Empresas de telecomunicaciones, proveedores de internet, industria satelital.",
    sueldoMin: 750000, sueldoMax: 1800000, habilidades: ["Matemática", "Redes", "Resolución de problemas"],
    materias: ["Matemática", "Física", "Tecnología"],
    testimonio: { nombre: "Ceci, 4to año", texto: "No sabía que detrás de cada llamada o video hay tanta ingeniería. Ahora no puedo dejar de pensarlo." }
  },
  {
    id: "ciberseguridad", area: "tecnologia", nombre: "Ciberseguridad",
    descripcion: "Protegés sistemas, redes y datos de ataques informáticos y vulnerabilidades.",
    duracion: "3-4 años", salida: "Empresas de tecnología, bancos, consultoras de seguridad informática.",
    sueldoMin: 900000, sueldoMax: 2300000, habilidades: ["Pensamiento analítico", "Programación", "Atención al detalle"],
    materias: ["Matemática", "Tecnología", "Inglés"],
    testimonio: { nombre: "Tomi, 2do año", texto: "Es como resolver un misterio todo el tiempo: buscar la falla antes de que la encuentre alguien con malas intenciones." }
  },

  {
    id: "ia_ml", area: "tecnologia", nombre: "Inteligencia Artificial y Machine Learning",
    descripcion: "Diseñás sistemas que aprenden de datos para tomar decisiones o generar contenido, desde chatbots hasta autos que se manejan solos.",
    duracion: "4-5 años (especialización sobre Sistemas o Ciencia de Datos)", salida: "Empresas de tecnología de punta, investigación, startups de IA en todo el mundo.",
    sueldoMin: 1000000, sueldoMax: 2500000, habilidades: ["Matemática", "Programación", "Pensamiento lógico"],
    materias: ["Matemática", "Tecnología", "Física"],
    testimonio: { nombre: "Tobi, 3er año", texto: "Entrenar mi primer modelo y verlo 'aprender' de verdad fue de las cosas más fuertes que hice en la facultad." }
  },

  {
    id: "medicina", area: "salud", nombre: "Medicina",
    descripcion: "Formación para diagnosticar, tratar y prevenir enfermedades, cuidando la salud de las personas.",
    duracion: "6-7 años", salida: "Hospitales, clínicas, consultorios propios e investigación.",
    sueldoMin: 700000, sueldoMax: 1800000, habilidades: ["Empatía", "Memoria", "Trabajo bajo presión"],
    materias: ["Biología", "Química", "Matemática"],
    testimonio: { nombre: "Agus, 4to año", texto: "Los primeros años son duros, pero la primera vez que ayudás de verdad a alguien, entendés por qué vale la pena." }
  },
  {
    id: "enfermeria", area: "salud", nombre: "Enfermería",
    descripcion: "Brindás cuidado directo a pacientes, acompañando tratamientos y emergencias en equipos de salud.",
    duracion: "3-4 años", salida: "Hospitales, clínicas, geriátricos y atención domiciliaria.",
    sueldoMin: 550000, sueldoMax: 1100000, habilidades: ["Empatía", "Precisión", "Calma"],
    materias: ["Biología", "Química"],
    testimonio: { nombre: "Vale, 2do año", texto: "Es una carrera exigente, pero el contacto directo con la gente te llena de una forma que no esperaba." }
  },
  {
    id: "odontologia", area: "salud", nombre: "Odontología",
    descripcion: "Diagnosticás y tratás la salud bucal, combinando precisión manual con atención al paciente.",
    duracion: "5 años", salida: "Consultorios propios, clínicas odontológicas, obras sociales.",
    sueldoMin: 650000, sueldoMax: 1600000, habilidades: ["Precisión", "Empatía", "Motricidad fina"],
    materias: ["Biología", "Química"],
    testimonio: { nombre: "Nico, 3er año", texto: "Me sorprendió lo manual que es: entre precisión y trato con pacientes, nunca es aburrido." }
  },
  {
    id: "kinesiologia", area: "salud", nombre: "Kinesiología",
    descripcion: "Rehabilitás el movimiento del cuerpo tras lesiones, cirugías o enfermedades.",
    duracion: "4-5 años", salida: "Clínicas, centros de rehabilitación, clubes deportivos, consultorio propio.",
    sueldoMin: 550000, sueldoMax: 1300000, habilidades: ["Anatomía", "Empatía", "Paciencia"],
    materias: ["Biología", "Educación Física"],
    testimonio: { nombre: "Sol, 3er año", texto: "Ver a alguien volver a caminar después de rehabilitarlo es una sensación que no se paga con nada." }
  },
  {
    id: "nutricion", area: "salud", nombre: "Nutrición",
    descripcion: "Asesorás sobre alimentación saludable y diseñás planes nutricionales para distintas necesidades.",
    duracion: "4 años", salida: "Consultorios, hospitales, clubes deportivos, industria alimenticia.",
    sueldoMin: 500000, sueldoMax: 1200000, habilidades: ["Biología", "Comunicación", "Empatía"],
    materias: ["Biología", "Química"],
    testimonio: { nombre: "Uma, 2do año", texto: "Aprendés que la alimentación no es solo dieta, es entender a cada persona en su contexto." }
  },

  {
    id: "veterinaria", area: "salud", nombre: "Medicina Veterinaria",
    descripcion: "Diagnosticás, tratás y cuidás la salud de los animales, desde mascotas hasta animales de granja o fauna silvestre.",
    duracion: "5 años", salida: "Clínicas veterinarias, zoológicos, industria agropecuaria, investigación.",
    sueldoMin: 550000, sueldoMax: 1400000, habilidades: ["Empatía", "Precisión", "Amor por los animales"],
    materias: ["Biología", "Química"],
    testimonio: { nombre: "Cata, 2do año", texto: "Nunca pensé que iba a emocionarme tanto operando a un perrito, pero acá estoy." }
  },

  {
    id: "fisica", area: "ciencias_exactas", nombre: "Licenciatura en Física",
    descripcion: "Estudiás las leyes que explican el universo, desde partículas hasta galaxias, con foco en investigación.",
    duracion: "5 años", salida: "Investigación, docencia, industria tecnológica y energética.",
    sueldoMin: 600000, sueldoMax: 1500000, habilidades: ["Matemática", "Curiosidad", "Pensamiento abstracto"],
    materias: ["Matemática", "Física"],
    testimonio: { nombre: "Iván, 3er año", texto: "Entender por qué el universo funciona como funciona te cambia la forma de ver todo, literalmente." }
  },
  {
    id: "quimica", area: "ciencias_exactas", nombre: "Licenciatura en Química",
    descripcion: "Investigás la composición y transformación de la materia, aplicable a la industria y el medioambiente.",
    duracion: "5 años", salida: "Laboratorios, industria farmacéutica y alimenticia, investigación.",
    sueldoMin: 600000, sueldoMax: 1400000, habilidades: ["Experimentación", "Precisión", "Análisis"],
    materias: ["Química", "Matemática", "Biología"],
    testimonio: { nombre: "Cami, 2do año", texto: "El laboratorio es el lugar donde la teoría se vuelve real, y a veces explota, literal." }
  },
  {
    id: "matematica", area: "ciencias_exactas", nombre: "Licenciatura en Matemática",
    descripcion: "Profundizás en estructuras lógicas y modelos abstractos que son la base de la ciencia y la tecnología.",
    duracion: "5 años", salida: "Investigación, docencia, finanzas cuantitativas y tecnología.",
    sueldoMin: 600000, sueldoMax: 1500000, habilidades: ["Pensamiento abstracto", "Lógica", "Paciencia"],
    materias: ["Matemática"],
    testimonio: { nombre: "Facu, 4to año", texto: "Pensé que iba a ser solo números, pero es la carrera más creativa que cursé: es resolver acertijos todo el día." }
  },
  {
    id: "astronomia", area: "ciencias_exactas", nombre: "Astronomía",
    descripcion: "Estudiás estrellas, planetas y el universo usando telescopios, datos y modelos matemáticos.",
    duracion: "5 años", salida: "Observatorios, investigación, docencia universitaria.",
    sueldoMin: 600000, sueldoMax: 1500000, habilidades: ["Curiosidad", "Matemática", "Paciencia"],
    materias: ["Física", "Matemática"],
    testimonio: { nombre: "Juli, 1er año", texto: "La primera vez que usé un telescopio de verdad, entendí por qué elegí esto." }
  },
  {
    id: "ciencias_ambientales", area: "ciencias_exactas", nombre: "Ciencias Ambientales",
    descripcion: "Investigás el impacto humano en el ambiente y proponés soluciones sustentables.",
    duracion: "4-5 años", salida: "Organismos públicos, consultoras ambientales, ONGs.",
    sueldoMin: 550000, sueldoMax: 1400000, habilidades: ["Análisis", "Compromiso ambiental", "Trabajo de campo"],
    materias: ["Biología", "Química", "Geografía"],
    testimonio: { nombre: "Roci, 3er año", texto: "Salís del aula literal: hay salidas de campo, muestreo, y la sensación de que tu trabajo importa para el planeta." }
  },

  {
    id: "biotecnologia", area: "ciencias_exactas", nombre: "Biotecnología",
    descripcion: "Usás organismos vivos y procesos biológicos para crear medicamentos, alimentos o soluciones ambientales.",
    duracion: "4-5 años", salida: "Laboratorios farmacéuticos, industria alimenticia, investigación genética.",
    sueldoMin: 700000, sueldoMax: 1700000, habilidades: ["Biología", "Química", "Innovación"],
    materias: ["Biología", "Química", "Matemática"],
    testimonio: { nombre: "Bianca, 3er año", texto: "Trabajar con ADN en el laboratorio se siente ciencia ficción, pero es mi día a día." }
  },

  {
    id: "civil", area: "ingenieria", nombre: "Ingeniería Civil",
    descripcion: "Planificás y construís puentes, edificios y obras de infraestructura que transforman las ciudades.",
    duracion: "5-6 años", salida: "Constructoras, estudios de ingeniería, sector público.",
    sueldoMin: 700000, sueldoMax: 1700000, habilidades: ["Cálculo", "Planificación", "Visión espacial"],
    materias: ["Matemática", "Física", "Dibujo Técnico"],
    testimonio: { nombre: "Denis, 4to año", texto: "Ver un edificio en pie que ayudaste a calcular es una sensación única." }
  },
  {
    id: "industrial", area: "ingenieria", nombre: "Ingeniería Industrial",
    descripcion: "Optimizás procesos productivos y de gestión para que las empresas funcionen mejor y de forma más eficiente.",
    duracion: "5 años", salida: "Fábricas, logística, consultoras y gestión de proyectos.",
    sueldoMin: 750000, sueldoMax: 1800000, habilidades: ["Organización", "Análisis", "Liderazgo"],
    materias: ["Matemática", "Física", "Economía"],
    testimonio: { nombre: "Meli, 3er año", texto: "Es la carrera de 'mejorar cómo se hacen las cosas': aplica a fábricas, hospitales, hasta un local de comida." }
  },
  {
    id: "electronica", area: "ingenieria", nombre: "Ingeniería Electrónica",
    descripcion: "Diseñás circuitos y sistemas electrónicos presentes en celulares, robots y automatización industrial.",
    duracion: "5-6 años", salida: "Industria tecnológica, telecomunicaciones, robótica y automatización.",
    sueldoMin: 750000, sueldoMax: 1800000, habilidades: ["Matemática", "Lógica", "Resolución de problemas"],
    materias: ["Matemática", "Física", "Tecnología"],
    testimonio: { nombre: "Gonza, 2do año", texto: "Armar tu primer circuito que funciona de verdad es una sensación de logro que engancha." }
  },
  {
    id: "aeronautica", area: "ingenieria", nombre: "Ingeniería Aeronáutica",
    descripcion: "Diseñás y mantenés aviones y sistemas aeroespaciales.",
    duracion: "5-6 años", salida: "Industria aeronáutica, aerolíneas, sector de defensa.",
    sueldoMin: 800000, sueldoMax: 2000000, habilidades: ["Matemática", "Precisión", "Trabajo en equipo"],
    materias: ["Matemática", "Física"],
    testimonio: { nombre: "Naza, 4to año", texto: "Estudiar por qué vuela un avión y después ver uno despegar sabiendo cómo funciona, no tiene precio." }
  },
  {
    id: "alimentos", area: "ingenieria", nombre: "Ingeniería en Alimentos",
    descripcion: "Aplicás ciencia y tecnología para producir y conservar alimentos de forma segura y eficiente.",
    duracion: "5 años", salida: "Industria alimenticia, control de calidad, desarrollo de productos.",
    sueldoMin: 650000, sueldoMax: 1600000, habilidades: ["Química", "Organización", "Precisión"],
    materias: ["Química", "Biología", "Matemática"],
    testimonio: { nombre: "Flor, 3er año", texto: "Combina química, biología y creatividad, y siempre hay algo nuevo para probar en el laboratorio." }
  },

  {
    id: "biomedica", area: "ingenieria", nombre: "Ingeniería Biomédica",
    descripcion: "Diseñás equipos y tecnología médica, desde prótesis hasta resonadores, combinando ingeniería con salud.",
    duracion: "5-6 años", salida: "Industria de tecnología médica, hospitales, investigación biomédica.",
    sueldoMin: 750000, sueldoMax: 1900000, habilidades: ["Matemática", "Biología", "Innovación"],
    materias: ["Matemática", "Física", "Biología"],
    testimonio: { nombre: "Rodri, 4to año", texto: "Diseñar una prótesis que después usa una persona real te cambia la perspectiva de para qué sirve estudiar." }
  },

  {
    id: "diseno", area: "artes", nombre: "Diseño Gráfico",
    descripcion: "Creás piezas visuales, marcas e interfaces que comunican ideas de forma clara y atractiva.",
    duracion: "4 años", salida: "Agencias, estudios de diseño, freelance y empresas de todo tipo.",
    sueldoMin: 500000, sueldoMax: 1300000, habilidades: ["Creatividad", "Estética", "Software de diseño"],
    materias: ["Arte", "Tecnología"],
    testimonio: { nombre: "Pilar, 2do año", texto: "Ver tu diseño usado de verdad por una marca, aunque sea chica, se siente increíble." }
  },
  {
    id: "arquitectura", area: "artes", nombre: "Arquitectura",
    descripcion: "Diseñás espacios y edificios pensando en cómo las personas van a vivirlos y habitarlos.",
    duracion: "5-6 años", salida: "Estudios de arquitectura, construcción, diseño de interiores.",
    sueldoMin: 600000, sueldoMax: 1500000, habilidades: ["Creatividad", "Cálculo", "Visión espacial"],
    materias: ["Arte", "Matemática", "Dibujo Técnico"],
    testimonio: { nombre: "Santi, 4to año", texto: "Es una carrera exigente, pero imaginar un espacio y después verlo construido es único." }
  },
  {
    id: "audiovisual", area: "artes", nombre: "Realización Audiovisual / Cine",
    descripcion: "Contás historias a través de imagen y sonido, desde el guion hasta la edición final.",
    duracion: "3-4 años", salida: "Productoras, plataformas de streaming, publicidad y contenido digital.",
    sueldoMin: 500000, sueldoMax: 1400000, habilidades: ["Creatividad", "Narrativa", "Trabajo en equipo"],
    materias: ["Arte", "Comunicación", "Lengua"],
    testimonio: { nombre: "Lula, 2do año", texto: "Filmar tu primer corto con amigos y verlo terminado te hace entender por qué elegiste esto." }
  },
  {
    id: "indumentaria", area: "artes", nombre: "Diseño de Indumentaria",
    descripcion: "Creás colecciones de ropa y accesorios, combinando creatividad con conocimiento textil.",
    duracion: "4 años", salida: "Marcas de indumentaria, moda sustentable, emprendimientos propios.",
    sueldoMin: 450000, sueldoMax: 1200000, habilidades: ["Creatividad", "Estética", "Patronaje"],
    materias: ["Arte", "Tecnología"],
    testimonio: { nombre: "Abril, 3er año", texto: "Pasás de un boceto en un cuaderno a una prenda real que alguien se pone, ese proceso es adictivo." }
  },
  {
    id: "animacion", area: "artes", nombre: "Animación Digital",
    descripcion: "Creás personajes y mundos animados para películas, series, publicidad o videojuegos.",
    duracion: "3-4 años", salida: "Estudios de animación, agencias de publicidad, plataformas de streaming.",
    sueldoMin: 500000, sueldoMax: 1400000, habilidades: ["Creatividad", "Dibujo", "Software 3D"],
    materias: ["Arte", "Tecnología"],
    testimonio: { nombre: "Bauti, 2do año", texto: "Dar vida a un personaje que dibujaste vos mismo es de las cosas más satisfactorias que hice." }
  },

  {
    id: "ux_ui", area: "artes", nombre: "Diseño UX/UI",
    descripcion: "Diseñás cómo se ve y cómo se usa una app o página web, pensando siempre en la experiencia de quien la usa.",
    duracion: "2-4 años (tecnicatura o licenciatura)", salida: "Startups, empresas de tecnología, agencias digitales, freelance.",
    sueldoMin: 650000, sueldoMax: 1700000, habilidades: ["Empatía", "Creatividad", "Pensamiento lógico"],
    materias: ["Arte", "Tecnología"],
    testimonio: { nombre: "Dani, 2do año", texto: "Rediseñé una app que usaba mi familia y ver que ahora la entienden mejor fue un subidón." }
  },

  {
    id: "comunicacion", area: "comunicacion", nombre: "Comunicación Social / Periodismo",
    descripcion: "Investigás, contás historias y comunicás información a través de medios y plataformas digitales.",
    duracion: "4 años", salida: "Medios de comunicación, prensa institucional, contenido digital.",
    sueldoMin: 500000, sueldoMax: 1200000, habilidades: ["Escritura", "Curiosidad", "Comunicación oral"],
    materias: ["Lengua", "Comunicación", "Sociales"],
    testimonio: { nombre: "Delfi, 3er año", texto: "Aprendés a contar historias que la gente realmente escucha, no solo a escribir lindo." }
  },
  {
    id: "marketing", area: "comunicacion", nombre: "Marketing Digital",
    descripcion: "Planificás estrategias para que marcas y productos lleguen a las personas correctas en el momento justo.",
    duracion: "3-4 años", salida: "Agencias, empresas, emprendimientos propios y freelance.",
    sueldoMin: 550000, sueldoMax: 1400000, habilidades: ["Creatividad", "Análisis de datos", "Comunicación"],
    materias: ["Comunicación", "Matemática", "Arte"],
    testimonio: { nombre: "Ramiro, 2do año", texto: "Ver crecer una marca chica gracias a una idea tuya es una sensación rara y buena." }
  },
  {
    id: "publicidad", area: "comunicacion", nombre: "Publicidad",
    descripcion: "Creás campañas e ideas que conectan marcas con las personas de forma creativa y estratégica.",
    duracion: "4 años", salida: "Agencias de publicidad, empresas, marketing de contenidos.",
    sueldoMin: 550000, sueldoMax: 1400000, habilidades: ["Creatividad", "Comunicación", "Estrategia"],
    materias: ["Comunicación", "Arte", "Lengua"],
    testimonio: { nombre: "Sofi, 4to año", texto: "Es la carrera perfecta si te gusta tener ideas locas y después convertirlas en algo que la gente recuerda." }
  },
  {
    id: "radio_podcast", area: "comunicacion", nombre: "Locución y Producción de Radio/Podcast",
    descripcion: "Contás historias en formato de audio, conducís programas y producís contenido sonoro.",
    duracion: "2-3 años", salida: "Radios, plataformas de streaming de audio, productoras de contenido.",
    sueldoMin: 450000, sueldoMax: 1100000, habilidades: ["Comunicación oral", "Creatividad", "Improvisación"],
    materias: ["Lengua", "Comunicación"],
    testimonio: { nombre: "Emi, 1er año", texto: "Grabar tu primer episodio y que alguien que no conocés te escuche desde otro país es una sensación única." }
  },
  {
    id: "community_management", area: "comunicacion", nombre: "Community Management / Redes Sociales",
    descripcion: "Gestionás la presencia digital de marcas y personas en redes sociales.",
    duracion: "1-2 años (tecnicatura) o carrera de grado en comunicación", salida: "Agencias digitales, empresas, freelance.",
    sueldoMin: 500000, sueldoMax: 1300000, habilidades: ["Creatividad", "Redes sociales", "Comunicación escrita"],
    materias: ["Comunicación", "Arte", "Lengua"],
    testimonio: { nombre: "Kari, 2do año", texto: "Es más estratégico de lo que parece: no es solo publicar, es entender a la gente detrás de la pantalla." }
  },

  {
    id: "creador_contenido", area: "comunicacion", nombre: "Creador de Contenido Digital",
    descripcion: "Creás y gestionás contenido para redes y plataformas digitales, combinando creatividad, storytelling y estrategia de marca.",
    duracion: "1-3 años (tecnicatura o carrera corta)", salida: "Agencias de marketing digital, marcas, proyectos propios como creador.",
    sueldoMin: 500000, sueldoMax: 1500000, habilidades: ["Creatividad", "Storytelling", "Análisis de redes"],
    materias: ["Comunicación", "Arte", "Lengua"],
    testimonio: { nombre: "Bren, 1er año", texto: "Aprendí que atrás de un buen video de 30 segundos hay muchísima estrategia, no es solo grabar y subir." }
  },

  {
    id: "administracion", area: "negocios", nombre: "Administración de Empresas",
    descripcion: "Aprendés a gestionar recursos, equipos y estrategias para que una organización funcione y crezca.",
    duracion: "4 años", salida: "Empresas de todos los rubros, emprendimientos propios, consultoría.",
    sueldoMin: 600000, sueldoMax: 1600000, habilidades: ["Organización", "Liderazgo", "Negociación"],
    materias: ["Matemática", "Economía"],
    testimonio: { nombre: "Lauti, 3er año", texto: "Aprendés a organizar cosas que después vas a usar en cualquier proyecto propio que tengas." }
  },
  {
    id: "economia", area: "negocios", nombre: "Economía",
    descripcion: "Estudiás cómo se producen, distribuyen y consumen los recursos para entender y prever el mercado.",
    duracion: "4-5 años", salida: "Bancos, consultoras, organismos públicos e internacionales.",
    sueldoMin: 650000, sueldoMax: 1700000, habilidades: ["Pensamiento analítico", "Matemática", "Lectura de datos"],
    materias: ["Matemática", "Economía"],
    testimonio: { nombre: "Maxi, 4to año", texto: "Empezás a entender las noticias de otra forma: de repente todo tiene un por qué económico." }
  },
  {
    id: "comercio_internacional", area: "negocios", nombre: "Comercio Internacional",
    descripcion: "Gestionás negocios y estrategias entre empresas de distintos países, con foco en mercados globales.",
    duracion: "4 años", salida: "Empresas exportadoras, logística internacional, organismos de comercio.",
    sueldoMin: 600000, sueldoMax: 1600000, habilidades: ["Negociación", "Idiomas", "Análisis"],
    materias: ["Economía", "Matemática", "Inglés"],
    testimonio: { nombre: "Belu, 2do año", texto: "Estudiar cómo se mueve el mundo comercialmente te abre la cabeza a pensar en grande." }
  },
  {
    id: "contador", area: "negocios", nombre: "Contador Público",
    descripcion: "Llevás las cuentas, impuestos y finanzas de empresas y personas, asegurando que todo esté en regla.",
    duracion: "5 años", salida: "Estudios contables, empresas, organismos públicos.",
    sueldoMin: 600000, sueldoMax: 1600000, habilidades: ["Matemática", "Orden", "Precisión"],
    materias: ["Matemática", "Economía"],
    testimonio: { nombre: "Fede, 4to año", texto: "No es solo números: es entender cómo funciona de verdad cualquier negocio por dentro." }
  },
  {
    id: "recursos_humanos", area: "negocios", nombre: "Recursos Humanos",
    descripcion: "Gestionás la selección, capacitación y bienestar de las personas dentro de una organización.",
    duracion: "4 años", salida: "Empresas de todos los rubros, consultoras de RRHH.",
    sueldoMin: 550000, sueldoMax: 1400000, habilidades: ["Empatía", "Organización", "Comunicación"],
    materias: ["Sociales", "Psicología", "Economía"],
    testimonio: { nombre: "Cande, 3er año", texto: "Trabajás todo el día con personas: es la carrera ideal si te interesa la parte humana de las empresas." }
  },

  {
    id: "turismo", area: "negocios", nombre: "Turismo y Hotelería",
    descripcion: "Gestionás experiencias de viaje, hoteles y destinos turísticos, combinando organización con atención al cliente.",
    duracion: "3-4 años", salida: "Hoteles, agencias de viaje, aerolíneas, organismos de turismo.",
    sueldoMin: 500000, sueldoMax: 1300000, habilidades: ["Organización", "Idiomas", "Trato con el público"],
    materias: ["Geografía", "Inglés", "Comunicación"],
    testimonio: { nombre: "Lu, 3er año", texto: "Organizar mi primer evento en un hotel y que salga bien fue una adrenalina que no esperaba." }
  },

  {
    id: "psicologia", area: "sociales", nombre: "Psicología",
    descripcion: "Estudiás la mente y el comportamiento humano para acompañar y ayudar a las personas.",
    duracion: "5 años", salida: "Consultorios, hospitales, escuelas, empresas (RRHH).",
    sueldoMin: 500000, sueldoMax: 1300000, habilidades: ["Empatía", "Escucha activa", "Análisis"],
    materias: ["Biología", "Sociales", "Lengua"],
    testimonio: { nombre: "Juana, 4to año", texto: "Entender por qué la gente actúa como actúa (empezando por vos mismo) cambia cómo ves el mundo." }
  },
  {
    id: "abogacia", area: "sociales", nombre: "Abogacía",
    descripcion: "Te formás para interpretar y aplicar leyes, defendiendo derechos y resolviendo conflictos.",
    duracion: "5-6 años", salida: "Estudios jurídicos, sector público, empresas, judicatura.",
    sueldoMin: 600000, sueldoMax: 1600000, habilidades: ["Argumentación", "Lectura crítica", "Ética"],
    materias: ["Lengua", "Sociales", "Historia"],
    testimonio: { nombre: "Nacho, 3er año", texto: "Es larga y exigente, pero defender algo en lo que creés de verdad no tiene comparación." }
  },
  {
    id: "trabajo_social", area: "sociales", nombre: "Trabajo Social",
    descripcion: "Acompañás a personas y comunidades en situaciones de vulnerabilidad, conectándolas con derechos y recursos.",
    duracion: "4 años", salida: "Organismos públicos, ONGs, escuelas, hospitales.",
    sueldoMin: 480000, sueldoMax: 1100000, habilidades: ["Empatía", "Compromiso social", "Escucha activa"],
    materias: ["Sociales", "Psicología", "Lengua"],
    testimonio: { nombre: "Mili, 2do año", texto: "Es una carrera que te conecta con realidades distintas a la tuya, y eso te hace crecer rápido." }
  },
  {
    id: "profesorado", area: "sociales", nombre: "Ciencias de la Educación / Profesorado",
    descripcion: "Te formás para enseñar y diseñar propuestas educativas en escuelas o instituciones.",
    duracion: "4 años", salida: "Escuelas, institutos, diseño de contenidos educativos.",
    sueldoMin: 480000, sueldoMax: 1100000, habilidades: ["Comunicación", "Paciencia", "Creatividad"],
    materias: ["Lengua", "Sociales", "Psicología"],
    testimonio: { nombre: "Pauli, 3er año", texto: "Ver que alguien entendió algo gracias a vos es de las mejores sensaciones que existen." }
  },
  {
    id: "ciencia_politica", area: "sociales", nombre: "Ciencia Política",
    descripcion: "Analizás el poder, las instituciones y los procesos políticos de una sociedad.",
    duracion: "4-5 años", salida: "Organismos públicos, ONGs, medios, consultoras políticas.",
    sueldoMin: 550000, sueldoMax: 1400000, habilidades: ["Pensamiento crítico", "Análisis", "Argumentación"],
    materias: ["Sociales", "Historia", "Lengua"],
    testimonio: { nombre: "Iñaki, 4to año", texto: "Empezás a entender por qué pasan las cosas en el país, no solo qué pasa." }
  },

  {
    id: "criminologia", area: "sociales", nombre: "Criminología y Ciencias Forenses",
    descripcion: "Analizás el crimen y sus causas, y aplicás ciencia para investigar delitos y reconstruir hechos.",
    duracion: "4 años", salida: "Fuerzas de seguridad, poder judicial, laboratorios forenses, investigación.",
    sueldoMin: 550000, sueldoMax: 1400000, habilidades: ["Pensamiento analítico", "Atención al detalle", "Ética"],
    materias: ["Sociales", "Biología", "Lengua"],
    testimonio: { nombre: "Emi, 4to año", texto: "Pensé que iba a ser como en las series, y por suerte (o por desgracia) es mucho más metódico que eso." }
  },
];

/* ---------------------------------------------------------
   UNIVERSIDADES EN BUENOS AIRES (por área)
--------------------------------------------------------- */

const AREA_UNIVERSITIES = {
  tecnologia: [
    { nombre: "UBA – Facultad de Ingeniería", tipo: "Pública" },
    { nombre: "UTN – Facultad Regional Buenos Aires", tipo: "Pública" },
    { nombre: "ITBA (Instituto Tecnológico de Buenos Aires)", tipo: "Privada" },
    { nombre: "UADE", tipo: "Privada" },
  ],
  salud: [
    { nombre: "UBA – Facultad de Medicina", tipo: "Pública" },
    { nombre: "Universidad Austral", tipo: "Privada" },
    { nombre: "UCA (Pontificia Universidad Católica Argentina)", tipo: "Privada" },
    { nombre: "Universidad Maimónides", tipo: "Privada" },
  ],
  ciencias_exactas: [
    { nombre: "UBA – Facultad de Ciencias Exactas y Naturales", tipo: "Pública" },
    { nombre: "UTN – Facultad Regional Buenos Aires", tipo: "Pública" },
    { nombre: "Universidad Nacional de La Matanza", tipo: "Pública" },
  ],
  ingenieria: [
    { nombre: "UTN – Facultad Regional Buenos Aires", tipo: "Pública" },
    { nombre: "UBA – Facultad de Ingeniería (FIUBA)", tipo: "Pública" },
    { nombre: "ITBA (Instituto Tecnológico de Buenos Aires)", tipo: "Privada" },
    { nombre: "Universidad Austral", tipo: "Privada" },
  ],
  artes: [
    { nombre: "UBA – Facultad de Arquitectura, Diseño y Urbanismo (FADU)", tipo: "Pública" },
    { nombre: "UNA (Universidad Nacional de las Artes)", tipo: "Pública" },
    { nombre: "Universidad de Palermo", tipo: "Privada" },
    { nombre: "Universidad del Salvador", tipo: "Privada" },
  ],
  comunicacion: [
    { nombre: "UBA – Facultad de Ciencias Sociales", tipo: "Pública" },
    { nombre: "Universidad Austral – Facultad de Comunicación", tipo: "Privada" },
    { nombre: "Universidad de Palermo", tipo: "Privada" },
    { nombre: "Universidad del Salvador", tipo: "Privada" },
  ],
  negocios: [
    { nombre: "UBA – Facultad de Ciencias Económicas", tipo: "Pública" },
    { nombre: "UADE", tipo: "Privada" },
    { nombre: "Universidad Torcuato Di Tella", tipo: "Privada" },
    { nombre: "Universidad de San Andrés", tipo: "Privada" },
  ],
  sociales: [
    { nombre: "UBA – Facultad de Ciencias Sociales", tipo: "Pública" },
    { nombre: "UBA – Facultad de Derecho / Psicología", tipo: "Pública" },
    { nombre: "Universidad del Salvador", tipo: "Privada" },
    { nombre: "Universidad de Palermo", tipo: "Privada" },
  ],
};

function mapsLink(name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", Buenos Aires, Argentina")}`;
}



const fmtARS = (n) => "$" + n.toLocaleString("es-AR");

function buildProfileContext(top1, top2, ranking, matched, chosenCareer) {
  const lines = [];
  lines.push("Sos 'la Brújula', la asistente conversacional de la app Brújula Vocacional, una app argentina que ayuda a estudiantes de secundaria a orientarse vocacionalmente.");
  lines.push("Hablás en español rioplatense (voseo), en tono cercano, cálido y motivador, como una guía vocacional con experiencia, pero sin ser condescendiente. Respuestas concisas (máximo 5-6 oraciones o una lista corta), directas y accionables.");
  lines.push("Un estudiante de secundaria acaba de completar el test vocacional. Este es su perfil de afinidad por área (de mayor a menor):");
  ranking.forEach((r) => lines.push(`- ${r.label}: ${r.pct}% de afinidad`));
  lines.push(`Sus dos áreas más fuertes son ${top1.label} (${top1.pct}%) y ${top2.label} (${top2.pct}%).`);
  lines.push("Las carreras de la base de datos que más coinciden con su perfil son:");
  matched.forEach((c) => lines.push(`- ${c.nombre} (${areaById[c.area].label}): materias clave en la secundaria: ${c.materias.join(", ")}. Salida laboral: ${c.salida}`));
  if (chosenCareer) {
    lines.push(`IMPORTANTE: el estudiante ya decidió quedarse a investigar en profundidad UNA carrera puntual: "${chosenCareer.nombre}" (área: ${areaById[chosenCareer.area].label}).`);
    lines.push(`Datos de esa carrera — duración: ${chosenCareer.duracion}; salida laboral: ${chosenCareer.salida}; sueldo estimado junior en ARS/mes: ${fmtARS(chosenCareer.sueldoMin)} a ${fmtARS(chosenCareer.sueldoMax)}; habilidades clave: ${chosenCareer.habilidades.join(", ")}; materias del secundario a reforzar: ${chosenCareer.materias.join(", ")}.`);
    lines.push("A partir de ahora, concentrá todas tus respuestas en esa carrera específica: qué orientación del secundario conviene, qué materias reforzar, cómo es cursarla, salida laboral y dudas típicas de alguien que recién termina el secundario. Solo compará con otras carreras del perfil si te lo piden explícitamente.");
  } else {
    lines.push("Cuando te pregunten qué orientación de bachillerato elegir, qué materias reforzar, o qué carrera conviene estudiar, respondé basándote en este perfil real, mencionando carreras concretas y materias concretas. Podés hacer alguna pregunta de seguimiento si ayuda a afinar el consejo, pero no abuses de las preguntas: priorizá dar valor en cada respuesta.");
  }
  return lines.join("\n");
}

/* ---------------------------------------------------------
   COMPASS ROSE (signature visual element)
--------------------------------------------------------- */

function CompassRose({ size = 240, angle = 0, spinning = false, highlightAreaId = null, idle = false }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;

  return (
    <div className={"compass-wrap" + (idle ? " idle-bob" : "")} style={{ position: "relative", width: size, height: size }}>
      <div className="compass-glow" />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={size / 2 - 3} fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={size / 2 - 16} fill="none" stroke="var(--line)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 5" />
      </svg>

      {AREAS.map((a) => {
        const rad = (a.angle * Math.PI) / 180;
        const x = cx + r * Math.sin(rad);
        const y = cy - r * Math.cos(rad);
        const Icon = a.icon;
        const active = highlightAreaId === a.id;
        return (
          <div
            key={a.id}
            style={{
              position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)",
              width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: active ? "var(--violet)" : "var(--surface-2)",
              border: `1.5px solid ${active ? "var(--violet)" : "var(--line)"}`,
              boxShadow: active ? "0 0 22px rgba(140,124,255,0.65)" : "none",
              transition: "all .5s ease",
            }}
          >
            <Icon size={16} color={active ? "#0E0B1A" : "var(--ink-soft)"} />
          </div>
        );
      })}

      <div style={{
        position: "absolute", inset: 0, transform: `rotate(${angle}deg)`,
        transition: spinning ? "transform 1.8s cubic-bezier(.16,.9,.2,1)" : "transform .7s ease",
      }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%", width: 4, height: r - 8,
          background: "linear-gradient(to top, var(--violet), var(--coral))",
          borderRadius: 4, transform: "translate(-50%,-100%)",
          boxShadow: "0 0 12px rgba(140,124,255,0.6)",
        }} />
      </div>
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 14, height: 14, borderRadius: "50%",
        background: "var(--ink)", transform: "translate(-50%,-50%)",
      }} />
    </div>
  );
}

/* ---------------------------------------------------------
   CAREER CARD + MODAL
--------------------------------------------------------- */

function CareerCard({ career, badge, reason, onOpen, onChoose, isChosen, delay = 0 }) {
  const area = areaById[career.area];
  const Icon = area.icon;
  return (
    <div className={"career-card fade-in-up" + (isChosen ? " career-card-chosen" : "")} style={{ animationDelay: `${delay}ms` }}>
      <div className="career-card-top">
        <div className="career-icon"><Icon size={20} color="var(--violet)" /></div>
        {badge && <span className="badge">{badge}</span>}
      </div>
      <div className="career-card-clickable" onClick={() => onOpen(career)}>
        <h3 className="career-name">{career.nombre}</h3>
        <p className="career-area-label">{area.label}</p>
        <p className="career-desc">{career.descripcion}</p>
        {reason && <p className="career-reason">{reason}</p>}
      </div>
      <div className="career-card-actions">
        <button className="career-link" onClick={() => onOpen(career)}>Ver ficha <ChevronRight size={14} /></button>
        {onChoose && (
          isChosen ? (
            <span className="career-chosen-tag"><Check size={14} /> Elegida</span>
          ) : (
            <button className="career-choose-btn" onClick={() => onChoose(career)}>Quedarme con esta</button>
          )
        )}
      </div>
    </div>
  );
}

function CareerModal({ career, onClose }) {
  if (!career) return null;
  const area = areaById[career.area];
  const Icon = area.icon;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card fade-in-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div className="career-icon" style={{ marginBottom: 14 }}><Icon size={22} color="var(--violet)" /></div>
        <p className="career-area-label">{area.label}</p>
        <h2 className="modal-title">{career.nombre}</h2>
        <p className="modal-desc">{career.descripcion}</p>

        <div className="modal-grid">
          <div className="modal-stat">
            <Clock size={16} color="var(--ink-soft)" />
            <div><p className="modal-stat-label">Duración</p><p className="modal-stat-value">{career.duracion}</p></div>
          </div>
          <div className="modal-stat">
            <TrendingUp size={16} color="var(--ink-soft)" />
            <div><p className="modal-stat-label">Salida laboral</p><p className="modal-stat-value">{career.salida}</p></div>
          </div>
          <div className="modal-stat">
            <Wallet size={16} color="var(--ink-soft)" />
            <div>
              <p className="modal-stat-label">Sueldo estimado (junior, ARS/mes)</p>
              <p className="modal-stat-value mono">{fmtARS(career.sueldoMin)} – {fmtARS(career.sueldoMax)}</p>
            </div>
          </div>
        </div>

        <p className="modal-skills-label">Habilidades clave</p>
        <div className="chip-row" style={{ marginBottom: 18 }}>
          {career.habilidades.map((h) => <span key={h} className="chip">{h}</span>)}
        </div>

        <p className="modal-skills-label"><BookOpen size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Materias para reforzar en la secundaria</p>
        <div className="chip-row">
          {career.materias.map((m) => <span key={m} className="chip chip-mint">{m}</span>)}
        </div>

        {career.testimonio && (
          <div className="testimonio-box">
            <Quote size={16} color="var(--coral)" />
            <p className="testimonio-text">{career.testimonio.texto}</p>
            <p className="testimonio-autor">— {career.testimonio.nombre}</p>
          </div>
        )}

        <p className="modal-skills-label" style={{ marginTop: 18 }}><Building2 size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Dónde estudiarlo en Buenos Aires</p>
        <div className="uni-list">
          {(AREA_UNIVERSITIES[career.area] || []).map((u) => (
            <a key={u.nombre} className="uni-item" href={mapsLink(u.nombre)} target="_blank" rel="noreferrer">
              <span>{u.nombre} <span className="uni-tag">{u.tipo}</span></span>
              <ExternalLink size={13} />
            </a>
          ))}
        </div>

        <p className="modal-disclaimer">* Montos orientativos para Argentina, varían según región, experiencia y empresa.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CAREER SPOTLIGHT (deep-dive on the chosen career)
--------------------------------------------------------- */

function CareerSpotlight({ career, onChangeCareer, top1, top2 }) {
  const area = areaById[career.area];
  const Icon = area.icon;
  const isTop1Area = top1 && career.area === top1.id;
  const reason = top1 && top2
    ? (isTop1Area
      ? `Elegiste esta carrera y conecta con tu área más fuerte (${top1.label}, ${top1.pct}% de afinidad) y con habilidades como ${career.habilidades[0].toLowerCase()} y ${career.habilidades[1].toLowerCase()}.`
      : `Elegiste esta carrera. Conecta con ${areaById[career.area].label} (${top2.pct}% de afinidad en tu perfil) y con habilidades como ${career.habilidades[0].toLowerCase()}.`)
    : null;
  return (
    <div className="spotlight-card fade-in-up">
      <div className="spotlight-top">
        <div className="career-icon" style={{ width: 46, height: 46 }}><Icon size={22} color="var(--violet)" /></div>
        <div>
          <p className="spotlight-kicker">Estás investigando</p>
          <h3 className="spotlight-name">{career.nombre}</h3>
        </div>
      </div>
      <p className="career-area-label" style={{ marginBottom: 10 }}>{area.label}</p>
      <p className="spotlight-desc">{career.descripcion}</p>
      {reason && <p className="career-reason" style={{ marginTop: -10, marginBottom: 20 }}>{reason}</p>}

      <div className="modal-grid">
        <div className="modal-stat">
          <Clock size={16} color="var(--ink-soft)" />
          <div><p className="modal-stat-label">Duración</p><p className="modal-stat-value">{career.duracion}</p></div>
        </div>
        <div className="modal-stat">
          <TrendingUp size={16} color="var(--ink-soft)" />
          <div><p className="modal-stat-label">Salida laboral</p><p className="modal-stat-value">{career.salida}</p></div>
        </div>
        <div className="modal-stat">
          <Wallet size={16} color="var(--ink-soft)" />
          <div>
            <p className="modal-stat-label">Sueldo estimado (junior, ARS/mes)</p>
            <p className="modal-stat-value mono">{fmtARS(career.sueldoMin)} – {fmtARS(career.sueldoMax)}</p>
          </div>
        </div>
      </div>

      <p className="modal-skills-label">Habilidades clave</p>
      <div className="chip-row" style={{ marginBottom: 18 }}>
        {career.habilidades.map((h) => <span key={h} className="chip">{h}</span>)}
      </div>

      <p className="modal-skills-label"><BookOpen size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Materias para reforzar en la secundaria</p>
      <div className="chip-row" style={{ marginBottom: 20 }}>
        {career.materias.map((m) => <span key={m} className="chip chip-mint">{m}</span>)}
      </div>

      {career.testimonio && (
        <div className="testimonio-box">
          <Quote size={16} color="var(--coral)" />
          <p className="testimonio-text">{career.testimonio.texto}</p>
          <p className="testimonio-autor">— {career.testimonio.nombre}</p>
        </div>
      )}

      <p className="modal-skills-label" style={{ marginTop: 18 }}><Building2 size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Dónde estudiarlo en Buenos Aires</p>
      <div className="uni-list" style={{ marginBottom: 22 }}>
        {(AREA_UNIVERSITIES[career.area] || []).map((u) => (
          <a key={u.nombre} className="uni-item" href={mapsLink(u.nombre)} target="_blank" rel="noreferrer">
            <span>{u.nombre} <span className="uni-tag">{u.tipo}</span></span>
            <ExternalLink size={13} />
          </a>
        ))}
      </div>

      <button className="btn-secondary" onClick={onChangeCareer}>← Elegir otra carrera</button>
      <p className="modal-disclaimer">* Montos orientativos para Argentina, varían según región, experiencia y empresa.</p>
    </div>
  );
}

/* ---------------------------------------------------------
   MOTIVATION SECTION ("¿Por qué estudiar?")
--------------------------------------------------------- */

const MOTIVATION_REASONS = [
  {
    icon: Rocket, title: "Multiplicás tus opciones",
    text: "Cuanto más aprendés, más puertas se abren. Estudiar no te cierra caminos, te da con qué elegir el tuyo."
  },
  {
    icon: Puzzle, title: "Resolvés problemas reales",
    text: "Lo que estudiás hoy es la caja de herramientas que vas a usar mañana para resolver cosas que todavía no existen."
  },
  {
    icon: Users, title: "Te conectás con tu gente",
    text: "En el camino vas a cruzarte con personas que piensan como vos — o distinto — y eso te cambia la cabeza."
  },
  {
    icon: RefreshCw, title: "Podés cambiar de idea",
    text: "Nadie espera que a los 17 sepas exactamente quién vas a ser. Elegir una carrera es un punto de partida, no una condena."
  },
  {
    icon: Trophy, title: "Construís algo tuyo",
    text: "El esfuerzo de estudiar se nota a largo plazo: en la confianza, en las oportunidades y en la libertad de elegir cómo vivir."
  },
  {
    icon: Lightbulb, title: "Descubrís en qué sos bueno",
    text: "A veces no sabés lo que te apasiona hasta que lo probás. Estudiar es también una forma de conocerte."
  },
];

function MotivationSection({ onClose, onStartQuiz }) {
  return (
    <div className="explore-wrap fade-in-up">
      <div className="explore-header">
        <h2 className="section-title" style={{ margin: 0 }}>¿Por qué estudiar?</h2>
        <button className="icon-btn" onClick={onClose}><X size={20} /></button>
      </div>
      <p className="results-sub" style={{ marginTop: 10, marginBottom: 26, maxWidth: 560 }}>
        No es solo por el título. Es por vos, por las puertas que se abren y por la persona en la
        que te vas a convertir en el camino.
      </p>
      <div className="career-grid">
        {MOTIVATION_REASONS.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="career-card fade-in-up" style={{ animationDelay: `${i * 60}ms`, cursor: "default" }}>
              <div className="career-card-top">
                <div className="career-icon"><Icon size={20} color="var(--coral)" /></div>
              </div>
              <h3 className="career-name">{r.title}</h3>
              <p className="career-desc">{r.text}</p>
            </div>
          );
        })}
      </div>
      <div className="divider-cta">
        <button className="btn-primary" onClick={onStartQuiz}>
          Descubrir mi carrera <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DUEL MODE (comparar dos carreras)
--------------------------------------------------------- */

function parseYears(s) {
  const m = s.match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function DuelCard({ career, other }) {
  const area = areaById[career.area];
  const Icon = area.icon;
  const shorter = parseYears(career.duracion) < parseYears(other.duracion);
  const higherCeiling = career.sueldoMax > other.sueldoMax;
  return (
    <div className="career-card" style={{ cursor: "default" }}>
      <div className="career-card-top">
        <div className="career-icon"><Icon size={20} color="var(--violet)" /></div>
      </div>
      <h3 className="career-name">{career.nombre}</h3>
      <p className="career-area-label" style={{ marginBottom: 12 }}>{area.label}</p>

      <div className="duel-stat-row">
        <Clock size={14} color="var(--ink-soft)" />
        <span>{career.duracion}</span>
        {shorter && <span className="duel-tag">Más corta</span>}
      </div>
      <div className="duel-stat-row">
        <Wallet size={14} color="var(--ink-soft)" />
        <span className="mono">{fmtARS(career.sueldoMin)} – {fmtARS(career.sueldoMax)}</span>
        {higherCeiling && <span className="duel-tag">Techo más alto</span>}
      </div>
      <div className="duel-stat-row" style={{ alignItems: "flex-start" }}>
        <TrendingUp size={14} color="var(--ink-soft)" style={{ marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: "13px", lineHeight: 1.5, color: "var(--ink-soft)" }}>{career.salida}</span>
      </div>

      <p className="modal-skills-label" style={{ marginTop: 14 }}>Materias clave</p>
      <div className="chip-row">
        {career.materias.map((m) => <span key={m} className="chip chip-mint">{m}</span>)}
      </div>
    </div>
  );
}

function DuelMode({ onClose, defaultA, defaultB }) {
  const [aId, setAId] = useState(defaultA || CAREERS[0].id);
  const [bId, setBId] = useState(defaultB || CAREERS[1].id);
  const a = CAREERS.find((c) => c.id === aId);
  const b = CAREERS.find((c) => c.id === bId);

  return (
    <div className="explore-wrap fade-in-up">
      <div className="explore-header">
        <h2 className="section-title" style={{ margin: 0 }}><Scale size={18} style={{ verticalAlign: -3, marginRight: 6 }} />Modo duelo</h2>
        <button className="icon-btn" onClick={onClose}><X size={20} /></button>
      </div>
      <p className="results-sub" style={{ marginTop: 10, marginBottom: 22, maxWidth: 560 }}>
        ¿Dudás entre dos carreras? Compará lado a lado antes de decidirte.
      </p>
      <div className="duel-pickers">
        <select className="duel-select" value={aId} onChange={(e) => setAId(e.target.value)}>
          {CAREERS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <span className="duel-vs">VS</span>
        <select className="duel-select" value={bId} onChange={(e) => setBId(e.target.value)}>
          {CAREERS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>
      <div className="career-grid">
        <DuelCard career={a} other={b} />
        <DuelCard career={b} other={a} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   EXPLORE ALL CAREERS
--------------------------------------------------------- */

function ExploreCareers({ onClose, onOpenCareer, onOpenDuel }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? CAREERS : CAREERS.filter((c) => c.area === filter);
  return (
    <div className="explore-wrap fade-in-up">
      <div className="explore-header">
        <h2 className="section-title" style={{ margin: 0 }}>Todas las carreras</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={onOpenDuel}><Scale size={15} /> Modo duelo</button>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
      </div>
      <div className="chip-row" style={{ margin: "18px 0 22px" }}>
        <button className={"filter-chip" + (filter === "all" ? " filter-chip-active" : "")} onClick={() => setFilter("all")}>Todas</button>
        {AREAS.map((a) => (
          <button key={a.id} className={"filter-chip" + (filter === a.id ? " filter-chip-active" : "")} onClick={() => setFilter(a.id)}>
            {a.label}
          </button>
        ))}
      </div>
      <div className="career-grid">
        {filtered.map((c, i) => <CareerCard key={c.id} career={c} onOpen={onOpenCareer} delay={i * 40} />)}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CHAT WITH THE COMPASS
--------------------------------------------------------- */

const QUICK_PROMPTS = [
  "¿Qué orientación me conviene elegir?",
  "¿A qué materias prestarle más atención?",
  "¿Qué carrera me conviene elegir?",
];

function getQuickPrompts(chosenCareer) {
  if (!chosenCareer) return QUICK_PROMPTS;
  return [
    `¿Qué materias son clave para ${chosenCareer.nombre}?`,
    `¿Cómo es cursar ${chosenCareer.nombre}?`,
    `¿Qué salida laboral tiene ${chosenCareer.nombre}?`,
  ];
}

function CompassChat({ top1, top2, ranking, matched, chosenCareer }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newHistory = [...messages, { role: "user", content: trimmed }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: buildProfileContext(top1, top2, ranking, matched, chosenCareer),
          messages: newHistory,
        }),
      });
      const data = await response.json();
      const reply = (data.content || []).map((b) => b.text || "").join("\n").trim();
      setMessages((h) => [...h, { role: "assistant", content: reply || "No pude generar una respuesta, ¿podés reformular tu pregunta?" }]);
    } catch (err) {
      setMessages((h) => [...h, { role: "assistant", content: "Se cortó la conexión con tu Brújula. Probá de nuevo en un momento." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-card fade-in-up">
      <div className="chat-header">
        <div className="career-icon" style={{ background: "var(--surface-2)" }}><MessageCircle size={18} color="var(--violet)" /></div>
        <div>
          <p className="chat-title">{chosenCareer ? `Hablá sobre ${chosenCareer.nombre}` : "Hablá con tu Brújula"}</p>
          <p className="chat-sub">{chosenCareer ? "Profundizá antes de decidirte" : "Te orienta con tu perfil real, no con respuestas genéricas"}</p>
        </div>
      </div>

      <div className="chat-body" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Preguntale lo que quieras saber, o arrancá con una de estas:</p>
            <div className="chip-row" style={{ marginTop: 12 }}>
              {getQuickPrompts(chosenCareer).map((p) => (
                <button key={p} className="filter-chip" onClick={() => send(p)}>{p}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={"chat-bubble-row " + (m.role === "user" ? "chat-row-user" : "chat-row-bot") + " fade-in-up"}>
            <div className={"chat-bubble " + (m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot")}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble-row chat-row-bot">
            <div className="chat-bubble chat-bubble-bot chat-typing">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Escribí tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
        />
        <button className="chat-send" onClick={() => send(input)} disabled={loading}>
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN APP
--------------------------------------------------------- */

export default function BrujulaVocacional() {
  const [screen, setScreen] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState(() => Object.fromEntries(AREAS.map((a) => [a.id, 0])));
  const [answersLog, setAnswersLog] = useState(() => Array(QUESTIONS.length).fill(0));
  const [openCareer, setOpenCareer] = useState(null);
  const [exploring, setExploring] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [chosenCareer, setChosenCareer] = useState(null);
  const [focusSpin, setFocusSpin] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [duelMode, setDuelMode] = useState(false);

  useEffect(() => {
    if (chosenCareer) {
      setFocusSpin(true);
      const t = setTimeout(() => setFocusSpin(false), 1500);
      return () => clearTimeout(t);
    }
  }, [chosenCareer]);

  const totalQ = QUESTIONS.length;
  const progressAngle = (qIndex / totalQ) * 360;

  function answer(value) {
    const q = QUESTIONS[qIndex];
    setScores((prev) => {
      const next = { ...prev };
      q.areas.forEach((id) => { next[id] = (next[id] || 0) + value; });
      return next;
    });
    setAnswersLog((prev) => {
      const next = [...prev];
      next[qIndex] = value;
      return next;
    });
    if (qIndex + 1 < totalQ) {
      setQIndex(qIndex + 1);
    } else {
      setScreen("results");
      setReveal(true);
      setTimeout(() => setReveal(false), 1900);
    }
  }

  const ranking = useMemo(() => {
    return AREAS.map((a) => {
      const max = QUESTIONS.filter((q) => q.areas.includes(a.id)).length * 5;
      const pct = max ? Math.round((scores[a.id] / max) * 100) : 0;
      return { ...a, pct };
    }).sort((x, y) => y.pct - x.pct);
  }, [scores]);

  const top1 = ranking[0];
  const top2 = ranking[1];

  const matched = useMemo(() => {
    if (screen !== "results") return [];
    return CAREERS.filter((c) => c.area === top1.id || c.area === top2.id).sort((a, b) => {
      const rank = (c) => (c.area === top1.id ? 0 : 1);
      return rank(a) - rank(b);
    });
  }, [screen, top1, top2]);

  const evidence = useMemo(() => {
    function pick(areaId, limit) {
      return QUESTIONS
        .map((q, i) => ({ text: q.text, value: answersLog[i] || 0, areas: q.areas }))
        .filter((e) => e.areas.includes(areaId) && e.value >= 4)
        .sort((a, b) => b.value - a.value)
        .slice(0, limit)
        .map((e) => e.text);
    }
    const fromTop1 = pick(top1.id, 2);
    const fromTop2 = pick(top2.id, 1).filter((t) => !fromTop1.includes(t));
    return [...fromTop1, ...fromTop2].slice(0, 3);
  }, [answersLog, top1, top2]);

  function restart() {
    setQIndex(0);
    setScores(Object.fromEntries(AREAS.map((a) => [a.id, 0])));
    setAnswersLog(Array(QUESTIONS.length).fill(0));
    setScreen("intro");
    setChosenCareer(null);
  }

  return (
    <div className={"app-root" + (theme === "light" ? " theme-light" : "")}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&family=Fraunces:ital,wght@1,500;1,600&family=IBM+Plex+Mono:wght@500&display=swap');

        :root{
          --bg: #0E0B1A;
          --surface: #181229;
          --surface-2: #211A3B;
          --ink: #F3F0FB;
          --ink-soft: #9C93BE;
          --violet: #8C7CFF;
          --violet-solid: #6D5AE6;
          --coral: #FF7A64;
          --mint: #34E0A1;
          --line: rgba(255,255,255,0.09);
        }
        *{ box-sizing: border-box; }
        .theme-light{
          --bg: #F5F2FC;
          --surface: #FFFFFF;
          --surface-2: #F1ECFB;
          --ink: #221A33;
          --ink-soft: #6B6280;
          --line: rgba(34,26,51,0.10);
        }
        .app-root{
          background:
            radial-gradient(circle at 20% -10%, rgba(140,124,255,0.16), transparent 55%),
            radial-gradient(circle at 90% 10%, rgba(255,122,100,0.10), transparent 45%),
            var(--bg);
          min-height: 100vh;
          font-family: 'Manrope', sans-serif;
          color: var(--ink);
        }
        .app-root h1, .app-root h2, .app-root h3, .app-root .display{ font-family: 'Sora', sans-serif; }
        .mono{ font-family: 'IBM Plex Mono', monospace; }

        .container{ max-width: 880px; margin: 0 auto; padding: 24px 20px 64px; }

        .topbar{ display:flex; align-items:center; gap:10px; padding: 6px 0 8px; }
        .topbar-logo{ width:32px; height:32px; border-radius:10px; background: linear-gradient(135deg, var(--violet), var(--violet-solid)); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow: 0 0 18px rgba(140,124,255,0.35); }
        .topbar-title{ font-weight:700; font-size:16px; letter-spacing:-0.01em; line-height:1.2; }
        .topbar-titles{ display:flex; flex-direction:column; flex:1; }
        .topbar-subtitle{ font-size:11px; color:var(--ink-soft); font-weight:500; letter-spacing:0.01em; }
        .theme-toggle{ background:var(--surface-2); border:1.5px solid var(--line); color:var(--ink); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: border-color .18s ease; }
        .theme-toggle:hover{ border-color:var(--violet); }

        .btn-primary{
          background: linear-gradient(135deg, var(--violet), var(--violet-solid)); color:#0E0B1A; border:none; font-family:'Sora',sans-serif;
          font-weight:700; font-size:15px; padding:14px 26px; border-radius:999px; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; transition: transform .2s ease, box-shadow .2s ease;
          box-shadow: 0 10px 26px rgba(140,124,255,0.35);
        }
        .btn-primary:hover{ transform: translateY(-2px) scale(1.02); box-shadow: 0 14px 32px rgba(140,124,255,0.5); }
        .btn-secondary{
          background:transparent; color:var(--ink-soft); border:1.5px solid var(--line); font-family:'Manrope',sans-serif;
          font-weight:600; font-size:14px; padding:11px 20px; border-radius:999px; cursor:pointer;
          display:inline-flex; align-items:center; gap:6px; transition: all .2s ease;
        }
        .btn-secondary:hover{ border-color:var(--violet); color:var(--violet); background: rgba(140,124,255,0.08); }
        .icon-btn{ background:var(--surface-2); border:1.5px solid var(--line); border-radius:999px; width:38px;height:38px; display:flex;align-items:center;justify-content:center; cursor:pointer; transition: border-color .2s ease; }
        .icon-btn:hover{ border-color: var(--violet); }

        @keyframes fadeInUp{ from{ opacity:0; transform: translateY(14px); } to{ opacity:1; transform: translateY(0); } }
        .fade-in-up{ animation: fadeInUp .55s cubic-bezier(.16,.9,.2,1) both; }
        @keyframes bob{ 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-9px); } }
        .idle-bob{ animation: bob 4.5s ease-in-out infinite; }
        .compass-glow{
          position:absolute; inset: -20%; border-radius:50%;
          background: radial-gradient(circle, rgba(140,124,255,0.30), transparent 65%);
          filter: blur(10px); z-index:0;
        }
        .compass-wrap > svg, .compass-wrap > div{ z-index:1; }

        .hero{ text-align:center; padding: 20px 0 10px; display:flex; flex-direction:column; align-items:center; }
        .hero-eyebrow{ font-size:13px; font-weight:600; color:var(--violet); letter-spacing:0.06em; text-transform:uppercase; margin-bottom:14px; }
        .hero-title{ font-size:clamp(30px,6vw,44px); font-weight:800; line-height:1.05; letter-spacing:-0.02em; margin:18px 0 12px; }
        .hero-title .accent{ font-family:'Fraunces', serif; font-style:italic; background: linear-gradient(135deg, var(--violet), var(--coral)); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .hero-sub{ font-size:16px; color:var(--ink-soft); max-width:440px; line-height:1.55; margin-bottom:28px; }
        .hero-actions{ display:flex; flex-direction:column; align-items:center; gap:14px; }
        .meta-row{ display:flex; gap:22px; margin-top:36px; flex-wrap:wrap; justify-content:center; }
        .meta-item{ display:flex; align-items:center; gap:8px; color:var(--ink-soft); font-size:13px; font-weight:500; }

        .quiz-wrap{ display:flex; flex-direction:column; align-items:center; padding-top:6px; }
        .quiz-progress-label{ font-size:13px; color:var(--ink-soft); font-weight:600; margin-top:8px; }
        .quiz-question{
          background:var(--surface); border:1px solid var(--line); border-radius:24px; padding:32px 28px;
          max-width:520px; width:100%; margin-top:26px; text-align:center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        }
        .quiz-question h2{ font-size:21px; font-weight:700; line-height:1.4; margin-bottom:28px; }
        .scale-row{ display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
        .scale-btn{
          border:1.5px solid var(--line); background:var(--surface-2); border-radius:14px; padding:12px 6px; width:82px;
          cursor:pointer; font-family:'Manrope',sans-serif; font-size:12.5px; font-weight:600; color:var(--ink-soft);
          display:flex; flex-direction:column; align-items:center; gap:8px; transition: all .18s ease;
        }
        .scale-btn:hover{ border-color:var(--violet); color:var(--ink); background: rgba(140,124,255,0.12); transform: translateY(-3px); }
        .scale-dot{ width:10px; height:10px; border-radius:50%; background:var(--line); transition: background .18s ease; }
        .scale-btn:hover .scale-dot{ background:var(--violet); box-shadow: 0 0 8px rgba(140,124,255,0.7); }

        .results-header{ text-align:center; }
        .results-kicker{ display:flex; align-items:center; justify-content:center; gap:6px; color:var(--coral); font-weight:700; font-size:13px; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px; }
        .results-title{ font-size:clamp(24px,5vw,32px); font-weight:800; margin-bottom:8px; letter-spacing:-0.01em; }
        .results-sub{ color:var(--ink-soft); font-size:15px; margin-bottom:6px; }

        .why-card{ background:var(--surface); border:1px solid var(--line); border-radius:20px; padding:22px 24px; margin: 24px 0 8px; text-align:left; }
        .why-kicker{ display:flex; align-items:center; gap:6px; color:var(--coral); font-weight:700; font-size:12.5px; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px; }
        .why-lead{ font-size:14px; color:var(--ink-soft); line-height:1.6; margin-bottom:12px; }
        .why-list{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
        .why-list li{ display:flex; align-items:flex-start; gap:8px; font-size:13.5px; color:var(--ink); line-height:1.5; background:var(--surface-2); border-radius:10px; padding:10px 12px; font-family:'Fraunces', serif; font-style:italic; }

        .section-title{ font-size:19px; font-weight:700; margin: 34px 0 16px; }
        .career-grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap:16px; }

        .career-card{
          text-align:left; background:var(--surface); border:1px solid var(--line); border-radius:20px; padding:20px;
          cursor:pointer; display:flex; flex-direction:column; gap:6px; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          font-family:'Manrope',sans-serif;
        }
        .career-card:hover{ transform: translateY(-4px); box-shadow: 0 16px 34px rgba(0,0,0,0.4); border-color: rgba(140,124,255,0.4); }
        .career-card-top{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
        .career-icon{ width:38px; height:38px; border-radius:11px; background:rgba(140,124,255,0.14); display:flex; align-items:center; justify-content:center; }
        .badge{ background:rgba(52,224,161,0.14); color:var(--mint); font-size:11px; font-weight:700; padding:5px 10px; border-radius:999px; }
        .career-name{ font-size:16px; font-weight:700; line-height:1.3; }
        .career-area-label{ font-size:12px; color:var(--violet); font-weight:600; }
        .career-desc{ font-size:13.5px; color:var(--ink-soft); line-height:1.5; flex:1; }
        .career-reason{ font-size:12.5px; color:var(--mint); line-height:1.5; margin-top:8px; font-style:italic; }
        .career-card-clickable{ cursor:pointer; }
        .career-card-actions{ display:flex; justify-content:space-between; align-items:center; margin-top:14px; gap:10px; }
        .career-link{ background:none; border:none; color:var(--ink-soft); font-size:12.5px; font-weight:700; display:flex; align-items:center; gap:2px; cursor:pointer; padding:0; transition: color .18s ease; }
        .career-link:hover{ color:var(--violet); }
        .career-choose-btn{ background:rgba(140,124,255,0.14); color:var(--violet); border:1px solid rgba(140,124,255,0.4); font-size:12px; font-weight:700; padding:7px 12px; border-radius:999px; cursor:pointer; white-space:nowrap; transition: all .18s ease; }
        .career-choose-btn:hover{ background:var(--violet); color:#0E0B1A; }
        .career-chosen-tag{ display:flex; align-items:center; gap:4px; color:var(--mint); font-size:12px; font-weight:700; white-space:nowrap; }
        .career-card-chosen{ border-color: rgba(52,224,161,0.6); box-shadow: 0 0 0 1px rgba(52,224,161,0.5), 0 16px 34px rgba(0,0,0,0.4); }

        .divider-cta{ display:flex; justify-content:center; margin: 40px 0 4px; gap:14px; flex-wrap:wrap; }

        .modal-backdrop{ position:fixed; inset:0; background:rgba(5,3,12,0.65); backdrop-filter: blur(3px); display:flex; align-items:center; justify-content:center; padding:20px; z-index:50; }
        .modal-card{ background:var(--surface); border:1px solid var(--line); border-radius:26px; max-width:480px; width:100%; padding:30px; position:relative; max-height:88vh; overflow-y:auto; }
        .modal-close{ position:absolute; top:18px; right:18px; background:var(--surface-2); border:none; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--ink); }
        .modal-title{ font-size:23px; font-weight:800; margin-bottom:10px; line-height:1.25; }
        .modal-desc{ font-size:14.5px; color:var(--ink-soft); line-height:1.6; margin-bottom:22px; }
        .modal-grid{ display:flex; flex-direction:column; gap:16px; margin-bottom:22px; }
        .modal-stat{ display:flex; gap:12px; align-items:flex-start; }
        .modal-stat-label{ font-size:12px; color:var(--ink-soft); font-weight:600; margin-bottom:2px; }
        .modal-stat-value{ font-size:14px; font-weight:600; line-height:1.4; }
        .modal-skills-label{ font-size:12px; color:var(--ink-soft); font-weight:600; margin-bottom:10px; display:flex; align-items:center; }
        .modal-disclaimer{ font-size:11.5px; color:var(--ink-soft); margin-top:20px; line-height:1.5; }

        .testimonio-box{ background:var(--surface-2); border-left:3px solid var(--coral); border-radius:12px; padding:14px 16px; margin:18px 0; }
        .testimonio-text{ font-family:'Fraunces', serif; font-size:14.5px; color:var(--ink); line-height:1.55; font-style:italic; margin:6px 0 8px; }
        .testimonio-autor{ font-size:12px; color:var(--ink-soft); font-weight:600; }

        .uni-list{ display:flex; flex-direction:column; gap:8px; }
        .uni-item{ display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--surface-2); border:1px solid var(--line); border-radius:12px; padding:10px 14px; font-size:13px; color:var(--ink); text-decoration:none; transition: border-color .18s ease; }
        .uni-item:hover{ border-color:var(--violet); color:var(--violet); }
        .uni-tag{ font-size:11px; color:var(--ink-soft); font-weight:600; margin-left:6px; }

        .duel-pickers{ display:flex; align-items:center; gap:14px; margin-bottom:26px; flex-wrap:wrap; }
        .duel-select{ flex:1; min-width:220px; background:var(--surface); border:1.5px solid var(--line); color:var(--ink); border-radius:12px; padding:12px 14px; font-family:'Manrope',sans-serif; font-size:14px; cursor:pointer; }
        .duel-vs{ font-family:'Sora',sans-serif; font-weight:700; color:var(--coral); font-size:14px; }
        .duel-stat-row{ display:flex; align-items:center; gap:8px; font-size:13.5px; margin-bottom:10px; }
        .duel-tag{ background:rgba(52,224,161,0.14); color:var(--mint); font-size:11px; font-weight:700; padding:3px 8px; border-radius:999px; margin-left:auto; white-space:nowrap; }

        .chip-row{ display:flex; gap:8px; flex-wrap:wrap; }
        .chip{ background:rgba(140,124,255,0.14); color:var(--violet); font-size:12.5px; font-weight:600; padding:7px 12px; border-radius:999px; }
        .chip-mint{ background:rgba(52,224,161,0.14); color:var(--mint); }
        .filter-chip{ background:var(--surface-2); border:1.5px solid var(--line); color:var(--ink-soft); font-size:13px; font-weight:600; padding:8px 15px; border-radius:999px; cursor:pointer; transition: all .18s ease; }
        .filter-chip:hover{ border-color:var(--violet); color:var(--ink); }
        .filter-chip-active{ background:var(--violet); color:#0E0B1A; border-color:var(--violet); }

        .spotlight-card{ background:var(--surface); border:1px solid rgba(52,224,161,0.35); border-radius:24px; padding:28px; margin-top:8px; box-shadow: 0 20px 50px rgba(0,0,0,0.35); }
        .spotlight-top{ display:flex; align-items:center; gap:14px; margin-bottom:2px; }
        .spotlight-kicker{ font-size:12px; color:var(--mint); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; }
        .spotlight-name{ font-size:21px; font-weight:800; margin:2px 0 0; line-height:1.25; }
        .spotlight-desc{ color:var(--ink-soft); font-size:14.5px; line-height:1.6; margin: 14px 0 22px; }

        .explore-wrap{ padding-top:6px; }
        .explore-header{ display:flex; justify-content:space-between; align-items:center; }

        .chat-card{ margin-top:36px; background:var(--surface); border:1px solid var(--line); border-radius:24px; padding:22px; box-shadow: 0 20px 50px rgba(0,0,0,0.35); }
        .chat-header{ display:flex; align-items:center; gap:12px; margin-bottom:16px; }
        .chat-title{ font-weight:700; font-size:15.5px; font-family:'Sora',sans-serif; }
        .chat-sub{ font-size:12.5px; color:var(--ink-soft); }
        .chat-body{ display:flex; flex-direction:column; gap:10px; max-height:340px; overflow-y:auto; padding:4px 2px; }
        .chat-empty{ background:var(--surface-2); border:1px dashed var(--line); border-radius:16px; padding:16px; font-size:13.5px; color:var(--ink-soft); line-height:1.5; }
        .chat-bubble-row{ display:flex; }
        .chat-row-user{ justify-content:flex-end; }
        .chat-row-bot{ justify-content:flex-start; }
        .chat-bubble{ max-width:80%; padding:11px 15px; border-radius:16px; font-size:14px; line-height:1.55; white-space:pre-wrap; }
        .chat-bubble-user{ background: linear-gradient(135deg, var(--violet), var(--violet-solid)); color:#0E0B1A; border-bottom-right-radius:4px; font-weight:500; }
        .chat-bubble-bot{ background:var(--surface-2); border:1px solid var(--line); border-bottom-left-radius:4px; }
        .chat-typing{ display:flex; gap:5px; align-items:center; padding:14px 16px; }
        .dot{ width:6px; height:6px; border-radius:50%; background:var(--ink-soft); animation: pulse 1.2s ease-in-out infinite; }
        .dot:nth-child(2){ animation-delay:.2s; } .dot:nth-child(3){ animation-delay:.4s; }
        @keyframes pulse{ 0%,100%{ opacity:.3; transform:scale(.8);} 50%{ opacity:1; transform:scale(1);} }
        .chat-input-row{ display:flex; gap:10px; margin-top:14px; }
        .chat-input{ flex:1; background:var(--surface-2); border:1.5px solid var(--line); border-radius:999px; padding:12px 18px; color:var(--ink); font-family:'Manrope',sans-serif; font-size:14px; outline:none; transition: border-color .18s ease; }
        .chat-input:focus{ border-color:var(--violet); }
        .chat-input::placeholder{ color: var(--ink-soft); }
        .chat-send{ background: linear-gradient(135deg, var(--violet), var(--violet-solid)); border:none; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#0E0B1A; flex-shrink:0; transition: transform .18s ease; }
        .chat-send:hover{ transform: scale(1.06); }
        .chat-send:disabled{ opacity:.5; cursor:default; transform:none; }

        @media (max-width: 480px){
          .quiz-question{ padding:24px 18px; }
          .scale-btn{ width:64px; padding:10px 4px; font-size:11px; }
          .chat-bubble{ max-width:88%; }
        }

        .signature-tag{ position:fixed; bottom:10px; right:14px; font-size:10px; color: var(--ink-soft); opacity:0.45; letter-spacing:0.02em; pointer-events:none; z-index:40; }
      `}</style>

      <span className="signature-tag">Costilla Morena</span>

      <div className="container">
        <div className="topbar">
          <div className="topbar-logo"><Compass size={18} color="#0E0B1A" /></div>
          <div className="topbar-titles">
            <span className="topbar-title">Brújula Vocacional</span>
            <span className="topbar-subtitle">Escuela Naciones Unidas</span>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {showMotivation ? (
          <MotivationSection
            onClose={() => setShowMotivation(false)}
            onStartQuiz={() => { setShowMotivation(false); setScreen("quiz"); }}
          />
        ) : duelMode ? (
          <DuelMode
            onClose={() => setDuelMode(false)}
            defaultA={screen === "results" && matched[0] ? matched[0].id : undefined}
            defaultB={screen === "results" && matched[1] ? matched[1].id : undefined}
          />
        ) : exploring ? (
          <ExploreCareers onClose={() => setExploring(false)} onOpenCareer={setOpenCareer} onOpenDuel={() => { setExploring(false); setDuelMode(true); }} />
        ) : screen === "intro" ? (
          <div className="hero">
            <p className="hero-eyebrow fade-in-up">Orientación vocacional para secundaria</p>
            <CompassRose size={230} angle={12} idle />
            <h1 className="hero-title fade-in-up" style={{ animationDelay: "80ms" }}>
              Encontrá tu <span className="accent">rumbo</span><br />antes de elegir carrera.
            </h1>
            <p className="hero-sub fade-in-up" style={{ animationDelay: "140ms" }}>
              Respondé {totalQ} preguntas sobre tus intereses y habilidades. La aguja se mueve con cada
              respuesta y al final te dice qué carreras van con vos — y podés seguir hablando con
              tu Brújula para afinar la decisión.
            </p>
            <div className="hero-actions fade-in-up" style={{ animationDelay: "200ms" }}>
              <button className="btn-primary" onClick={() => setScreen("quiz")}>
                Empezar el test <ArrowRight size={17} />
              </button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button className="btn-secondary" onClick={() => setExploring(true)}>
                  Explorar todas las carreras
                </button>
                <button className="btn-secondary" onClick={() => setShowMotivation(true)}>
                  <Lightbulb size={15} /> ¿Por qué estudiar?
                </button>
              </div>
            </div>
            <div className="meta-row fade-in-up" style={{ animationDelay: "260ms" }}>
              <div className="meta-item"><Clock size={15} /> 5 minutos</div>
              <div className="meta-item"><Check size={15} /> {totalQ} preguntas</div>
              <div className="meta-item"><Compass size={15} /> 48 carreras en la base</div>
            </div>
          </div>
        ) : screen === "quiz" ? (
          <div className="quiz-wrap">
            <CompassRose size={140} angle={progressAngle} />
            <p className="quiz-progress-label">Pregunta {qIndex + 1} de {totalQ}</p>
            <div className="quiz-question fade-in-up" key={qIndex}>
              <h2>{QUESTIONS[qIndex].text}</h2>
              <div className="scale-row">
                {ANSWER_SCALE.map((s) => (
                  <button key={s.value} className="scale-btn" onClick={() => answer(s.value)}>
                    <span className="scale-dot" style={{ width: 8 + s.value * 2, height: 8 + s.value * 2 }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="results-header">
              <CompassRose
                size={220}
                angle={chosenCareer ? (focusSpin ? 1080 + areaById[chosenCareer.area].angle : areaById[chosenCareer.area].angle) : (reveal ? 1080 + top1.angle : top1.angle)}
                spinning={chosenCareer ? focusSpin : reveal}
                highlightAreaId={chosenCareer ? chosenCareer.area : top1.id}
              />
              <p className="results-kicker fade-in-up"><Sparkles size={14} /> {chosenCareer ? "Tu elección" : "Tu resultado"}</p>
              <h2 className="results-title fade-in-up" style={{ animationDelay: "80ms" }}>
                {chosenCareer ? `La aguja quedó en ${areaById[chosenCareer.area].label}` : `Tu brújula apunta a ${top1.label}`}
              </h2>
              <p className="results-sub fade-in-up" style={{ animationDelay: "140ms" }}>
                {chosenCareer
                  ? "Elegiste investigar esta carrera a fondo. Podés cambiarla cuando quieras."
                  : `${top1.pct}% de afinidad con ${top1.label.toLowerCase()} · ${top2.pct}% con ${top2.label.toLowerCase()}`}
              </p>
            </div>

            {!chosenCareer && (
              <div className="why-card fade-in-up" style={{ animationDelay: "180ms" }}>
                <p className="why-kicker"><Sparkles size={13} /> Por qué te representa este resultado</p>
                <p className="why-lead">
                  {top1.pct}% de tu perfil está en {top1.label} y {top2.pct}% en {top2.label}.
                  {evidence.length > 0 ? " Esto es lo que más pesó en tu resultado:" : " Tuviste respuestas parejas entre varias áreas, así que vale la pena explorar más de una opción."}
                </p>
                {evidence.length > 0 && (
                  <ul className="why-list">
                    {evidence.map((t, i) => (
                      <li key={i}><Quote size={13} color="var(--coral)" style={{ flexShrink: 0, marginTop: 2 }} /> <span>{t}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {chosenCareer ? (
              <CareerSpotlight career={chosenCareer} onChangeCareer={() => setChosenCareer(null)} top1={top1} top2={top2} />
            ) : (
              <>
                <h3 className="section-title">Carreras que más te representan</h3>
                <p className="results-sub" style={{ marginTop: -8, marginBottom: 18 }}>
                  Elegí una para quedarte con ella e investigarla más a fondo.
                </p>
                <div className="career-grid">
                  {matched.map((c, i) => {
                    const isTop1Area = c.area === top1.id;
                    const reason = isTop1Area
                      ? `Conecta con tu área más fuerte (${top1.label}) y con habilidades como ${c.habilidades[0].toLowerCase()} y ${c.habilidades[1].toLowerCase()}.`
                      : `También conecta con tu perfil en ${areaById[c.area].label}, sumando ${c.habilidades[0].toLowerCase()}.`;
                    return (
                      <CareerCard
                        key={c.id}
                        career={c}
                        badge={isTop1Area ? "Tu mejor rumbo" : "También explorá"}
                        reason={reason}
                        onOpen={setOpenCareer}
                        onChoose={setChosenCareer}
                        isChosen={chosenCareer && chosenCareer.id === c.id}
                        delay={i * 60}
                      />
                    );
                  })}
                </div>
              </>
            )}

            <CompassChat key={chosenCareer ? chosenCareer.id : "general"} top1={top1} top2={top2} ranking={ranking} matched={matched} chosenCareer={chosenCareer} />

            <div className="divider-cta">
              <button className="btn-secondary" onClick={() => setExploring(true)}>Ver todas las carreras</button>
              <button className="btn-secondary" onClick={() => setDuelMode(true)}><Scale size={15} /> Modo duelo</button>
              <button className="btn-secondary" onClick={() => setShowMotivation(true)}><Lightbulb size={15} /> ¿Por qué estudiar?</button>
              <button className="btn-secondary" onClick={restart}><RotateCcw size={15} /> Repetir el test</button>
            </div>
          </div>
        )}
      </div>

      <CareerModal career={openCareer} onClose={() => setOpenCareer(null)} />
    </div>
  );
}
