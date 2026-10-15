import sys; sys.path.insert(0, '..'); sys.path.insert(0, '.')
from mapgen import Grid

def r1():
    g = Grid(64, 17)
    g.rect(0, 14, 64, 3, '#')
    g.rect(19, 14, 3, 3, '.')          # open cellar hatch (pit)
    g.hline(3, 12, 6, '=')             # truck bed (2 up)
    g.rect(12, 12, 2, 2, '#')          # planter (2 high)
    g.rect(33, 11, 18, 3, '#')         # stoop x33..50 (3 high)
    g.rect(51, 3, 13, 11, '#')         # neighbor building x51..63, top row 3
    g.hline(37, 7, 9, '=')             # fire escape 1 x37..45 row 7
    g.hline(39, 3, 6, '=')             # fire escape 2 x39..44 row 3
    g.vline(45, 3, 4, 'M')             # drainpipe x45 rows 3..6
    g.put(2, 13, '@')
    g.put(26, 13, 'A')                 # moving box
    g.put(40, 2, 'B')                  # buzzer
    g.put(46, 10, 'X')                 # front door on the stoop
    g.put(58, 2, '*')                  # golden mug on neighbor roof
    g.put(1, 13, 'P')                  # intro trigger
    g.put(33, 10, 'R')                 # mila joins trigger (on stoop)
    g.cups([(4, 11), (7, 11), (10, 13), (12, 11), (16, 13), (20, 11), (24, 13), (29, 13),
            (36, 10), (42, 10), (49, 10), (38, 6), (41, 6), (42, 2), (54, 2)])
    return g

def r2():
    g = Grid(40, 17)
    g.rect(0, 0, 40, 2, '#')           # ceiling
    g.rect(37, 0, 3, 17, '#')          # right wall
    g.rect(0, 14, 40, 3, '#')          # floor 1
    g.rect(0, 8, 34, 2, '#')           # floor 2 slab x0..33 rows 8-9
    g.put(27, 6, '#'); g.put(27, 7, '#')   # filing cabinet
    g.put(26, 2, '#'); g.put(26, 3, '#'); g.put(26, 4, 'D')  # wall/duct above the door
    g.put(26, 5, 'V')                  # vent grate
    g.put(26, 7, 'G')                  # locked door (2 tall: rows 6-7)
    g.put(23, 7, 'L')                  # lever behind the door
    g.put(2, 7, 'X')                   # exit to stairwell
    g.put(36, 4, '=')                  # secret ledge in the shaft
    g.put(36, 3, '*')
    g.put(34, 13, 'E')                 # elevator platform (3 wide)
    g.put(33, 13, 'K')                 # broken elevator panel
    g.put(1, 13, '@')
    g.put(5, 11, 'm')                  # mailboxes decor (2x2 at rows 12-13?)
    g.put(15, 13, 'B')                 # benny join trigger
    g.put(28, 13, 'T')                 # theo join trigger
    g.cups([(4, 13), (9, 13), (13, 13), (18, 13), (22, 13), (26, 13), (30, 13), (35, 10),
            (30, 7), (27, 5), (20, 7), (16, 7), (12, 7), (8, 7), (5, 7)])
    return g

def r3():
    g = Grid(58, 17)
    g.rect(0, 0, 58, 2, '#')           # ceiling
    g.rect(0, 14, 58, 3, '#')          # floor
    g.rect(57, 0, 1, 17, '#')          # right wall
    g.put(1, 13, '@')
    g.put(12, 13, 'P')                 # piano 2x2 (x12-13, rows 12-13)
    g.put(22, 13, 'F')                 # Mr. Fenwick
    g.hline(28, 10, 4, '=')            # high shelf x28..31 row 10
    g.rect(31, 2, 4, 6, '#')           # pillar x31..34 rows 2..7
    g.rect(32, 10, 3, 1, '#')          # alcove floor x32..34 row 10
    g.rect(34, 8, 1, 2, '#')           # alcove back wall
    g.put(31, 9, 'Y')                  # small sound door (rows 8-9)
    g.put(33, 9, '*')                  # golden mug
    g.rect(40, 2, 1, 10, '#')          # wall above Roz's door x40 rows 2..11
    g.put(40, 13, 'S')                 # Roz's sound door (rows 12-13)
    g.put(55, 13, 'Z')                 # the X mark (2 wide)
    # decor
    g.put(6, 13, 'd'); g.put(18, 13, 'd'); g.put(45, 13, 'b')
    g.put(9, 5, 'l'); g.put(25, 5, 'l'); g.put(36, 5, 'l'); g.put(48, 5, 'w')
    g.put(4, 13, 'J')                  # intro trigger
    g.put(19, 13, 'Q')                 # fenwick hint trigger
    g.put(36, 13, 'U')                 # sound door hint trigger
    g.cups([(4, 11), (8, 13), (16, 13), (20, 13), (25, 13), (29, 9), (30, 9), (35, 13), (38, 13),
            (44, 13), (48, 13), (52, 13), (50, 10)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__)
        g = f(); g.show(); print(g.js())
