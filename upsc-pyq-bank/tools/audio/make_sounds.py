#!/usr/bin/env python3
"""Builds the ten calm timer sounds as 60-second stereo FLAC loops (page/audio/<id>.flac).

Every sound is made so the end joins the start exactly:
  * noise is generated for the whole minute and shaped in the frequency domain, which is circular,
  * slow movements use whole numbers of cycles per minute,
  * short events (drops, crackles, thunder, bowls...) are written round the end of the minute,
  * the room echo is a circular convolution, so tails run on past the end and into the start.
The file can therefore be looped by the app with no crossfade and no audible join.

Usage: python3 make_sounds.py [id ...]      (no ids = all)     needs numpy and soundfile
"""
import os, sys, hashlib
import numpy as np
import soundfile as sf

SR = 22050
DUR = 60
N = SR * DUR
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "page", "audio")
FREQ = np.fft.rfftfreq(N, 1.0 / SR)
T = np.arange(N) / SR
TAU = 2 * np.pi


class Ctx:
    def __init__(self, name):
        seed = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
        self.r = np.random.default_rng(seed)
        self.L = np.zeros(N)       # dry bed, left / right
        self.R = np.zeros(N)
        self.eL = np.zeros(N)      # events that get the room echo
        self.eR = np.zeros(N)
        self.dL = np.zeros(N)      # events with no echo
        self.dR = np.zeros(N)

    # ---- noise beds, shaped in the frequency domain (so they are exactly periodic) ----
    def white(self):
        return self.r.standard_normal(N)

    def shape(self, x, fn):
        X = np.fft.rfft(x)
        f = np.maximum(FREQ, 1e-3)
        return np.fft.irfft(X * fn(f), N)

    def noise(self, kind="pink", lo=None, hi=None, order=2):
        def fn(f):
            m = np.ones_like(f)
            if kind == "pink":
                m = 1.0 / np.sqrt(np.maximum(f, 20.0))
            elif kind == "brown":
                m = 1.0 / np.maximum(f, 20.0)
            if hi:
                m = m / np.sqrt(1 + (f / hi) ** (2 * order))
            if lo:
                m = m / np.sqrt(1 + (lo / f) ** (2 * order))
            m[0] = 0
            return m
        y = self.shape(self.white(), fn)
        return y / (np.sqrt(np.mean(y ** 2)) + 1e-12)

    def slow(self, rate_hz=0.1, depth=0.3):
        """a slow, smooth, random movement (mean 1) that joins its own start"""
        x = self.shape(self.white(), lambda f: 1.0 / np.sqrt(1 + (f / rate_hz) ** 6))
        x = x / (np.std(x) + 1e-12)
        return np.clip(1 + depth * x, 0.05, None)

    def lfo(self, cycles, depth, phase=0.0):
        return 1 + depth * np.sin(TAU * cycles * T / DUR + phase)

    def bed(self, kind, lo, hi, gain, mod=None, order=2, width=1.0):
        """a stereo bed: the two ears hear different noise"""
        for ch in (self.L, self.R):
            y = self.noise(kind, lo, hi, order) * gain
            if mod is not None:
                y = y * mod
            ch += y

    # ---- events written round the end of the minute ----
    def put(self, bus, t0, w, pan=0.0):
        n = len(w)
        i = (int(round(t0 * SR)) + np.arange(n)) % N
        gl = np.sqrt(0.5 * (1 - pan)) * 1.0
        gr = np.sqrt(0.5 * (1 + pan)) * 1.0
        bus[0][i] += w * gl * 1.414
        bus[1][i] += w * gr * 1.414

    @property
    def echo(self):
        return (self.eL, self.eR)

    @property
    def dry(self):
        return (self.dL, self.dR)


def decay_env(n, tau, atk=0.001):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(atk, 1e-4)) * np.exp(-t / tau)


def tone_burst(f0, f1, dur, tau, atk=0.002, phase=None):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    ph = np.cumsum(TAU * f / SR)
    return np.sin(ph) * decay_env(n, tau, atk)


