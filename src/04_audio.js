// ---------------------------------------------------------------------------
// Audio engine (Web Audio API). Everything is synthesized: no audio files.
// ---------------------------------------------------------------------------
const NOTE_IDX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function noteToMidi(n) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(n);
  if (!m) return null;
  let v = NOTE_IDX[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return v + (parseInt(m[3], 10) + 1) * 12;
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

const AudioSys = {
  ctx: null, ok: false, master: null, musicBus: null, sfxBus: null, crowdBus: null,
  noiseBuf: null, ksCache: new Map(), crowd: {}, crowdReady: false, lastCrowd: -9, lastCrowdBuf: null,
  vol: { music: 0.7, sfx: 0.8 }, laughOn: true, duckUntil: 0,

  unlock() {
    if (!this.ctx) {
      try { this.init(); } catch (e) { this.ok = false; return; }
    }
    if (this.ctx && this.ctx.state === 'suspended') { try { this.ctx.resume(); } catch (e) { /* ignore */ } }
  },

  init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = this.ctx = new AC();
    this.ok = true;
    this.master = c.createGain(); this.master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
    this.master.connect(comp); comp.connect(c.destination);
    this.musicBus = c.createGain(); this.musicBus.connect(this.master);
    this.musicDuck = c.createGain(); this.musicDuck.connect(this.musicBus);
    this.sfxBus = c.createGain(); this.sfxBus.connect(this.master);
    this.crowdBus = c.createGain(); this.crowdBus.connect(this.master);
    // a small "studio" room for the audience
    const verb = c.createConvolver();
    verb.buffer = this.makeIR(1.5, 0.38, true);
    const wet = c.createGain(); wet.gain.value = 0.3;
    this.crowdBus.connect(verb); verb.connect(wet); wet.connect(this.master);
    // a little room on the music too
    const mverb = c.createConvolver(); mverb.buffer = this.makeIR(1.1, 0.25);
    const mwet = c.createGain(); mwet.gain.value = 0.12;
    this.musicBus.connect(mverb); mverb.connect(mwet); mwet.connect(this.master);
    // noise
    const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = nb;
    this.applyVolumes();
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      try { if (document.hidden) this.ctx.suspend(); else this.ctx.resume(); } catch (e) { /* ignore */ }
    });
    setInterval(() => Music.update(), 25);
    // synthesize the audience in small chunks so the page stays responsive
    setTimeout(() => this.buildCrowd(), 60);
  },

  applyVolumes() {
    if (!this.ctx) return;
    const s = (typeof Save !== 'undefined' && Save.data) ? Save.data.settings : null;
    if (s) { this.vol.music = s.music / 10; this.vol.sfx = s.sfx / 10; this.laughOn = !!s.laugh; }
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(this.vol.music * 0.55, t, 0.05);
    this.sfxBus.gain.setTargetAtTime(this.vol.sfx * 0.8, t, 0.05);
    this.crowdBus.gain.setTargetAtTime(this.vol.sfx * 0.9, t, 0.05);
  },

  makeIR(dur, decay, dark) {
    const c = this.ctx, sr = c.sampleRate, len = Math.floor(sr * dur);
    const b = c.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        const x = (Math.random() * 2 - 1) * Math.exp(-t / decay) * (t < 0.01 ? t / 0.01 : 1);
        // seats and bodies soak up the highs first, so the tail darkens as it fades
        const k = dark ? Math.max(0.05, Math.exp(-t / (decay * 0.8))) : 1;
        lp += k * (x - lp);
        d[i] = lp;
      }
    }
    return b;
  },

  now() { return this.ctx ? this.ctx.currentTime : 0; },

  // ---- primitive voices -------------------------------------------------------
  osc(type, f, t, dest) {
    const o = this.ctx.createOscillator();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (dest) o.connect(dest);
    return o;
  },

  gain(v, dest) { const g = this.ctx.createGain(); g.gain.value = v; if (dest) g.connect(dest); return g; },

  filt(type, f, q, dest) {
    const b = this.ctx.createBiquadFilter();
    b.type = type; b.frequency.value = f; if (q !== undefined) b.Q.value = q;
    if (dest) b.connect(dest);
    return b;
  },

  noise(t, dur, dest, rate) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf; s.loop = true;
    if (rate) s.playbackRate.value = rate;
    s.connect(dest);
    s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    return s;
  },

  ks(midi, kind) {
    const key = midi + '|' + kind;
    let b = this.ksCache.get(key);
    if (b) return b;
    const c = this.ctx, sr = c.sampleRate;
    const f = mtof(midi);
    const P = {
      gtr: { dur: 2.2, decay: 0.997, bright: 0.55, s: 0.5 },
      jangle: { dur: 2.4, decay: 0.998, bright: 0.85, s: 0.45 },
      bass: { dur: 1.8, decay: 0.9965, bright: 0.35, s: 0.5 },
      slap: { dur: 1.4, decay: 0.995, bright: 0.9, s: 0.5 },
      pizz: { dur: 0.6, decay: 0.985, bright: 0.5, s: 0.5 },
      harp: { dur: 2.6, decay: 0.998, bright: 0.35, s: 0.5 },
    }[kind] || { dur: 1.5, decay: 0.996, bright: 0.5, s: 0.5 };
    const len = Math.floor(sr * P.dur);
    b = c.createBuffer(1, len, sr);
    const out = b.getChannelData(0);
    const N = Math.max(2, Math.round(sr / f - 0.5));
    const line = new Float32Array(N);
    let lp = 0;
    for (let i = 0; i < N; i++) { const n = Math.random() * 2 - 1; lp += P.bright * (n - lp); line[i] = lp; }
    let mean = 0; for (let i = 0; i < N; i++) mean += line[i]; mean /= N;
    for (let i = 0; i < N; i++) line[i] -= mean;
    let idx = 0;
    const s = P.s;
    for (let i = 0; i < len; i++) {
      const a = line[idx], bb = line[(idx + 1) % N];
      out[i] = a;
      line[idx] = P.decay * ((1 - s) * a + s * bb);
      idx = (idx + 1) % N;
    }
    const fade = Math.floor(len * 0.05);
    for (let i = 0; i < fade; i++) out[len - 1 - i] *= i / fade;
    // normalise
    let pk = 0; for (let i = 0; i < Math.min(len, 4000); i++) pk = Math.max(pk, Math.abs(out[i]));
    if (pk > 0) for (let i = 0; i < len; i++) out[i] /= pk;
    this.ksCache.set(key, b);
    return b;
  },

  // ---- instruments --------------------------------------------------------------
  // play an instrument note: time t (ctx seconds), midi, dur (s), vel 0..1, dest
  inst(name, midi, t, dur, vel, dest) {
    if (!this.ok) return;
    const c = this.ctx;
    dest = dest || this.musicDuck;
    vel = vel === undefined ? 0.8 : vel;
    const f = mtof(midi);
    switch (name) {
      case 'gtr': case 'jangle': case 'pizz': case 'harp': {
        const src = c.createBufferSource(); src.buffer = this.ks(midi, name);
        const lpf = this.filt('lowpass', name === 'pizz' ? 2200 : name === 'harp' ? 2600 : 4200, 0.7);
        const g = this.gain(0, dest);
        src.connect(lpf); lpf.connect(g);
        const peak = vel * (name === 'jangle' ? 0.32 : name === 'harp' ? 0.4 : 0.38);
        g.gain.setValueAtTime(peak, t);
        const end = t + Math.max(0.05, dur);
        g.gain.setValueAtTime(peak, end);
        g.gain.linearRampToValueAtTime(0.0001, end + 0.12);
        src.start(t); src.stop(end + 0.15);
        break;
      }
      case 'bass': case 'slap': {
        const src = c.createBufferSource(); src.buffer = this.ks(midi, name);
        const lpf = this.filt('lowpass', name === 'slap' ? 2400 : 900, 1.2);
        if (name === 'slap') { lpf.frequency.setValueAtTime(3600, t); lpf.frequency.exponentialRampToValueAtTime(700, t + 0.25); }
        const g = this.gain(0, dest);
        src.connect(lpf); lpf.connect(g);
        const subg = this.gain(0, g);
        const sub = this.osc('sine', f, t, subg);
        subg.gain.setValueAtTime(0.5, t); subg.gain.setTargetAtTime(0.0001, t + 0.05, 0.25);
        const peak = vel * 0.75;
        g.gain.setValueAtTime(peak, t);
        const end = t + Math.max(0.06, dur * 0.95);
        g.gain.setValueAtTime(peak, end);
        g.gain.linearRampToValueAtTime(0.0001, end + 0.06);
        src.start(t); src.stop(end + 0.1); sub.start(t); sub.stop(end + 0.1);
        break;
      }
      case 'ep': {
        const g = this.gain(0, dest);
        const car = this.osc('sine', f, t, g);
        const mod = c.createOscillator(); mod.frequency.value = f;
        const mg = c.createGain();
        mg.gain.setValueAtTime(f * 1.6 * vel, t); mg.gain.setTargetAtTime(f * 0.12, t, 0.18);
        mod.connect(mg); mg.connect(car.frequency);
        const bg = this.gain(0, g);
        const bell = this.osc('sine', f * 4.01, t, bg);
        bg.gain.setValueAtTime(0.18 * vel, t); bg.gain.setTargetAtTime(0.0001, t, 0.06);
        const peak = vel * 0.3;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + 0.006);
        g.gain.setTargetAtTime(peak * 0.35, t + 0.01, 0.6);
        const end = t + dur;
        g.gain.setTargetAtTime(0.0001, end, 0.12);
        [car, mod, bell].forEach(o => { o.start(t); o.stop(end + 0.6); });
        break;
      }
      case 'organ': {
        const g = this.gain(0, dest);
        const parts = [[1, 0.5], [2, 0.3], [3, 0.16], [4, 0.08]];
        const lfo = c.createOscillator(); lfo.frequency.value = 6;
        const lg = c.createGain(); lg.gain.value = f * 0.004; lfo.connect(lg);
        const os = parts.map(([m, a]) => {
          const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * m;
          lg.connect(o.frequency);
          const og = c.createGain(); og.gain.value = a; o.connect(og); og.connect(g);
          return o;
        });
        const peak = vel * 0.22;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + 0.012);
        const end = t + dur;
        g.gain.setValueAtTime(peak, end); g.gain.linearRampToValueAtTime(0.0001, end + 0.06);
        os.concat([lfo]).forEach(o => { o.start(t); o.stop(end + 0.1); });
        break;
      }
      case 'lead': case 'square': case 'whistle': case 'saw': case 'keytar': case 'flute': {
        const g = this.gain(0, dest);
        const type = name === 'whistle' || name === 'flute' ? 'sine' : name === 'saw' || name === 'keytar' ? 'sawtooth' : 'square';
        const lpf = this.filt('lowpass', name === 'keytar' ? 2600 : name === 'lead' ? 2400 : 3500, 0.8, g);
        if (name === 'keytar') { lpf.frequency.setValueAtTime(4200, t); lpf.frequency.exponentialRampToValueAtTime(1300, t + 0.25); lpf.Q.value = 3; }
        const o1 = this.osc(type, f, t, lpf);
        let o2 = null;
        if (name === 'saw' || name === 'keytar') { o2 = this.osc(type, f * 1.006, t, lpf); }
        const lfo = c.createOscillator(); lfo.frequency.value = name === 'whistle' ? 5.2 : 5.6;
        const lg = c.createGain(); lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * (name === 'whistle' ? 0.012 : 0.007), t + 0.25);
        lfo.connect(lg); lg.connect(o1.frequency); if (o2) lg.connect(o2.frequency);
        let breath = null;
        if (name === 'flute' || name === 'whistle') {
          const nb = this.filt('bandpass', f * 2, 2, g); const ng = c.createGain(); ng.gain.value = 0.05; ng.connect(nb);
          breath = this.noise(t, dur + 0.1, ng);
        }
        const peak = vel * (type === 'sine' ? 0.32 : type === 'square' ? 0.12 : 0.13);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + (name === 'flute' ? 0.04 : 0.012));
        g.gain.setTargetAtTime(peak * 0.75, t + 0.03, 0.2);
        const end = t + Math.max(0.04, dur * 0.92);
        g.gain.setValueAtTime(peak * 0.75, end); g.gain.linearRampToValueAtTime(0.0001, end + 0.05);
        [o1, o2, lfo].forEach(o => { if (o) { o.start(t); o.stop(end + 0.08); } });
        break;
      }
      case 'brass': {
        const g = this.gain(0, dest);
        const lpf = this.filt('lowpass', 600, 1.5, g);
        lpf.frequency.setValueAtTime(500, t); lpf.frequency.linearRampToValueAtTime(2600, t + 0.05); lpf.frequency.setTargetAtTime(1500, t + 0.06, 0.15);
        const o1 = this.osc('sawtooth', f, t, lpf), o2 = this.osc('sawtooth', f * 0.995, t, lpf), o3 = this.osc('sawtooth', f * 1.004, t, lpf);
        const peak = vel * 0.09;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + 0.03);
        const end = t + Math.max(0.05, dur * 0.9);
        g.gain.setValueAtTime(peak, end); g.gain.linearRampToValueAtTime(0.0001, end + 0.07);
        [o1, o2, o3].forEach(o => { o.start(t); o.stop(end + 0.1); });
        break;
      }
      case 'clav': {
        const g = this.gain(0, dest);
        const bp = this.filt('bandpass', 1400, 1.8, g);
        const hp = this.filt('highpass', 250, 0.7, bp);
        const o = this.osc('square', f, t, hp);
        const o2 = this.osc('sawtooth', f * 2, t, hp);
        const peak = vel * 0.28;
        g.gain.setValueAtTime(peak, t); g.gain.setTargetAtTime(0.0001, t + 0.01, Math.min(0.12, dur * 0.5));
        const end = t + dur;
        o.start(t); o.stop(end + 0.2); o2.start(t); o2.stop(end + 0.2);
        break;
      }
      case 'glock': case 'bell': case 'vib': case 'celesta': case 'steel': {
        const g = this.gain(0, dest);
        const parts = name === 'glock' ? [[1, 0.6], [2.76, 0.25], [5.4, 0.12]]
          : name === 'bell' ? [[1, 0.5], [2.0, 0.3], [3.01, 0.2], [4.2, 0.1]]
            : name === 'steel' ? [[1, 0.6], [2, 0.25], [3.02, 0.15]]
              : name === 'celesta' ? [[1, 0.6], [2, 0.18], [4, 0.08]] : [[1, 0.7], [4, 0.15]];
        const decay = name === 'glock' ? 0.5 : name === 'bell' ? 1.2 : name === 'steel' ? 0.35 : name === 'celesta' ? 0.45 : 0.9;
        const os = parts.map(([m, a], i) => {
          const o = this.osc('sine', f * m, t, null);
          const og = c.createGain(); og.gain.setValueAtTime(a, t); og.gain.setTargetAtTime(0.0001, t, decay / (1 + i * 0.8));
          o.connect(og); og.connect(g); return o;
        });
        if (name === 'vib') {
          const lfo = c.createOscillator(); lfo.frequency.value = 5.5;
          const lg = c.createGain(); lg.gain.value = 0.25; lfo.connect(lg); lg.connect(g.gain);
          lfo.start(t); lfo.stop(t + dur + 1.5);
        }
        const peak = vel * (name === 'vib' ? 0.26 : 0.3);
        g.gain.setValueAtTime(peak, t);
        const end = t + Math.max(dur, decay * 2);
        g.gain.setTargetAtTime(0.0001, t + dur + 0.2, 0.2);
        os.forEach(o => { o.start(t); o.stop(end + 0.4); });
        break;
      }
      // ---- drums ----
      case 'kick': {
        const g = this.gain(0, dest);
        const o = this.osc('sine', 150, t, g);
        o.frequency.exponentialRampToValueAtTime(42, t + 0.11);
        g.gain.setValueAtTime(vel * 0.95, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        o.start(t); o.stop(t + 0.35);
        const cg = this.gain(0, dest); const hp = this.filt('highpass', 2500, 0.7, cg);
        cg.gain.setValueAtTime(vel * 0.2, t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
        this.noise(t, 0.02, hp);
        break;
      }
      case 'snare': {
        const g = this.gain(0, dest); const hp = this.filt('highpass', 1200, 0.7, g);
        g.gain.setValueAtTime(vel * 0.42, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
        this.noise(t, 0.2, hp);
        const tg = this.gain(0, dest); const o = this.osc('triangle', 190, t, tg);
        o.frequency.exponentialRampToValueAtTime(150, t + 0.08);
        tg.gain.setValueAtTime(vel * 0.4, t); tg.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        o.start(t); o.stop(t + 0.1);
        break;
      }
      case 'hat': case 'ohat': {
        const g = this.gain(0, dest); const hp = this.filt('highpass', 7500, 0.7, g);
        const d = name === 'ohat' ? 0.28 : 0.045;
        g.gain.setValueAtTime(vel * 0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
        this.noise(t, d + 0.02, hp);
        break;
      }
      case 'clap': {
        const g = this.gain(0, dest); const bp = this.filt('bandpass', 1150, 1.1, g);
        g.gain.setValueAtTime(0.0001, t);
        [0, 0.011, 0.022].forEach(o => { g.gain.setValueAtTime(vel * 0.5, t + o); g.gain.exponentialRampToValueAtTime(vel * 0.1, t + o + 0.009); });
        g.gain.setValueAtTime(vel * 0.45, t + 0.033); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        this.noise(t, 0.18, bp);
        break;
      }
      case 'rim': case 'block': {
        const g = this.gain(0, dest);
        const o = this.osc(name === 'rim' ? 'triangle' : 'sine', name === 'rim' ? 1700 : 950, t, g);
        g.gain.setValueAtTime(vel * 0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + (name === 'rim' ? 0.035 : 0.06));
        o.start(t); o.stop(t + 0.08);
        break;
      }
      case 'shaker': case 'tamb': {
        const g = this.gain(0, dest); const bp = this.filt(name === 'tamb' ? 'highpass' : 'bandpass', name === 'tamb' ? 7000 : 6000, 1.5, g);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel * (name === 'tamb' ? 0.22 : 0.12), t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.001, t + (name === 'tamb' ? 0.14 : 0.07));
        this.noise(t, 0.16, bp);
        break;
      }
      case 'crash': {
        const g = this.gain(0, dest); const hp = this.filt('highpass', 4500, 0.6, g);
        g.gain.setValueAtTime(vel * 0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
        this.noise(t, 1.7, hp, 0.9);
        break;
      }
      case 'tom': {
        const g = this.gain(0, dest); const o = this.osc('sine', f || 140, t, g);
        o.frequency.exponentialRampToValueAtTime((f || 140) * 0.6, t + 0.25);
        g.gain.setValueAtTime(vel * 0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.start(t); o.stop(t + 0.32);
        break;
      }
      case 'brush': {
        const g = this.gain(0, dest); const bp = this.filt('bandpass', 3200, 0.8, g);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel * 0.16, t + 0.03); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        this.noise(t, 0.22, bp);
        break;
      }
      case 'sleigh': {
        const g = this.gain(0, dest); const hp = this.filt('highpass', 6000, 1, g);
        g.gain.setValueAtTime(0.0001, t);
        for (let i = 0; i < 4; i++) { const o = t + i * 0.022; g.gain.linearRampToValueAtTime(vel * 0.16, o + 0.005); g.gain.exponentialRampToValueAtTime(vel * 0.02, o + 0.02); }
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        this.noise(t, 0.22, hp, 1.3);
        break;
      }
      case 'cowbell': {
        const g = this.gain(0, dest); const bp = this.filt('bandpass', 800, 3, g);
        const o1 = this.osc('square', 545, t, bp), o2 = this.osc('square', 815, t, bp);
        g.gain.setValueAtTime(vel * 0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o1.start(t); o1.stop(t + 0.32); o2.start(t); o2.stop(t + 0.32);
        break;
      }
      case 'snap': {
        const g = this.gain(0, dest); const bp = this.filt('bandpass', 2600, 2, g);
        g.gain.setValueAtTime(vel * 0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        this.noise(t, 0.05, bp);
        break;
      }
      default: break;
    }
  },

  // ---- sound effects ---------------------------------------------------------------
  tone(o) {
    // {type, f0, f1, dur, vol, attack, t, dest, curve:'exp'|'lin', q, filter}
    if (!this.ok) return;
    const c = this.ctx, t = o.t || c.currentTime;
    const g = this.gain(0, o.dest || this.sfxBus);
    let tail = g;
    if (o.filter) { tail = this.filt(o.filter, o.ff || 2000, o.q || 1, g); }
    const osc = this.osc(o.type || 'square', o.f0, t, tail);
    if (o.f1 !== undefined) {
      if (o.curve === 'lin') osc.frequency.linearRampToValueAtTime(o.f1, t + o.dur);
      else osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t + o.dur);
    }
    if (o.vib) {
      const l = c.createOscillator(); l.frequency.value = o.vib; const lg = c.createGain(); lg.gain.value = o.vibAmt || o.f0 * 0.05;
      l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + o.dur + 0.05);
    }
    const v = (o.vol || 0.3);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + (o.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0008, t + o.dur);
    osc.start(t); osc.stop(t + o.dur + 0.02);
  },
  nz(o) {
    // {dur, vol, f0, f1, type, q, t, attack}
    if (!this.ok) return;
    const c = this.ctx, t = o.t || c.currentTime;
    const g = this.gain(0, o.dest || this.sfxBus);
    const f = this.filt(o.type || 'bandpass', o.f0 || 1000, o.q || 1, g);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.vol || 0.3, t + (o.attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0008, t + o.dur);
    this.noise(t, o.dur + 0.02, f, o.rate);
  },

  sfx(name, opt) {
    if (!this.ok) return;
    const c = this.ctx, t = c.currentTime;
    opt = opt || {};
    const S = this;
    switch (name) {
      case 'jump': S.tone({ type: 'square', f0: 260, f1: 520, dur: 0.1, vol: 0.06, filter: 'lowpass', ff: 1800 }); break;
      case 'djump':
        S.nz({ dur: 0.22, vol: 0.12, f0: 600, f1: 3000, q: 2 });
        S.tone({ type: 'triangle', f0: 500, f1: 1200, dur: 0.16, vol: 0.08 }); break;
      case 'land': S.nz({ dur: 0.06, vol: 0.12, f0: 300, type: 'lowpass' }); break;
      case 'thud':
        S.tone({ type: 'sine', f0: 120, f1: 45, dur: 0.25, vol: 0.4 });
        S.nz({ dur: 0.15, vol: 0.25, f0: 400, type: 'lowpass' }); break;
      case 'push': S.nz({ dur: 0.18, vol: 0.06, f0: 250, f1: 180, type: 'lowpass', q: 0.7 }); break;
      case 'grunt': S.tone({ type: 'sawtooth', f0: 120, f1: 90, dur: 0.18, vol: 0.12, filter: 'bandpass', ff: 600, q: 3 }); break;
      case 'climb': S.nz({ dur: 0.04, vol: 0.06, f0: 1800, q: 3 }); break;
      case 'clink':
        S.tone({ type: 'sine', f0: 2600 + rnd(400), dur: 0.12, vol: 0.12 });
        S.tone({ type: 'sine', f0: 3900 + rnd(400), dur: 0.08, vol: 0.06 }); break;
      case 'spark':
        for (let i = 0; i < 4; i++) S.nz({ t: t + i * 0.03 + rnd(0.02), dur: 0.03, vol: 0.12, f0: 3000 + rnd(3000), q: 4 });
        break;
      case 'zap':
        S.tone({ type: 'sawtooth', f0: 70, dur: 0.4, vol: 0.18, filter: 'lowpass', ff: 1200, vib: 30, vibAmt: 25 });
        S.nz({ dur: 0.4, vol: 0.12, f0: 4000, q: 1 }); break;
      case 'fixed':
        [72, 76, 79, 84].forEach((m, i) => S.inst('glock', m, t + i * 0.06, 0.2, 0.7, S.sfxBus));
        break;
      case 'lever':
        S.nz({ dur: 0.07, vol: 0.2, f0: 900, q: 2 });
        S.tone({ type: 'square', f0: 140, f1: 90, dur: 0.12, vol: 0.12, filter: 'lowpass', ff: 600 }); break;
      case 'door':
        S.nz({ dur: 0.45, vol: 0.12, f0: 500, f1: 1400, q: 1.5 }); break;
      case 'creak':
        S.tone({ type: 'sawtooth', f0: 220, f1: 330, dur: 0.5, vol: 0.06, filter: 'bandpass', ff: 900, q: 6, vib: 18, vibAmt: 20, curve: 'lin' }); break;
      case 'gate':
        for (let i = 0; i < 5; i++) S.nz({ t: t + i * 0.07, dur: 0.06, vol: 0.12, f0: 2200, q: 6 });
        break;
      case 'magic':
        S.nz({ dur: 0.35, vol: 0.25, f0: 1200, f1: 200, type: 'lowpass' });
        [88, 91, 95, 100].forEach((m, i) => S.inst('celesta', m, t + 0.05 + i * 0.05, 0.15, 0.5, S.sfxBus));
        break;
      case 'poof': S.nz({ dur: 0.3, vol: 0.22, f0: 1500, f1: 250, type: 'lowpass' }); break;
      case 'cup':
        S.tone({ type: 'square', f0: 1319, dur: 0.07, vol: 0.06, filter: 'lowpass', ff: 5000 });
        S.tone({ type: 'square', f0: 1976, dur: 0.16, vol: 0.06, t: t + 0.06, filter: 'lowpass', ff: 5000 });
        break;
      case 'mug':
        [72, 76, 79, 84, 88, 91].forEach((m, i) => S.inst('glock', m, t + i * 0.07, 0.3, 0.8, S.sfxBus));
        S.inst('bell', 96, t + 0.45, 0.8, 0.6, S.sfxBus);
        break;
      case 'checkpoint':
        S.nz({ dur: 0.12, vol: 0.14, f0: 3000, f1: 1500, q: 1 });
        S.tone({ type: 'triangle', f0: 880, dur: 0.12, vol: 0.1, t: t + 0.08 }); break;
      case 'slide':
        S.tone({ type: 'sine', f0: 1400, f1: 260, dur: 0.75, vol: 0.2, vib: 9, vibAmt: 30 }); break;
      case 'slideup':
        S.tone({ type: 'sine', f0: 300, f1: 1500, dur: 0.5, vol: 0.18, vib: 9, vibAmt: 25 }); break;
      case 'boing':
        S.tone({ type: 'sine', f0: 180, f1: 520, dur: 0.3, vol: 0.25, vib: 22, vibAmt: 60 }); break;
      case 'spring':
        S.tone({ type: 'triangle', f0: 200, f1: 900, dur: 0.25, vol: 0.2, vib: 25, vibAmt: 50 }); break;
      case 'snap':
        S.nz({ dur: 0.05, vol: 0.4, f0: 3000, q: 1 });
        S.tone({ type: 'square', f0: 900, f1: 300, dur: 0.06, vol: 0.12 }); break;
      case 'ow': S.tone({ type: 'sawtooth', f0: 420, f1: 260, dur: 0.3, vol: 0.12, filter: 'bandpass', ff: 900, q: 4 }); break;
      case 'splash':
        S.nz({ dur: 0.4, vol: 0.3, f0: 2500, f1: 500, q: 0.8 });
        for (let i = 0; i < 5; i++) S.tone({ type: 'sine', f0: 900 + rnd(900), f1: 1800 + rnd(600), dur: 0.06, vol: 0.05, t: t + 0.1 + rnd(0.3) });
        break;
      case 'whistle':
        S.tone({ type: 'sine', f0: 2700, dur: 0.18, vol: 0.18, vib: 40, vibAmt: 120 });
        S.tone({ type: 'sine', f0: 2700, dur: 0.4, vol: 0.18, vib: 40, vibAmt: 120, t: t + 0.22 }); break;
      case 'crash':
        S.nz({ dur: 0.6, vol: 0.35, f0: 3000, f1: 800, q: 0.5 });
        S.tone({ type: 'sine', f0: 100, f1: 40, dur: 0.3, vol: 0.35 }); break;
      case 'pop': S.tone({ type: 'sine', f0: 400, f1: 900, dur: 0.08, vol: 0.18 }); break;
      case 'clack':
        S.nz({ dur: 0.05, vol: 0.4, f0: 1800, q: 1.5 });
        S.tone({ type: 'square', f0: 300, f1: 200, dur: 0.05, vol: 0.12 }); break;
      case 'select': S.tone({ type: 'square', f0: 660, dur: 0.05, vol: 0.06, filter: 'lowpass', ff: 3000 }); break;
      case 'move': S.tone({ type: 'square', f0: 440, dur: 0.03, vol: 0.04, filter: 'lowpass', ff: 2500 }); break;
      case 'confirm':
        S.tone({ type: 'square', f0: 660, dur: 0.06, vol: 0.06, filter: 'lowpass', ff: 3000 });
        S.tone({ type: 'square', f0: 990, dur: 0.1, vol: 0.06, t: t + 0.06, filter: 'lowpass', ff: 3000 }); break;
      case 'back': S.tone({ type: 'square', f0: 440, f1: 300, dur: 0.08, vol: 0.06, filter: 'lowpass', ff: 2000 }); break;
      case 'deny':
        S.tone({ type: 'square', f0: 180, dur: 0.08, vol: 0.08, filter: 'lowpass', ff: 1200 });
        S.tone({ type: 'square', f0: 150, dur: 0.12, vol: 0.08, t: t + 0.09, filter: 'lowpass', ff: 1200 }); break;
      case 'swap': S.nz({ dur: 0.12, vol: 0.08, f0: 800, f1: 2500, q: 2 }); break;
      case 'elevator':
        S.tone({ type: 'sine', f0: 1046, dur: 0.6, vol: 0.12 });
        S.tone({ type: 'sine', f0: 1318, dur: 0.6, vol: 0.08, t: t + 0.02 }); break;
      case 'hum': S.tone({ type: 'sawtooth', f0: 60, dur: 0.6, vol: 0.06, filter: 'lowpass', ff: 300 }); break;
      case 'robot':
        for (let i = 0; i < 3; i++) S.tone({ type: 'square', f0: 600 + rndi(0, 4) * 200, dur: 0.05, vol: 0.05, t: t + i * 0.07 }); break;
      case 'squeak': S.tone({ type: 'sine', f0: 1800, f1: 2400, dur: 0.08, vol: 0.08 }); break;
      case 'coo':
        S.tone({ type: 'sine', f0: 420, f1: 380, dur: 0.25, vol: 0.08, vib: 12, vibAmt: 25 });
        S.tone({ type: 'sine', f0: 400, f1: 360, dur: 0.3, vol: 0.08, vib: 12, vibAmt: 25, t: t + 0.3 }); break;
      case 'flutter':
        for (let i = 0; i < 8; i++) S.nz({ t: t + i * 0.035, dur: 0.03, vol: 0.08, f0: 1200, q: 1 }); break;
      case 'steam': S.nz({ dur: 0.8, vol: 0.12, f0: 5000, type: 'highpass', attack: 0.1 }); break;
      case 'ding': S.inst('bell', 88, t, 0.4, 0.5, S.sfxBus); break;
      case 'rip': S.nz({ dur: 0.15, vol: 0.15, f0: 2500, f1: 4000, q: 0.7 }); break;
      case 'type': S.tone({ type: 'square', f0: 1500 + rnd(300), dur: 0.015, vol: 0.03 }); break;
      case 'shutter':
        for (let i = 0; i < 6; i++) S.nz({ t: t + i * 0.05, dur: 0.05, vol: 0.1, f0: 900, q: 3 }); break;
      case 'tvon':
        S.tone({ type: 'sine', f0: 15000, dur: 0.4, vol: 0.02 });
        S.nz({ dur: 0.5, vol: 0.12, f0: 3000, q: 0.5 }); break;
      case 'caught':
        S.sfx('whistle'); break;
      case 'yay':
        [76, 79, 84].forEach((m, i) => S.inst('glock', m, t + i * 0.05, 0.2, 0.6, S.sfxBus)); break;
      case 'claps': // two quick hand claps
        S.inst('clap', 60, t, 0.1, 1, S.sfxBus); S.inst('clap', 60, t + 0.22, 0.1, 1, S.sfxBus); break;
      case 'powerdown':
        S.tone({ type: 'sawtooth', f0: 220, f1: 40, dur: 0.7, vol: 0.12, filter: 'lowpass', ff: 900 });
        S.nz({ dur: 0.25, vol: 0.12, f0: 2000, f1: 200, type: 'bandpass', q: 1 }); break;
      case 'powerup':
        S.tone({ type: 'sawtooth', f0: 50, f1: 240, dur: 0.6, vol: 0.1, filter: 'lowpass', ff: 1200 });
        [60, 67, 72].forEach((m, i) => S.inst('glock', m + 12, t + 0.35 + i * 0.07, 0.2, 0.5, S.sfxBus)); break;
      default: break;
    }
  },

  // tiny talking blips, per character voice
  blip(voice) {
    if (!this.ok) return;
    const V = VOICES[voice] || VOICES.npc;
    const t = this.ctx.currentTime;
    let f = V.f * (1 + (Math.random() - 0.5) * V.var);
    if (V.scale) f = mtof(V.scale[rndi(0, V.scale.length - 1)]);
    this.tone({ type: V.type, f0: f, f1: f * (V.slide || 0.92), dur: V.dur, vol: V.vol, filter: 'bandpass', ff: V.ff || f * 2.5, q: 1.2, t });
  },

  // ---- studio audience ---------------------------------------------------------------
  // CrowdSynth (04_crowd.js) renders the reactions in a Worker when the page allows one,
  // otherwise here in small slices between frames. The most-used reactions come first.
  buildCrowd() {
    const jobs = [['chuckle', 1], ['laugh', 2], ['applause', 3], ['chuckle', 4], ['laugh', 5], ['big', 6], ['aww', 7],
      ['cheer', 8], ['ooh', 9], ['chuckle', 10], ['laugh', 11], ['big', 12], ['aww', 13], ['applause', 14]];
    const done = new Set();
    const add = (kind, seed, L, R, sr) => {
      if (done.has(seed)) return;
      done.add(seed);
      try {
        const b = this.ctx.createBuffer(2, L.length, sr);
        b.getChannelData(0).set(L); b.getChannelData(1).set(R);
        (this.crowd[kind] = this.crowd[kind] || []).push(b);
      } catch (e) { /* audience is a nicety */ }
      if (done.size === jobs.length) this.crowdReady = true;
    };
    const local = () => this.buildCrowdLocal(jobs.filter(j => !done.has(j[1])), add);
    let w = null;
    try {
      const code = 'const CS=(' + CrowdSynth.toString() + ')();onmessage=function(e){var d=e.data,r=CS.render(d.kind,d.seed);' +
        'postMessage({kind:d.kind,seed:d.seed,L:r.L,R:r.R,sr:r.sr},[r.L.buffer,r.R.buffer]);};';
      w = new Worker(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));
    } catch (e) { w = null; }
    if (!w) { local(); return; }
    let fellBack = false;
    const fallback = () => { if (fellBack) return; fellBack = true; try { w.terminate(); } catch (e) { /* ignore */ } local(); };
    w.onmessage = e => {
      const d = e.data;
      add(d.kind, d.seed, d.L, d.R, d.sr);
      if (done.size === jobs.length) { try { w.terminate(); } catch (err) { /* ignore */ } }
    };
    w.onerror = fallback;
    w.onmessageerror = fallback;
    for (const j of jobs) w.postMessage({ kind: j[0], seed: j[1] });
    // a worker that is silently blocked never answers: render here instead
    setTimeout(() => { if (!done.size) fallback(); }, 6000);
  },

  buildCrowdLocal(jobs, add) {
    const CS = CrowdSynth();
    let job = null, p = null, k = 0;
    const step = () => {
      const t0 = performance.now();
      while (performance.now() - t0 < 6) {
        if (!p) { job = jobs.shift(); if (!job) return; p = CS.plan(job[0], job[1]); k = 0; }
        if (k < p.tasks.length) p.tasks[k++]();
        else { const r = p.result(); add(job[0], job[1], r.L, r.R, r.sr); p = null; }
      }
      setTimeout(step, 0);
    };
    step();
  },

  // kind: chuckle | laugh | big | ooh | aww | applause | cheer
  audience(kind, vol) {
    if (!this.ok || !this.laughOn) return;
    const list = this.crowd[kind];
    if (!list || !list.length) return;
    const c = this.ctx, t = c.currentTime;
    // a chuckle stacked on another reaction sounds like a stutter, not a crowd
    if (kind === 'chuckle' && t - this.lastCrowd < 0.9) return;
    this.lastCrowd = t;
    let b = pick(list);
    if (list.length > 1 && b === this.lastCrowdBuf) b = list[(list.indexOf(b) + 1) % list.length];
    this.lastCrowdBuf = b;
    const src = c.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = rnd(0.96, 1.04);
    const g = this.gain(vol === undefined ? 0.85 : vol, this.crowdBus);
    src.connect(g); src.start(t);
    // duck music under the audience
    const dur = b.duration;
    const dg = this.musicDuck.gain;
    dg.cancelScheduledValues(t); dg.setTargetAtTime(0.45, t, 0.08); dg.setTargetAtTime(1, t + dur * 0.6, 0.4);
  },
};

