# echo

**PT** · Áudio vira conteúdo. Suba um episódio e receba transcrição com timestamps, capítulos, resumo e posts prontos para LinkedIn, X e Instagram.
**EN** · Audio becomes content. Upload an episode and get a timestamped transcript, chapters, a summary and ready-to-post copy for LinkedIn, X and Instagram.

🔗 **Ao vivo / Live:** https://echo-vhcode.vercel.app

![echo](docs/screenshot.png)

## Português

### O que faz
- Upload de áudio (MP3, WAV, M4A) ou episódios de exemplo
- Capítulos com timestamps e duração de cada trecho
- Resumo em tópicos
- Posts com contador de caracteres por plataforma e botão de copiar
- Exportação de tudo em Markdown

### Modo demo
A versão publicada não envia seu áudio para nenhum servidor: ela mostra transcrições de exemplo. A transcrição real foi desenvolvida e testada localmente com FunASR.

### Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Vitest

### Como rodar
```bash
npm install
npm run dev     # http://localhost:3000
npm test        # testes unitários
npm run build
```

## English

### Features
- Audio upload (MP3, WAV, M4A) or sample episodes
- Timestamped chapters with per-section length
- Bullet summary
- Social posts with per-platform character counters and copy button
- Markdown export

### Demo mode
The deployed version never uploads your audio; it shows sample transcripts. Real transcription was built and tested locally with FunASR.

### Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Vitest

### Run locally
```bash
npm install
npm run dev
npm test
npm run build
```
