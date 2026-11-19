export const LANGS = ["pt", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const langPath = (l: Lang) => (l === "pt" ? "/" : `/${l}`);
export const htmlLang: Record<Lang, string> = { pt: "pt-BR", en: "en", es: "es" };
export const langLabel: Record<Lang, string> = { pt: "Português", en: "English", es: "Español" };

const pt = {
  meta: { title: "echo — áudio vira conteúdo", description: "Suba um episódio e receba transcrição, capítulos com timestamps, resumo e posts para LinkedIn, X e Instagram." },
  skip: "Pular para o conteúdo",
  nav: { label: "Seções", studio: "Estúdio", how: "Como funciona", language: "Idioma" },
  hero: {
    eyebrow: "Para quem grava podcast, aula ou entrevista",
    h1: ["Você grava.", "A gente escreve", "o resto."],
    lead: "Um episódio entra, saem a transcrição, os capítulos, um resumo de verdade e os posts da semana. Sem colar transcrição em chat nenhum.",
    cta: "Testar agora", tracksLabel: "O que você recebe", tracks: "Faixas",
    items: [["Transcrição", "com timestamps a cada fala"], ["Capítulos", "títulos que dá vontade de clicar"], ["Resumo", "cinco pontos, um minuto de leitura"], ["Posts", "LinkedIn, X e Instagram, no tamanho certo"]],
  },
  how: {
    title: "Como funciona",
    items: [
      ["Transcreve", "O áudio passa por um modelo de reconhecimento de fala (FunASR) que devolve cada frase com o tempo exato em que foi dita."],
      ["Organiza", "Mudanças de assunto viram capítulos. O resumo sai da transcrição inteira, não só do começo do episódio."],
      ["Reescreve", "Cada post respeita o limite e o jeito da rede. Os textos passam por uma revisão para não soarem como robô."],
    ],
  },
  footer: { project: "um projeto", note: "Versão pública com episódios de exemplo · transcrição real roda localmente" },
  studio: {
    title: "Estúdio", side: "lado A", yourAudio: "Seu áudio", upTo: "até 200 MB", drop: "Pode soltar.", drag: "Arraste o episódio para cá",
    or: "ou", choose: "escolha um arquivo", listen: "Ou ouça o que ele faz com", sampleNote: "",
    notAudio: "Esse arquivo não é de áudio. Use MP3, WAV, M4A ou OGG.", tooBig: "Arquivo acima de 200 MB. Corte o episódio ou exporte em MP3.",
    local: "Seu arquivo não saiu do navegador. Esta versão pública não transcreve áudio real, então mostramos um episódio de exemplo processado do mesmo jeito.",
    progress: "Progresso", steps: ["Áudio", "Transcrição", "Capítulos", "Textos"],
    tabs: ["Capítulos", "Resumo", "Posts", "Transcrição"], resultLabel: "Resultado",
    words: "palavras", chapters: "capítulos", export: "Exportar .md", reading: "Leitura", episode: "Episódio",
    search: "Buscar", searchHint: "desperdício, café, WhatsApp…", none: (q: string) => `Nada encontrado para “${q}”.`,
    draft: "rascunho", copied: "Copiado ✓", copy: "Copiar texto", goTo: (i: number, t: string) => `Ir para o capítulo ${i}: ${t}`,
    md: { chapters: "Capítulos", summary: "Resumo", transcript: "Transcrição" },
  },
};
export type Dict = typeof pt;

const en: Dict = {
  meta: { title: "echo — audio into content", description: "Upload an episode and get a transcript, timestamped chapters, a summary and posts for LinkedIn, X and Instagram." },
  skip: "Skip to content",
  nav: { label: "Sections", studio: "Studio", how: "How it works", language: "Language" },
  hero: {
    eyebrow: "For people who record podcasts, classes or interviews",
    h1: ["You record.", "We write", "the rest."],
    lead: "One episode goes in; out come the transcript, the chapters, a real summary and the posts for the week. No pasting transcripts into a chat.",
    cta: "Try it now", tracksLabel: "What you get", tracks: "Tracks",
    items: [["Transcript", "timestamped line by line"], ["Chapters", "titles worth clicking"], ["Summary", "five points, one minute to read"], ["Posts", "LinkedIn, X and Instagram, at the right length"]],
  },
  how: {
    title: "How it works",
    items: [
      ["Transcribes", "The audio goes through a speech recognition model (FunASR) that returns every sentence with the exact time it was said."],
      ["Organizes", "Topic changes become chapters. The summary comes from the whole transcript, not just the start of the episode."],
      ["Rewrites", "Each post respects the limit and the style of its network. The texts go through a review so they do not sound like a robot."],
    ],
  },
  footer: { project: "a project by", note: "Public version with sample episodes · real transcription runs locally" },
  studio: {
    title: "Studio", side: "side A", yourAudio: "Your audio", upTo: "up to 200 MB", drop: "Drop it.", drag: "Drag the episode here",
    or: "or", choose: "choose a file", listen: "Or hear what it does with", sampleNote: "Sample episodes are in Portuguese.",
    notAudio: "That file is not audio. Use MP3, WAV, M4A or OGG.", tooBig: "File over 200 MB. Trim the episode or export it as MP3.",
    local: "Your file never left the browser. This public version does not transcribe real audio, so it shows a sample episode processed the same way.",
    progress: "Progress", steps: ["Audio", "Transcript", "Chapters", "Texts"],
    tabs: ["Chapters", "Summary", "Posts", "Transcript"], resultLabel: "Result",
    words: "words", chapters: "chapters", export: "Export .md", reading: "Reading", episode: "Episode",
    search: "Search", searchHint: "desperdício, café, WhatsApp…", none: (q) => `Nothing found for “${q}”.`,
    draft: "draft", copied: "Copied ✓", copy: "Copy text", goTo: (i, t) => `Go to chapter ${i}: ${t}`,
    md: { chapters: "Chapters", summary: "Summary", transcript: "Transcript" },
  },
};

const es: Dict = {
  meta: { title: "echo — el audio se vuelve contenido", description: "Sube un episodio y recibe transcripción, capítulos con marcas de tiempo, resumen y publicaciones para LinkedIn, X e Instagram." },
  skip: "Saltar al contenido",
  nav: { label: "Secciones", studio: "Estudio", how: "Cómo funciona", language: "Idioma" },
  hero: {
    eyebrow: "Para quien graba podcasts, clases o entrevistas",
    h1: ["Tú grabas.", "Nosotros escribimos", "el resto."],
    lead: "Entra un episodio y salen la transcripción, los capítulos, un resumen de verdad y las publicaciones de la semana. Sin pegar transcripciones en ningún chat.",
    cta: "Probar ahora", tracksLabel: "Lo que recibes", tracks: "Pistas",
    items: [["Transcripción", "con marcas de tiempo en cada frase"], ["Capítulos", "títulos que dan ganas de abrir"], ["Resumen", "cinco puntos, un minuto de lectura"], ["Publicaciones", "LinkedIn, X e Instagram, del tamaño justo"]],
  },
  how: {
    title: "Cómo funciona",
    items: [
      ["Transcribe", "El audio pasa por un modelo de reconocimiento de voz (FunASR) que devuelve cada frase con el momento exacto en que se dijo."],
      ["Organiza", "Los cambios de tema se vuelven capítulos. El resumen sale de toda la transcripción, no solo del inicio del episodio."],
      ["Reescribe", "Cada publicación respeta el límite y el estilo de su red. Los textos pasan por una revisión para que no suenen a robot."],
    ],
  },
  footer: { project: "un proyecto de", note: "Versión pública con episodios de ejemplo · la transcripción real corre localmente" },
  studio: {
    title: "Estudio", side: "lado A", yourAudio: "Tu audio", upTo: "hasta 200 MB", drop: "Suéltalo.", drag: "Arrastra el episodio aquí",
    or: "o", choose: "elige un archivo", listen: "O escucha lo que hace con", sampleNote: "Los episodios de ejemplo están en portugués.",
    notAudio: "Ese archivo no es de audio. Usa MP3, WAV, M4A u OGG.", tooBig: "Archivo de más de 200 MB. Recorta el episodio o expórtalo en MP3.",
    local: "Tu archivo no salió del navegador. Esta versión pública no transcribe audio real, así que muestra un episodio de ejemplo procesado de la misma forma.",
    progress: "Progreso", steps: ["Audio", "Transcripción", "Capítulos", "Textos"],
    tabs: ["Capítulos", "Resumen", "Publicaciones", "Transcripción"], resultLabel: "Resultado",
    words: "palabras", chapters: "capítulos", export: "Exportar .md", reading: "Lectura", episode: "Episodio",
    search: "Buscar", searchHint: "desperdício, café, WhatsApp…", none: (q) => `Nada encontrado para “${q}”.`,
    draft: "borrador", copied: "Copiado ✓", copy: "Copiar texto", goTo: (i, t) => `Ir al capítulo ${i}: ${t}`,
    md: { chapters: "Capítulos", summary: "Resumen", transcript: "Transcripción" },
  },
};

export const dicts: Record<Lang, Dict> = { pt, en, es };
