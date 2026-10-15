window.__sol = window.__sol || {};
window.__sol[2] = [
  // R1 cafe: couch onto the X (Dex), espresso (Theo), pigeons (Juno)
  (B) => {
    B.as('dex');
    B.walkTo(4 * 16 + 8); B.walkTo(6 * 16 + 8);
    B.walkTo(9 * 16 + 2, { tol: 3 });
    B.hold('KeyD', 260);
    B.waitFor(() => B.flag('couch'), 30, 'couch on the mark');
    B.walkTo(17 * 16 + 8);
    B.jumpTo(19 * 16 + 8); B.walkTo(20 * 16 + 8, { tol: 2 });  // stand on the couch (cup 20,12)
    B.as('mila');
    B.walkTo(11 * 16 + 8); B.jumpTo(12 * 16 + 8); B.walkTo(14 * 16 + 8);   // shelf cups
    B.walkTo(16 * 16 + 8, { tol: 4 });
    B.as('theo');
    B.walkTo(16 * 16 + 8);
    B.jumpTo(19 * 16 + 8); B.jumpTo(21 * 16 + 8); B.walkTo(23 * 16 + 2, { tol: 3 });
    B.holdUse(80); B.expectFlag('espresso');
    B.walkTo(25 * 16 + 8, { tol: 2 }); B.jumpTo(25 * 16 + 8);   // cup 25,10 above the machine
    B.walkTo(28 * 16 + 8);
    B.walkTo(31 * 16 + 8); B.jumpTo(31 * 16 + 8);
    B.as('juno');
    B.walkTo(16 * 16 + 8); B.jumpTo(19 * 16 + 8); B.jumpTo(21 * 16 + 8);
    B.walkTo(28 * 16 + 8);
    B.use(); B.step(70);
    B.waitFor(() => B.flag('pigeons'), 30, 'pigeons gone');
    B.step(150);
    B.walkTo(42 * 16 + 8);
    B.jumpTo(44 * 16 + 8); B.walkTo(45 * 16 + 8);   // shelf B
    B.walkTo(43 * 16 + 8);
    B.jumpTo(40 * 16 + 8); B.walkTo(38 * 16 + 8);   // shelf C
    B.walkTo(36 * 16 + 8, { tol: 4 });
    B.walkTo(49 * 16 + 8);
    B.walkTo(52 * 16 + 4);
    B.enter();
  },
  // R2 kitchen: Theo opens the fridge, Dex pushes the box to the shelf, Benny takes the vent
  (B) => {
    B.as('theo');
    B.walkTo(5 * 16 + 8); B.walkTo(3 * 16 + 8);
    B.runJump(9 * 16, 10 * 16 + 12, { lead: -3 }); B.walkTo(11 * 16 + 2, { tol: 2 }); B.runJump(12 * 16, 13 * 16 + 12, { lead: -3 });  // over the mousetraps
    B.jumpTo(12 * 16 + 8); B.walkTo(14 * 16 + 8);
    B.walkTo(16 * 16 + 8, { tol: 4 }); B.walkTo(17 * 16 + 6, { tol: 3 });
    B.holdUse(80); B.expectFlag('fridge');
    B.step(40);
    B.as('dex');
    B.walkTo(3 * 16 + 8); B.runJump(9 * 16, 10 * 16 + 12, { lead: -3 }); B.walkTo(11 * 16 + 2, { tol: 2 }); B.runJump(12 * 16, 13 * 16 + 12, { lead: -3 });
    B.walkTo(22 * 16 + 8);
    B.pushTo(B.ent(e => e.crate), 42 * 16);
    B.walkTo(30 * 16 + 8); B.walkTo(31 * 16 + 8); B.jumpTo(31 * 16 + 8);
    B.walkTo(33 * 16 + 8); B.jumpTo(34 * 16 + 8); B.walkTo(36 * 16 + 8);
    B.walkTo(40 * 16 + 8, { tol: 4 });
    B.as('benny');
    B.walkTo(3 * 16 + 8); B.runJump(9 * 16, 10 * 16 + 12, { lead: -3 }); B.walkTo(11 * 16 + 2, { tol: 2 }); B.runJump(12 * 16, 13 * 16 + 12, { lead: -3 });
    B.walkTo(22 * 16 + 8); B.walkTo(26 * 16 + 8); B.walkTo(40 * 16 + 8);
    B.jumpTo(42 * 16 + 8);                 // onto the box
    B.jumpTo(43 * 16 + 8);                 // up through the shelf
    if (B.pos().row !== 10) B.fail('benny not on the shelf');
    B.jumpTo(45 * 16 + 8);                 // into the vent mouth
    if (B.pos().row !== 8) B.fail('benny not at the vent mouth');
    B.use(); B.expectFlag('vent');
    B.walkTo(49 * 16 + 8, { max: 400 });
    B.jumpTo(50 * 16 + 4);                 // up the shaft into the cubby
    B.walkTo(51 * 16 + 8);                 // golden mug
    B.walkTo(49 * 16 + 8, { max: 300, tol: 4 });
    B.walkTo(50 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'dropped into pantry');
    B.walkTo(52 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('pantry');
    B.walkTo(55 * 16 + 8); B.walkTo(50 * 16 + 8);
    B.walkTo(57 * 16 + 4);
    B.enter();
  },
  // R3 basement: Priya stalls the inspector, Dex holds the shutter, Theo fixes the fuses
  (B) => {
    B.as('priya');
    B.walkTo(4 * 16 + 8); B.walkTo(11 * 16 + 4, { tol: 3 });
    B.use(); B.choose(2);
    B.waitFor(() => B.flag('stalled'), 30, 'stalled');
    B.step(200);
    const climb = () => {
      B.walkTo(16 * 16 + 8); B.jumpTo(18 * 16 + 8); B.walkTo(19 * 16 + 8);
      B.jumpTo(21 * 16 + 8); B.walkTo(22 * 16 + 8);
      B.walkTo(24 * 16 + 8, { tol: 4 }); B.walkTo(25 * 16 + 8); B.walkTo(31 * 16 + 8);
      B.walkTo(34 * 16 + 8); B.jumpTo(35 * 16 + 8); B.jumpTo(38 * 16 + 8);
      B.walkTo(40 * 16 + 8); B.walkTo(42 * 16 + 8, { tol: 4 });
    };
    B.as('mila');
    B.walkTo(16 * 16 + 8); B.jumpTo(18 * 16 + 8); B.walkTo(19 * 16 + 8);
    B.jumpTo(21 * 16 + 8); B.walkTo(22 * 16 + 8);
    B.jumpTo(24 * 16 + 8); B.walkTo(28 * 16 + 8);   // shelf C cups
    B.walkTo(31 * 16 + 8, { tol: 4 });
    B.walkTo(34 * 16 + 8); B.jumpTo(35 * 16 + 8); B.jumpTo(38 * 16 + 8);
    B.jumpTo(39 * 16 + 8, { double: true });   // high shelf cup
    B.walkTo(41 * 16 + 8, { tol: 4 });
    B.as('dex'); climb();
    B.walkTo(44 * 16 - 7, { tol: 2 });
    B.use();
    B.waitFor(() => B.ent(e => e.constructor.name === 'Shutter').lift >= 1, 60, 'shutter up');
    B.as('theo'); climb();
    B.walkTo(47 * 16 + 8); B.walkTo(51 * 16 + 8); B.walkTo(52 * 16 + 6, { tol: 3 });
    B.holdUse(80);
    B.waitFor(() => B.flag('fuses'), 10, 'fuses fixed');
    B.walkTo(55 * 16 + 8);
  },
];