const VOICES = {
  dex: { f: 115, var: 0.15, type: 'sawtooth', dur: 0.06, vol: 0.07, ff: 500 },
  mila: { f: 330, var: 0.25, type: 'square', dur: 0.04, vol: 0.05, ff: 1200 },
  theo: { f: 210, var: 0.2, type: 'square', dur: 0.05, vol: 0.05, ff: 900 },
  priya: { f: 300, var: 0.3, type: 'triangle', dur: 0.035, vol: 0.09 },
  benny: { f: 420, var: 0.3, type: 'square', dur: 0.04, vol: 0.045, ff: 1500 },
  juno: { f: 300, var: 0, type: 'triangle', dur: 0.06, vol: 0.09, scale: [67, 69, 71, 74, 76, 79], slide: 1 },
  gus: { f: 90, var: 0.1, type: 'sawtooth', dur: 0.07, vol: 0.07, ff: 400 },
  holloway: { f: 190, var: 0.1, type: 'square', dur: 0.05, vol: 0.05, ff: 1600 },
  roz: { f: 280, var: 0.35, type: 'triangle', dur: 0.07, vol: 0.09, slide: 1.05 },
  npc: { f: 200, var: 0.25, type: 'triangle', dur: 0.05, vol: 0.08 },
  sarge: { f: 900, var: 0.2, type: 'sine', dur: 0.04, vol: 0.06, slide: 1.3 },
  robot: { f: 600, var: 0.4, type: 'square', dur: 0.04, vol: 0.04, slide: 1 },
  announcer: { f: 98, var: 0.06, type: 'sawtooth', dur: 0.06, vol: 0.065, ff: 620, slide: 0.97 },
  pitch: { f: 170, var: 0.3, type: 'square', dur: 0.045, vol: 0.05, ff: 1100, slide: 1.04 },
};
