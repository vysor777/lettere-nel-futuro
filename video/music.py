"""Genera la musica di sottofondo (carillon + pad) sincronizzata con l'animazione.

Uso: python3 music.py  ->  out/musica.wav (30 s, 44.1 kHz, stereo)
"""
import os
import wave

import numpy as np

SR = 44100
DUR = 30.0
BAR = 2.4  # un accordo ogni 2,4 s (100 bpm, 4/4)
SEAL_HIT = 12.45  # impatto del sigillo di ceralacca

N = int(SR * DUR)
t_all = np.arange(N) / SR
L = np.zeros(N)
R = np.zeros(N)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def add(buf, start, sig, gain=1.0):
    i = int(start * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i : i + len(sig)] += sig * gain


def bell(freq, dur=2.6):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 2.2) * np.minimum(1, t / 0.004)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 3)
    s += 0.12 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 5)
    return s * env


def pad(freqs, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(1, t / 0.9) * np.minimum(1, (dur - t) / 0.9)
    s = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 1.003 * t) for f in freqs)
    return s * env / len(freqs)


# La minore - Fa - Do - Sol, chiusura su Do
CHORDS = {
    "Am": [57, 60, 64], "F": [53, 57, 60], "C": [48, 55, 64], "G": [55, 59, 62],
}
PROG = ["Am", "F", "C", "G"] * 3 + ["C"]
PATTERN = [0, 1, 2, 3, 2, 1, 2, 3]  # arpeggio a crome

for bar, name in enumerate(PROG):
    start = bar * BAR
    notes = CHORDS[name]
    arp = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[0] + 24]
    last = bar == len(PROG) - 1
    pad_dur = DUR - start if last else BAR + 0.6
    p = pad([midi(n - 12) for n in notes], pad_dur) * 0.10
    add(L, start, p)
    add(R, start, p)
    steps = 4 if last else 8
    for k in range(steps):
        if bar == 0 and k % 2:  # apertura più rarefatta
            continue
        n = arp[PATTERN[k]]
        b = bell(midi(n)) * (0.20 if k == 0 else 0.14)
        pan = 0.5 + 0.25 * np.sin(k * 1.7 + bar)
        add(L, start + k * BAR / 8, b * (1 - pan) * 2)
        add(R, start + k * BAR / 8, b * pan * 2)

# colpo sordo del sigillo
th = np.arange(int(SR * 0.5)) / SR
thud = np.sin(2 * np.pi * (70 + 60 * np.exp(-th * 30)) * th) * np.exp(-th * 9) * 0.55
rng = np.random.default_rng(3)
click = rng.standard_normal(len(th)) * np.exp(-th * 80) * 0.08
add(L, SEAL_HIT, thud + click)
add(R, SEAL_HIT, thud + click)

# riverbero semplice (eco multiple)
for d, g in [(0.113, 0.32), (0.171, 0.26), (0.263, 0.2), (0.397, 0.14)]:
    k = int(d * SR)
    L[k:] += R[:-k] * g
    R[k:] += L[:-k] * g

fade = np.minimum(1, t_all / 0.3) * np.minimum(1, (DUR - t_all) / 2.0)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.8, R / peak * 0.8

os.makedirs(os.path.join(os.path.dirname(__file__) or ".", "out"), exist_ok=True)
out = os.path.join(os.path.dirname(__file__) or ".", "out", "musica.wav")
data = (np.stack([L, R], axis=1) * 32767).astype("<i2")
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print("Audio salvato in", out)
