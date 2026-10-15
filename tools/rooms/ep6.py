import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # the grand ballroom: piano to the bandstand, speaker, sound check
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(11, 13, 'P')                                 # grand piano (3x2)
    g.put(18, 13, 'N')                                 # the wedding planner (Priya)
    g.put(24, 13, 'Z')                                 # bandstand mark (3 wide)
    g.hline(20, 9, 3, '='); g.hline(16, 6, 3, '=')     # chandeliers (Mila)
    g.put(17, 5, '*')
    g.put(29, 13, 'K')                                 # dead speaker (Theo)
    g.put(31, 13, 'Q')                                 # microphone (Juno sound check)
    g.rect(40, 2, 1, 9, '#'); g.put(40, 13, 'G')       # backstage curtain
    g.put(57, 13, 'X')
    g.put(9, 13, 'A'); g.put(21, 13, 'B')
    g.put(5, 7, 'w'); g.put(33, 7, 'w'); g.put(48, 7, 'w'); g.put(36, 13, 'f'); g.put(44, 13, 'x'); g.put(52, 13, 't')
    g.cups([(10, 11), (15, 13), (16, 11), (20, 13), (21, 8), (23, 11), (27, 13), (30, 13), (33, 11), (35, 13),
            (38, 13), (43, 13), (46, 11), (49, 13), (52, 11), (55, 13)])
    return g

def r2():  # the hotel kitchen: Sarge the ring bearer is loose
    g = Grid(64, 17)
    g.rect(0, 0, 64, 2, '#'); g.rect(0, 14, 64, 3, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'S')                                 # Sarge (with the rings)
    g.hline(14, 12, 7, '=')                            # prep table
    g.hline(16, 9, 2, '=')                             # high shelf (Mila)
    g.hline(22, 14, 8, '{')                            # dish conveyor (moves left)
    g.rect(31, 2, 10, 9, '#')                          # low corridor (rows 11..13)
    g.put(33, 13, 'B')                                 # stacked boxes (Dex)
    g.put(46, 13, 'V'); g.put(49, 13, 'W')             # dishwasher steam vents
    g.rect(52, 2, 1, 9, '#'); g.put(52, 12, 'G'); g.put(52, 13, 'U')   # pantry wall, door, vent grate
    g.put(54, 13, 'L')                                 # pantry door release (Benny)
    g.rect(61, 7, 3, 7, '#')                           # walk-in fridge (Sarge hides on top)
    g.put(56, 13, 'X')
    g.put(8, 13, 'A'); g.put(29, 13, 'C'); g.put(43, 13, 'E')
    g.put(6, 9, 'y'); g.put(24, 9, 'y'); g.put(45, 9, 'y'); g.put(56, 9, 'y')
    g.cups([(10, 11), (13, 13), (15, 11), (19, 11), (16, 8), (17, 8), (21, 13), (24, 13), (27, 13), (35, 13), (38, 13),
            (42, 11), (47, 13), (51, 13), (54, 11), (58, 13), (59, 11)])
    return g

def r3():  # the ceremony: photographer, the cake, the vestry, the organ
    g = Grid(56, 17)
    g.rect(0, 0, 56, 2, '#'); g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(13, 13, 'N')                                 # photographer (Priya)
    g.put(17, 13, 'C')                                 # cake cart (Dex)
    g.put(29, 13, 'Z')                                 # reception mark (2 wide)
    g.hline(22, 10, 3, '=')                            # chandelier (Mila)
    g.rect(33, 2, 1, 9, '#'); g.put(33, 12, 'G'); g.put(33, 13, 'V')   # vestry wall, door, grate
    g.put(35, 13, 'L')                                 # vestry door release (Benny)
    g.put(43, 13, 'Y')                                 # the nervous groom
    g.put(47, 13, 'K')                                 # the organ (Theo), 2x2
    g.put(8, 13, 'A'); g.put(26, 13, 'B'); g.put(37, 13, 'E')
    g.put(5, 7, 'w'); g.put(18, 7, 'w'); g.put(52, 7, 'w'); g.put(31, 13, 'f'); g.put(53, 13, 'f')
    g.cups([(10, 11), (12, 13), (16, 11), (21, 13), (23, 9), (25, 13), (28, 11), (32, 13), (36, 11), (38, 13),
            (45, 11), (50, 13), (52, 11), (54, 13)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
