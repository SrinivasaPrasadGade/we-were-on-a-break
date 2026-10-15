#!/usr/bin/env python3
"""Run a room spec script and return {roomName: js-rows-string}."""
import subprocess, re, os, sys
def rooms(script):
    here = os.path.dirname(os.path.abspath(__file__))
    out = subprocess.run(['python3', os.path.join(here, 'rooms', script)], capture_output=True, text=True, cwd=here)
    if out.returncode != 0:
        print(out.stderr); sys.exit(1)
    blocks, cur = {}, None
    for line in out.stdout.split('\n'):
        m = re.match(r'===== (r\d+)', line)
        if m: cur = m.group(1); blocks[cur] = []; continue
        if cur: blocks[cur].append(line)
    return {k: '\n'.join(v).rstrip() for k, v in blocks.items()}
