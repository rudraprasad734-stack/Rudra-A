#!/usr/bin/env python3
"""Checks the built sounds: loop join, loudness, spectrum balance, and writes a spectrogram sheet."""
import os, sys
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw
D = os.path.join(os.path.dirname(__file__), "..", "..", "page", "audio")
ids = ["rain","storm","wind","waves","forest","brown","white","fire","stream","drone"]
tiles = []
for i in ids:
    y, sr = sf.read(os.path.join(D, i + ".flac"))
    m = y.mean(axis=1)
    d = np.diff(np.concatenate([m, m[:1]]))      # includes the join
    z = abs(d[-1]) / (d.std() + 1e-12)
    F = np.abs(np.fft.rfft(m)) ** 2; f = np.fft.rfftfreq(len(m), 1 / sr); tot = F.sum()
    band = lambda a, b: F[(f >= a) & (f < b)].sum() / tot
    print("%-6s join %.1f sigma | <150Hz %4.0f%%  150-1k %4.0f%%  1-4k %4.0f%%  >4k %4.0f%% | peak %.2f crest %.1f" % (
        i, z, 100 * band(0, 150), 100 * band(150, 1000), 100 * band(1000, 4000), 100 * band(4000, 99999), np.abs(m).max(), np.abs(m).max() / (m.std() + 1e-9)))
    nfft, hop = 1024, 512
    seg = m[: sr * 30]
    win = np.hanning(nfft)
    S = np.array([np.abs(np.fft.rfft(seg[k:k + nfft] * win)) for k in range(0, len(seg) - nfft, hop)]).T
    S = 20 * np.log10(S + 1e-9); S = np.clip((S - S.max() + 75) / 75, 0, 1)
    S = S[:280][::-1]                              # up to ~5.5 kHz
    img = Image.fromarray((S * 255).astype(np.uint8)).resize((520, 120)).convert("RGB")
    ImageDraw.Draw(img).text((6, 4), i, fill=(255, 255, 0))
    tiles.append(img)
W = Image.new("RGB", (520 * 2 + 10, 125 * 5), "black")
for k, t in enumerate(tiles): W.paste(t, ((k % 2) * 530, (k // 2) * 125))
W.save(sys.argv[1] if len(sys.argv) > 1 else "spectrograms.png")
