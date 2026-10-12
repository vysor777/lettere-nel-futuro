# Lettere nel Futuro — video TikTok in Remotion

Versione Remotion del video "Tra 10 anni ti arriva una lettera" (1080×1920, 30 fps, 29,4 s, con musica).
Il video renderizzato è in `../video/out/lettere-nel-futuro-tiktok-remotion.mp4`.

## Struttura

| File | Contenuto |
|---|---|
| `src/LettereNelFuturo.tsx` | Composizione principale: sfondo, `TransitionSeries` delle sei scene, musica |
| `src/scenes/` | Le scene, ognuna registrata anche come composizione a sé nella cartella "Scene" dello Studio |
| `src/components/` | Lettera (scrittura a mano + penna), busta con sigillo, sfondo con polvere dorata |
| `src/content.ts` | Testo della lettera, scritta sulla busta, eventi di ogni anno |
| `src/theme.ts` | Font, colori e funzione `tween()` per le animazioni |
| `public/fonts/` | Font locali (Caveat, Playfair Display, Inter) |
| `scripts/music.py` | Genera `public/musica.wav` sincronizzata con il sigillo (frame 360) |

Scene: Hook (100 frame) → Scrittura (200) → Sigillo (130) → Dieci anni (150) → Apertura 2036 (180) → Finale (150).

## Comandi

```bash
npm i
npm run dev                                   # Remotion Studio: anteprima e modifica dei testi
npx remotion render LettereNelFuturo out/video.mp4
python3 scripts/music.py                      # rigenera la musica (richiede numpy)
```

Se cambi le durate delle scene, aggiorna `durationInFrames` della composizione in `src/Root.tsx`
e `DUR` / `SEAL_HIT` in `scripts/music.py`.

In ambienti dove Remotion non riesce a scaricare Chrome, passa un browser già installato con
`--browser-executable=/percorso/headless_shell`.
