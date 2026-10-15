window.__sol = window.__sol || {};
window.__sol[3] = [
  // R1 stairwell: Theo hot-wires the door, Juno claps the trapdoor open, Mila climbs to the breaker
  (B) => {
    B.as('theo');
    B.walkTo(10 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('stairlock');
    B.step(30);
    B.as('juno');
    B.walkTo(14 * 16 + 8);
    B.walkTo(17 * 16 + 8); B.jumpTo(17 * 16 + 8);           // cup 17,6
    B.walkTo(20 * 16 + 8); B.walkTo(23 * 16 + 8);
    B.walkTo(26 * 16 + 8, { tol: 1 });
    B.climb(1);                                              // down to landing B
    if (B.pos().row !== 17) B.fail('juno not on landing B');
    B.walkTo(23 * 16 + 8);
    B.walkTo(20 * 16 + 8); B.jumpTo(20 * 16 + 8);           // cup 20,15
    B.runJump(18 * 16, 16 * 16 + 4, { lead: -3 });           // over the mousetrap
    B.walkTo(13 * 16 + 8);
    B.walkTo(9 * 16 + 10, { tol: 2 });
    B.use(); B.step(40);
    B.expectFlag('clap1');
    B.walkTo(6 * 16 + 8);
    B.step(20);
    B.as('mila');
    B.walkTo(14 * 16 + 8); B.walkTo(26 * 16 + 8, { tol: 1 });
    B.climb(1);
    B.walkTo(20 * 16 + 8);
    B.runJump(18 * 16, 16 * 16 + 4, { lead: -3 });
    B.walkTo(4 * 16 + 8, { tol: 3 });                       // through the trapdoor
    B.waitFor(() => B.f().onGround && B.pos().row === 26, 200, 'landed on landing C');
    B.walkTo(6 * 16 + 8); B.walkTo(11 * 16 + 8); B.walkTo(16 * 16 + 8);
    B.walkTo(19 * 16 + 8); B.jumpTo(19 * 16 + 8);           // cup 19,24
    B.walkTo(21 * 16 + 8);
    B.walkTo(24 * 16 + 8, { tol: 1 });
    B.climb(1);                                              // down to the bottom
    if (B.pos().row !== 34) B.fail('mila not at the bottom');
    B.walkTo(21 * 16 + 8); B.walkTo(15 * 16 + 8); B.walkTo(5 * 16 + 8);
    B.walkTo(10 * 16 + 8, { tol: 1 });
    B.climb(-1);                                             // up the drainpipe
    B.walkTo(11 * 16 + 8, { tol: 3 }); B.walkTo(12 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('breaker');
    B.walkTo(15 * 16 + 8);
    B.walkTo(27 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 basement: Dex boxes the plate, Benny crawls the vent, Juno opens the music cubby
  (B) => {
    const traps = () => {
      B.walkTo(9 * 16 + 8);
      B.runJump(11 * 16, 12 * 16 + 8, { lead: -3 });
      B.walkTo(13 * 16 + 8);
      B.runJump(15 * 16, 16 * 16 + 8, { lead: -3 });
    };
    B.as('dex');
    traps();
    B.walkTo(18 * 16 + 6, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 25 * 16);
    B.waitFor(() => B.flag('plate4'), 30, 'plate pressed');
    B.walkTo(24 * 16 + 6, { tol: 3 }); B.jumpTo(24 * 16 + 6);   // cup 24,11
    B.jumpTo(27 * 16 + 8);                                      // over the box
    B.walkTo(28 * 16 + 8);
    B.walkTo(33 * 16 + 8); B.jumpTo(33 * 16 + 8);               // cup 33,11
    B.walkTo(36 * 16 + 4, { tol: 3 });
    B.as('benny');
    traps();
    B.walkTo(23 * 16 + 8, { tol: 3 }); B.jumpTo(27 * 16 + 8);  // over the box
    B.walkTo(37 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent4');
    B.walkTo(42 * 16 + 8, { max: 400 });
    B.walkTo(43 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('lev4');
    B.walkTo(44 * 16 + 8);
    B.step(40);
    B.as('juno');
    traps();
    B.walkTo(23 * 16 + 8, { tol: 3 }); B.jumpTo(27 * 16 + 8);
    B.walkTo(45 * 16 + 4, { tol: 3 });
    B.jumpTo(46 * 16 + 8);                                      // step 1 (cup 46,11)
    B.jumpTo(48 * 16 + 8);                                      // step 2 (cup 48,10)
    B.use(); B.step(40);
    B.expectFlag('secret4');
    B.as('benny');
    B.walkTo(45 * 16 + 4, { tol: 3 });
    B.jumpTo(46 * 16 + 4);
    B.jumpTo(47 * 16 + 8);
    B.walkTo(55 * 16 + 8, { max: 500 });                        // crawl in: cups + golden mug
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(49 * 16 + 4, { max: 500, tol: 4 });
    B.walkTo(44 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'dropped to the floor');
    B.walkTo(53 * 16 + 8); B.walkTo(56 * 16 + 8);
    B.walkTo(58 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 generator room: Priya handles Holloway, Dex lifts the cage, Theo starts the generator
  (B) => {
    B.as('priya');
    B.walkTo(11 * 16 + 8);
    B.walkTo(13 * 16 + 6, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('holloway4'), 30, 'holloway talked');
    B.step(240);
    B.as('mila');
    B.walkTo(17 * 16 + 8);
    B.walkTo(20 * 16 + 8); B.jumpTo(20 * 16 + 8);              // cup 20,11
    B.jumpTo(22 * 16 + 8); B.walkTo(23 * 16 + 8);              // crates
    B.walkTo(25 * 16 + 8, { tol: 4 });
    B.walkTo(26 * 16 + 8);
    B.jumpTo(27 * 16 + 8, { double: true });                   // catwalk
    B.walkTo(26 * 16 + 8, { tol: 3 }); B.walkTo(31 * 16 + 8, { tol: 3 });
    B.walkTo(33 * 16 + 4, { tol: 4 });
    B.as('dex');
    B.walkTo(20 * 16 + 8); B.jumpTo(22 * 16 + 8); B.walkTo(24 * 16 + 4, { tol: 4 });
    B.walkTo(29 * 16 + 8);
    B.walkTo(34 * 16 - 7, { tol: 2 });
    B.use();
    B.waitFor(() => B.ent(e => e.constructor.name === 'Shutter').lift >= 1, 60, 'shutter up');
    B.as('theo');
    B.walkTo(20 * 16 + 8); B.jumpTo(22 * 16 + 8); B.walkTo(24 * 16 + 4, { tol: 4 });
    B.walkTo(31 * 16 + 8);
    B.walkTo(36 * 16 + 8);
    B.walkTo(39 * 16 + 8); B.jumpTo(39 * 16 + 8);              // cup 39,11
    B.walkTo(46 * 16 + 8); B.jumpTo(46 * 16 + 8);              // cup 46,11
    B.walkTo(49 * 16 + 8);
    B.walkTo(41 * 16 + 8, { tol: 3 });
    B.holdUse(80);
    B.waitFor(() => B.flag('gen'), 10, 'generator fixed');
  },
];
