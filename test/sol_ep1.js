window.__sol = window.__sol || {};
window.__sol[0] = [
  // Room 0: Larkspur Street
  (B) => {
    B.as('dex');
    B.jumpTo(4 * 16 + 8);             // onto the truck bed (cup 4,11)
    B.walkTo(7 * 16 + 8);             // cup 7,11
    B.walkTo(10 * 16 + 8);            // drop to street, cup 10,13
    B.jumpTo(12 * 16 + 8);            // planter top, cup 12,11
    B.walkTo(16 * 16 + 8);            // cup 16,13
    B.runJump(19 * 16, 23 * 16 + 8);  // over the open hatch (cup 20,11)
    B.walkTo(24 * 16 + 8);            // cup 24,13
    B.walkTo(29 * 16 + 8);
    B.hold('KeyD', 90);                 // push the box against the stoop
    B.waitFor(() => B.ent(e => e.crate).x === 32 * 16, 10, 'box at the stoop');
    B.walkTo(30 * 16 + 8);
    B.jumpTo(32 * 16 + 8);            // onto the box
    B.jumpTo(35 * 16 + 8);            // onto the stoop -> Mila joins
    B.waitFor(() => B.get('mila').present, 60, 'mila joined');
    B.walkTo(36 * 16 + 8); B.walkTo(42 * 16 + 8); B.walkTo(49 * 16 + 8);
    B.as('mila');
    B.walkTo(38 * 16 + 8);
    B.jumpTo(38 * 16 + 8, { double: true }); // up to fire escape 1
    if (B.pos().row !== 6) B.fail('not on fire escape 1');
    B.walkTo(41 * 16 + 8);
    B.walkTo(45 * 16 + 8);
    B.climb(-1);                      // up the drainpipe
    if (B.pos().row !== 2) B.fail('not at the top of the pipe');
    B.walkTo(42 * 16 + 8);
    B.walkTo(40 * 16 + 8, { tol: 3 });
    B.use();
    B.expectFlag('buzz');
    B.walkTo(39 * 16 + 8);
    B.runJump(46 * 16, 53 * 16 + 8, { double: true }); // across to the neighbor roof
    B.walkTo(58 * 16 + 8);            // golden mug
    B.walkTo(49 * 16 + 8, { tol: 4 });  // drop back onto the stoop
    B.walkTo(46 * 16 + 4);
    B.enter();
  },
  // Room 1: Lobby
  (B) => {
    B.as('dex');
    B.walkTo(4 * 16 + 8); B.walkTo(9 * 16 + 8); B.walkTo(13 * 16 + 8);
    B.walkTo(18 * 16 + 8); B.waitFor(() => B.get('benny').present, 30, 'benny joined');
    B.walkTo(22 * 16 + 8); B.walkTo(26 * 16 + 8); B.walkTo(30 * 16 + 8);
    B.waitFor(() => B.get('theo').present, 30, 'theo joined');
    B.as('theo');
    B.walkTo(33 * 16 + 2, { tol: 3 });
    B.holdUse(80);
    B.expectFlag('elev');
    // Mila rides up for the golden mug
    B.as('mila');
    B.walkTo(32 * 16 + 8);
    B.ride(35 * 16 + 8, 224, 128);
    B.jumpTo(36 * 16 + 8, { double: true });
    if (B.pos().row !== 3) B.fail('mila not on the shaft ledge');
    B.walkTo(33 * 16 + 4, { tol: 4 });   // drop down onto floor 2
    // Benny rides up
    B.as('benny');
    B.walkTo(32 * 16 + 8);
    B.ride(35 * 16 + 8, 224, 128);
    B.walkTo(30 * 16 + 8);
    B.walkTo(28 * 16 + 8);
    B.jumpTo(27 * 16 + 8);            // onto the cabinet
    B.use();                          // open the vent
    B.expectFlag('vent');
    B.walkTo(24 * 16 + 8, { max: 300 });
    B.walkTo(23 * 16 + 8, { tol: 3 });
    B.use();
    B.expectFlag('lev');
    B.walkTo(20 * 16 + 8); B.walkTo(16 * 16 + 8); B.walkTo(12 * 16 + 8); B.walkTo(8 * 16 + 8); B.walkTo(5 * 16 + 8);
    B.walkTo(2 * 16 + 4);
    B.enter();
  },
  // Room 2: 5th floor hallway
  (B) => {
    B.as('priya');
    B.walkTo(10 * 16 + 8);
    B.jumpTo(12 * 16 + 16);           // onto the piano
    B.walkTo(16 * 16 + 8); B.walkTo(21 * 16 + 4, { tol: 3 });
    B.use();
    B.choose(1);
    B.waitFor(() => B.flag('fenwick'), 60, 'fenwick moved');
    B.step(120);
    B.as('juno');
    B.walkTo(10 * 16 + 8); B.jumpTo(12 * 16 + 16);
    B.walkTo(25 * 16 + 8); B.walkTo(30 * 16 + 8);
    B.use(); B.step(80);              // play for the secret door
    B.expectFlag('secret');
    B.walkTo(35 * 16 + 8); B.walkTo(38 * 16 + 8);
    B.use(); B.step(80);
    B.expectFlag('rozdoor');
    B.walkTo(44 * 16 + 8); B.walkTo(48 * 16 + 8); B.walkTo(52 * 16 + 8);
    B.jumpTo(50 * 16 + 8);            // cup 50,10
    B.as('mila');
    B.walkTo(10 * 16 + 8); B.jumpTo(12 * 16 + 16);
    B.walkTo(28 * 16 + 8);
    B.jumpTo(29 * 16 + 8, { double: true });
    if (B.pos().row !== 9) B.fail('mila not on the shelf');
    B.walkTo(30 * 16 + 8); B.walkTo(33 * 16 + 8);  // golden mug
    B.walkTo(27 * 16 + 8);            // drop off the shelf
    B.as('dex');
    B.walkTo(4 * 16 + 8);
    B.jumpTo(4 * 16 + 8);             // cup 4,11
    B.walkTo(11 * 16 + 1, { tol: 2 });
    B.walkTo(53 * 16, { tol: 4, max: 4000 }); // push the piano all the way
    B.waitFor(() => B.flag('mark'), 200, 'piano on the mark');
  },
];
