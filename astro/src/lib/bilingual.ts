function localizeInternalHrefs(html: string, prefix: '' | '/en'): string {
  const root = prefix || '';

  return html
    .replace(
      /href="https:\/\/uvb\.edu\.mx\/reynosa\/(?!wp-content|wp-includes|wp-json|xmlrpc\.php)([^"]*)"/g,
      `href="${root}/reynosa/$1"`,
    )
    .replace(
      /href='https:\/\/uvb\.edu\.mx\/reynosa\/(?!wp-content|wp-includes|wp-json|xmlrpc\.php)([^']*)'/g,
      `href='${root}/reynosa/$1'`,
    )
    .replace(
      /href="https:\/\/uvb\.edu\.mx\/(?!reynosa\/|wp-content|wp-includes|wp-json|xmlrpc\.php)([^"]*)"/g,
      `href="${root}/$1"`,
    )
    .replace(
      /href='https:\/\/uvb\.edu\.mx\/(?!reynosa\/|wp-content|wp-includes|wp-json|xmlrpc\.php)([^']*)'/g,
      `href='${root}/$1'`,
    )
    .replace(
      /href="\/reynosa\/(?!wp-content|wp-includes|wp-json|xmlrpc\.php)([^"]*)"/g,
      `href="${root}/reynosa/$1"`,
    )
    .replace(
      /href='\/reynosa\/(?!wp-content|wp-includes|wp-json|xmlrpc\.php)([^']*)'/g,
      `href='${root}/reynosa/$1'`,
    )
    .replace(
      /href="\/(?!en\/|reynosa\/|wp-content|wp-includes|wp-json|xmlrpc\.php)([^"]*)"/g,
      `href="${root}/$1"`,
    )
    .replace(
      /href='\/(?!en\/|reynosa\/|wp-content|wp-includes|wp-json|xmlrpc\.php)([^']*)'/g,
      `href='${root}/$1'`,
    );
}

function injectLanguageSwitch(html: string, isEnglish: boolean): string {
  const switchCss = `<style>
.uvb-lang-switch{position:fixed;top:16px;right:20px;z-index:99999;display:flex;gap:8px;align-items:center;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.35);color:#fff;font-size:12px;letter-spacing:.04em;backdrop-filter:blur(4px)}
.uvb-lang-switch a{color:#fff;text-decoration:none;opacity:.7}
.uvb-lang-switch a.active{opacity:1;font-weight:700}
</style>`;
  const script = `<script>(function(){var p=window.location.pathname||'/';var isEn=${isEnglish ? 'true' : 'false'};var esPath=isEn?p.replace(/^\\/en(?=\\/|$)/,''):p;if(!esPath)esPath='/';var enPath=isEn?p:(p==='/'?'/en/':'/en'+(p.startsWith('/')?p:'/'+p));var box=document.createElement('div');box.className='uvb-lang-switch';box.innerHTML=(isEn?'<a href="'+esPath+'">ES</a><span>|</span><a class="active" href="'+enPath+'">EN</a>':'<a class="active" href="'+esPath+'">ES</a><span>|</span><a href="'+enPath+'">EN</a>');document.body.appendChild(box);})();</script>`;
  return html.replace('</head>', `${switchCss}</head>`).replace('</body>', `${script}</body>`);
}

export function addSpanishLanguageSwitch(html: string): string {
  return injectLanguageSwitch(localizeInternalHrefs(html, ''), false);
}

