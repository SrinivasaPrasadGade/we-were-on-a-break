window.__sol = window.__sol || {};
window.__sol[12] = [
  // R1 street: Mila drops the ladder, Theo fixes the OPEN sign, Dex holds Vance's shutter
  (B) => {
    B.as('mila');
    B.walkTo(43 * 16 + 8, { tol: 1 }); B.climb(-1);             // drainpipe to the awning
    B.walkTo(48 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('ladder16');
    B.walkTo(53 * 16 + 8); B.walkTo(54 * 16 + 8);
    B.as('theo');
    B.walkTo(55 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the drop ladder
    B.walkTo(51 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('sign16');
    B.as('dex');
    B.walkTo(57 * 16 - 7, { tol: 2 });
    B.use();
    B.waitFor(() => B.ent(e => e.constructor.name === 'Shutter').lift >= 1, 60, 'shutter up');
    B.as('juno');
    const cupRun = [10, 13, 17, 21, 24, 29, 32, 36, 40];
    for (const x of cupRun) { B.walkTo(x * 16 + 8); if ([10, 17, 24, 32, 40].includes(x)) B.jumpTo(x * 16 + 8); }
    B.walkTo(56 * 16 - 2, { tol: 3 });
    B.walkTo(59 * 16 + 8); B.jumpTo(59 * 16 + 8);
    B.walkTo(60 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 café: pigeons (Juno), couch (Dex), Old Faithful (Theo), string-light clips (Mila)
  (B) => {
    B.as('juno');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);
    B.walkTo(11 * 16 + 8, { tol: 3 });
    B.use(); B.step(30);
    B.waitFor(() => B.flag('pigeons16'), 60, 'pigeons fly off');
    B.step(160);
    B.walkTo(12 * 16 + 8);
    B.as('dex');
    B.walkTo(16 * 16 + 9, { tol: 2 }); B.jumpTo(16 * 16 + 9);   // cup 16,11
    B.pushTo(B.ent(e => e.crate), 25 * 16);
    B.waitFor(() => B.flag('couch16'), 30, 'couch home');
    B.as('theo');
    B.walkTo(20 * 16 + 8); B.jumpTo(20 * 16 + 8);
    B.walkTo(23 * 16 + 8, { tol: 4 }); B.jumpTo(28 * 16 + 8);   // over the couch (cup 28,11)
    B.walkTo(30 * 16 + 8);
    B.walkTo(31 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('esp16');
    B.as('mila');
    B.walkTo(23 * 16 + 8, { tol: 4 }); B.jumpTo(28 * 16 + 8);
    B.walkTo(37 * 16 + 8);
    B.jumpTo(39 * 16 + 8);                                       // onto the counter (cups 39,11 42,11)
    B.walkTo(42 * 16 + 8);
    B.jumpTo(41 * 16 + 8, { double: true });                     // ledge A
    B.walkTo(40 * 16 + 8, { tol: 3 }); B.walkTo(42 * 16 + 8, { tol: 3 });
    B.walkTo(41 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('clipA');
    B.walkTo(46 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila down');
    B.jumpTo(46 * 16 + 8);                                       // cup 46,11
    B.walkTo(47 * 16 + 4, { tol: 3 }); B.jumpTo(48 * 16 + 8);  // onto the table
    B.jumpTo(51 * 16 + 8, { double: true });                     // ledge B
    B.walkTo(50 * 16 + 8, { tol: 3 }); B.walkTo(52 * 16 + 8, { tol: 3 });
    B.walkTo(51 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('clipB');
    B.walkTo(55 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila on the floor');
    B.jumpTo(55 * 16 + 8);
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 kitchen: mixer (Dex), steam + pantry vent (Benny), flour (Mila), the oven (Theo)
  (B) => {
    const V = (tx) => B.ent(e => e.constructor.name === 'Hazard' && e.tx === tx);
    const steam = () => {
      B.walkTo(27 * 16 + 8);
      B.walkTo(28 * 16 + 4, { tol: 2 });
      B.waitFor(() => (V(29).t % 120) === 74, 200, 'vent 1 off');
      B.walkTo(30 * 16 + 8, { tol: 2 });
      if (B.L().takes > 1) B.fail('steamed');
      B.jumpTo(30 * 16 + 8);                                     // cup 30,11
      B.waitFor(() => (V(32).t % 120) === 74, 200, 'vent 2 off');
      B.walkTo(34 * 16 + 8, { tol: 3 });
      if (B.L().takes > 1) B.fail('steamed');
    };
    B.as('dex');
    B.walkTo(8 * 16 + 8); B.jumpTo(8 * 16 + 8);                 // cup 8,11
    B.walkTo(9 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 17 * 16);
    B.waitFor(() => B.flag('mixer16'), 30, 'mixer at its station');
    B.as('benny');
    B.walkTo(15 * 16 + 8); B.jumpTo(15 * 16 + 8);
    B.walkTo(16 * 16 - 2, { tol: 3 }); B.jumpTo(18 * 16 + 8);  // over the mixer
    B.walkTo(27 * 16 + 8); B.jumpTo(27 * 16 + 8);               // across the dish conveyor
    steam();
    B.walkTo(35 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent16');
    B.walkTo(38 * 16 + 8, { max: 400, tol: 3 });
    B.use(); B.expectFlag('pantry16');
    B.walkTo(39 * 16 + 8); B.jumpTo(39 * 16 + 8);
    B.as('mila');
    B.walkTo(16 * 16 - 2, { tol: 3 }); B.jumpTo(18 * 16 + 8);
    B.walkTo(27 * 16 + 8);
    steam();
    B.walkTo(40 * 16 + 8);
    B.walkTo(42 * 16 + 8, { tol: 1 }); B.climb(-1);             // shelving up to the flour
    B.walkTo(43 * 16 + 8); B.walkTo(45 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('flour16');
    B.walkTo(44 * 16 + 8, { tol: 3 });
    B.as('theo');
    B.walkTo(16 * 16 - 2, { tol: 3 }); B.jumpTo(18 * 16 + 8);
    B.walkTo(27 * 16 + 8);
    steam();
    B.walkTo(47 * 16 + 8); B.jumpTo(47 * 16 + 8);
    B.walkTo(53 * 16 + 8); B.jumpTo(53 * 16 + 8);
    B.walkTo(55 * 16 + 8);
    B.walkTo(49 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('oven16');
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R4 rooftop: Priya and Mrs. Petrakis, Juno's karaoke, Theo bounces to the searchlight, Mila's antenna banner + mug
  (B) => {
    B.as('priya');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);
    B.walkTo(11 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('petrakis16'), 30, 'mrs. petrakis is coming');
    B.step(120);
    B.as('juno');
    B.walkTo(15 * 16 + 8);
    B.walkTo(19 * 16 + 8); B.jumpTo(19 * 16 + 8);
    B.walkTo(23 * 16 + 8); B.jumpTo(23 * 16 + 8);
    B.walkTo(23 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.expectFlag('karaoke16');
    B.walkTo(27 * 16 + 8);
    B.as('theo');
    B.walkTo(28 * 16 + 8);
    B.bounce(31 * 16 + 4, 34 * 16 + 8);                          // trampoline to the catwalk
    if (B.pos().row !== 6) B.fail('theo not on the catwalk');
    B.walkTo(33 * 16 + 8); B.walkTo(39 * 16 + 8);
    B.walkTo(37 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('search16');
    B.as('mila');
    B.walkTo(28 * 16 + 4, { tol: 3 }); B.jumpTo(32 * 16 + 8);   // hop the trampoline
    B.walkTo(42 * 16 + 8); B.jumpTo(42 * 16 + 8);
    B.walkTo(46 * 16 + 8);
    B.walkTo(48 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the TV antenna
    B.walkTo(49 * 16 + 8); B.walkTo(50 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('banner16');
    B.walkTo(51 * 16 + 8);
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(53 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila down');
    B.walkTo(54 * 16 + 8); B.jumpTo(54 * 16 + 8);
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R5 the grand reopening: Vance + critic (Priya), piano (Dex), banner (Mila), lights (Theo), deed (Benny), the show (Juno)
  (B) => {
    B.as('priya');
    B.walkTo(9 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('vance16'), 30, 'vance listening');
    B.step(150);
    B.walkTo(9 * 16 + 8); B.jumpTo(9 * 16 + 8);
    B.walkTo(12 * 16 + 2, { tol: 3 });
    B.use(); B.choose(0);
    B.waitFor(() => B.flag('critic16'), 30, 'critic staying');
    B.step(160);
    B.as('dex');
    B.walkTo(15 * 16 + 8); B.jumpTo(15 * 16 + 8);
    B.walkTo(16 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 26 * 16);
    B.waitFor(() => B.flag('piano16'), 30, 'piano on stage');
    B.jumpTo(24 * 16 + 9);                                       // cup 24,11
    B.as('mila');
    B.walkTo(24 * 16 + 4, { tol: 3 }); B.jumpTo(27 * 16 + 8);   // onto the piano
    B.jumpTo(22 * 16 + 8, { double: true });                     // banner clip, left
    B.walkTo(23 * 16 + 8, { tol: 3 }); B.walkTo(22 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('bannerL');
    B.walkTo(29 * 16 + 8, { max: 400, tol: 4 });
    B.waitFor(() => B.f().onGround, 120, 'mila landed');
    B.walkTo(31 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila on the floor');
    B.jumpTo(31 * 16 + 8);
    B.walkTo(34 * 16 + 8);
    B.jumpTo(37 * 16 + 8); B.walkTo(40 * 16 + 8);               // onto the counter
    B.jumpTo(39 * 16 + 8, { double: true });                     // banner clip, right
    B.walkTo(40 * 16 + 8, { tol: 3 }); B.walkTo(39 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('bannerR');
    B.as('theo');
    B.walkTo(24 * 16 + 4, { tol: 3 }); B.jumpTo(27 * 16 + 8); B.walkTo(30 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'theo past the piano');
    B.walkTo(35 * 16 + 4, { tol: 3 }); B.jumpTo(37 * 16 + 8); B.walkTo(43 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'theo past the counter');
    B.jumpTo(43 * 16 + 8);
    B.walkTo(43 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('lights16');
    B.as('benny');
    B.walkTo(24 * 16 + 4, { tol: 3 }); B.jumpTo(27 * 16 + 8); B.walkTo(30 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'benny past the piano');
    B.walkTo(35 * 16 + 4, { tol: 3 }); B.jumpTo(37 * 16 + 8); B.walkTo(43 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'benny past the counter');
    B.walkTo(46 * 16 + 8); B.jumpTo(46 * 16 + 8);
    B.walkTo(47 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent16b');
    B.walkTo(50 * 16 + 8, { max: 400 }); B.jumpTo(50 * 16 + 8);
    B.walkTo(55 * 16 + 8); B.walkTo(57 * 16 + 8); B.jumpTo(57 * 16 + 8);
    B.walkTo(53 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('deed16');
    B.as('juno');
    B.walkTo(21 * 16 + 8); B.walkTo(24 * 16 + 4, { tol: 3 }); B.jumpTo(27 * 16 + 8); B.walkTo(30 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'juno past the piano');
    B.walkTo(29 * 16 + 8); B.walkTo(31 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.waitFor(() => B.flag('show16'), 30, 'the show');
  },
];
