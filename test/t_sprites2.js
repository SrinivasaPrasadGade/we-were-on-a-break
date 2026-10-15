const Save = { data: { settings: { touch: 'auto' } } };
const Game = { touchControlsActive: () => false };
resizeScreen();
fill(0, 0, W, H, '#7a8a9a');
FRIENDS.forEach((who, i) => {
  for (let o = 0; o < OUTFITS.length; o++) {
    blitPerson(ctx, friendSpecId(who, o), friendSpecFn(who, o), { anim: 'idle', t: 5, expr: 'happy' }, 16 + o * 26 + i * 0, 46 + i * 0, {});
  }
});
// outfits grid: rows = friends, cols = outfits
fill(0, 0, W, H, '#7a8a9a');
FRIENDS.forEach((who, i) => {
  for (let o = 0; o < OUTFITS.length; o++) {
    blitPerson(ctx, friendSpecId(who, o), friendSpecFn(who, o), { anim: 'idle', t: 5, expr: 'happy' }, 14 + o * 24, 40 + i * 38, {});
  }
});
const npcs = Object.keys(NPC_SPECS);
npcs.forEach((id, k) => {
  const col = k % 8, row = Math.floor(k / 8);
  blitPerson(ctx, 'npc:' + id, npcSpecFn(id), { anim: 'idle', t: 5, expr: 'neutral' }, 170 + col * 26, 44 + row * 40, {});
  drawText(id.slice(0, 5), 158 + col * 26, 46 + row * 40, '#fff', {});
});
const exprs = ['neutral', 'happy', 'grin', 'surprised', 'sad', 'angry', 'smug', 'scared', 'cry', 'dizzy', 'strain', 'pain', 'love', 'wink'];
exprs.forEach((e, k) => {
  blitPerson(ctx, friendSpecId('dex', 0), friendSpecFn('dex', 0), { anim: 'idle', t: 5, expr: e }, 170 + (k % 7) * 26, 200 + Math.floor(k / 7) * 34, {});
});
drawIguana(ctx, 380, 240, false, 10, {});
drawIguana(ctx, 420, 240, true, 10, { tongue: true });
drawPigeon(ctx, 450, 240, false, 3, false);
drawRabbit(ctx, 465, 240, false, 3);
drawRobot(ctx, 400, 262, false, 3, { arm: true });
drawRoboDog(ctx, 440, 262, false, 3, false);
drawDove(ctx, 460, 210, 3);
// crawl
blitPerson(ctx, friendSpecId('benny', 0), friendSpecFn('benny', 0), { anim: 'crawl', t: 3 }, 380, 215, {});
blitPerson(ctx, friendSpecId('dex', 0), friendSpecFn('dex', 0), { anim: 'sit', t: 3 }, 410, 215, {});
blitPerson(ctx, friendSpecId('mila', 0), friendSpecFn('mila', 0), { anim: 'dance', t: 3 }, 440, 215, {});
blitPerson(ctx, friendSpecId('priya', 0), friendSpecFn('priya', 0), { anim: 'idle', t: 3, quirk: 'priya' }, 460, 215, {});
blitPerson(ctx, friendSpecId('dex', 0), friendSpecFn('dex', 0), { anim: 'cry', t: 3 }, 470, 175, {});
present();
