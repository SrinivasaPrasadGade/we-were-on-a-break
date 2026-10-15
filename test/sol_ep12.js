window.__sol = window.__sol || {};
window.__sol[11] = [
  // R1 terminal: Priya past security, Dex clears the luggage, Mila's departures-board mug
  (B) => {
    B.as('priya');
    B.walkTo(18 * 16 + 8); B.jumpTo(18 * 16 + 8);               // over the walkway, cup 18,11
    B.walkTo(20 * 16 + 2, { tol: 3 });
    B.use(); B.choose(2);
    B.waitFor(() => B.flag('tsa12'), 30, 'security convinced');
    B.step(80);
    B.as('dex');
    B.walkTo(24 * 16 + 8);
    B.walkTo(26 * 16 + 8); B.jumpTo(26 * 16 + 8);
    B.walkTo(30 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 40 * 16);
    B.as('mila');
    B.walkTo(39 * 16 + 4, { tol: 3 }); B.jumpTo(40 * 16 + 8);  // onto the luggage (cup 40,11)
    B.walkTo(43 * 16 + 8, { max: 200, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila down');
    B.walkTo(44 * 16 + 8);
    B.walkTo(46 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the board pole
    B.walkTo(48 * 16 + 8); B.walkTo(50 * 16 + 8);
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(52 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila on the floor');
    B.walkTo(53 * 16 + 8); B.jumpTo(53 * 16 + 8);
    B.walkTo(58 * 16 + 8);
    B.walkTo(61 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 concourse: Juno leads the tour away, Theo fixes the escalator, Benny rides up and opens the gate
  (B) => {
    B.as('juno');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);
    B.walkTo(11 * 16 + 8, { tol: 3 });
    B.use(); B.step(30);
    B.waitFor(() => B.flag('t1') && B.flag('t2') && B.flag('t3'), 60, 'tour dancing');
    B.step(280);
    B.walkTo(12 * 16 + 8);
    B.as('theo');
    B.walkTo(19 * 16 + 8); B.jumpTo(19 * 16 + 8);
    B.walkTo(21 * 16 + 8); B.jumpTo(21 * 16 + 8);
    B.walkTo(22 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('esc12');
    B.walkTo(25 * 16 + 8);
    B.as('benny');
    B.walkTo(25 * 16 + 8);
    B.ride(28 * 16 + 4, 224, 128);                               // the escalator lift
    B.walkTo(31 * 16 + 8);
    B.walkTo(34 * 16 + 8); B.jumpTo(34 * 16 + 8);
    B.walkTo(38 * 16 + 8);
    B.walkTo(42 * 16 + 8); B.jumpTo(42 * 16 + 8);
    B.walkTo(45 * 16 + 8); B.walkTo(48 * 16 + 8);
    B.walkTo(49 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent12');
    B.walkTo(52 * 16 + 8, { max: 400, tol: 3 });
    B.use(); B.expectFlag('gate12');
    B.walkTo(53 * 16 + 8); B.jumpTo(53 * 16 + 8);
    B.walkTo(55 * 16 + 8);
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 gate 47: Priya and the gate agent, Dex clears the lane, Theo fixes the PA, Juno sings goodbye
  (B) => {
    B.as('priya');
    B.walkTo(9 * 16 + 8); B.jumpTo(9 * 16 + 8);
    B.walkTo(10 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('agent12'), 30, 'gate agent on our side');
    B.step(60);
    B.as('dex');
    B.walkTo(14 * 16 + 8);
    B.walkTo(16 * 16 + 1, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 27 * 16);
    const overBags = () => { B.walkTo(26 * 16 + 4, { tol: 3 }); B.jumpTo(27 * 16 + 8); B.walkTo(30 * 16 + 8, { max: 200, tol: 4 }); B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'over the bags'); };
    B.as('theo');
    overBags();
    B.walkTo(29 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('pa12');
    B.walkTo(32 * 16 + 8); B.jumpTo(32 * 16 + 8);
    B.walkTo(35 * 16 + 8);
    B.walkTo(37 * 16 + 8); B.jumpTo(37 * 16 + 8);
    B.walkTo(50 * 16 + 8);
    B.walkTo(53 * 16 + 8); B.jumpTo(53 * 16 + 8);
    B.as('mila');
    overBags();
    B.walkTo(42 * 16 + 8, { tol: 3 });
    B.jumpTo(42 * 16 + 8, { double: true });                     // baggage shelf
    B.walkTo(41 * 16 + 8, { tol: 3 }); B.walkTo(43 * 16 + 8, { tol: 3 });
    B.as('juno');
    overBags();
    B.walkTo(32 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.waitFor(() => B.flag('song12'), 30, 'the goodbye song');
  },
];
