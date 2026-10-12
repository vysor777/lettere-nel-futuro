# Video TikTok animato — "Tra 10 anni ti arriva una lettera"

Video verticale 1080×1920, 30 s, 30 fps, con musica: `out/lettere-nel-futuro-tiktok.mp4`.

## Storyboard

| Tempo | Scena |
|---|---|
| 0–3 s | Hook: "Tra 10 anni ti arriva una lettera. *L'hai scritta tu.*" |
| 3–10 s | Una penna scrive la lettera: "Caro me del 2036… Sei felice?" |
| 10–14 s | La lettera si piega, entra nella busta, sigillo di ceralacca "2036", "da aprire il 12·10·2036" |
| 14–19 s | Gli anni scorrono 2026 → 2036 con gli eventi della vita (il primo lavoro, un amore, un addio…) |
| 19–25 s | 12 ottobre 2036: il sigillo salta, la lettera esce, è ingiallita, "Sei felice?" viene sottolineato |
| 25–30 s | "E tu, cosa scriveresti al te del futuro?" + Lettere nel Futuro + "Scrivi la tua lettera · link in bio" |

## Come rigenerarlo

```bash
cd video
npm install            # installa playwright (usa Chromium già presente o `npx playwright install chromium`)
python3 music.py       # crea out/musica.wav (richiede numpy)
node render.mjs        # crea out/lettere-nel-futuro-tiktok.mp4 (richiede ffmpeg)
```

- Anteprima nel browser: apri `index.html?play`.
- Testi, date ed eventi si modificano direttamente in `index.html` (oggetto `EVENTS` e righe della lettera).
- Anteprime singole: `node render.mjs --frames 2,8,16,23` salva PNG in `out/preview/`.

## Su TikTok

- La musica è originale (nessun problema di copyright). Per più copertura puoi abbassarla a zero nell'editor di TikTok e usare un audio di tendenza emotivo della libreria commerciale.
- Didascalia suggerita: *"Cosa scriveresti al te del 2036? 👇"* — la domanda spinge i commenti.