export function toEnglishLegacyHtml(html: string): string {
  let out = html;

  const replacements: Array<[RegExp, string]> = [
    [/Universidad Valle del Bravo Reynosa/g, 'Valle del Bravo University Reynosa'],
    [/UVB Universidad Valle del Bravo/g, 'UVB Valle del Bravo University'],
    [/Universidad Valle del Bravo/g, 'Valle del Bravo University'],
    [/Somos La Valle, En la Valle Está Mejor/g, 'We Are Valle, Better at Valle'],
    [/Somos La Valle ¡En La Valle Está Mejor!/g, 'We Are Valle! Better at Valle!'],
    [/Reglamento General de Estudiantes de Tipo Superior/g, 'General Regulations for Higher Education Students'],
    [/Reglamento Escolar Bachillerato/g, 'High School Academic Regulations'],
    [/Selecciona tu Campus/g, 'Select your Campus'],
    [/Te damos la bienvenida a la UVB/g, 'Welcome to UVB'],
    [/Normatividad/g, 'Regulations'],
    [/Admisiones/g, 'Admissions'],
    [/Contacto/g, 'Contact'],
    [/Oferta Educativa/g, 'Academic Programs'],
    [/Inicio/g, 'Home'],
    [/Acerca de la UVB/g, 'About UVB'],
    [/Becas/g, 'Scholarships'],
    [/Biblioteca/g, 'Library'],
    [/Licenciaturas/g, 'Undergraduate Programs'],
    [/Preparatoria/g, 'High School'],
    [/Educación Continua/g, 'Continuing Education'],
    [/Conoce nuestros planes de estudio/g, 'Discover our study plans'],
    [/Contamos con un amplio programa de Diplomados/g, 'We offer a broad diploma program'],
    [/Disfruta de una de las etapas más importantes/g, 'Enjoy one of the most important stages'],
    [/Tenemos una oferta académica de siete programas de Licenciatura/g, 'We offer seven undergraduate programs'],
    [/Nuestra Universidad/g, 'Our University'],
    [/Conoce más/g, 'Learn more'],
    [/Campo Laboral/g, 'Career Opportunities'],
    [/MODALIDAD/g, 'FORMAT'],
    [/Modalidad/g, 'Format'],
    [/DURACIÓN/g, 'DURATION'],
    [/Duración/g, 'Duration'],
    [/INICIO DE CURSOS CUATRIMESTRAL/g, 'QUARTER START DATES'],
    [/Inicio de Cursos Cuatrimestral/g, 'Quarter Start Dates'],
    [/Aviso de Privacidad/g, 'Privacy Notice'],
    [/Derechos Reservados/g, 'All Rights Reserved'],
    [/Redes Sociales/g, 'Social Media'],
    [/Reglamento/g, 'Regulations'],
    [/Escuela/g, 'School'],
    [/Contacto y Ubicación/g, 'Contact and Location'],
    [/Plan de Estudios/g, 'Study Plan'],
    [/Perfil de Egreso/g, 'Graduate Profile'],
    [/Perfil de Ingreso/g, 'Admission Profile'],
    [/Objetivo General/g, 'General Objective'],
    [/INTERESES/g, 'INTERESTS'],
    [/HABILIDADES/g, 'SKILLS'],
    [/ACTITUDES/g, 'ATTITUDES'],
    [/Cuatrimestral/g, 'Quarterly'],
    [/Enero \/ Mayo \/ Septiembre/g, 'January / May / September'],
    [/9 ciclos/g, '9 terms'],
    [/8 ciclos/g, '8 terms'],
    [/10 ciclos/g, '10 terms'],
    [/LIC\. EN PSICOLOGÍA/g, 'B.A. IN PSYCHOLOGY'],
    [/LPS &#8211; Licenciatura en Psicología/g, 'LPS &#8211; B.A. in Psychology'],
    [/Conviértete en un profesional en psicología, aprendiendo a analizar y comprender el comportamiento humano desde múltiples perspectivas\./g, 'Become a psychology professional by learning to analyze and understand human behavior from multiple perspectives.'],
    [/La <strong>Licenciatura en Psicología<\/strong> en la Universidad Valle del Bravo ofrece una formación completa, teórica y práctica, en el estudio de la conducta humana\./g, 'The <strong>B.A. in Psychology</strong> at Valle del Bravo University offers comprehensive theoretical and practical training in the study of human behavior.'],
    [/Aprenderás a analizar desde aspectos fisioanatómicos hasta ambientales, adquiriendo conocimientos en cómo los factores externos e internos influyen en la interacción de las personas con su entorno y definen su estilo de vida\./g, 'You will learn to analyze everything from physio-anatomical to environmental factors, understanding how internal and external elements shape how people interact with their surroundings and define their lifestyle.'],
    [/Este programa te capacitará en diversas técnicas y habilidades para entender y asistir las necesidades psicológicas de individuos y grupos\./g, 'This program will train you in a wide range of techniques and skills to understand and support the psychological needs of individuals and groups.'],
    [/Instituciones de rehabilitación/g, 'Rehabilitation institutions'],
    [/Hospitales y clínicas/g, 'Hospitals and clinics'],
    [/Centros de educación e investigación/g, 'Education and research centers'],
    [/Consultorio propio/g, 'Private practice'],
    [/Clubes deportivos/g, 'Sports clubs'],
    [/Empresas maquiladoras y gubernamentales/g, 'Manufacturing and government organizations'],
    [/Conocimiento, manejo y comprensión de ciencias/g, 'Knowledge, command, and understanding of the sciences'],
    [/Manejo de sistemas de información/g, 'Use of information systems'],
    [/Manejo de métodos y técnicas de investigación/g, 'Use of research methods and techniques'],
    [/Capacidad de análisis y síntesis/g, 'Analytical and synthesis skills'],
    [/Interés por la lectura y comprensión lectora/g, 'Interest in reading and reading comprehension'],
    [/Interés por la conducta humana/g, 'Interest in human behavior'],
    [/Bases Metodológicas de la Investigación/g, 'Methodological Foundations of Research'],
    [/Métodos Descriptivos en Psicología/g, 'Descriptive Methods in Psychology'],
    [/Epistemología en Psicología/g, 'Epistemology in Psychology'],
    [/Historia de la Psicología/g, 'History of Psychology'],
    [/Teorías Psicológicas de la Personalidad/g, 'Psychological Theories of Personality'],
    [/Entrevista en Psicología/g, 'Interviewing in Psychology'],
    [/Aplicaciones de la Entrevista/g, 'Interview Applications'],
    [/Procesos Psicológicos Básicos/g, 'Basic Psychological Processes'],
    [/Funciones Psicológicas Básicas/g, 'Basic Psychological Functions'],
    [/Funciones Psicológicas Superiores/g, 'Higher Psychological Functions'],
    [/Anatomía y Fisiología del Sistema Nervioso/g, 'Anatomy and Physiology of the Nervous System'],
    [/Bases Neuropsicológicas de la Conducta/g, 'Neuropsychological Foundations of Behavior'],
    [/Aplicaciones Neuropsicológicas al Comportamiento/g, 'Neuropsychological Applications to Behavior'],
    [/Evaluación Neuropsicológica/g, 'Neuropsychological Assessment'],
    [/Psicología del Desarrollo/g, 'Developmental Psychology'],
    [/Psicodesarrollo en la Infancia/g, 'Psychological Development in Childhood'],
    [/Psicodesarrollo en la Adolescencia/g, 'Psychological Development in Adolescence'],
    [/Psicodesarrollo en la Adultez y Senectud/g, 'Psychological Development in Adulthood and Aging'],
    [/Psicología Social/g, 'Social Psychology'],
    [/Psicología de la Personalidad/g, 'Personality Psychology'],
    [/Psicometría/g, 'Psychometrics'],
    [/Psicopatología/g, 'Psychopathology'],
    [/Psicodiagnóstico en la Infancia/g, 'Psychodiagnosis in Childhood'],
    [/Psicodiagnóstico en la Adolescencia/g, 'Psychodiagnosis in Adolescence'],
    [/Psicodiagnóstico en la Adultez y Senectud/g, 'Psychodiagnosis in Adulthood and Aging'],
    [/Psicología Clínica/g, 'Clinical Psychology'],
    [/Psicología Educativa/g, 'Educational Psychology'],
    [/Psicología Organizacional/g, 'Organizational Psychology'],
    [/Prácticas Experimentales en Psicología/g, 'Experimental Practices in Psychology'],
    [/Metodología Cualitativa en Psicología/g, 'Qualitative Methodology in Psychology'],
    [/Técnicas de Modificación Conductual/g, 'Behavior Modification Techniques'],
    [/Pruebas Psicológicas en la Organización/g, 'Psychological Testing in Organizations'],
    [/Modelos de Intervención en Grupos/g, 'Group Intervention Models'],
    [/Pruebas Estadísticas en Psicología/g, 'Statistical Testing in Psychology'],
    [/Psicología Jurídica/g, 'Forensic Psychology'],
    [/Trastornos Psicopatológicos/g, 'Psychopathological Disorders'],
    [/Orientación Educativa y Profesional/g, 'Educational and Career Guidance'],
    [/Diseño e Intervención de Capacitación de Personal/g, 'Design and Training Intervention for Personnel'],
    [/Psicología Comunitaria/g, 'Community Psychology'],
    [/Seminario de Investigación Aplicada/g, 'Applied Research Seminar'],
    [/Psicología Ambiental/g, 'Environmental Psychology'],
    [/Aplicaciones en Psicoterapia/g, 'Applications in Psychotherapy'],
    [/Intervención Psicológica en Educación Especial/g, 'Psychological Intervention in Special Education'],
    [/Desarrollo del Talento Humano/g, 'Human Talent Development'],
    [/Atención Psicosocial a Grupos Vulnerables/g, 'Psychosocial Support for Vulnerable Groups'],
    [/Desarrollo Emprendedor/g, 'Entrepreneurial Development'],
    [/Cultura Internacional del Trabajo/g, 'International Work Culture'],
    [/Intervención Profesional en Salud/g, 'Professional Intervention in Health'],
    [/Intervención Profesional Social/g, 'Professional Social Intervention'],
    [/Seminario de Innovación/g, 'Innovation Seminar'],
    [/Criminología y Victimología/g, 'Criminology and Victimology'],
    [/Taller de Fortalecimiento al Egreso/g, 'Graduation Readiness Workshop'],
    [/Intervención Profesional Organizacional/g, 'Professional Organizational Intervention'],
    [/Intervención Profesional Educativa/g, 'Professional Educational Intervention'],
    [/Intervención en Adicciones y Trastornos de la Alimentación/g, 'Intervention in Addictions and Eating Disorders'],
    [/Seminario de Tendencias Disciplinarias/g, 'Seminar on Disciplinary Trends'],
    [/Intervención en Psicología Familiar/g, 'Intervention in Family Psychology'],
    [/¡INICIA TU PROCESO DE ADMISIÓN!/g, 'START YOUR ADMISSION PROCESS!'],
    [/Realiza tu proceso de incorporación con ayuda de uno de nuestros asesores\./g, 'Complete your enrollment process with the help of one of our advisors.'],
    [/ADMISIONES/g, 'ADMISSIONS'],
    [/Ubicación/g, 'Location'],
    [/Ética Profesional/g, 'Professional Ethics'],
    [/Ciclo /g, 'Term '],
  ];

  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }

  out = localizeInternalHrefs(out, '/en');
  out = out.replace(/<html lang="[^"]+"/g, '<html lang="en"');

  return injectLanguageSwitch(out, true);
}
