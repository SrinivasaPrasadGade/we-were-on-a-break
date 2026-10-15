import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # dark stairwell, vertical: landings A (row 8), B (17), C (26), bottom (34)
    g = Grid(30, 37)
    g.rect(0, 0, 30, 2, '#'); g.rect(0, 35, 30, 2, '#')
    # landing A: spawn, electric stair door (Theo), ladder down at x26
    g.rect(0, 9, 30, 1, '#'); g.vline(26, 9, 9, 'H')
    g.rect(11, 2, 1, 5, '#'); g.put(11, 8, 'G'); g.put(10, 8, 'P')
    g.put(2, 8, '@')
    # landing B: Clap-o-Matic (Juno) drops the trapdoor at x3..4
    g.rect(0, 18, 30, 1, '#'); g.put(3, 18, 'T')
    g.put(8, 17, 'Q'); g.put(17, 17, '^')
    g.put(6, 11, 'Y'); g.put(19, 11, 'Y')
    # landing C: optional emergency light (Theo), ladder down at x24
    g.rect(0, 27, 30, 1, '#'); g.vline(24, 27, 8, 'H')
    g.put(14, 25, 'K'); g.put(8, 26, 'k')
    # bottom: drainpipe (Mila) up to the breaker ledge; basement door
    g.vline(10, 30, 5, 'M'); g.rect(11, 30, 2, 1, '#'); g.put(12, 29, 'L')
    g.put(27, 34, 'X')
    # decor
    g.put(4, 8, 'd'); g.put(15, 8, 'd'); g.put(21, 4, 'l'); g.put(13, 13, 'l'); g.put(24, 22, 'l'); g.put(5, 31, 'l')
    g.put(20, 32, 'm'); g.put(2, 26, 'x')
    # triggers
    g.put(8, 8, 'A'); g.put(22, 17, 'B'); g.put(17, 34, 'C')
    g.cups([(14, 8), (17, 6), (20, 8), (23, 8),
            (23, 17), (20, 15), (13, 17), (6, 17),
            (6, 26), (11, 26), (16, 26), (19, 24), (21, 26),
            (5, 34), (11, 29), (15, 34), (21, 34)])
    return g

def r2():  # dark basement corridor
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(11, 13, '^'); g.put(15, 13, '^')
    g.put(19, 13, 'B')                 # box
    g.put(25, 13, 'P')                 # heavy plate
    g.rect(30, 2, 1, 9, '#'); g.put(30, 13, 'G')   # wall + weighted door (rows 11-13)
    g.rect(38, 2, 4, 8, '#')           # collapsed shelving (rows 2..9)
    g.put(38, 12, 'J')                 # jammed shutter, 4 wide, rows 10..12
    g.put(38, 13, 'V')                 # vent grate at the crawl gap (row 13)
    g.put(43, 13, 'L')                 # lever behind the shelving
    # secret cubby: two steps up, crawl-height alcove behind a sound door
    g.hline(45, 12, 2, '='); g.hline(47, 11, 3, '=')
    g.rect(50, 2, 7, 8, '#'); g.rect(50, 11, 7, 1, '#'); g.put(56, 10, '#')
    g.put(50, 10, 'S'); g.put(55, 10, '*')
    g.put(58, 13, 'X')
    g.put(9, 13, 'A'); g.put(27, 13, 'R'); g.put(35, 13, 'U'); g.put(46, 13, 'W')
    g.put(22, 6, 'l'); g.put(34, 6, 'l'); g.put(45, 6, 'l'); g.put(5, 9, 'p'); g.put(32, 13, 'x'); g.put(6, 13, 'j')
    g.cups([(11, 11), (13, 13), (15, 11), (22, 13), (24, 11), (28, 13), (33, 11), (36, 13),
            (40, 13), (44, 13), (46, 11), (48, 10), (52, 10), (53, 10), (53, 13), (56, 13)])
    return g

def r3():  # generator room
    g = Grid(52, 17)
    g.rect(0, 0, 52, 2, '#'); g.rect(0, 14, 52, 3, '#'); g.rect(51, 0, 1, 17, '#')
    g.put(2, 13, '@')
    g.put(14, 13, 'N')                 # Holloway (Priya)
    g.rect(22, 12, 2, 2, '#')          # crates
    g.hline(26, 10, 6, '=')            # catwalk (Mila)
    g.rect(34, 2, 1, 9, '#'); g.put(34, 13, 'U')   # cage wall + shutter (Dex)
    g.put(42, 13, 'K')                 # generator (2x2, Theo)
    g.put(9, 13, 'A'); g.put(31, 13, 'B')
    g.put(4, 8, 'l'); g.put(18, 6, 'l'); g.put(40, 6, 'l'); g.put(46, 13, 'x'); g.put(37, 12, 'p'); g.put(48, 13, 'r')
    g.cups([(11, 13), (17, 13), (20, 11), (22, 11), (23, 11), (26, 9), (28, 9), (31, 9), (29, 13),
            (36, 13), (39, 11), (46, 11), (49, 13)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
