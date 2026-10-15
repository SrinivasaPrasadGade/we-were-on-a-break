// ---------------------------------------------------------------------------
// Boot (supports the artifact viewer's hot-update hook when present)
// ---------------------------------------------------------------------------
let _booted = false;
function start(data) {
  if (_booted) { if (data && data.save) { Save.data = deepMerge(Save.defaults(), data.save); } return; }
  _booted = true;
  boot(data || {});
}
try {
  const hot = window.claude && window.claude.hot;
  if (hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {});
} catch (e) { start({}); }
// test hook
window.__gang = { present, Game, Save, Input, LevelScene, EPISODES, FRIENDS, Music, AudioSys, playEpisode, goHub, HubScene, TitleScene, CutsceneScene, CreditsScene, ResultsScene, compileSong, SONGS };
