// ---------------------------------------------------------------------------
// The studio audience. A small source-filter voice model renders a crowd of
// individual people: glottal pulses with jitter, shimmer and breath, shaped by
// five cascaded formant resonators. Laughter is built the way people laugh:
// breathy "ha" calls at laughing pitch that slow down and sink, inhales between
// bouts, giggles, guffaws, closed-mouth chuckles and silent wheezes. A few loud
// front-row laughers sit on top of a dense, distant crowd. Oohs, awws, cheers
// and applause use the same parts.
// The whole module is self-contained so it can be stringified into a Worker.
// ---------------------------------------------------------------------------
function CrowdSynth() {
  const SR = 24000, TAU = Math.PI * 2;
  let R = Math.random;
  function seed(s) {
    let a = (s * 2654435761 + 1013904223) >>> 0;
    R = () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rr = (a, b) => a + R() * (b - a);
  const pick = a => a[Math.floor(R() * a.length)];
  const gauss = () => (R() + R() + R() + R() - 2) * 1.732;
  function wpick(w) {
    let s = 0;
    for (const k in w) s += w[k];
    let x = R() * s;
    for (const k in w) { x -= w[k]; if (x <= 0) return k; }
    return Object.keys(w)[0];
  }

  // Formant targets for an adult male vocal tract, scaled per speaker.
  const VOW = {
    a: [750, 1250, 2550, 3400, 4000],   // "ha"
    u: [620, 1180, 2450, 3350, 3950],   // "huh"
    e: [560, 1720, 2520, 3400, 4000],   // "heh"
    i: [340, 2150, 2900, 3450, 4050],   // "hee"
    o: [530, 920, 2420, 3350, 3950],    // "ho"
    oo: [370, 840, 2350, 3300, 3950],   // "ooh"
    aw: [650, 1000, 2450, 3350, 3950],  // "aww"
    ye: [430, 1950, 2620, 3400, 4000],  // "yeah"
    m: [270, 1150, 2350, 3250, 3900],   // closed-mouth "hm"
    hi: [480, 1700, 2650, 3450, 4050],  // inhale
  };
  const BW = [75, 95, 140, 230, 320];
  const K_CALL = 0, K_BREATH = 1, K_INHALE = 2, K_TONE = 3;

  // Rosenberg glottal-flow derivative, one period, peak-normalised.
  const tabs = new Map();
  function pulseTable(oq) {
    const key = Math.round(oq * 40);
    if (tabs.has(key)) return tabs.get(key);
    oq = key / 40;
    const N = 512, tab = new Float32Array(N + 1);
    const tp = oq * 0.64, tn = oq * 0.36;
    let mx = 0;
    for (let i = 0; i < N; i++) {
      const p = i / N;
      let d = 0;
      if (p < tp) d = Math.sin(Math.PI * p / tp) / tp;
      else if (p < tp + tn) d = -Math.sin(Math.PI * (p - tp) / (2 * tn)) / tn;
      tab[i] = d;
      if (Math.abs(d) > mx) mx = Math.abs(d);
    }
    for (let i = 0; i < N; i++) tab[i] /= mx;
    tab[N] = tab[0];
    tabs.set(key, tab);
    return tab;
  }

  function speaker(female, oqr, young) {
    const oq = rr(oqr[0], oqr[1]);
    return {
      vtl: young ? rr(1.2, 1.3) : female ? rr(1.12, 1.22) : rr(0.94, 1.05),
      oq, tab: pulseTable(oq), jit: rr(0.006, 0.018), shim: rr(0.03, 0.09), kt: rr(0.35, 0.62),
      ph: R(), ns: (R() * 2147483646 + 1) | 0,
    };
  }

  // Breath turbulence above the formants: a high-pass (2.6 kHz) path that skips the cascade.
  const HP = (() => {
    const w = TAU * 2600 / SR, al = Math.sin(w) / (2 * 0.707), cw = Math.cos(w), a0 = 1 + al;
    return [(1 + cw) / 2 / a0, -(1 + cw) / a0, (1 + cw) / 2 / a0, -2 * cw / a0, (1 - al) / a0];
  })();
  const AIR = [0.32, 0.55, 1.1, 0.3];   // per event kind: call, breath, inhale, tone

  // One vocal gesture (a laugh call, a breath, an inhale or a held vowel), added into `out`.
  function renderEvent(out, s0, V, e) {
    const D = e.d;
    const n = Math.min(out.length - s0, Math.floor((D + 0.04) * SR));
    if (n <= 0) return;
    const co = new Float64Array(15);
    const vA = VOW[e.vow] || VOW.u, vB = e.vow2 ? VOW[e.vow2] : null;
    const glide = vB ? (e.glide || 0.25) * D : 0;
    const bwm = (e.bwm || 1) * (V.vtl > 1.1 ? 1.12 : 1);
    const f1min = (e.f0a || 0) * 1.12;
    const breath = e.breath || 0;
    const formants = m => {
      for (let k = 0; k < 5; k++) {
        let f = (vB ? vA[k] + (vB[k] - vA[k]) * m : vA[k]) * V.vtl;
        if (k === 0 && f < f1min) f = f1min;
        if (f > SR * 0.45) f = SR * 0.45;
        const q = Math.exp(-Math.PI * BW[k] * bwm * (k === 0 ? 1 + breath * 0.7 : 1) / SR);
        const c = -q * q, b = 2 * q * Math.cos(TAU * f / SR);
        co[k * 3] = 1 - b - c; co[k * 3 + 1] = b; co[k * 3 + 2] = c;
      }
    };
    formants(0);
    let a0 = co[0], b0 = co[1], c0 = co[2], a1 = co[3], b1 = co[4], c1 = co[5], a2 = co[6], b2 = co[7], c2 = co[8];
    let a3 = co[9], b3 = co[10], c3 = co[11], a4 = co[12], b4 = co[13], c4 = co[14];
    let y01 = 0, y02 = 0, y11 = 0, y12 = 0, y21 = 0, y22 = 0, y31 = 0, y32 = 0, y41 = 0, y42 = 0;
    let hx1 = 0, hx2 = 0, hy1 = 0, hy2 = 0;
    const h0 = HP[0], h1 = HP[1], h2 = HP[2], ha1 = HP[3], ha2 = HP[4];
    const kind = e.k === 'breath' ? K_BREATH : e.k === 'inhale' ? K_INHALE : e.k === 'tone' ? K_TONE : K_CALL;
    const air = AIR[kind] * (e.air === undefined ? 1 : e.air);
    const tab = V.tab, oq = V.oq, amp = e.amp, jit = V.jit, shim = V.shim;
    const asp = e.asp || 0, tv = asp * 0.7, atk = e.atk || 0.014;
    const rel = e.rel || Math.max(0.02, (D - tv) * 0.45);
    const f0a = e.f0a || 0, f0b = e.f0b || f0a, hump = e.hump || 0;
    const ct = e.contour, vib = e.vib || 0, vibR = e.vibR || 5.5;
    const hAmp = e.hAmp === undefined ? 1 : e.hAmp;
    const kt = e.kt || V.kt, sq = e.squeak || 0;
    let ph = V.ph, jf = 1, sh = 1, lp = 0, prevN = 0, ns = V.ns, nb = V.ns ^ 0x5bd1e995, ci = 1;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      if (vB && (i & 63) === 0 && t <= glide + 0.003) {
        formants(Math.min(1, t / glide));
        a0 = co[0]; b0 = co[1]; c0 = co[2]; a1 = co[3]; b1 = co[4]; c1 = co[5]; a2 = co[6]; b2 = co[7]; c2 = co[8];
        a3 = co[9]; b3 = co[10]; c3 = co[11]; a4 = co[12]; b4 = co[13]; c4 = co[14];
      }
      let av = 0, ah = 0, f0 = 0;
      if (kind === K_CALL) {
        if (t >= tv && t < D) {
          const u = t - tv;
          av = u < atk ? u / atk : t > D - rel ? Math.pow((D - t) / rel, 1.6) : 1;
          const x = u / (D - tv);
          f0 = f0a + (f0b - f0a) * x + f0a * hump * Math.sin(Math.PI * x);
        }
        if (t < asp) ah = Math.sin(Math.PI * t / asp) * hAmp;
        ah += breath * av;
      } else if (kind === K_BREATH) {
        ah = t < 0.012 ? t / 0.012 : t < D ? Math.pow((D - t) / (D - 0.012), 1.4) : 0;
      } else if (kind === K_INHALE) {
        const x = t / D;
        ah = x < 0.82 ? Math.pow(x / 0.82, 1.4) : x < 1 ? (1 - x) / 0.18 : 0;
        if (sq && x > 0.25 && x < 0.8) { av = Math.sin(Math.PI * (x - 0.25) / 0.55) * 0.45; f0 = sq * (0.9 + x * 0.3); }
      } else {
        if (t < D) {
          av = t < atk ? t / atk : t > D - rel ? Math.pow((D - t) / rel, 1.3) : 1;
          const x = t / D;
          let m = 1;
          if (ct) {
            while (ci < ct.length - 1 && ct[ci][0] < x) ci++;
            const p = ct[ci - 1], q = ct[ci];
            m = p[1] + (q[1] - p[1]) * Math.min(1, Math.max(0, (x - p[0]) / (q[0] - p[0])));
          }
          f0 = f0a * m * (1 + vib * Math.sin(TAU * vibR * t) * Math.min(1, t / 0.3));
        }
        if (t < asp) ah += Math.sin(Math.PI * t / asp) * hAmp;
        ah += breath * av;
      }
      // glottal source with per-period jitter and shimmer, then spectral tilt
      let v = 0;
      if (av > 0 && f0 > 0) {
        ph += f0 * jf / SR;
        if (ph >= 1) { ph -= 1; jf = 1 + jit * gauss(); sh = 1 + shim * gauss(); }
        const p = ph * 512, j = p | 0;
        v = (tab[j] + (tab[j + 1] - tab[j]) * (p - j)) * av * sh;
      }
      lp += kt * (v - lp);
      // breath noise, stronger while the glottis is open
      ns ^= ns << 13; ns ^= ns >>> 17; ns ^= ns << 5;
      const w = ns / 2147483648;
      const nz = kind === K_INHALE ? (w - prevN) * 0.6 : (w + prevN) * 0.5;
      prevN = w;
      const na = ah * (av > 0 ? (ph < oq ? 1 : 0.4) : 1);
      const x = (lp + nz * na * 0.6) * amp;
      // vocal tract: five formants in cascade
      let y = a4 * x + b4 * y41 + c4 * y42; y42 = y41; y41 = y;
      y = a3 * y + b3 * y31 + c3 * y32; y32 = y31; y31 = y;
      y = a2 * y + b2 * y21 + c2 * y22; y22 = y21; y21 = y;
      y = a1 * y + b1 * y11 + c1 * y12; y12 = y11; y11 = y;
      y = a0 * y + b0 * y01 + c0 * y02; y02 = y01; y01 = y;
      // turbulence that the formants would swallow (its own noise, so the two paths never cancel)
      nb ^= nb << 13; nb ^= nb >>> 17; nb ^= nb << 5;
      const xa = (nb / 2147483648) * na * air * amp;
      const ya = h0 * xa + h1 * hx1 + h2 * hx2 - ha1 * hy1 - ha2 * hy2;
      hx2 = hx1; hx1 = xa; hy2 = hy1; hy1 = ya;
      out[s0 + i] += y + ya;
    }
    V.ph = ph; V.ns = ns;
  }

  function renderVoice(evs, V) {
    let t0 = 1e9, t1 = 0;
    for (const e of evs) { if (e.t < t0) t0 = e.t; if (e.t + e.d > t1) t1 = e.t + e.d; }
    const out = new Float32Array(Math.ceil((t1 - t0 + 0.06) * SR));
    for (const e of evs) renderEvent(out, Math.floor((e.t - t0) * SR), V, e);
    return { t0, out };
  }

  // Peak-normalise a voice to `gain`, pan it, optionally push it back (low-pass) and delay it.
  function mixInto(L, Rt, buf, t0, gain, pan, lpHz, delay) {
    let pk = 0;
    for (let i = 0; i < buf.length; i++) { const a = Math.abs(buf[i]); if (a > pk) pk = a; }
    if (pk < 1e-9) return;
    const g = gain / pk;
    const gl = Math.cos(pan * Math.PI / 2) * g, gr = Math.sin(pan * Math.PI / 2) * g;
    const c = lpHz ? 1 - Math.exp(-TAU * lpHz / SR) : 1;
    const off = Math.floor((t0 + (delay || 0)) * SR);
    let s = 0;
    for (let i = 0; i < buf.length; i++) {
      const j = off + i;
      if (j >= L.length) break;
      s += c * (buf[i] - s);
      if (j >= 0) { L[j] += s * gl; Rt[j] += s * gr; }
    }
  }

  // ---- laughers -----------------------------------------------------------------
  // f0 ranges follow measured laughter, which sits far above speaking pitch.
  const TYPES = {
    ha: { v: true, m: 0.5, f0m: [160, 250], f0f: [260, 400], ioi: [0.17, 0.215], vows: ['a', 'a', 'u', 'e'], br: [0.2, 0.45], inh: 0.5, sq: 0.03, oq: [0.5, 0.65], cf: 1 },
    guffaw: { v: true, m: 0.85, f0m: [110, 165], f0f: [190, 250], ioi: [0.2, 0.27], vows: ['a', 'o', 'u'], br: [0.3, 0.55], inh: 0.55, sq: 0, oq: [0.42, 0.55], cf: 0.8 },
    giggle: { v: true, m: 0.2, young: 0.4, f0m: [250, 340], f0f: [370, 540], ioi: [0.105, 0.14], vows: ['i', 'e', 'i'], br: [0.3, 0.55], inh: 0.4, sq: 0.1, oq: [0.6, 0.75], cf: 1.4 },
    cackle: { v: true, m: 0.35, f0m: [230, 310], f0f: [400, 580], ioi: [0.125, 0.155], vows: ['a', 'e'], br: [0.12, 0.28], inh: 0.3, sq: 0.08, oq: [0.38, 0.5], cf: 1.2 },
    breathy: { v: false, m: 0.5, ioi: [0.15, 0.2], vows: ['u', 'a'], br: [1, 1], inh: 0.45, sq: 0, oq: [0.6, 0.7], cf: 1 },
    chuckle: { v: true, hum: true, m: 0.55, f0m: [95, 145], f0f: [170, 235], ioi: [0.16, 0.23], vows: ['m'], br: [0.35, 0.6], inh: 0.2, sq: 0, oq: [0.6, 0.75], cf: 0.7 },
  };

  function laugher(type, t0, size) {
    const T = TYPES[type];
    const female = R() > T.m;
    const V = speaker(female, T.oq, T.young && R() < T.young);
    const f0 = T.v ? (female ? rr(T.f0f[0], T.f0f[1]) : rr(T.f0m[0], T.f0m[1])) : 0;
    const vow0 = pick(T.vows);
    const evs = [];
    let t = t0, amp = 1, fc = f0;
    const ioi = rr(T.ioi[0], T.ioi[1]);
    const bouts = size < 0.7 ? 1 : size < 1.2 ? (R() < 0.35 ? 2 : 1) : 1 + (R() < 0.65 ? 1 : 0) + (R() < 0.2 ? 1 : 0);
    const callsBase = size < 0.7 ? rr(2, 4.2) : size < 1.2 ? rr(3.5, 7.5) : rr(5, 11);
    for (let b = 0; b < bouts; b++) {
      const nCalls = Math.max(2, Math.round(callsBase * T.cf * (b === 0 ? 1 : rr(0.4, 0.75))));
      let io = ioi * rr(0.95, 1.05);
      for (let c = 0; c < nCalls; c++) {
        const d = io * rr(0.52, 0.68);
        const a = amp * (c === 0 ? rr(0.85, 1) : Math.pow(0.91, c) * rr(0.8, 1.12));
        const vow = R() < 0.8 ? vow0 : pick(T.vows);
        if (T.v) {
          const fa = fc * rr(0.97, 1.07);
          evs.push({
            k: 'call', t, d, amp: a, f0a: fa, f0b: fa * rr(0.78, 0.92), hump: rr(0, 0.06), vow,
            asp: T.hum ? rr(0.01, 0.025) : rr(0.018, 0.045), breath: rr(T.br[0], T.br[1]),
            hAmp: T.hum ? 0.5 : rr(0.7, 1.1), kt: T.hum ? 0.18 : 0, bwm: T.hum ? 1.3 : 1,
          });
        } else {
          evs.push({ k: 'breath', t, d: d * rr(0.8, 1), amp: a * 0.8, vow, bwm: 1.6 });
        }
        t += io * rr(0.9, 1.12);
        io *= rr(1.02, 1.07);
        fc *= rr(0.95, 0.995);
      }
      if (b < bouts - 1 || R() < 0.5) {
        if (R() < T.inh) {
          const d = rr(0.18, 0.36);
          evs.push({ k: 'inhale', t: t + rr(0, 0.05), d, amp: rr(0.2, 0.34), vow: 'hi', bwm: 1.9, squeak: R() < T.sq ? rr(650, 950) : 0 });
          t += d + rr(0.06, 0.25);
        } else t += rr(0.25, 0.55);
      }
      amp *= rr(0.55, 0.8);
      fc = f0 * rr(0.95, 1.08);
    }
    return { evs, V };
  }

  // A held vocalisation ("ooh", "aww", "yeah!", "woo!") with a pitch contour.
  function toner(female, f0, vow, vow2, glide, contour, t0, d, o) {
    const V = speaker(female, [0.55, 0.7]);
    const ct = contour.map(([x, m]) => [x, m * rr(0.96, 1.04)]);
    const evs = [{ k: 'tone', t: t0, d, amp: 1, f0a: f0, vow, vow2, glide, contour: ct, vib: rr(0.008, 0.02), vibR: rr(4.8, 6.2), breath: o.breath || rr(0.2, 0.4), asp: o.asp || 0, hAmp: o.hAmp || 0.6, atk: o.atk || rr(0.06, 0.16), rel: d * rr(0.3, 0.45), kt: o.kt || 0 }];
    return { evs, V };
  }

  // ---- applause -----------------------------------------------------------------
  function bp(f, q) {
    const w = TAU * f / SR, al = Math.sin(w) / (2 * q), a0 = 1 + al;
    return { b0: al / a0, b2: -al / a0, a1: -2 * Math.cos(w) / a0, a2: (1 - al) / a0, x1: 0, x2: 0, y1: 0, y2: 0 };
  }
  function runBp(s, x) {
    const y = s.b0 * x + s.b2 * s.x2 - s.a1 * s.y1 - s.a2 * s.y2;
    s.x2 = s.x1; s.x1 = x; s.y2 = s.y1; s.y1 = y;
    return y;
  }
  function clapper(L, Rt, t0, t1, vol) {
    const n = L.length;
    let ns = (R() * 2147483646 + 1) | 0;
    const cup = R() < 0.4;
    const f1 = cup ? rr(600, 1100) : rr(1100, 2600);
    const s1 = bp(f1, rr(1.2, 2.6)), s2 = bp(f1 * rr(1.7, 2.6), rr(1.5, 3.5));
    const mix2 = rr(0.2, 0.6);
    const pan = rr(0.03, 0.97), gl = Math.cos(pan * Math.PI / 2), gr = Math.sin(pan * Math.PI / 2);
    const g0 = vol * rr(0.4, 1);
    let rate = rr(3.4, 5.4);
    let t = t0 + Math.pow(R(), 1.5) * 0.6;
    const stop = t1 - rr(0, 1.6);
    while (t < stop) {
      const i0 = Math.floor(t * SR), len = Math.floor(SR * 0.035);
      const dk = Math.exp(-1 / (rr(0.0035, 0.009) * SR));
      const env = Math.min(1, (t - t0) / 0.25) * Math.min(1, Math.max(0.15, (stop - t) / 1.2));
      let e = g0 * env * rr(0.7, 1.15);
      for (let i = 0; i < len && i0 + i < n; i++) {
        ns ^= ns << 13; ns ^= ns >>> 17; ns ^= ns << 5;
        const x = ((ns | 0) / 2147483648) * e * (i < 10 ? i / 10 : 1);
        e *= dk;
        const y = runBp(s1, x) + runBp(s2, x) * mix2;
        L[i0 + i] += y * gl; Rt[i0 + i] += y * gr;
      }
      t += (1 / rate) * rr(0.88, 1.12);
      if (t > stop - 1.2) rate *= 0.985;
    }
  }
  function whistle(L, Rt, t0, vol) {
    const n = L.length, i0 = Math.floor(t0 * SR), len = Math.floor(SR * rr(0.5, 0.8));
    const f0 = rr(1700, 2300), pan = rr(0.2, 0.8);
    let ph = 0;
    for (let i = 0; i < len && i0 + i < n; i++) {
      const k = i / len;
      const f = f0 * (k < 0.35 ? 1 + k * 0.9 : 1.32 - (k - 0.35) * 0.5) * (1 + 0.004 * Math.sin(i / 90));
      ph += f / SR;
      const y = Math.sin(ph * TAU) * vol * (k < 0.06 ? k / 0.06 : Math.pow(1 - k, 0.7));
      L[i0 + i] += y * (1 - pan); Rt[i0 + i] += y * pan;
    }
  }

  // ---- mixdown --------------------------------------------------------------------
  function addCopy(sL, sR, L, Rt, rate, delay, gain) {
    const n = L.length, d = delay * SR;
    for (let i = 0; i < n; i++) {
      const p = (i - d) * rate;
      if (p < 0) continue;
      const j = p | 0;
      if (j + 1 >= sL.length) break;
      const f = p - j;
      L[i] += (sR[j] + (sR[j + 1] - sR[j]) * f) * gain;
      Rt[i] += (sL[j] + (sL[j + 1] - sL[j]) * f) * gain;
    }
  }
  function finish(L, Rt, target) {
    const n = L.length;
    // gentle high-pass (~90 Hz) to keep the crowd out of the bass
    const c = Math.exp(-TAU * 90 / SR);
    let xl = 0, yl = 0, xr = 0, yr = 0;
    for (let i = 0; i < n; i++) {
      const a = L[i], b = Rt[i];
      yl = c * (yl + a - xl); xl = a; L[i] = yl;
      yr = c * (yr + b - xr); xr = b; Rt[i] = yr;
    }
    // a couple of early reflections from the studio walls
    const taps = [[0.013, 0.2], [0.021, 0.16], [0.034, 0.12]];
    for (const [dt, g] of taps) {
      const d = Math.floor(dt * SR);
      let sl = 0, sr = 0;
      for (let i = n - 1; i >= d; i--) {
        sl += 0.35 * (Rt[i - d] - sl); sr += 0.35 * (L[i - d] - sr);
        L[i] += sl * g; Rt[i] += sr * g;
      }
    }
    // loudness: scale the loudest 0.4 s to the target RMS, then soft-limit peaks
    const win = Math.floor(SR * 0.4);
    let acc = 0, mx = 0;
    for (let i = 0; i < n; i++) {
      acc += L[i] * L[i] + Rt[i] * Rt[i];
      if (i >= win) { acc -= L[i - win] * L[i - win] + Rt[i - win] * Rt[i - win]; if (acc > mx) mx = acc; }
    }
    const rms = Math.sqrt(Math.max(mx, 1e-12) / (2 * win));
    const g = target / rms;
    const soft = x => { const a = Math.abs(x); return a < 0.7 ? x : (x < 0 ? -1 : 1) * (0.7 + 0.29 * Math.tanh((a - 0.7) / 0.29)); };
    for (let i = 0; i < n; i++) { L[i] = soft(L[i] * g); Rt[i] = soft(Rt[i] * g); }
    // trim the silent tail (the studio reverb adds its own), then fade the edges
    let end = n - 1;
    while (end > 0 && Math.abs(L[end]) < 0.002 && Math.abs(Rt[end]) < 0.002) end--;
    const m = Math.min(n, end + Math.floor(SR * 0.12));
    const fi = Math.floor(SR * 0.004), fo = Math.min(Math.floor(SR * 0.3), Math.floor(m / 3));
    for (let i = 0; i < m; i++) {
      const f = (i < fi ? i / fi : 1) * (i > m - fo ? (m - i) / fo : 1);
      L[i] *= f; Rt[i] *= f;
    }
    return { L: L.slice(0, m), R: Rt.slice(0, m), sr: SR };
  }

  const LAUGH_MIX = {
    chuckle: { n: 30, size: 0.55, spread: 0.45, w: { chuckle: 0.36, breathy: 0.3, ha: 0.24, giggle: 0.1 }, feat: ['ha', 'chuckle'], late: 3, dur: 2.6, copies: [[1.03, 0.05, 0.4]], target: 0.1 },
    laugh: { n: 58, size: 1, spread: 0.3, w: { ha: 0.42, giggle: 0.14, guffaw: 0.12, breathy: 0.14, chuckle: 0.1, cackle: 0.08 }, feat: ['guffaw', 'giggle', 'ha', 'ha'], late: 8, dur: 4, copies: [[1.04, 0.06, 0.55], [0.965, 0.11, 0.5]], target: 0.15 },
    big: { n: 88, size: 1.5, spread: 0.28, w: { ha: 0.4, giggle: 0.14, guffaw: 0.18, breathy: 0.1, chuckle: 0.06, cackle: 0.12 }, feat: ['guffaw', 'cackle', 'giggle', 'ha', 'ha'], late: 12, dur: 5.6, copies: [[1.04, 0.06, 0.55], [0.965, 0.11, 0.5]], target: 0.17 },
  };
  const DUR = { ooh: 2.6, aww: 2.8, applause: 5, cheer: 4.6 };
  const TARGET = { ooh: 0.12, aww: 0.12, applause: 0.13, cheer: 0.13 };

  // Build the work for one buffer as small tasks, so a main-thread fallback can time-slice it.
  function plan(kind, sd) {
    seed(sd);
    const M = LAUGH_MIX[kind];
    const n = Math.floor((M ? M.dur : DUR[kind] || 3) * SR);
    const L = new Float32Array(n), Rt = new Float32Array(n);
    const bL = new Float32Array(n), bR = new Float32Array(n);
    const tasks = [];
    const add = (mk, dst, gain, pan, lpHz, delay) => tasks.push(() => {
      const { evs, V } = mk();
      const r = renderVoice(evs, V);
      mixInto(dst === 'bed' ? bL : L, dst === 'bed' ? bR : Rt, r.out, r.t0, gain, pan, lpHz, delay);
    });
    if (M) {
      for (let v = 0; v < M.n; v++) {
        const type = wpick(M.w), t0 = 0.02 + M.spread * Math.pow(R(), 1.35);
        add(() => laugher(type, t0, M.size), 'bed', rr(0.35, 1), rr(0.03, 0.97), rr(2200, 4200), rr(0, 0.02));
      }
      for (let v = 0; v < M.late; v++) {
        const type = wpick(M.w), t0 = rr(0.55, 1.5) * (M.size > 1.2 ? 1.3 : 1);
        add(() => laugher(type, t0, M.size * 0.5), 'bed', rr(0.3, 0.7), rr(0.05, 0.95), rr(2400, 4000), 0);
      }
      M.feat.forEach((type, k) => {
        const t0 = 0.05 + rr(0, 0.16) + k * 0.02;
        add(() => laugher(type, t0, M.size), 'near', rr(1.5, 2.1) * (M.size < 0.7 ? 0.8 : 1), 0.5 + rr(-0.35, 0.35), 0, 0);
      });
    } else if (kind === 'ooh' || kind === 'aww') {
      const ooh = kind === 'ooh';
      for (let v = 0; v < 40; v++) {
        const female = R() < (ooh ? 0.5 : 0.62);
        const f0 = female ? rr(190, 290) : rr(105, 165);
        const t0 = 0.04 + Math.pow(R(), 1.5) * 0.25, d = ooh ? rr(1.3, 1.9) : rr(1.4, 2.0);
        const contour = ooh ? [[0, 0.92], [0.35, 1.12], [0.75, 1], [1, 0.82]] : [[0, 1.18], [0.12, 1.26], [0.6, 0.98], [1, 0.8]];
        add(() => toner(female, f0, ooh ? 'oo' : 'a', ooh ? 'o' : 'aw', ooh ? 0.5 : 0.3, contour, t0, d, {}), v < 4 ? 'near' : 'bed', v < 4 ? rr(1.3, 1.7) : rr(0.4, 1), rr(0.05, 0.95), v < 4 ? 0 : rr(2400, 4200), rr(0, 0.02));
      }
    } else if (kind === 'applause' || kind === 'cheer') {
      const cheer = kind === 'cheer';
      const dur = n / SR;
      for (let c = 0; c < (cheer ? 44 : 60); c++) tasks.push(() => clapper(bL, bR, 0.05, dur, 0.5));
      const shouts = cheer ? 26 : 6;
      for (let v = 0; v < shouts; v++) {
        const female = R() < 0.5, woo = R() < (cheer ? 0.45 : 0.8);
        const f0 = woo ? (female ? rr(400, 620) : rr(220, 330)) : (female ? rr(280, 420) : rr(160, 260));
        const t0 = rr(0.1, cheer ? 1.6 : 2), d = woo ? rr(0.5, 0.9) : rr(0.38, 0.7);
        const contour = woo ? [[0, 0.8], [0.35, 1.3], [1, 1.05]] : [[0, 0.95], [0.3, 1.18], [1, 0.85]];
        add(() => toner(female, f0, woo ? 'oo' : 'ye', woo ? 'o' : 'a', woo ? 0.7 : 0.4, contour, t0, d, { breath: rr(0.25, 0.45), asp: woo ? 0 : 0.02, atk: rr(0.03, 0.06) }), v < 3 ? 'near' : 'bed', v < 3 ? rr(0.9, 1.3) : rr(0.4, 0.9), rr(0.05, 0.95), v < 3 ? 0 : rr(2600, 4400), 0);
      }
      tasks.push(() => { for (let w = 0; w < (cheer ? 2 : 1); w++) whistle(L, Rt, rr(0.4, 2.2), 0.06); });
    }
    let out = null;
    tasks.push(() => {
      if (M) { const sL = bL.slice(), sR = bR.slice(); for (const [rate, delay, gain] of M.copies) addCopy(sL, sR, bL, bR, rate, delay, gain); }
      for (let i = 0; i < n; i++) { L[i] += bL[i]; Rt[i] += bR[i]; }
      out = finish(L, Rt, M ? M.target : TARGET[kind] || 0.1);
    });
    return { tasks, result: () => out };
  }

  function render(kind, sd) {
    const p = plan(kind, sd);
    for (const t of p.tasks) t();
    return p.result();
  }
  return { plan, render, SR };
}