def room_ir(rt60, damp_hz, seed, pre=0.012):
    r = np.random.default_rng(seed)
    n = int(rt60 * 1.1 * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-6.9 * t / rt60)
    ir[: int(pre * SR)] = 0
    X = np.fft.rfft(ir)
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / np.sqrt(1 + (f / damp_hz) ** 2)
    ir = np.fft.irfft(X, n)
    return ir / np.sqrt(np.sum(ir ** 2))


def circ_conv(x, ir):
    h = np.zeros(N)
    h[: len(ir)] = ir
    return np.fft.irfft(np.fft.rfft(x) * np.fft.rfft(h), N)


def finish(c, wet=0.3, rt60=1.8, damp=3500, target_rms=0.1, name=""):
    """mix beds, dry events and echoed events; make loudness even; soft-limit"""
    irL = room_ir(rt60, damp, 11)
    irR = room_ir(rt60, damp, 23)
    wl = circ_conv(c.eL, irL)
    wr = circ_conv(c.eR, irR)
    L = c.L + c.dL + c.eL * (1 - wet) + wl * wet * 2.2
    R = c.R + c.dR + c.eR * (1 - wet) + wr * wet * 2.2
    out = np.stack([L, R], axis=1)
    out = out - out.mean(axis=0)
    rms = np.sqrt(np.mean(out ** 2))
    out = out * (target_rms / (rms + 1e-12))
    out = np.tanh(out * 1.1) / 1.1          # gentle limiter, keeps peaks tidy
    return out


# ============================================================================ recipes
def rain(heavy=False):
    c = Ctx("storm" if heavy else "rain")
    k = 1.7 if heavy else 1.0
    # canopy: soft broadband patter, no hiss (nothing above ~4 kHz)
    c.bed("pink", 300, 5200, 1.0 * k, c.slow(0.15, 0.12))
    c.bed("pink", 60, 800, 0.35 * k, c.slow(0.08, 0.15))
    c.bed("brown", None, 160, 0.14 * k)
    # drops on leaves and ground
    r = c.r
    for _ in range(int(DUR * 85 * k)):
        f = r.uniform(1300, 4200)
        w = tone_burst(f, f * r.uniform(0.75, 1.1), r.uniform(0.012, 0.03), r.uniform(0.003, 0.008)) * r.uniform(0.035, 0.11)
        c.put(c.echo, r.uniform(0, DUR), w, r.uniform(-1, 1))
    for _ in range(int(DUR * 3.2 * k)):
        f = r.uniform(420, 1100)
        w = tone_burst(f * 1.2, f * 0.85, r.uniform(0.05, 0.11), r.uniform(0.012, 0.03), 0.003) * r.uniform(0.09, 0.22)
        c.put(c.echo, r.uniform(0, DUR), w, r.uniform(-1, 1))
    # a breeze moving through the trees
    wind = c.noise("pink", 120, 700, 2)
    swell = c.slow(0.06, 0.55) * c.lfo(3, 0.25, 1.0)
    c.L += wind * swell * (0.7 if heavy else 0.32)
    c.R += c.noise("pink", 120, 700, 2) * c.slow(0.06, 0.55) * (0.7 if heavy else 0.32)
    thunder(c, [(9, 8, 0.5), (31, 9, 0.42), (49, 8, 0.5)] if not heavy else
            [(6, 8, 1.0), (19, 9, 0.9), (27, 7, 0.8), (40, 9, 1.0), (50, 8, 0.85)])
    if not heavy:
        for t0 in (17, 38, 53):
            birds(c, t0)
    return finish(c, wet=0.28 if not heavy else 0.22, rt60=1.9, damp=3000, target_rms=0.095)


