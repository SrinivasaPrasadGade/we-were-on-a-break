import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # Terminal B: moving walkway, security, the luggage jam, the departures board
    g = Grid(64, 17)
    g.rect(0, 0, 64, 2, '#'); g.rect(0, 14, 64, 3, '#')
    g.put(2, 13, '@')
    g.hline(9, 14, 8, '}')                             # moving walkway
    g.put(21, 13, 'N')                                 # airport security (Priya)
    g.rect(30, 2, 9, 9, '#')                           # low passage (rows 11..13)
    g.put(31, 13, 'C')                                 # lost-luggage pile (Dex), 2x2
    g.vline(46, 5, 9, 'M'); g.hline(47, 5, 4, '='); g.put(49, 4, '*')   # board pole + top: golden mug (Mila)
    g.put(61, 13, 'X')
    g.put(7, 13, 'A'); g.put(27, 13, 'B'); g.put(42, 13, 'E')
    g.put(56, 13, 'j')
    g.cups([(10, 13), (13, 13), (16, 13), (18, 11), (24, 13), (26, 11), (34, 13), (37, 13), (40, 11), (44, 13),
            (48, 4), (50, 4), (53, 11), (58, 13)])
    return g

def r2():  # the concourse: a tour group, the broken escalator up to the mezzanine, the locked jet-bridge gate
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(13, 13, 'N'); g.put(15, 13, 'O'); g.put(17, 13, 'Q')   # tour group (Juno)
    g.put(23, 13, 'K')                                 # escalator controls (Theo), 2 wide
    g.put(27, 13, 'P')                                 # escalator lift (2 wide)
    g.rect(29, 8, 31, 1, '#')                          # mezzanine floor (row 8)
    g.rect(46, 9, 1, 5, '#')                           # lower concourse dead-ends
    g.rect(50, 2, 1, 3, '#'); g.put(50, 6, 'G'); g.put(50, 7, 'V')   # jet-bridge gate: wall, door (rows 5..6), grate (row 7)
    g.put(52, 7, 'L')                                  # gate release (Benny)
    g.put(57, 7, 'X')
    g.put(8, 13, 'A'); g.put(21, 13, 'B'); g.put(35, 7, 'E')
    g.put(4, 9, 'n'); g.put(38, 4, 'n'); g.put(33, 13, 'x'); g.put(40, 13, 'x')
    g.cups([(10, 11), (12, 13), (19, 11), (21, 11), (25, 13), (28, 9), (31, 7), (34, 5), (38, 7), (42, 5), (45, 7),
            (48, 7), (53, 5), (55, 7)])
    return g

def r3():  # gate 47: the gate agent, the luggage lane, the PA system, Gus by the window, Sarge's escape
    g = Grid(56, 17)
    g.rect(0, 0, 56, 2, '#'); g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(11, 13, 'N')                                 # gate agent (Priya)
    g.rect(16, 2, 10, 9, '#')                          # boarding lane (rows 11..13)
    g.put(17, 13, 'C')                                 # lost-luggage pile (Dex)
    g.put(30, 13, 'K')                                 # PA system (Theo), 1x2
    g.put(33, 13, 'Q')                                 # PA microphone (Juno)
    g.put(38, 13, 'S')                                 # Sarge (escapes onto the jet bridge)
    g.put(46, 13, 'G')                                 # Gus, waiting by the window
    g.hline(41, 10, 4, '=')                             # baggage shelf
    g.put(8, 13, 'A'); g.put(28, 13, 'B')
    g.put(44, 7, 'w'); g.put(48, 7, 'w'); g.put(52, 7, 'w')
    g.cups([(9, 11), (14, 13), (20, 13), (23, 13), (27, 11), (29, 13), (32, 11), (35, 13), (37, 11), (41, 9),
            (43, 9), (50, 13), (53, 11)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
