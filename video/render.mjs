// Renderizza index.html fotogramma per fotogramma e codifica un MP4 verticale 1080x1920.
// Uso: node render.mjs [out.mp4] [--frames 1.0,5.2,...]  (con --frames salva solo dei PNG di anteprima)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const fi = args.indexOf('--frames');
const stills = fi >= 0 ? args[fi + 1].split(',').map(Number) : null;
const out = args.find(a => a.endsWith('.mp4')) || path.join(here, 'out', 'lettere-nel-futuro-tiktok.mp4');
const audio = path.join(here, 'out', 'musica.wav');
const FPS = 30;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
await page.goto('file://' + path.join(here, 'index.html'));
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
const stage = await page.$('#stage');

if (stills) {
  fs.mkdirSync(path.join(here, 'out', 'preview'), { recursive: true });
  for (const t of stills) {
    await page.evaluate(t => window.seek(t), t);
    await stage.screenshot({ path: path.join(here, 'out', 'preview', `t${t.toFixed(2)}.png`) });
  }
  await browser.close();
  process.exit(0);
}

fs.mkdirSync(path.dirname(out), { recursive: true });
const hasAudio = fs.existsSync(audio);
const ff = spawn('ffmpeg', [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  ...(hasAudio ? ['-i', audio] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  ...(hasAudio ? ['-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
  '-movflags', '+faststart', out,
], { stdio: ['pipe', 'inherit', 'inherit'] });

const total = Math.round(duration * FPS);
for (let i = 0; i < total; i++) {
  await page.evaluate(t => window.seek(t), i / FPS);
  const buf = await stage.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 90 === 0) process.stdout.write(`frame ${i}/${total}\n`);
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
await browser.close();
console.log('Video salvato in', out);
