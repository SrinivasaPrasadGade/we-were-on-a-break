#!/usr/bin/env python3
"""Tiny map builder: build a room from feature calls, print JS rows + a ruler view.
Usage inside other scripts:  from mapgen import Grid
"""
import json, sys

class Grid:
    def __init__(self, w, h, fill='.'):
        self.w, self.h = w, h
        self.g = [[fill] * w for _ in range(h)]

    def put(self, x, y, ch):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.g[y][x] = ch
        else:
            raise ValueError(f'put out of range {x},{y} {ch}')
        return self

    def rect(self, x, y, w, h, ch):
        for j in range(h):
            for i in range(w):
                self.put(x + i, y + j, ch)
        return self

    def hline(self, x, y, n, ch):
        return self.rect(x, y, n, 1, ch)

    def vline(self, x, y, n, ch):
        return self.rect(x, y, 1, n, ch)

    def cups(self, pts):
        for x, y in pts:
            if self.g[y][x] != '.':
                raise ValueError(f'cup on non-empty {x},{y} = {self.g[y][x]}')
            self.put(x, y, 'c')
        return self

    def rows(self):
        return [''.join(r) for r in self.g]

    def js(self, indent='        '):
        out = []
        tens = ''.join(str((i // 10) % 10) for i in range(self.w))
        ones = ''.join(str(i % 10) for i in range(self.w))
        out.append(indent + '// ' + tens)
        out.append(indent + '// ' + ones)
        for i, r in enumerate(self.rows()):
            out.append(indent + "'" + r + "', // " + str(i))
        return '\n'.join(out)

    def show(self):
        tens = ''.join(str((i // 10) % 10) for i in range(self.w))
        ones = ''.join(str(i % 10) for i in range(self.w))
        print('    ' + tens)
        print('    ' + ones)
        for i, r in enumerate(self.rows()):
            print(f'{i:2d}  ' + r)
