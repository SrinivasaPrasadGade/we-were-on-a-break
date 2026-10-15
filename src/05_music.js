// ---------------------------------------------------------------------------
// Music: chord-aware pattern sequencer + original songs
// ---------------------------------------------------------------------------
const QUALITIES = {
  '': [0, 4, 7], 'm': [0, 3, 7], '7': [0, 4, 7, 10], 'maj7': [0, 4, 7, 11], 'm7': [0, 3, 7, 10], 'dim': [0, 3, 6],
  'dim7': [0, 3, 6, 9], 'sus4': [0, 5, 7], 'sus2': [0, 2, 7], '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9], 'add9': [0, 4, 7, 14],
  '9': [0, 4, 7, 10, 14], 'aug': [0, 4, 8], 'm7b5': [0, 3, 6, 10], '7sus4': [0, 5, 7, 10], 'maj9': [0, 4, 7, 11, 14], 'm9': [0, 3, 7, 10, 14],
  '5': [0, 7],
};
function parseChord(sym) {
  const m = /^([A-G])(#|b)?([^/]*)(?:\/([A-G])(#|b)?)?$/.exec(sym);
  if (!m) return { root: 0, iv: [0, 4, 7], bass: 0 };
  const pc = (l, acc) => (NOTE_IDX[l] + (acc === '#' ? 1 : acc === 'b' ? -1 : 0) + 12) % 12;
  const root = pc(m[1], m[2]);
  const iv = QUALITIES[m[3]] || QUALITIES[''];
  const bass = m[4] ? pc(m[4], m[5]) : root;
  return { root, iv, bass };
}
function voiceChord(ch, center) {
  const notes = ch.iv.map(i => {
    const pcv = (ch.root + i) % 12;
    let n = center - ((center - pcv) % 12 + 12) % 12; // highest <= center with that pc
    if (center - n > 6) n += 12;
    return n;
  });
  notes.sort((a, b) => a - b);
  return notes;
}
function bassNote(ch, center) {
  const c = center || 40;
  let n = c - ((c - ch.bass) % 12 + 12) % 12;
  if (c - n > 6) n += 12;
  return n;
}

const BASS_PATS = {
  slap: 'R..R..O.F.RO..r.', funk: 'R.rR..O..R.rF.O.', root8: 'R.R.R.R.R.R.R.R.', rootq: 'R...R...R...R...',
  reggae: 'R.....R.F.....R.', half: 'R.......F.......', disco: 'R.O.R.O.R.O.R.O.', gallop: 'R.RR.RR.R.RR.RR.',
  sneak: 'R..R....F..R....', boom: 'R...F...R...F...', drive: 'RRRRRRRRRRRRRRRR', whole: 'R...............',
};
const COMP_PATS = {
  strum: 'D.D.UDU.D.D.UDU.', strum4: 'D...D...D...D...', jangle: '0.1.2.1.3.2.1.2.', arp16: '0123210101232101',
  skank: '..x...x...x...x.', comp: '..x..x....x..x..', push: 'x..x..x...x..x..', stab: 'x.....x.........',
  pad: 'P...............', pad2: 'P.......P.......', block: 'x...x...x...x...', arp8: '0.1.2.3.2.1.0.1.',
  charleston: 'x..x....x..x....', offbeat: '..x...x...x...x.', rest: '................',
};
const DRUM_PATS = {
  pop: { kick: 'x.......x.x.....', snare: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.' },
  funk: { kick: 'x..x..x...x..x..', snare: '....x..g.g..x..g', hat: 'xoxoxoxoxoxoxoxo' },
  rock: { kick: 'x.....x.x.......', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.' },
  fast: { kick: 'x...x.x.x...x.x.', snare: '....x.......x...', hat: 'xoxoxoxoxoxoxoxo' },
  disco: { kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'o.o.o.o.o.o.o.o.', ohat: '..x...x...x...x.' },
  ska: { kick: 'x.......x.......', snare: '....x.......x...', hat: '..x...x...x...x.', shaker: 'o.o.o.o.o.o.o.o.' },
  sneak: { kick: 'x.....x.........', rim: '....x.......x...', shaker: 'o.o.o.o.o.o.o.o.' },
  brush: { kick: 'x.......x.......', brush: 'x...x...x...x...', hat: '..o...o...o...o.' },
  sleigh: { kick: 'x.......x.......', snare: '....x.......x...', sleigh: 'x.o.x.o.x.o.x.o.' },
  spooky: { kick: 'x.......x.......', block: '..o...o...o..o.o', shaker: '....o.......o...' },
  swing: { kick: 'x.......x.......', snare: '....g.......g...', hat: 'x...x..ox...x..o', brush: '....x.......x...' },
  half: { kick: 'x.........x.....', snare: '........x.......', hat: 'x.o.x.o.x.o.x.o.' },
  clapper: { kick: 'x.......x.x.....', snare: '....x.......x...', clap: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.', tamb: '..o...o...o...o.' },
  none: {},
};
const DRUM_VOICE = { kick: 'kick', snare: 'snare', hat: 'hat', ohat: 'ohat', rim: 'rim', shaker: 'shaker', brush: 'brush', sleigh: 'sleigh', block: 'block', clap: 'clap', tamb: 'tamb', crash: 'crash', cowbell: 'cowbell' };

// Compile a song definition into a sorted list of note events (time in beats)
function compileSong(def) {
  const bars = def.chords.length;
  const ev = [];
  const s8 = def.swing || 0, s16 = def.swing16 || 0;
  const stepTime = (bar, st) => bar * 4 + st * 0.25 + (st % 4 === 2 ? s8 / 6 : 0) + (st % 2 === 1 ? s16 / 12 : 0);
  const chordsOf = bar => String(def.chords[bar]).split(' ').map(parseChord);
  const chordAt = (bar, st) => { const cs = chordsOf(bar); return cs[Math.min(cs.length - 1, Math.floor(st / (16 / cs.length)))]; };
  const active = (p, bar) => {
    if (p.from !== undefined && bar < p.from) return false;
    if (p.to !== undefined && bar > p.to) return false;
    if (p.mask) return p.mask[bar % p.mask.length] !== '.';
    return true;
  };
  for (const p of def.parts) {
    const vol = p.vol === undefined ? 0.8 : p.vol;
    if (p.mel) {
      let open = null;
      const close = endT => { if (open) { open.d = Math.max(0.05, endT - open.t); ev.push(open); open = null; } };
      for (let bar = 0; bar < bars; bar++) {
        const str = p.mel[bar % p.mel.length];
        if (!active(p, bar) || str === undefined || str === null) { close(bar * 4); continue; }
        const toks = str.trim().split(/\s+/);
        const n = toks.length, stepBeats = 4 / n;
        toks.forEach((tk, i) => {
          const tStraight = bar * 4 + i * stepBeats;
          const st = Math.round(i * (16 / n));
          const t = stepTime(bar, st);
          if (tk === '.') return;
          close(t);
          if (tk === '-') return;
          const midi = noteToMidi(tk);
          if (midi === null) return;
          open = { t, d: stepBeats, inst: p.inst, m: midi + (p.oct || 0) * 12, v: vol * (p.accent && i % 2 === 0 ? 1 : 0.88) };
          void tStraight;
        });
      }
      close(bars * 4);
      if (p.double) {
        // copy all events of this part an interval away (harmony / octave)
        const mine = ev.filter(e => e.inst === p.inst && !e.dbl);
        for (const e of mine) ev.push({ ...e, m: e.m + p.double, v: e.v * 0.6, dbl: true, inst: p.doubleInst || p.inst });
      }
      continue;
    }
    if (p.bass) {
      for (let bar = 0; bar < bars; bar++) {
        if (!active(p, bar)) continue;
        const pat = BASS_PATS[p.bass] || BASS_PATS.root8;
        if (p.bass === 'walk') continue;
        for (let st = 0; st < 16; st++) {
          const c = pat[st];
          if (c === '.') continue;
          let len = 1; while (st + len < 16 && pat[st + len] === '.') len++;
          const ch = chordAt(bar, st);
          let m = bassNote(ch, p.center || 40);
          let v = vol;
          if (c === 'O') m += 12;
          else if (c === 'F') m += 7;
          else if (c === 'T') m += ch.iv[1];
          else if (c === 'r') v *= 0.55;
          const t = stepTime(bar, st);
          ev.push({ t, d: Math.min(len, p.legato ? len : 3) * 0.25 * 0.9, inst: p.inst || 'bass', m, v });
        }
      }
      continue;
    }
    if (p.walk) {
      for (let bar = 0; bar < bars; bar++) {
        if (!active(p, bar)) continue;
        const cs = chordsOf(bar);
        const next = chordsOf((bar + 1) % bars)[0];
        for (let q = 0; q < 4; q++) {
          const ch = cs[Math.min(cs.length - 1, Math.floor(q / (4 / cs.length)))];
          const root = bassNote(ch, p.center || 38);
          let m;
          if (q === 0) m = root;
          else if (q === 1) m = root + ch.iv[1];
          else if (q === 2) m = root + 7;
          else { const nr = bassNote(next, p.center || 38); m = nr + (Math.random() < 0.5 ? -1 : 1); }
          const t = stepTime(bar, q * 4);
          ev.push({ t, d: 0.9, inst: p.inst || 'bass', m, v: vol * (q === 0 ? 1 : 0.85) });
        }
      }
      continue;
    }
    if (p.comp) {
      const pat = COMP_PATS[p.comp] || COMP_PATS.block;
      for (let bar = 0; bar < bars; bar++) {
        if (!active(p, bar)) continue;
        for (let st = 0; st < 16; st++) {
          const c = pat[st];
          if (c === '.') continue;
          let len = 1; while (st + len < 16 && pat[st + len] === '.') len++;
          const ch = chordAt(bar, st);
          const notes = voiceChord(ch, p.center || 62);
          const t = stepTime(bar, st);
          if (c === 'D' || c === 'U') {
            const ns = c === 'D' ? notes : notes.slice().reverse();
            const all = c === 'D' ? [bassNote(ch, 52)].concat(ns) : ns;
            all.forEach((m, k) => ev.push({ t: t + k * 0.03, d: len * 0.25 * 0.95, inst: p.inst, m, v: vol * (c === 'D' ? 0.9 : 0.6) }));
          } else if (c === 'x') {
            notes.forEach(m => ev.push({ t, d: (p.len || 0.7) * 0.25, inst: p.inst, m, v: vol }));
          } else if (c === 'P') {
            notes.forEach(m => ev.push({ t, d: len * 0.25 * 0.98, inst: p.inst, m, v: vol }));
          } else if (/\d/.test(c)) {
            const k = parseInt(c, 10);
            const ext = notes.concat(notes.map(x => x + 12));
            ev.push({ t, d: Math.min(len, 2) * 0.25 * 1.4, inst: p.inst, m: ext[k % ext.length], v: vol });
          }
        }
      }
      continue;
    }
    if (p.drums) {
      for (let bar = 0; bar < bars; bar++) {
        if (!active(p, bar)) continue;
        const pat = DRUM_PATS[p.drums] || DRUM_PATS.pop;
        const fillBar = p.fill && ((bar + 1) % (p.fill) === 0) && bar !== bars - 1;
        for (const vname in pat) {
          const s = pat[vname];
          for (let st = 0; st < 16; st++) {
            if (fillBar && st >= 12 && (vname === 'snare' || vname === 'hat')) continue;
            const c = s[st];
            if (!c || c === '.') continue;
            const v = vol * (c === 'x' ? 1 : c === 'o' ? 0.65 : 0.32);
            ev.push({ t: stepTime(bar, st), d: 0.1, inst: DRUM_VOICE[vname], m: 60, v });
          }
        }
        if (fillBar) {
          [12, 13, 14, 15].forEach((st, k) => ev.push({ t: stepTime(bar, st), d: 0.1, inst: k < 2 ? 'tom' : 'snare', m: k < 2 ? 50 - k * 4 : 60, v: vol * (0.6 + k * 0.12) }));
        }
        if (p.crash && (bar % p.crash === 0)) ev.push({ t: bar * 4, d: 1, inst: 'crash', m: 60, v: vol * 0.8 });
      }
      continue;
    }
    if (p.hits) {
      // explicit list of [beat, inst, midi, dur, vel]
      for (const h of p.hits) ev.push({ t: h[0], inst: h[1], m: h[2] || 60, d: h[3] || 0.25, v: (h[4] || 1) * vol });
    }
  }
  ev.sort((a, b) => a.t - b.t);
  return { events: ev, bars, beats: bars * 4, bpm: def.bpm, loop: def.loop !== false, loopBeat: (def.loopBar || 0) * 4 };
}

const Music = {
  cur: null, name: null, cache: {},
  play(name, opts) {
    opts = opts || {};
    if (!SONGS[name]) return;
    this.wanted = name;
    if (!AudioSys.ok) return;
    if (this.name === name && this.cur && !opts.restart) return;
    this.stop(opts.crossfade !== undefined ? opts.crossfade : 0.4);
    const song = this.cache[name] || (this.cache[name] = compileSong(SONGS[name]));
    const bus = AudioSys.gain(0, AudioSys.musicDuck);
    const t = AudioSys.now() + 0.06;
    const vol = SONGS[name].vol || 1;
    bus.gain.setValueAtTime(0.0001, t);
    bus.gain.linearRampToValueAtTime(vol, t + (opts.fadeIn || 0.03));
    this.cur = { song, bus, start: t, offset: 0, cursor: 0, onEnd: opts.onEnd, endAt: null };
    this.name = name;
    this.update();
  },
  stop(fade) {
    if (!this.cur) { this.name = null; return; }
    const c = this.cur; this.cur = null; this.name = null;
    if (!AudioSys.ok) return;
    const t = AudioSys.now();
    try {
      c.bus.gain.cancelScheduledValues(t);
      c.bus.gain.setValueAtTime(c.bus.gain.value, t);
      c.bus.gain.linearRampToValueAtTime(0.0001, t + (fade || 0.05));
    } catch (e) { /* ignore */ }
    setTimeout(() => { try { c.bus.disconnect(); } catch (e) { /* ignore */ } }, (fade || 0.05) * 1000 + 2500);
  },
  update() {
    const c = this.cur;
    if (!c || !AudioSys.ok) return;
    const spb = 60 / c.song.bpm;
    const now = AudioSys.now(), ahead = now + 0.15;
    const evs = c.song.events;
    for (let guard = 0; guard < 400; guard++) {
      if (c.cursor >= evs.length) {
        if (c.song.loop) {
          c.offset += (c.song.beats - c.song.loopBeat) * spb;
          c.cursor = evs.findIndex(e => e.t >= c.song.loopBeat);
          if (c.cursor < 0) c.cursor = 0;
          continue;
        }
        if (!c.endAt) {
          c.endAt = c.start + c.offset + c.song.beats * spb;
        }
        if (now >= c.endAt) {
          const cb = c.onEnd; this.cur = null; this.name = null;
          setTimeout(() => { try { c.bus.disconnect(); } catch (e) { /* ignore */ } }, 3000);
          if (cb) cb();
        }
        return;
      }
      const e = evs[c.cursor];
      const t = c.start + c.offset + e.t * spb;
      if (t > ahead) break;
      if (t >= now - 0.03) AudioSys.inst(e.inst, e.m, t, e.d * spb, e.v, c.bus);
      c.cursor++;
    }
  },
  // play a one-off sequence on the SFX bus (no interruption of the current song)
  oneShot(name, vol) {
    if (!AudioSys.ok || !SONGS[name]) return 0;
    const song = this.cache[name] || (this.cache[name] = compileSong(SONGS[name]));
    const spb = 60 / song.bpm;
    const t0 = AudioSys.now() + 0.03;
    const g = AudioSys.gain(vol || 1, AudioSys.sfxBus);
    for (const e of song.events) AudioSys.inst(e.inst, e.m, t0 + e.t * spb, e.d * spb, e.v, g);
    setTimeout(() => { try { g.disconnect(); } catch (er) { /* ignore */ } }, song.beats * spb * 1000 + 3000);
    return song.beats * spb;
  },
  // play explicit notes [[beatOffset, midi, durBeats], ...] with an instrument
  notes(list, inst, bpm, vol, dest) {
    if (!AudioSys.ok) return;
    const spb = 60 / (bpm || 120), t0 = AudioSys.now() + 0.02;
    for (const n of list) AudioSys.inst(inst, n[1], t0 + n[0] * spb, (n[2] || 0.5) * spb, (vol || 0.8) * (n[3] || 1), dest || AudioSys.sfxBus);
  },
};

// Juno's improvised jingles: a melody generated from the lyric's syllable count
function playJingle(text, seed) {
  if (!AudioSys.ok) return 3;
  const R = mulberry32(seed || text.length * 31 + 7);
  const words = text.replace(/[^a-zA-Z ']/g, ' ').split(/\s+/).filter(Boolean);
  let syl = 0;
  for (const w of words) syl += Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) || []).length);
  syl = clamp(syl, 6, 22);
  const scale = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79];
  let idx = 4 + Math.floor(R() * 3);
  const notes = [];
  let beat = 0;
  for (let i = 0; i < syl; i++) {
    const last = i === syl - 1;
    if (last) idx = 7;
    else if (i === syl - 2) idx = R() < 0.5 ? 8 : 6;
    else { idx += Math.floor(R() * 5) - 2; idx = clamp(idx, 2, 10); }
    const dur = last ? 1.5 : (i % 4 === 3 ? 1 : 0.5);
    notes.push([beat, scale[idx], dur * 0.9]);
    beat += dur;
  }
  const bpm = 150, spb = 60 / bpm;
  Music.notes(notes, 'keytar', bpm, 0.8);
  // simple I-IV-V-I chord bed
  const chords = [[48, 52, 55], [53, 57, 60], [55, 59, 62], [48, 52, 55, 60]];
  const span = beat;
  const cl = [];
  for (let k = 0; k < 4; k++) chords[k].forEach(m => cl.push([k * span / 4, m, span / 4 * 0.95]));
  Music.notes(cl, 'ep', bpm, 0.55);
  Music.notes([[0, 36, span / 2], [span / 2, 43, span / 2]], 'bass', bpm, 0.6);
  return span * spb + 0.4;
}

// ---------------------------------------------------------------------------
// Songs (all original)
// ---------------------------------------------------------------------------
const THEME = {
  intro: { chords: ['D', 'G'], mel: ['A5 . F#5 . A5 B5 A5 F#5', 'G5 . B5 . D6 . B5 .'] },
  verse: {
    chords: ['D', 'Bm', 'G', 'A', 'D', 'Bm', 'Em', 'A'],
    mel: ['A4 D5 F#5 . E5 D5 E5 .', 'F#5 . D5 . B4 . . .', 'B4 D5 G5 . F#5 E5 D5 .', 'E5 . . . C#5 . A4 .',
      'A4 D5 F#5 . E5 D5 E5 .', 'F#5 . A5 . B5 . . .', 'G5 . F#5 . E5 . D5 .', 'E5 . . . . . - -'],
  },
  chorus: {
    chords: ['G', 'A', 'F#m', 'Bm', 'G', 'A', 'D', 'D'],
    mel: ['- B5 D6 . D6 . B5 .', 'C#6 . . . A5 . . .', '- A5 C#6 . C#6 . A5 .', 'B5 . . . F#5 . . .',
      '- B5 D6 . D6 . E6 .', 'F#6 . E6 . C#6 . A5 .', 'D6 . . . . . . .', '- - A5 . B5 . C#6 .'],
  },
  outro: {
    chords: ['G', 'A', 'Bb', 'C', 'D'],
    mel: ['D6 . B5 . G5 . B5 .', 'E6 . C#6 . A5 . C#6 .', 'F6 . D6 . Bb5 . D6 .', 'G6 . E6 . C6 . E6 .', 'A5 D6 F#6 . . . . .'],
  },
};
function sectionsSong(order, extra) {
  const chords = [], mel = [], marks = {};
  for (const name of order) {
    const s = THEME[name];
    marks[name] = marks[name] || [];
    marks[name].push(chords.length);
    chords.push(...s.chords); mel.push(...s.mel);
  }
  return Object.assign({ chords, mel, marks }, extra || {});
}

function themeSong(order, opts) {
  const S = sectionsSong(order);
  const n = S.chords.length;
  const mask = (want) => S.chords.map((_, i) => {
    let sec = null;
    for (const k in S.marks) for (const st of S.marks[k]) if (i >= st && i < st + THEME[k].chords.length) sec = k;
    return want.includes(sec) ? 'x' : '.';
  }).join('');
  const parts = [
    { inst: 'keytar', vol: 0.55, mel: S.mel, mask: mask(['verse', 'chorus', 'outro', 'intro']) },
    { inst: 'gtr', vol: 0.5, mel: S.mel, oct: 0, mask: mask(['chorus', 'outro']) },
    { comp: 'jangle', inst: 'jangle', vol: 0.55, center: 64, mask: mask(['intro', 'verse']) },
    { comp: 'strum', inst: 'jangle', vol: 0.5, center: 62, mask: mask(['chorus', 'outro']) },
    { bass: 'slap', inst: 'slap', vol: 0.75, mask: mask(['verse', 'chorus', 'outro']) },
    { bass: 'whole', inst: 'bass', vol: 0.6, mask: mask(['intro']) },
    { drums: 'pop', vol: 0.7, fill: 8, crash: 8, mask: mask(['verse']) },
    { drums: 'clapper', vol: 0.7, fill: 8, crash: 4, mask: mask(['chorus', 'outro']) },
    { comp: 'pad', inst: 'organ', vol: 0.35, center: 62, mask: mask(['chorus']) },
    { comp: 'stab', inst: 'brass', vol: 0.55, center: 65, mask: mask(['outro']) },
  ];
  // final chord
  const last = n - 1;
  parts.push({ hits: [[last * 4, 'crash', 60, 2, 1], [last * 4, 'kick', 60, 0.2, 1]], vol: 0.8 });
  return Object.assign({ bpm: 136, chords: S.chords, parts }, opts || {});
}

const SONGS = {
  theme: themeSong(['intro', 'verse', 'chorus', 'outro'], { loop: false }),
  title: themeSong(['intro', 'verse', 'chorus'], { loopBar: 2, vol: 0.8 }),
  credits: themeSong(['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro'], { loop: false }),
  minicredits: (() => { const s = themeSong(['chorus'], { loop: false }); return s; })(),
  finale: Object.assign(themeSong(['verse', 'chorus'], { bpm: 142, vol: 0.85 }), {}),

  hub: {
    bpm: 80, swing: 0.6, vol: 0.85,
    chords: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7', 'Bbmaj7', 'Am7', 'Gm7', 'C7', 'Fmaj7', 'Em7', 'Dm7', 'Cmaj7', 'Bbmaj7', 'Am7', 'Gm7', 'C7'],
    parts: [
      { inst: 'vib', vol: 0.7, mel: ['- - A5 . C6 . A5 .', 'G5 . . . . . - -', '- - F5 . A5 . C6 .', 'B5 . . . G5 . . .', '- - D6 . C6 . A5 .', 'C6 . . . E5 . . .', '- F5 G5 . Bb5 . A5 .', 'G5 . . . . . - -',
        'C6 . A5 . G5 . A5 .', 'B5 . G5 . E5 . . .', 'D6 . C6 . A5 . F5 .', 'E5 . G5 . . . - -', 'F5 . A5 . D6 . . .', 'C6 . B5 . A5 . G5 .', 'F5 . . . D5 . F5 .', 'E5 . . . . . - -'] },
      { comp: 'comp', inst: 'ep', vol: 0.55, center: 60, len: 1.6 },
      { walk: true, inst: 'bass', vol: 0.6, center: 38 },
      { drums: 'brush', vol: 0.5 },
    ],
  },

  funk: {
    bpm: 108, swing16: 0.25,
    chords: ['Em7', 'Em7', 'A7', 'A7', 'Em7', 'Em7', 'C7', 'B7', 'Am7', 'Am7', 'D7', 'D7', 'Em7', 'Em7', 'C7', 'B7'],
    parts: [
      { inst: 'keytar', vol: 0.5, mel: ['E5 . G5 A5 . G5 E5 .', 'D5 . E5 . - - - -', 'C#5 . E5 G5 . E5 C#5 .', 'A4 . B4 . - - - -', 'E5 . G5 A5 . G5 E5 .', 'B5 . A5 . G5 . E5 .', 'G5 . E5 . C5 . Bb4 .', 'B4 . D#5 . F#5 . A5 .',
        'A5 . G5 . E5 . G5 A5', 'C6 . A5 . - - - -', 'F#5 . A5 . C6 . A5 .', 'D6 . . . - - - -', 'B5 . G5 . E5 . D5 .', 'E5 . . . G5 . A5 .', 'Bb5 . G5 . E5 . C5 .', 'D#5 . F#5 . A5 . B5 .'] },
      { comp: 'push', inst: 'clav', vol: 0.55, center: 60 },
      { bass: 'funk', inst: 'slap', vol: 0.75 },
      { drums: 'funk', vol: 0.65, fill: 8 },
      { comp: 'stab', inst: 'brass', vol: 0.45, center: 64, mask: '..x...x...x...x.' },
    ],
  },

  sneaky: {
    bpm: 118,
    chords: ['Am', 'Am', 'Dm', 'E7', 'Am', 'F', 'E7', 'Am', 'F', 'F', 'Am', 'Am', 'Dm', 'E7', 'Am', 'E7'],
    parts: [
      { inst: 'pizz', vol: 0.8, mel: ['A4 - C5 - E5 - C5 -', 'A4 - B4 - C5 - B4 -', 'D5 - F5 - A5 - F5 -', 'G#4 - B4 - D5 - - -', 'A4 - C5 - E5 - A5 -', 'F5 - E5 - D5 - C5 -', 'B4 - G#4 - E4 - G#4 -', 'A4 . . . - - - -',
        'C5 - F5 - A5 - F5 -', 'C5 - D5 - E5 - F5 -', 'E5 - - - C5 - A4 -', 'B4 - C5 - D5 - E5 -', 'F5 - E5 - D5 - A4 -', 'G#4 - B4 - E5 - D5 -', 'C5 - B4 - A4 - E4 -', 'G#4 - - - B4 - - -'] },
      { inst: 'flute', vol: 0.35, oct: 1, mel: [null, null, null, null, 'A4 . . . E5 . . .', 'F5 . . . C5 . . .', 'B4 . . . G#4 . . .', 'A4 . . . . . . .'], mask: '....xxxx........' },
      { bass: 'sneak', inst: 'pizz', vol: 0.9, center: 45 },
      { drums: 'sneak', vol: 0.7 },
      { comp: 'offbeat', inst: 'clav', vol: 0.25, center: 62 },
    ],
  },

  panic: {
    bpm: 152,
    chords: ['G', 'G', 'C', 'C', 'D', 'C', 'G', 'D', 'Em', 'C', 'G', 'D', 'Em', 'C', 'A', 'D'],
    parts: [
      { inst: 'saw', vol: 0.45, mel: ['G5 . B5 . D6 . B5 .', 'G5 A5 B5 . A5 . G5 .', 'E5 . G5 . C6 . G5 .', 'E5 F#5 G5 . E5 . C5 .', 'F#5 . A5 . D6 . A5 .', 'E6 . D6 . C6 . A5 .', 'B5 . A5 . G5 . D5 .', 'F#5 . . . A5 . . .',
        'E5 . G5 . B5 . G5 .', 'C6 . B5 . G5 . E5 .', 'D5 . G5 . B5 . D6 .', 'C#6 . D6 . A5 . F#5 .', 'G5 . F#5 . E5 . B4 .', 'C5 . E5 . G5 . C6 .', 'C#6 . . . A5 . E5 .', 'F#5 . . . D5 . - -'] },
      { inst: 'gtr', vol: 0.4, mel: ['G5 . B5 . D6 . B5 .'], mask: '.' },
      { comp: 'strum', inst: 'jangle', vol: 0.45, center: 60 },
      { bass: 'gallop', inst: 'bass', vol: 0.7 },
      { drums: 'fast', vol: 0.62, fill: 8, crash: 8 },
    ],
  },

  lightsout: {
    bpm: 96,
    chords: ['Dm', 'Dm', 'Bb', 'A7', 'Dm', 'Gm', 'A7', 'Dm', 'Gm', 'Gm', 'Dm', 'Dm', 'Bb', 'C', 'A7', 'A7'],
    parts: [
      { inst: 'celesta', vol: 0.75, mel: ['D5 . F5 . A5 . . .', 'G#5 . A5 . F5 . . .', 'Bb5 . A5 . F5 . D5 .', 'C#5 . E5 . G5 . . .', 'D5 . F5 . A5 . D6 .', 'Bb5 . A5 . G5 . D5 .', 'E5 . C#5 . A4 . C#5 .', 'D5 . . . - - - -',
        'G5 . Bb5 . D6 . Bb5 .', 'A5 . G5 . D5 . . .', 'F5 . E5 . D5 . A4 .', 'C#5 . D5 . - - - -', 'D5 . F5 . Bb5 . F5 .', 'E5 . G5 . C6 . G5 .', 'A5 . G5 . E5 . C#5 .', 'E5 . . . A4 . . .'] },
      { comp: 'pad2', inst: 'organ', vol: 0.4, center: 57 },
      { bass: 'boom', inst: 'pizz', vol: 0.9, center: 45 },
      { drums: 'spooky', vol: 0.6 },
    ],
  },

  sunny: {
    bpm: 116,
    chords: ['C', 'F', 'G', 'C', 'Am', 'F', 'G', 'G', 'F', 'G', 'Em', 'Am', 'F', 'G', 'C', 'C'],
    parts: [
      { inst: 'steel', vol: 0.75, mel: ['E5 . G5 . C6 . G5 .', 'A5 . . . F5 . A5 .', 'B5 . D6 . B5 . G5 .', 'C6 . . . - - - -', 'C6 . B5 . A5 . E5 .', 'F5 . A5 . C6 . A5 .', 'G5 . B5 . D6 . F6 .', 'E6 . D6 . B5 . G5 .',
        'A5 . C6 . A5 . F5 .', 'B5 . D6 . B5 . G5 .', 'G5 . B5 . E6 . B5 .', 'C6 . . . A5 . . .', 'F5 . A5 . C6 . D6 .', 'D6 . B5 . G5 . B5 .', 'C6 . . . G5 . E5 .', 'C5 . . . - - - -'] },
      { comp: 'skank', inst: 'gtr', vol: 0.45, center: 64, len: 0.6 },
      { bass: 'boom', inst: 'bass', vol: 0.75, center: 40 },
      { drums: 'ska', vol: 0.65, fill: 8 },
      { comp: 'stab', inst: 'brass', vol: 0.4, center: 64, mask: 'x...x...' },
    ],
  },

  wedding: {
    bpm: 144, swing: 0.7,
    chords: ['F', 'D7', 'G7', 'C7', 'F', 'D7', 'Gm7 C7', 'F', 'Bb', 'Bdim7', 'F/C', 'D7', 'G7', 'C7', 'F', 'C7'],
    parts: [
      { inst: 'brass', vol: 0.7, mel: ['C5 . F5 . A5 . C6 .', 'A5 . F#5 . D5 . C5 .', 'B4 . D5 . F5 . G5 .', 'E5 . . . Bb4 . . .', 'C5 . F5 . A5 . F6 .', 'D6 . C6 . A5 . F#5 .', 'G5 . Bb5 . E5 . G5 .', 'F5 . . . - - - -',
        'D5 . F5 . Bb5 . D6 .', 'D6 . B5 . Ab5 . F5 .', 'C6 . A5 . F5 . C5 .', 'F#5 . A5 . C6 . D6 .', 'B5 . . . G5 . F5 .', 'E5 . G5 . Bb5 . G5 .', 'A5 . . . F5 . C5 .', 'E5 . G5 . Bb5 . C6 .'] },
      { comp: 'charleston', inst: 'ep', vol: 0.5, center: 62, len: 1.2 },
      { walk: true, inst: 'bass', vol: 0.65, center: 38 },
      { drums: 'swing', vol: 0.6 },
    ],
  },

  rush: {
    bpm: 130,
    chords: ['Am', 'G', 'F', 'E', 'Am', 'G', 'F', 'E7', 'Dm', 'Dm', 'Am', 'Am', 'F', 'G', 'E', 'E7'],
    parts: [
      { inst: 'lead', vol: 0.55, mel: ['A5 . . . E5 . A5 .', 'B5 . . . G5 . D5 .', 'C6 . . . A5 . F5 .', 'G#5 . . . B5 . . .', 'A5 . C6 . E6 . C6 .', 'D6 . B5 . G5 . B5 .', 'C6 . A5 . F5 . A5 .', 'G#5 . E5 . D5 . B4 .',
        'D6 . . . A5 . F5 .', 'D5 . F5 . A5 . D6 .', 'C6 . . . A5 . E5 .', 'A4 . C5 . E5 . A5 .', 'C6 . A5 . F5 . C6 .', 'D6 . B5 . G5 . D6 .', 'E6 . . . B5 . G#5 .', 'E5 . G#5 . B5 . D6 .'] },
      { comp: 'arp16', inst: 'saw', vol: 0.22, center: 60 },
      { bass: 'drive', inst: 'bass', vol: 0.55 },
      { drums: 'rock', vol: 0.65, fill: 8, crash: 8 },
    ],
  },

  snow: {
    bpm: 100,
    chords: ['G', 'Em', 'C', 'D', 'G', 'Em', 'Am7 D7', 'G', 'C', 'D', 'Bm', 'Em', 'C', 'D', 'G', 'G'],
    parts: [
      { inst: 'glock', vol: 0.75, mel: ['D5 . G5 . B5 . . .', 'B5 . A5 . G5 . E5 .', 'E5 . G5 . C6 . . .', 'A5 . . . F#5 . . .', 'D5 . G5 . B5 . D6 .', 'E6 . D6 . B5 . G5 .', 'C6 . A5 . A5 . F#5 .', 'G5 . . . - - - -',
        'E5 . G5 . C6 . E6 .', 'D6 . . . A5 . F#5 .', 'D6 . B5 . F#5 . B5 .', 'G5 . . . E5 . . .', 'G5 . E5 . C5 . E5 .', 'F#5 . A5 . D6 . C6 .', 'B5 . . . G5 . D5 .', 'G5 . . . - - - -'] },
      { comp: 'comp', inst: 'ep', vol: 0.45, center: 60, len: 1.4 },
      { bass: 'boom', inst: 'bass', vol: 0.6, center: 40 },
      { drums: 'sleigh', vol: 0.55 },
      { inst: 'flute', vol: 0.3, oct: -1, mel: ['B5 . . . . . . .', 'G5 . . . . . . .', 'G5 . . . . . . .', 'F#5 . . . . . . .'], from: 8 },
    ],
  },

  snoop: { // spy jazz for sneaking past landlords
    bpm: 126, swing: 0.6,
    chords: ['Cm7', 'Cm7', 'Fm7', 'Fm7', 'Cm7', 'Cm7', 'Ab7', 'G7', 'Cm7', 'Cm7', 'Fm7', 'Bb7', 'Ebmaj7', 'Ab7', 'Dm7b5 G7', 'Cm7'],
    parts: [
      { inst: 'gtr', vol: 0.62, mel: ['G4 . C5 . Eb5 . D5 C5', 'Bb4 . G4 . - - - -', 'Ab4 . C5 . F5 . Eb5 C5', 'Eb5 . . . - - - -', 'G5 . G5 F5 Eb5 . D5 .', 'C5 . Bb4 . G4 . - -', 'Ab4 . C5 . Eb5 . Gb5 .', 'F5 . . . D5 . B4 .',
        'C5 . . Eb5 - G5 . .', 'F#5 G5 . . Eb5 . C5 .', 'Ab5 . F5 . C5 . Ab4 .', 'D5 . F5 . Ab5 . F5 .', 'G5 . . . Bb5 . G5 .', 'Gb5 . Eb5 . C5 . Ab4 .', 'F5 . D5 . B4 . G4 .', 'C5 . . . - - - -'] },
      { inst: 'vib', vol: 0.3, oct: 1, from: 8, mel: [null, null, null, null, null, null, null, null, 'C5 . . Eb5 - G5 . .', 'F#5 G5 . . Eb5 . C5 .', 'Ab5 . F5 . C5 . Ab4 .', 'D5 . F5 . Ab5 . F5 .', 'G5 . . . Bb5 . G5 .', 'Gb5 . Eb5 . C5 . Ab4 .', 'F5 . D5 . B4 . G4 .', 'C5 . . . - - - -'] },
      { comp: 'comp', inst: 'ep', vol: 0.42, center: 60, len: 1.2 },
      { walk: true, inst: 'bass', vol: 0.62, center: 38 },
      { drums: 'swing', vol: 0.55 },
    ],
  },

  magic: { // vaudeville bounce for the Great Bennini
    bpm: 150,
    chords: ['F', 'C7', 'C7', 'F', 'F', 'Bb', 'C7', 'F', 'F7', 'Bb', 'Bbm', 'F', 'D7', 'G7', 'C7', 'F'],
    parts: [
      { inst: 'organ', vol: 0.5, mel: ['C5 . A4 . C5 . F5 .', 'E5 . D5 . C5 . Bb4 .', 'G4 . Bb4 . E5 . G5 .', 'F5 . . . - - C5 C#5', 'D5 . C5 . A4 . F4 .', 'Bb4 . D5 . F5 . Bb5 .', 'A5 . G5 . E5 . C5 .', 'F5 . . . - - - -',
        'Eb5 . . . C5 . A4 .', 'D5 . F5 . Bb5 . . .', 'Db5 . F5 . Bb5 . Ab5 .', 'A5 . F5 . C5 . A4 .', 'F#5 . A5 . C6 . A5 .', 'B5 . G5 . D5 . F5 .', 'E5 . G5 . Bb5 . E5 .', 'F5 . . . F4 . - -'] },
      { inst: 'glock', vol: 0.35, oct: 1, mask: '....xxxx....xxxx', mel: ['C5 . A4 . C5 . F5 .', 'E5 . D5 . C5 . Bb4 .', 'G4 . Bb4 . E5 . G5 .', 'F5 . . . - - C5 C#5', 'D5 . C5 . A4 . F4 .', 'Bb4 . D5 . F5 . Bb5 .', 'A5 . G5 . E5 . C5 .', 'F5 . . . - - - -',
        'Eb5 . . . C5 . A4 .', 'D5 . F5 . Bb5 . . .', 'Db5 . F5 . Bb5 . Ab5 .', 'A5 . F5 . C5 . A4 .', 'F#5 . A5 . C6 . A5 .', 'B5 . G5 . D5 . F5 .', 'E5 . G5 . Bb5 . E5 .', 'F5 . . . F4 . - -'] },
      { comp: 'offbeat', inst: 'organ', vol: 0.32, center: 60 },
      { bass: 'boom', inst: 'bass', vol: 0.75, center: 38 },
      { drums: 'ska', vol: 0.5 },
    ],
  },

  subway: { // breakbeat funk under the city
    bpm: 112, swing16: 0.3,
    chords: ['Dm9', 'Dm9', 'G9', 'G9', 'Dm9', 'Dm9', 'Bbmaj7', 'A7', 'Dm9', 'Dm9', 'G9', 'G9', 'Bbmaj7', 'C9', 'A7', 'A7'],
    parts: [
      { inst: 'keytar', vol: 0.48, mel: ['D5 . F5 . A5 . G5 F5', 'E5 . D5 . - - A4 C5', 'D5 . E5 . F5 . A5 .', 'G5 . . . - - - -', 'A5 . C6 . A5 . G5 F5', 'E5 F5 E5 D5 . . - -', 'D5 . F5 . A5 . C6 .', 'C#6 . . . A5 . - -',
        'F5 . . . E5 . D5 .', 'C5 . D5 . - - - -', 'B4 . D5 . F5 . A5 .', 'G5 . F5 . E5 . D5 .', 'D5 . F5 . A5 . D6 .', 'E6 . D6 . C6 . Bb5 .', 'A5 . . . C#6 . E6 .', 'D6 . . . - - - -'] },
      { comp: 'push', inst: 'clav', vol: 0.5, center: 60 },
      { bass: 'funk', inst: 'slap', vol: 0.75 },
      { drums: 'funk', vol: 0.65, fill: 8 },
      { comp: 'stab', inst: 'brass', vol: 0.38, center: 64, mask: '...x...x' },
    ],
  },

  expo: { // shiny synth-pop for the invention expo
    bpm: 124,
    chords: ['A', 'E', 'F#m', 'D', 'A', 'E', 'D', 'E', 'F#m', 'D', 'A', 'E', 'F#m', 'D', 'Bm7', 'E'],
    parts: [
      { inst: 'square', vol: 0.4, mel: ['E5 . A5 . C#6 . B5 .', 'G#5 . . . E5 . . .', 'F#5 . A5 . C#6 . E6 .', 'D6 . . . A5 . . .', 'C#6 . B5 . A5 . E5 .', 'B5 . G#5 . E5 . B4 .', 'D5 . F#5 . A5 . D6 .', 'E6 . . . - - - -',
        'C#6 . . . A5 . F#5 .', 'D6 . . . F#5 . A5 .', 'E6 . C#6 . A5 . E5 .', 'G#5 . B5 . E6 . . .', 'F#6 . E6 . C#6 . A5 .', 'D6 . C#6 . A5 . F#5 .', 'D6 . . . F#5 . B5 .', 'G#5 . . . B5 . E6 .'] },
      { comp: 'arp16', inst: 'saw', vol: 0.18, center: 60 },
      { bass: 'disco', inst: 'bass', vol: 0.62, center: 40 },
      { drums: 'disco', vol: 0.55, fill: 8 },
      { comp: 'pad2', inst: 'organ', vol: 0.2, center: 64 },
    ],
  },

  // ----- stings, bumpers, fanfares -----
  sting_title: {
    bpm: 136, loop: false, vol: 1,
    chords: ['D', 'D'],
    parts: [
      { inst: 'keytar', vol: 0.6, mel: ['A4 D5 F#5 A5 D6 . . .', '. . . . - - - -'] },
      { inst: 'gtr', vol: 0.5, mel: ['A4 D5 F#5 A5 D6 . . .', '. . . . - - - -'] },
      { hits: [[0, 'slap', 38, 0.5, 1], [0.5, 'slap', 50, 0.25, 0.8], [2, 'slap', 38, 2, 1], [2, 'crash', 60, 2, 1], [2, 'kick', 60, 0.2, 1],
        [2, 'jangle', 50, 3, 0.8], [2.03, 'jangle', 57, 3, 0.8], [2.06, 'jangle', 62, 3, 0.8], [2.09, 'jangle', 66, 3, 0.8], [2.12, 'jangle', 69, 3, 0.8],
        [0, 'snare', 60, 0.1, 0.5], [0.5, 'snare', 60, 0.1, 0.6], [1, 'snare', 60, 0.1, 0.7], [1.5, 'snare', 60, 0.1, 0.8]], vol: 0.9 },
    ],
  },
  sting_freeze: {
    bpm: 120, loop: false,
    chords: ['G'],
    parts: [{
      hits: [[0, 'slap', 31, 0.4, 1], [0, 'crash', 60, 2, 0.8], [0, 'kick', 60, 0.2, 1], [0, 'snare', 60, 0.2, 0.8],
        [0, 'jangle', 55, 1.5, 0.9], [0.02, 'jangle', 59, 1.5, 0.9], [0.04, 'jangle', 62, 1.5, 0.9], [0.06, 'jangle', 67, 1.5, 0.9],
        [0.75, 'slap', 38, 0.25, 0.8], [1, 'slap', 43, 1.5, 1], [1, 'brass', 67, 1.5, 0.7], [1, 'brass', 71, 1.5, 0.7], [1, 'brass', 74, 1.5, 0.7]], vol: 0.9,
    }],
  },
  bumper1: { bpm: 118, loop: false, chords: ['E', 'E'], parts: [{ inst: 'slap', vol: 0.95, mel: ['E2 - E3 - - G2 A2 - B2 - D3 E3 - - - -', 'E3 . . . - - - -'] }, { drums: 'funk', vol: 0.5, to: 0 }, { hits: [[4, 'jangle', 64, 1.5, 0.8], [4.03, 'jangle', 68, 1.5, 0.8], [4.06, 'jangle', 71, 1.5, 0.8], [4.09, 'jangle', 74, 1.5, 0.8], [4, 'crash', 60, 1, 0.6]], vol: 0.8 }] },
  bumper2: { bpm: 122, loop: false, chords: ['A', 'A'], parts: [{ inst: 'slap', vol: 0.95, mel: ['A1 - A2 G2 - E2 - G2 A2 - C3 - D3 - E3 -', 'A2 . . . - - - -'] }, { drums: 'rock', vol: 0.5, to: 0 }, { hits: [[4, 'jangle', 57, 1.5, 0.8], [4.03, 'jangle', 61, 1.5, 0.8], [4.06, 'jangle', 64, 1.5, 0.8], [4.09, 'jangle', 69, 1.5, 0.8], [4, 'crash', 60, 1, 0.6]], vol: 0.8 }] },
  bumper3: { bpm: 116, loop: false, chords: ['D', 'D'], parts: [{ inst: 'slap', vol: 0.95, mel: ['D2 - - D3 C3 - A2 - G2 - A2 - - C3 D3 -', 'D2 . . . - - - -'] }, { drums: 'pop', vol: 0.5, to: 0 }, { hits: [[4, 'jangle', 62, 1.5, 0.8], [4.03, 'jangle', 66, 1.5, 0.8], [4.06, 'jangle', 69, 1.5, 0.8], [4.09, 'jangle', 74, 1.5, 0.8], [4, 'crash', 60, 1, 0.6]], vol: 0.8 }] },
  bumper4: { bpm: 120, loop: false, chords: ['G', 'G'], parts: [{ inst: 'slap', vol: 0.95, mel: ['G1 - G2 - B1 - C2 C#2 D2 - - D3 - - G2 -', 'G2 . . . - - - -'] }, { drums: 'funk', vol: 0.5, to: 0 }, { hits: [[4, 'jangle', 55, 1.5, 0.8], [4.03, 'jangle', 59, 1.5, 0.8], [4.06, 'jangle', 62, 1.5, 0.8], [4.09, 'jangle', 67, 1.5, 0.8], [4, 'crash', 60, 1, 0.6]], vol: 0.8 }] },
  fanfare: {
    bpm: 120, loop: false,
    chords: ['G', 'C D', 'G'],
    parts: [
      { inst: 'brass', vol: 0.75, mel: ['D5 G5 B5 . D6 . B5 D6', 'E6 . C6 . F#6 . D6 .', 'G6 . . . . . . .'] },
      { comp: 'stab', inst: 'brass', vol: 0.45, center: 60 },
      { bass: 'rootq', inst: 'slap', vol: 0.7 },
      { drums: 'pop', vol: 0.6, to: 1 },
      { hits: [[8, 'crash', 60, 2, 1], [8, 'kick', 60, 0.2, 1]], vol: 0.8 },
    ],
  },
  tiny: { bpm: 120, loop: false, chords: ['C'], parts: [{ inst: 'glock', vol: 0.7, mel: ['C6 E6 G6 C7 . . . .'] }] },
};
