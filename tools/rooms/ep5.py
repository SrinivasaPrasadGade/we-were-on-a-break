import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # fire escape, vertical: street (row 29), platforms A (23), B (16), C (9)
    g = Grid(30, 32)
    g.rect(0, 30, 30, 2, '#')
    g.put(2, 29, '@')
    g.put(3, 29, 'T')                                   # drop ladder (rows 23..29) once released
    g.hline(2, 23, 7, '='); g.put(3, 23, '.')           # platform A (x2..8)
    g.vline(9, 23, 7, 'M')                              # drainpipe (Mila), top level with platform A
    g.put(5, 22, 'L')                                   # ladder release
    g.vline(7, 16, 7, 'H')                              # A <-> B
    g.hline(2, 16, 26, '='); g.put(7, 16, 'H')          # platform B (x2..27)
    g.put(14, 15, 'N')                                  # Mrs. Petrakis, sunbathing (Priya)
    g.vline(24, 9, 7, 'H')                              # B <-> C
    g.hline(4, 9, 25, '='); g.put(24, 9, 'H')           # platform C (x4..28)
    g.rect(14, 0, 1, 6, '#'); g.put(14, 7, 'G')         # roof-access cage: wall + bars (gap at row 8)
    g.put(12, 8, 'K')                                   # cage release lever (Benny)
    g.put(6, 8, 'X')
    g.vline(28, 2, 7, 'M'); g.put(28, 1, '*')           # Mila-only cornice pipe -> golden mug
    # decor
    g.put(12, 21, 'w'); g.put(20, 21, 'w'); g.put(4, 13, 'w'); g.put(20, 13, 'w'); g.put(9, 5, 'w'); g.put(22, 5, 'w')
    g.put(17, 29, 'd'); g.put(23, 29, 'h'); g.put(27, 29, 'j'); g.put(13, 29, 'q')
    # triggers
    g.put(6, 29, 'A'); g.put(10, 15, 'B'); g.put(19, 8, 'C')
    g.cups([(12, 29), (15, 29), (20, 29), (25, 29),
            (5, 20), (8, 22),
            (9, 15), (12, 13), (17, 15), (21, 15), (26, 15),
            (26, 8), (22, 8), (19, 6), (16, 8), (12, 6), (9, 8), (5, 8)])
    return g

def r2():  # the roof: Sarge on the grill, grill to the X, light it
    g = Grid(64, 17)
    g.rect(0, 14, 64, 3, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'C'); g.put(12, 12, 'S')             # grill + Sarge sunbathing on it
    g.put(30, 13, 'Z'); g.put(30, 12, 'F')             # BBQ mark + flames (Theo)
    g.rect(40, 12, 2, 2, '#')                          # AC unit
    g.rect(45, 13, 3, 1, '#')                          # skylight frame
    g.rect(52, 11, 12, 3, '#'); g.vline(51, 11, 3, 'H')   # raised roof + ladder
    g.put(61, 10, 'X')
    g.put(0, 13, 'd'); g.put(18, 13, 't'); g.put(35, 13, 'a'); g.put(57, 10, 'j'); g.put(48, 13, 'v')
    g.put(8, 13, 'A'); g.put(27, 13, 'B')
    g.cups([(10, 11), (15, 13), (18, 11), (22, 13), (26, 13), (33, 13), (36, 11), (40, 11), (41, 11),
            (44, 13), (46, 12), (49, 11), (53, 10), (55, 8), (59, 10)])
    return g

def r3():  # the water tower: Holloway on patrol, cooler step, party lights
    g = Grid(56, 17)
    g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(10, 13, 'R')                                 # Roz (chat)
    g.put(25, 13, 'W')                                 # Holloway (watcher)
    g.put(39, 13, 'k')
    g.put(40, 13, 'B')                                 # cooler (Dex)
    g.hline(43, 7, 9, '='); g.vline(47, 7, 2, 'H')     # catwalk + short ladder (rows 7..8)
    g.put(45, 6, 'J')                                  # party-light junction box (Theo)
    g.put(5, 13, 'A'); g.put(36, 13, 'E')
    g.put(6, 13, 't'); g.put(14, 13, 'a')
    g.cups([(10, 11), (13, 13), (17, 13), (21, 13), (23, 13), (29, 13), (33, 13), (36, 11), (42, 13),
            (44, 6), (49, 6), (51, 6), (53, 13), (54, 10)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
