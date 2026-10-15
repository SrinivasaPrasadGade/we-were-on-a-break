#!/usr/bin/env python3
"""Assemble src/14_episodes.js from tools/eps/*.tpl + room specs."""
import os, re, sys, glob
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from inject import rooms
out = open(os.path.join(here, 'eps', 'header.js')).read()
for tpl in sorted(glob.glob(os.path.join(here, 'eps', 'ep*.js.tpl'))):
    n = int(re.search(r'ep(\d+)', os.path.basename(tpl)).group(1))
    t = open(tpl).read()
    spec = 'ep%d.py' % n
    maps = rooms(spec)
    def sub(m):
        key = m.group(1)
        if key not in maps: raise SystemExit('missing map %s in %s' % (key, spec))
        return maps[key].lstrip()
    t = re.sub(r'@@(r\d+)@@', sub, t)
    out += t.rstrip() + '\n\n'
open(os.path.join(here, '..', 'src', '14_episodes.js'), 'w').write(out)
print('episodes assembled')
