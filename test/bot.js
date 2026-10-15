// In-page bot that plays the game through the real keyboard input path.
(function () {
  const G = window.__gang;
  const Input = G.Input;
  const FR = G.FRIENDS;
  class BotError extends Error {}
  const B = {
    log: [],
    frames: 0,
    L() { return G.Game.scene; },
    f() { return B.L().p1(); },
    get(who) { return B.L().friends.find(q => q.who === who); },
    step(n) { n = n || 1; for (let i = 0; i < n; i++) { G.Game.update(); B.frames++; if (B.onStep) B.onStep(); } },
    down(code) { Input.down.add(code); },
    up(code) { Input.down.delete(code); },
    tap(code, frames) { Input.down.add(code); Input.pressedKeys.add(code); B.step(frames || 1); Input.down.delete(code); B.step(1); },
    releaseAll() { Input.down.clear(); },
    fail(msg) {
      const f = B.f();
      const st = f ? ` [${f.who} at x=${f.x.toFixed(1)} y=${f.y.toFixed(1)} cx=${f.cx.toFixed(1)} feet=${(f.y + f.h).toFixed(1)} tile=(${Math.floor(f.cx / 16)},${Math.floor((f.y + f.h - 1) / 16)}) ground=${f.onGround} state=${f.state}]` : '';
      throw new BotError(msg + st);
    },
    say(m) { B.log.push(m); },
    as(who) {
      const i = FR.indexOf(who);
      if (B.f().who === who) return;
      Input.pressedKeys.add('Digit' + (i + 1));
      B.step(2);
      if (B.f().who !== who) B.fail('could not switch to ' + who);
    },
    tx(f) { return Math.floor(f.cx / 16); },
    feetRow(f) { return Math.floor((f.y + f.h - 1) / 16); },
    // walk to pixel x (centre) on the current level
    walkTo(px, opts) {
      opts = opts || {};
      const tol = opts.tol || 2;
      const max = opts.max || 1500;
      let last = null, still = 0;
      for (let i = 0; i < max; i++) {
        const f = B.f();
        const dx = px - f.cx;
        if (Math.abs(dx) <= tol && Math.abs(f.vx) < 0.4 && f.onGround) { B.releaseAll(); B.step(2); return f; }
        const brake = Math.abs(f.vx) * Math.abs(f.vx) / 0.7 + 1;
        B.up('KeyA'); B.up('KeyD');
        if (Math.abs(dx) > Math.max(tol, brake)) B.down(dx > 0 ? 'KeyD' : 'KeyA');
        else if (Math.abs(dx) > tol && Math.abs(f.vx) < 0.2) B.down(dx > 0 ? 'KeyD' : 'KeyA');
        if (opts.jumpIfStuck && last !== null && Math.abs(f.x - last) < 0.05 && f.onGround) { if (++still > 8) { B.tap('Space', 12); still = 0; } }
        else if (last !== null && Math.abs(f.x - last) < 0.01 && f.onGround && Math.abs(dx) > tol) { if (++still > 40) { B.releaseAll(); B.fail('stuck walking to ' + px); } }
        else still = 0;
        last = f.x;
        B.step(1);
      }
      B.releaseAll();
      B.fail('walkTo timeout ' + px);
    },
    walkToTile(tx, opts) { return B.walkTo(tx * 16 + 8, opts); },
    // hold a direction for n frames
    hold(code, n) { B.down(code); B.step(n); B.up(code); },
    // jump toward pixel x; waits until landed. opts: {double, doubleAt, maxFrames, runup}
    jumpTo(px, opts) {
      opts = opts || {};
      const f0 = B.f();
      const startFeet = f0.y + f0.h;
      if (!f0.onGround && !f0.climbing) B.fail('jumpTo while airborne');
      B.down('Space');
      let didDouble = false, left = false;
      for (let i = 0; i < (opts.maxFrames || 200); i++) {
        const f = B.f();
        const dx = px - f.cx;
        B.up('KeyA'); B.up('KeyD');
        const brake = Math.abs(f.vx) * 4;
        if (Math.abs(dx) > Math.max(2, opts.loose ? 6 : 2) || (opts.carry && Math.abs(dx) > 1)) B.down(dx > 0 ? 'KeyD' : 'KeyA');
        if (opts.delaySteer && i < opts.delaySteer) { B.up('KeyA'); B.up('KeyD'); }
        if (opts.double && !didDouble && f.vy >= (opts.doubleAt !== undefined ? opts.doubleAt : -0.6) && i > 3) {
          B.up('Space'); B.step(1); B.down('Space'); didDouble = true;
        }
        B.step(1);
        if (!f.onGround) left = true;
        if (left && f.onGround) { B.releaseAll(); B.step(2); return f; }
        if (f.mishapT > 0) { B.releaseAll(); B.fail('mishap during jump to ' + px); }
        void brake;
      }
      B.releaseAll();
      B.fail('jumpTo did not land ' + px + ' (start feet ' + startFeet + ')');
    },
    // run in a direction and jump once the front foot passes edgePx, steering to landPx
    runJump(edgePx, landPx, opts) {
      opts = opts || {};
      const f0 = B.f();
      const dir = landPx > f0.cx ? 1 : -1;
      const code = dir > 0 ? 'KeyD' : 'KeyA';
      B.down(code);
      for (let i = 0; i < 600; i++) {
        const f = B.f();
        const front = dir > 0 ? f.x + f.w : f.x;
        if ((dir > 0 && front >= edgePx + (opts.lead || 2)) || (dir < 0 && front <= edgePx - (opts.lead || 2))) break;
        if (!f.onGround) break;
        B.step(1);
      }
      return B.jumpTo(landPx, Object.assign({ carry: true }, opts));
    },
    // ride a moving platform: wait for it to arrive at fromY, step on at standX, ride to toY
    ride(standX, fromY, toY, pred) {
      const P = () => B.ent(pred || (e => e.constructor.name === 'Platform'));
      for (let tries = 0; tries < 5; tries++) {
        // wait for an arrival at fromY (so we get the full dwell time)
        if (Math.abs(P().y - fromY) < 0.5) B.waitFor(() => Math.abs(P().y - fromY) > 2, 1200, 'platform to leave');
        B.waitFor(() => Math.abs(P().y - fromY) < 0.5, 1500, 'platform to arrive');
        B.walkTo(standX, { tol: 3 });
        if (B.f().groundEnt === P()) { B.waitFor(() => Math.abs(P().y - toY) < 0.5, 900, 'ride to ' + toY); B.step(3); return; }
      }
      B.fail('could not board the platform');
    },
    // push (or pull) a crate until its left edge reaches px
    pushTo(crate, px, max) {
      for (let i = 0; i < (max || 1500); i++) {
        const f = B.f();
        const d = px - crate.x;
        if (Math.abs(d) < 1.2) { B.releaseAll(); B.step(3); return; }
        B.up('KeyA'); B.up('KeyD'); B.up('KeyE');
        if (d > 0) {
          if (f.cx > crate.cx) B.fail('pusher on the wrong side');
          B.down('KeyD');
        } else {
          // pull: grab and walk left
          B.down('KeyE'); if (i > 1) B.down('KeyA');
        }
        B.step(1);
      }
      B.releaseAll();
      B.fail('pushTo timeout, crate at ' + crate.x);
    },
    // climb ladder/pipe up (dir=-1) or down (dir=1) until feet row reaches row or climbing stops
    climb(dir, untilFeetY, max) {
      const code = dir < 0 ? 'KeyW' : 'KeyS';
      B.down(code);
      for (let i = 0; i < (max || 600); i++) {
        B.step(1);
        const f = B.f();
        if (untilFeetY !== undefined && ((dir < 0 && f.y + f.h <= untilFeetY + 0.5) || (dir > 0 && f.y + f.h >= untilFeetY - 0.5))) break;
        if (!f.climbing && i > 4) break;
      }
      B.up(code); B.step(4);
      return B.f();
    },
    // hold W: jump, grab a ladder overhead and climb to its top
    jumpClimb(max) {
      B.down('KeyW');
      let started = false;
      for (let i = 0; i < (max || 400); i++) {
        B.step(1);
        const f = B.f();
        if (f.climbing) started = true;
        if (started && !f.climbing && f.onGround) break;
        if (!started && i > 60 && f.onGround) { B.up('KeyW'); B.fail('jumpClimb: never grabbed the ladder'); }
      }
      B.up('KeyW'); B.step(4);
      return B.f();
    },
    use() { B.tap('KeyE', 1); B.step(2); },
    holdUse(n) { B.down('KeyE'); B.step(n || 70); B.up('KeyE'); B.step(2); },
    enter() { B.tap('KeyW', 1); B.step(4); },
    choose(i) {
      B.step(10);
      if (!B.L().choice) B.fail('no choice dialog');
      Input.pressedKeys.add('Digit' + (i + 1)); B.step(1);
      for (let k = 0; k < 400 && B.L().choice; k++) B.step(1);
      if (B.L().choice) B.fail('choice did not close');
    },
    wait(n) { B.step(n); },
    waitFor(fn, max, msg) { for (let i = 0; i < (max || 600); i++) { if (fn()) return; B.step(1); } B.fail('waitFor timeout: ' + (msg || '')); },
    flag(id) { return !!B.L().flags[id]; },
    expectFlag(id) { if (!B.flag(id)) B.fail('expected flag ' + id); },
    ent(pred) { return B.L().room.ents.find(pred); },
    // put the active friend roughly at a standing spot (debug use only)
    pos() { const f = B.f(); return { x: f.x, cx: f.cx, feet: f.y + f.h, tx: Math.floor(f.cx / 16), row: Math.floor((f.y + f.h - 1) / 16) }; },
    cupsLeft() { return B.L().room.ents.filter(e => e.constructor.name === 'Cup' && !e.got).map(e => [e.tx, e.ty]); },
  };
  window.__bot = B;
})();