def thunder(c, plan):
    r = c.r
    for t0, dur, amp in plan:
        n = int(dur * SR)
        x = np.zeros(N)
        base = c.noise("brown", 18, 150, 3)
        t = np.arange(N) / SR
        env = np.zeros(N)
        offs = [0.0, r.uniform(0.5, 1.3), r.uniform(1.8, 3.0), r.uniform(3.2, 4.4)]
        wts = [1.0, 0.65, 0.5, 0.3]
        for o, wt in zip(offs, wts):
            u = t - o
            e = np.where(u > 0, np.minimum(1, u / 0.5) * np.exp(-u / (dur / 3.3)), 0.0)
            env += wt * e
        env = np.where(t < dur + 6, env, 0.0)
        rumble = base * env * amp * 1.4
        # a faint crack at the start of the nearest roll
        crack = c.noise("pink", 180, 900, 2) * np.where((t > 0) & (t < 0.25), np.exp(-t / 0.05), 0.0) * amp * 0.25
        w = (rumble + crack)
        idx = (int(t0 * SR) + np.arange(int((dur + 6) * SR))) % N
        seg = w[: len(idx)]
        pan = r.uniform(-0.3, 0.3)
        c.eL[idx] += seg * np.sqrt(0.5 * (1 - pan))
        c.eR[idx] += seg * np.sqrt(0.5 * (1 + pan))


def birds(c, t0):
    r = c.r
    f0 = r.uniform(2300, 3100)
    pan = r.uniform(-0.8, 0.8)
    t = t0
    for _ in range(r.integers(3, 6)):
        w = tone_burst(f0, f0 * r.uniform(1.15, 1.4), 0.09, 0.05, 0.01) * 0.035
        c.put(c.echo, t, w, pan)
        t += r.uniform(0.14, 0.2)


def wind():
    c = Ctx("wind")
    c.bed("brown", 70, 520, 1.3, c.slow(0.07, 0.6) * c.lfo(2, 0.2))
    c.bed("pink", 300, 1500, 0.28, c.slow(0.1, 0.6))
    c.bed("pink", 1500, 3600, 0.09, c.slow(0.18, 0.8))   # leaves
    # a faint whistle that drifts
    ph = np.cumsum(TAU * (780 + 110 * np.sin(TAU * 2 * T / DUR)) / SR)
    c.L += np.sin(ph) * 0.012 * c.slow(0.05, 0.9)
    c.R += np.sin(ph + 0.4) * 0.012 * c.slow(0.05, 0.9)
    for t0 in (11.0, 36.0):
        creak = tone_burst(160, 105, 0.7, 0.45, 0.2) * 0.04
        c.put(c.echo, t0, creak, -0.4)
    return finish(c, wet=0.2, rt60=1.4, damp=2500, target_rms=0.09)


def waves():
    c = Ctx("waves")
    r = c.r
    c.bed("brown", None, 260, 0.9, c.lfo(8, 0.25))
    # eight swells a minute, each a little different
    env = np.zeros(N)
    for w in range(8):
        t0 = w * 7.5 + r.uniform(0.2, 1.0)
        u = (T - t0) % DUR
        rise = r.uniform(2.6, 3.4)
        e = np.where(u < rise, (u / rise) ** 2 * (3 - 2 * (u / rise)), np.exp(-(u - rise) / r.uniform(1.4, 2.0)))
        e = np.where(u < 6.8, e, 0.0) * r.uniform(0.6, 1.0)
        env += e
    env = np.clip(env, 0, 1.3)
    for ch in (c.L, c.R):
        low = c.noise("pink", 40, 350, 2)
        mid = c.noise("pink", 120, 1200, 2)
        hi = c.noise("pink", 400, 2800, 2)
        ch += low * (0.25 + 0.85 * env) + mid * env ** 1.5 * 0.9 + hi * env ** 3 * 0.55
    # foam fizz on the crest
    fizz = c.noise("pink", 900, 3200, 2)
    fiz_mod = np.clip(c.slow(2.5, 0.8), 0, None) * env ** 3
    c.L += fizz * fiz_mod * 0.22
    c.R += c.noise("pink", 900, 3200, 2) * np.clip(c.slow(2.5, 0.8), 0, None) * env ** 3 * 0.22
    for t0, f in ((21, 1900), (44, 2100)):
        gull = tone_burst(f, f * 0.66, 0.5, 0.3, 0.08) * 0.03 * (1 + 0.15 * np.sin(TAU * 18 * np.arange(int(0.5 * SR)) / SR))
        c.put(c.echo, t0, gull, 0.6)
    return finish(c, wet=0.18, rt60=2.2, damp=2000, target_rms=0.1)


