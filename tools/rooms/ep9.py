import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # Larkspur St. station: the token clerk, broken turnstiles, the track pit + maintenance cart
    g = Grid(64, 17)
    g.rect(0, 0, 64, 2, '#'); g.rect(0, 14, 64, 3, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'N')                                 # Marge, the token clerk (Priya)
    g.hline(15, 14, 8, '{')                            # broken escalator walkway (pushes you back)
    g.rect(27, 2, 1, 10, '#'); g.put(27, 13, 'G')      # turnstile wall + turnstile
    g.put(25, 13, 'K')                                 # turnstile control box (Theo)
    g.put(37, 13, 'k')
    g.rect(40, 14, 8, 3, '.')                          # the tracks (fall in = retake)
    g.put(40, 13, 'P')                                 # maintenance cart across the tracks
    g.hline(43, 10, 2, '=')                            # signal ledge over the tracks (Mila)
    g.put(61, 13, 'X')
    g.put(8, 13, 'A'); g.put(23, 13, 'B'); g.put(35, 13, 'C')
    g.put(5, 9, 'n'); g.put(19, 9, 'n'); g.put(31, 9, 'n'); g.put(52, 9, 'n'); g.put(56, 13, 'j'); g.put(33, 13, 'q')
    g.cups([(10, 11), (16, 13), (19, 13), (22, 13), (24, 11), (29, 11), (32, 13), (38, 11), (43, 9), (44, 9),
            (49, 13), (52, 11), (55, 13), (58, 11)])
    return g

def r2():  # the Uptown Local: a car full of grumpy commuters, poles + luggage rack, the connecting door
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(14, 13, 'N'); g.put(16, 13, 'O'); g.put(18, 13, 'Q')   # commuters (Juno)
    g.vline(23, 4, 10, 'M'); g.vline(34, 4, 10, 'M')   # grab poles (Mila)
    g.hline(24, 4, 10, '='); g.put(29, 3, '*')         # luggage rack: golden mug
    g.rect(42, 2, 1, 9, '#'); g.put(42, 13, 'U')       # connecting door (Dex holds it up)
    g.rect(46, 12, 7, 1, '#')                          # bench (crawl underneath)
    g.put(57, 13, 'X')
    g.put(8, 13, 'A'); g.put(38, 13, 'B')
    g.put(6, 7, 'w'); g.put(12, 7, 'w'); g.put(28, 9, 'w'); g.put(48, 7, 'w'); g.put(54, 7, 'w')
    g.cups([(10, 11), (12, 13), (20, 11), (22, 13), (25, 3), (27, 3), (31, 3), (33, 3), (36, 11), (40, 13),
            (44, 11), (47, 13), (49, 13), (51, 13), (49, 11), (55, 11)])
    return g

def r3():  # end of the line: storage manager, unit 7B (vent), the crate, the freight lift up to the dock
    g = Grid(56, 17)
    g.rect(0, 0, 56, 2, '#'); g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(10, 13, 'N')                                 # storage manager (Priya)
    g.rect(15, 12, 2, 2, '#'); g.hline(17, 10, 3, '=')   # box stack + shelf up to the vent
    g.rect(20, 2, 1, 7, '#'); g.put(20, 9, 'V'); g.put(20, 10, '#'); g.put(20, 13, 'G')   # unit 7B: wall, vent, door
    g.put(22, 13, 'L')                                 # door release (inside)
    g.put(25, 13, 'C')                                 # the Tidy-Bot crate (Dex)
    g.rect(31, 2, 1, 9, '#'); g.put(31, 13, 'J')       # unit's far wall + second roll-up door
    g.put(38, 13, 'K')                                 # freight lift power (Theo)
    g.put(40, 13, 'P')                                 # freight lift (3 wide)
    g.rect(43, 8, 13, 6, '#')                          # loading dock
    g.put(47, 7, 'Z')                                  # dock mark for the crate
    g.put(53, 7, 'X')
    g.put(6, 13, 'A'); g.put(34, 13, 'B')
    g.put(4, 4, 'Y'); g.put(26, 4, 'Y'); g.put(37, 4, 'Y'); g.put(50, 3, 'Y'); g.put(13, 13, 'x'); g.put(28, 13, 'x')
    g.cups([(12, 13), (15, 11), (17, 11), (19, 9), (23, 11), (27, 11), (29, 13), (33, 11), (36, 13), (40, 9),
            (45, 7), (50, 7), (52, 5)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
