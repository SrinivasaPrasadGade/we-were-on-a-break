import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # cafe front
    g = Grid(56, 17)
    g.rect(0, 0, 56, 2, '#'); g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(10, 13, 'C')                 # the couch (3x1)
    g.put(18, 13, 'Z')                 # X mark (3 wide)
    g.put(21, 13, '#')                 # doorstop
    g.put(23, 13, 'E')                 # broken espresso machine (2x2)
    g.put(26, 13, 'S')                 # steam (2 wide, 3 tall)
    g.put(34, 13, 'P')                 # pigeons
    g.put(52, 13, 'X')                 # kitchen door
    g.hline(12, 12, 4, '='); g.hline(38, 10, 4, '='); g.hline(43, 12, 3, '=')
    g.put(4, 13, 'A'); g.put(29, 13, 'B')
    g.put(6, 9, 'w'); g.put(14, 4, 'l'); g.put(30, 4, 'l'); g.put(46, 4, 'l')
    g.put(31, 13, 't'); g.put(47, 13, 'f'); g.put(16, 13, 't')
    g.cups([(4, 12), (6, 13), (12, 11), (14, 11), (17, 13), (20, 12), (25, 10), (28, 13), (31, 11),
            (38, 9), (40, 9), (43, 11), (45, 11), (49, 13)])
    return g

def r2():  # kitchen
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(9, 13, '^'); g.put(12, 13, '^')
    # walk-in fridge x20..28: roof row 10, back wall x28
    g.rect(20, 10, 9, 1, '#')
    g.put(20, 13, 'F')                 # fridge door (rows 11-13)
    g.put(18, 13, 'K')                 # fridge control panel (broken)
    g.put(24, 13, 'B')                 # box inside the fridge
    # wall between kitchen and pantry at x47; tunnel through it at row 8
    g.rect(47, 2, 1, 5, '#'); g.put(47, 7, 'D'); g.put(47, 9, 'D'); g.rect(47, 10, 1, 2, '#')
    g.put(47, 13, 'G')                 # pantry door rows 12-13
    # vent: entrance mouth at x45 (rows 7-8 open), tunnel x46..50 row 8
    g.hline(45, 9, 5, 'D')             # duct floor x45..49 row 9
    g.hline(45, 6, 1, 'D')             # ceiling over the mouth
    g.hline(46, 7, 6, 'D')             # tunnel ceiling x46..51 row 7
    g.put(51, 8, 'D')                  # tunnel end
    g.put(46, 8, 'V')                  # grate
    # secret: shaft up at x49 (gap in ceiling), cubby x49..51 rows 5-6
    g.put(49, 7, '.'); g.hline(48, 4, 5, 'D'); g.put(48, 5, 'D'); g.put(48, 6, 'D'); g.put(52, 5, 'D'); g.put(52, 6, 'D'); g.hline(50, 7, 2, 'D')
    g.put(51, 6, '*')
    # pantry: x48..58 rows 10..13, ceiling row 9 except the drop at x50
    g.rect(48, 9, 11, 1, '#'); g.put(50, 9, '.'); g.rect(59, 0, 1, 17, '#')
    g.put(48, 9, 'D'); g.put(49, 9, 'D')
    g.put(53, 13, 'L'); g.put(57, 13, 'X')
    # shelf next to the vent
    g.hline(42, 11, 3, '=')
    g.hline(12, 12, 4, '='); g.hline(33, 12, 4, '=')
    g.put(4, 13, 'A'); g.put(38, 13, 'T')
    g.put(14, 13, 'x'); g.put(52, 13, 'x'); g.put(6, 6, 'o'); g.put(25, 6, 'l'); g.put(37, 6, 'l')
    g.cups([(5, 13), (9, 11), (12, 10), (13, 11), (14, 11), (16, 13), (22, 13), (26, 13), (30, 13), (31, 11),
            (34, 11), (36, 11), (40, 13), (43, 10), (50, 13), (55, 13)])
    return g

def r3():  # basement storeroom (dark until the fuses are fixed)
    g = Grid(58, 17)
    g.rect(0, 0, 58, 2, '#'); g.rect(0, 14, 58, 3, '#'); g.rect(57, 0, 1, 17, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'N')                 # the inspector
    g.rect(18, 12, 2, 2, '#')          # box stack A (2 tall)
    g.rect(21, 10, 2, 4, '#')          # box stack B (4 tall)
    g.hline(24, 8, 5, '=')             # shelf C
    g.rect(35, 12, 1, 2, '#')          # step
    g.rect(37, 11, 4, 3, '#')          # crate pile (3 tall)
    g.hline(38, 7, 3, '=')             # high shelf (Mila)
    g.rect(44, 2, 1, 9, '#'); g.put(44, 13, 'U')   # cage wall + shutter
    g.put(53, 13, 'F')                 # fuse box (broken)
    g.put(5, 13, 'A'); g.put(15, 13, 'B'); g.put(42, 13, 'T')
    g.put(8, 13, 'x'); g.put(29, 13, 'x'); g.put(33, 13, 'x'); g.put(48, 13, 'x')
    g.cups([(4, 13), (10, 13), (16, 13), (18, 11), (22, 9), (24, 7), (26, 7), (28, 7), (25, 13), (31, 13),
            (35, 11), (38, 10), (39, 6), (47, 13), (51, 13), (55, 13)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