def forest():
    c = Ctx("forest")
    r = c.r
    c.bed("brown", 60, 420, 0.3, c.slow(0.06, 0.35))
    c.bed("pink", 1600, 3400, 0.05, c.slow(0.14, 0.7))
    for _ in range(8):
        fc = r.uniform(3800, 4800)
        per = r.uniform(0.7, 1.5)
        amp = r.uniform(0.06, 0.12)
        pan = r.uniform(-0.9, 0.9)
        t = r.uniform(0, per)
        while t < DUR:
            pulses = r.integers(3, 6)
            for p in range(pulses):
                w = tone_burst(fc, fc * 1.01, 0.034, 0.02, 0.004) * amp
                c.put(c.echo, t + p * 0.075, w, pan)
            t += per * r.uniform(0.85, 1.2) + (r.uniform(0.5, 1.5) if r.random() < 0.2 else 0)
    for t0 in (14, 41):
        for dt, f0, f1, d, tau in ((0, 410, 385, 0.32, 0.24), (0.45, 410, 385, 0.30, 0.24), (1.0, 395, 330, 0.9, 0.5)):
            w = tone_burst(f0, f1, d, tau, 0.04)
            w = w + 0.25 * tone_burst(f0 * 2, f1 * 2, d, tau, 0.04)
            c.put(c.echo, t0 + dt, w * 0.13, -0.3)
    return finish(c, wet=0.34, rt60=2.4, damp=3000, target_rms=0.085)


def deep_calm():
    c = Ctx("brown")
    c.bed("brown", None, 420, 1.0, c.slow(0.04, 0.2))
    c.bed("pink", 120, 900, 0.07, c.slow(0.08, 0.3))
    for f, g, cyc, ph in ((55, 0.09, 3, 0.2), (82.5, 0.07, 4, 1.0), (110, 0.06, 5, 2.1), (165, 0.035, 6, 0.7), (220, 0.015, 7, 1.7)):
        for det, pan in ((0, -0.5), (0.4, 0.5)):
            tone = np.sin(TAU * (f + det) * T) * g * c.lfo(cyc, 0.45, ph)
            c.L += tone * (1 - pan) * 0.7
            c.R += tone * (1 + pan) * 0.7
    return finish(c, wet=0.1, rt60=2.5, damp=1200, target_rms=0.1)


def fan():
    c = Ctx("white")
    c.bed("pink", 120, 1800, 0.6, c.slow(0.05, 0.05))
    c.bed("brown", None, 300, 0.3)
    for f, g in ((100, 0.04), (200, 0.022), (300, 0.012), (400, 0.006)):
        tone = np.sin(TAU * f * T) * g * c.lfo(2, 0.08)
        c.L += tone
        c.R += tone * 0.95
    # blades passing: a gentle 7 Hz flutter on the air
    flut = 1 + 0.06 * np.sin(TAU * 7 * T)
    c.L *= flut
    c.R *= flut
    return finish(c, wet=0.06, rt60=0.7, damp=2500, target_rms=0.09)


