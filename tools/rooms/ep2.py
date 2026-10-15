import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # 3rd floor hallway, night: Sarge chase past Holloway
    g = Grid(64, 17)
    g.rect(0, 0, 64, 2, '#'); g.rect(0, 14, 64, 3, '#')
    g.rect(50, 11, 14, 3, '#')            # stair landing x50..63 rows 11-13
    g.rect(58, 2, 1, 6, '#')              # wall above the stairwell door
    g.put(58, 9, 'G')                     # door rows 8-9 (gap under it)
    g.put(58, 10, 'V')                    # vent grate in the gap under the door
    g.put(60, 10, 'L'); g.put(62, 10, 'X')
    g.put(44, 13, 'R')                    # dresser 2x2
    g.put(9, 13, 'S')                     # Sarge
    g.put(28, 13, 'W')                    # Holloway on patrol
    g.vline(30, 6, 8, 'M')                # climbing holds x30 rows 6..13
    g.rect(31, 6, 4, 1, '#')              # high ledge x31..34 row 6
    g.put(33, 5, '*')
    g.put(14, 13, 'k'); g.put(42, 13, 'k')
    g.put(2, 13, '@')
    # decor: apartment doors and lamps
    for x in (5, 17, 36): g.put(x, 13, 'd')
    for x in (8, 22, 40, 54): g.put(x, 5, 'l')
    g.put(25, 10, 'i'); g.put(47, 9, 'w')
    g.put(4, 13, 'A')                     # intro trigger
    g.put(18, 13, 'B')                    # holloway warning trigger
    g.cups([(6, 12), (11, 13), (16, 13), (21, 13), (24, 13), (27, 13), (33, 13), (37, 13), (40, 13),
            (44, 11), (52, 10), (55, 10), (61, 10), (31, 5), (32, 5)])
    return g

def r2():  # laundry room
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.rect(34, 11, 26, 3, '#')            # raised floor x34..59 rows 11-13
    g.rect(52, 2, 1, 6, '#')              # wall above shutter
    g.put(52, 10, 'U')                    # dex shutter rows 8-10
    g.put(57, 10, 'X')
    g.put(7, 13, 'K')                     # broken washer
    g.put(10, 13, 'Z')                    # suds hazard x10..14
    g.put(24, 13, 'C')                    # washing machine crate
    g.put(2, 13, '@')
    # optional pipe climb with cups up high
    g.vline(20, 5, 9, 'M'); g.hline(21, 5, 6, '=')
    g.put(44, 10, 'S')                    # Sarge on the raised floor
    g.put(30, 13, 'k')
    for x in (5, 18, 26): g.put(x, 13, 'x')
    for x in (37, 40, 45, 48): g.put(x, 10, 'r')
    g.put(9, 6, 'v'); g.put(36, 6, 'v')
    g.put(17, 13, 'T')                    # trigger
    g.cups([(4, 13), (9, 11), (12, 11), (16, 13), (19, 13), (22, 4), (24, 4), (26, 4), (28, 13), (31, 13),
            (36, 10), (41, 10), (46, 10), (50, 10), (55, 10)])
    return g

def r3():  # Roz's rooftop greenhouse
    g = Grid(56, 17)
    g.rect(0, 14, 56, 3, '#')
    g.rect(55, 0, 1, 17, '#')
    g.put(2, 13, '@')
    g.put(20, 13, 'R')                    # Roz blocks the greenhouse
    g.rect(23, 2, 33, 1, '#')             # greenhouse roof beam
    g.hline(26, 12, 5, '='); g.hline(32, 10, 5, '='); g.hline(38, 8, 5, '=')
    g.hline(44, 6, 6, '='); g.hline(50, 10, 4, '=')
    g.put(47, 5, 'S')                     # Sarge on the top shelf
    g.put(4, 13, 'A')
    g.put(24, 13, 'B')
    for x in (8, 14): g.put(x, 13, 'f')
    g.cups([(6, 13), (10, 13), (16, 13), (27, 11), (29, 11), (33, 9), (35, 9), (39, 7), (41, 7),
            (45, 5), (49, 5), (51, 9), (53, 9), (44, 13), (50, 13)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
