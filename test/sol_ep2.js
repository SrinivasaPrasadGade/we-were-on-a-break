window.__sol = window.__sol || {};
window.__sol[1] = [
  // R1 hallway: Juno distracts Holloway, Dex pushes the dresser, Benny crawls under the door
  (B) => {
    const W = () => B.ent(e => e.constructor.name === 'Watcher');
    B.as('dex');
    B.walkTo(6 * 16 + 8); B.walkTo(11 * 16 + 8); B.walkTo(14 * 16 + 8);   // checkpoint
    B.as('mila'); B.walkTo(13 * 16 + 8);
    B.as('benny'); B.walkTo(12 * 16 + 8);
    B.as('juno'); B.walkTo(15 * 16 + 8);
    // wait for Holloway to walk away, then sneak up behind him and play
    B.waitFor(() => W().face > 0 && W().x > 26 * 16 && W().pause === 0, 1500, 'holloway heading right');
    B.walkTo(W().x - 40);
    B.use(); B.step(60);
    if (W().danceT <= 0) B.fail('holloway not dancing');
    B.walkTo(24 * 16 + 8); B.walkTo(27 * 16 + 8);
    B.use(); B.step(60);
    B.as('dex');
    B.walkTo(16 * 16 + 8); B.walkTo(21 * 16 + 8); B.walkTo(33 * 16 + 8); B.walkTo(37 * 16 + 8); B.walkTo(42 * 16 + 8);
    B.as('juno'); B.use(); B.step(70);
    B.as('mila');
    B.walkTo(30 * 16 + 8);
    B.climb(-1);
    if (B.pos().row !== 5) B.fail('mila not at the ledge top');
    B.walkTo(31 * 16 + 8); B.walkTo(33 * 16 + 8);   // cups + golden mug
    B.walkTo(30 * 16 + 8);
    B.as('juno'); B.use(); B.step(70);
    B.as('mila');
    B.climb(1);
    B.walkTo(40 * 16 + 8);
    B.as('benny');
    B.walkTo(24 * 16 + 8); B.walkTo(40 * 16 + 8);
    B.as('dex');
    B.walkTo(43 * 16 + 8);
    B.jumpTo(44 * 16 + 8);                 // hop on the dresser (cup 44,11)
    B.walkTo(42 * 16 + 8);
    B.hold('KeyD', 160);                   // push dresser to the landing
    B.waitFor(() => B.ent(e => e.crate).x === 48 * 16, 10, 'dresser at landing');
    B.as('benny');
    B.walkTo(46 * 16 + 8);
    B.jumpTo(48 * 16 + 8);
    B.jumpTo(51 * 16 + 8);
    B.walkTo(55 * 16 + 8);
    B.walkTo(57 * 16 + 6, { tol: 3 });
    B.use(); B.expectFlag('vent');
    B.walkTo(60 * 16 + 8, { max: 400 });
    B.use(); B.expectFlag('lev');
    B.walkTo(61 * 16 + 8); B.walkTo(62 * 16 + 4);
    B.enter();
  },
  // R2 laundry: Theo fixes the washer, Dex pushes a washer and holds the shutter
  (B) => {
    B.as('theo');
    B.walkTo(4 * 16 + 8); B.walkTo(6 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('washer');
    B.walkTo(9 * 16 + 8); B.jumpTo(9 * 16 + 8);
    B.walkTo(12 * 16 + 8); B.jumpTo(12 * 16 + 8);
    B.as('mila');
    B.walkTo(16 * 16 + 8); B.walkTo(19 * 16 + 8); B.walkTo(20 * 16 + 8);
    B.climb(-1);
    if (B.pos().row !== 4) B.fail('mila not on top of the pipe');
    B.walkTo(22 * 16 + 8); B.walkTo(26 * 16 + 8);
    B.walkTo(28 * 16 + 8, { tol: 4 });     // drop off
    B.as('dex');
    B.walkTo(22 * 16 + 8);
    B.hold('KeyD', 260);                   // push the washer to the raised floor
    B.waitFor(() => B.ent(e => e.crate).x === 33 * 16, 10, 'washer at the ledge');
    B.walkTo(31 * 16 + 8);
    B.jumpTo(33 * 16 + 8);
    B.jumpTo(35 * 16 + 8);
    B.walkTo(41 * 16 + 8); B.walkTo(46 * 16 + 8); B.walkTo(50 * 16 + 8);
    B.walkTo(52 * 16 - 7, { tol: 2 });
    B.use();
    B.waitFor(() => B.ent(e => e.constructor.name === 'Shutter').lift >= 1, 60, 'shutter lifted');
    B.as('theo');
    B.walkTo(28 * 16 + 8); B.walkTo(31 * 16 + 8);
    B.jumpTo(33 * 16 + 8); B.jumpTo(35 * 16 + 8);
    B.walkTo(36 * 16 + 8); B.walkTo(50 * 16 + 8);
    B.walkTo(55 * 16 + 8); B.walkTo(57 * 16 + 4);
    B.enter();
  },
  // R3 greenhouse: Priya talks Roz aside, Juno lures Sarge down, catch him
  (B) => {
    B.as('priya');
    B.walkTo(6 * 16 + 8); B.walkTo(10 * 16 + 8); B.walkTo(16 * 16 + 8); B.walkTo(19 * 16 + 4, { tol: 3 });
    B.use(); B.choose(2);
    B.waitFor(() => B.flag('roz'), 30, 'roz convinced');
    B.step(100);
    B.as('mila');
    B.walkTo(25 * 16 + 8);
    B.jumpTo(27 * 16 + 8); B.walkTo(29 * 16 + 8);
    B.jumpTo(33 * 16 + 8); B.walkTo(35 * 16 + 8);
    B.jumpTo(39 * 16 + 8); B.walkTo(41 * 16 + 8);
    B.jumpTo(45 * 16 + 8); B.walkTo(49 * 16 + 4, { tol: 4 });
    B.jumpTo(51 * 16 + 8); B.walkTo(53 * 16 + 8);
    B.walkTo(50 * 16 + 8, { tol: 5 }); B.walkTo(50 * 16 + 8, { tol: 3 });
    B.as('juno');
    B.walkTo(25 * 16 + 8);
    B.jumpTo(27 * 16 + 8); B.walkTo(30 * 16 + 8);
    B.jumpTo(33 * 16 + 8); B.walkTo(36 * 16 + 8);
    B.jumpTo(39 * 16 + 8);
    B.walkTo(41 * 16 + 8);
    if (B.pos().row !== 7) B.fail('juno not on shelf C');
    B.use(); B.step(60);
    B.waitFor(() => { const s = B.ent(e => e.constructor.name === 'Runner'); return s.i === 1 && !s.moving; }, 300, 'sarge came down');
    B.walkTo(44 * 16 + 8, { tol: 6 });
    B.walkTo(47 * 16 + 8, { tol: 6 });
    B.waitFor(() => B.flag('caught'), 120, 'sarge caught');
  },
];