def fire():
    c = Ctx("fire")
    r = c.r
    c.bed("brown", None, 300, 0.5, c.slow(0.5, 0.35))
    c.bed("pink", 150, 1400, 0.12, c.slow(0.9, 0.5))
    # crackles: bursts of noise, shaped afterwards into a warm 1-6 kHz crackle
    raw = [np.zeros(N), np.zeros(N)]
    for _ in range(int(DUR * 13)):
        big = r.random()
        amp = 0.5 if big > 0.97 else (0.22 if big > 0.85 else 0.08) * r.uniform(0.6, 1)
        n = int(r.uniform(0.004, 0.03) * SR)
        w = r.standard_normal(n) * decay_env(n, r.uniform(0.003, 0.012), 0.0006) * amp
        i = (int(r.uniform(0, DUR) * SR) + np.arange(n)) % N
        pan = r.uniform(-1, 1)
        raw[0][i] += w * np.sqrt(0.5 * (1 - pan))
        raw[1][i] += w * np.sqrt(0.5 * (1 + pan))
    for ch, x in zip((c.eL, c.eR), raw):
        y = c.shape(x, lambda f: 1 / np.sqrt(1 + (1200 / f) ** 4) / np.sqrt(1 + (f / 6500) ** 4))
        ch += y * 14
    for _ in range(60):
        w = tone_burst(r.uniform(130, 200), r.uniform(50, 80), 0.06, 0.02, 0.002) * r.uniform(0.1, 0.22)
        c.put(c.echo, r.uniform(0, DUR - 0.3), w, r.uniform(-0.7, 0.7))
    return finish(c, wet=0.15, rt60=0.9, damp=3500, target_rms=0.1)


def stream():
    c = Ctx("stream")
    r = c.r
    c.bed("pink", 300, 2600, 0.5, c.slow(0.9, 0.3) * c.slow(0.25, 0.2))
    c.bed("brown", None, 380, 0.45)
    for _ in range(int(DUR * 66)):
        f0 = r.uniform(320, 900)
        w = tone_burst(f0, f0 * r.uniform(1.5, 2.3), r.uniform(0.018, 0.05), r.uniform(0.01, 0.025), 0.003) * r.uniform(0.02, 0.07)
        c.put(c.echo, r.uniform(0, DUR), w, r.uniform(-1, 1))
    for _ in range(int(DUR * 3)):
        f0 = r.uniform(200, 380)
        w = tone_burst(f0, f0 * 1.6, r.uniform(0.05, 0.12), 0.04, 0.005) * r.uniform(0.05, 0.11)
        c.put(c.echo, r.uniform(0, DUR), w, r.uniform(-0.8, 0.8))
    return finish(c, wet=0.2, rt60=1.1, damp=3500, target_rms=0.09)


def bowl():
    c = Ctx("drone")
    for f, g, cyc, ph in ((66, 0.05, 3, 0.3), (132, 0.045, 4, 1.1), (198, 0.035, 5, 2.0)):
        tone = np.sin(TAU * f * T) * g * c.lfo(cyc, 0.3, ph)
        c.L += tone
        c.R += tone * 0.9
    c.bed("brown", None, 300, 0.15)
    for t0, f in ((2, 196.0), (14, 220.0), (26, 246.9), (38, 220.0), (50, 196.0)):
        for ratio, amp, tau in ((1, 1.0, 9.0), (2.76, 0.5, 6.0), (5.4, 0.25, 3.0), (8.9, 0.1, 1.5)):
            n = int(24 * SR)
            t = np.arange(n) / SR
            for det, pan in ((0.0, -0.1), (1.4, 0.1)):
                w = np.sin(TAU * (f * ratio + det) * t) * amp * 0.09 * np.minimum(1, t / 0.004) * np.exp(-t / tau)
                c.put(c.echo, t0, w, pan)
    return finish(c, wet=0.35, rt60=3.2, damp=3500, target_rms=0.1)


SOUNDS = {
    "rain": lambda: rain(False), "storm": lambda: rain(True), "wind": wind, "waves": waves, "forest": forest,
    "brown": deep_calm, "white": fan, "fire": fire, "stream": stream, "drone": bowl,
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    ids = sys.argv[1:] or list(SOUNDS)
    for i in ids:
        y = SOUNDS[i]()
        path = os.path.join(OUT, i + ".flac")
        sf.write(path, y.astype(np.float32), SR, format="FLAC", subtype="PCM_16")
        seam = float(np.max(np.abs(y[0] - y[-1])))
        step = float(np.mean(np.abs(np.diff(y[:5000, 0]))))
        print("%-7s %5.2f MB  peak %.2f  rms %.3f  seam %.4f  step %.4f" % (i, os.path.getsize(path) / 1e6, np.max(np.abs(y)), np.sqrt(np.mean(y ** 2)), seam, step))
