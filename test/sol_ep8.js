window.__sol = window.__sol || {};
window.__sol[7] = [
  // R1 backstage: Priya gets past the stage manager, Theo bounces up to the spotlight, Dex moves the top hat, Mila climbs the rope
  (B) => {
    B.as('priya');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(11 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('stagemgr'), 30, 'stage manager convinced');
    B.step(200);
    B.as('theo');
    B.walkTo(15 * 16 + 8); B.jumpTo(15 * 16 + 8);               // cup 15,11
    B.bounce(18 * 16 + 4, 21 * 16 + 8);                          // trampoline to the catwalk
    if (B.pos().row !== 6) B.fail('theo not on the catwalk');
    B.walkTo(20 * 16 + 8); B.walkTo(29 * 16 + 8);
    B.walkTo(25 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('spot8');
    B.as('dex');
    B.walkTo(32 * 16 + 9, { tol: 2 }); B.jumpTo(32 * 16 + 9);   // cup 32,11
    B.pushTo(B.ent(e => e.crate), 44 * 16);
    B.waitFor(() => B.flag('hat8'), 30, 'top hat on the lift');
    B.as('mila');
    B.walkTo(38 * 16 + 8); B.jumpTo(38 * 16 + 8);               // cup 38,11
    B.walkTo(39 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the rope
    B.walkTo(41 * 16 + 8); B.walkTo(44 * 16 + 8);
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(47 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'mila on the floor');
    B.walkTo(50 * 16 + 8); B.jumpTo(50 * 16 + 8);
    B.walkTo(53 * 16 + 8);
    B.walkTo(56 * 16 + 8); B.jumpTo(56 * 16 + 8);
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 under the stage: chase the rabbit through the tunnel (Benny), Theo bounces over and fixes the lift motor
  (B) => {
    B.as('mila');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(14 * 16 + 8); B.jumpTo(14 * 16 + 8);               // cup 14,11
    B.walkTo(15 * 16 + 8);
    B.bounce(18 * 16 + 4, 22 * 16 + 8);                          // onto the lift housing
    B.walkTo(25 * 16 + 8); B.walkTo(28 * 16 + 8);
    B.walkTo(30 * 16 + 8, { tol: 3 });
    B.jumpTo(32 * 16 + 8, { double: true });                     // the high beam
    if (B.pos().row !== 4) B.fail('mila not on the beam');
    B.walkTo(33 * 16 + 8, { tol: 3 });
    B.as('benny');
    B.walkTo(15 * 16 + 8); B.walkTo(23 * 16 + 8, { max: 600 }); B.walkTo(31 * 16 + 8, { max: 600 });   // through the tunnel
    B.walkTo(35 * 16 + 8); B.jumpTo(35 * 16 + 8);               // cup 35,11
    B.walkTo(37 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent8');
    B.walkTo(40 * 16 + 8, { max: 400, tol: 3 });
    B.use(); B.expectFlag('motordoor8');
    B.walkTo(42 * 16 + 8); B.jumpTo(42 * 16 + 8);
    B.waitFor(() => { const r = B.ent(e => e.constructor.name === 'Runner'); return r.i === r.path.length - 1 && !r.moving; }, 300, 'rabbit cornered');
    B.walkTo(47 * 16 + 8); B.walkTo(50 * 16 + 8, { tol: 3 }); B.jumpTo(50 * 16 + 8);
    B.waitFor(() => B.flag('rabbit8'), 60, 'rabbit caught');
    B.as('theo');
    B.walkTo(15 * 16 + 8);
    B.bounce(18 * 16 + 4, 22 * 16 + 8);
    B.walkTo(32 * 16 + 8, { max: 300, tol: 8 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'theo down from the housing');
    B.walkTo(37 * 16 + 8);
    B.walkTo(44 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('lift8');
    B.walkTo(53 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 the stage: heckler (Priya), spotlight on the fly rail (Mila), box on the trapdoor (Dex), trapdoor (Theo), drumroll (Juno)
  (B) => {
    B.as('priya');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);
    B.walkTo(12 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('heckler'), 30, 'heckler seated');
    B.step(160);
    B.walkTo(16 * 16 + 8);
    B.as('mila');
    B.walkTo(18 * 16 + 8);
    B.bounce(21 * 16 + 4, 26 * 16 + 8, { double: true });        // bounce + air jump to the fly rail
    if (B.pos().row !== 4) B.fail('mila not on the fly rail');
    B.walkTo(23 * 16 + 8); B.walkTo(29 * 16 + 8);
    B.walkTo(27 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('spot8b');
    B.as('dex');
    B.walkTo(31 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 40 * 16);
    B.waitFor(() => B.flag('box8'), 30, 'box on the trapdoor');
    B.as('theo');
    B.walkTo(34 * 16 + 8); B.jumpTo(34 * 16 + 8);               // cup 34,11
    B.walkTo(38 * 16 + 8, { tol: 4 }); B.jumpTo(40 * 16 + 8); B.walkTo(42 * 16 + 8);   // over the box
    B.jumpTo(42 * 16 + 8);                                       // cup 42,11
    B.walkTo(43 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('trap8');
    B.as('juno');
    B.walkTo(38 * 16 + 8, { tol: 4 }); B.jumpTo(40 * 16 + 8); B.walkTo(42 * 16 + 8);
    B.walkTo(46 * 16 + 8);
    B.walkTo(53 * 16 + 8); B.jumpTo(53 * 16 + 8);
    B.walkTo(56 * 16 + 8);
    B.walkTo(49 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.waitFor(() => B.flag('trick'), 30, 'the trick');
  },
];
