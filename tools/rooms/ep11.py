import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # Larkspur St. in a blizzard: ice, the kid's fort, carolers, the snowplow + the big drift
    g = Grid(64, 17)
    g.rect(0, 14, 64, 3, '#')
    g.hline(9, 14, 7, 'I')                             # ice patch
    g.put(2, 13, '@')
    g.put(20, 13, 'N')                                 # the kid in the snow fort (Priya)
    g.put(28, 13, 'O'); g.put(30, 13, 'Q')             # carolers (Juno)
    g.put(35, 13, 'K')                                 # stalled snowplow (Theo), 2x2
    g.put(39, 13, 'F')                                 # the big drift (5 tall)
    g.hline(44, 14, 6, 'I')                            # ice under the bus stop
    g.rect(46, 10, 4, 1, '#'); g.put(48, 9, '*')       # bus shelter roof: golden mug (Mila)
    g.put(60, 13, 'X')
    g.put(7, 13, 'A'); g.put(25, 13, 'B'); g.put(33, 13, 'E')
    g.put(12, 13, 'q'); g.put(42, 13, 'h'); g.put(55, 13, 'q'); g.put(57, 13, 'j')
    g.cups([(10, 13), (12, 12), (14, 13), (16, 11), (23, 11), (26, 13), (32, 11), (37, 11), (42, 11), (45, 13),
            (47, 9), (49, 9), (52, 11), (58, 13)])
    return g

def r2():  # the alley: snowball snipers, snowmen to hide behind, icy drainpipe, the frozen cellar lock
    g = Grid(60, 17)
    g.rect(0, 14, 60, 3, '#')
    g.hline(6, 14, 7, 'I')
    g.put(2, 13, '@')
    g.put(14, 13, 'S'); g.put(29, 13, 'T'); g.put(34, 13, 'U')   # snowmen (hide)
    g.put(23, 13, 'W'); g.put(43, 13, 'V')             # snowball snipers
    g.vline(47, 5, 9, 'M'); g.hline(48, 5, 5, '=')     # icy drainpipe + fire escape landing (Mila)
    g.put(54, 13, 'K')                                 # frozen cellar lock (Theo)
    g.put(57, 13, 'X')
    g.put(9, 13, 'A'); g.put(50, 13, 'B')
    g.put(4, 13, 'j'); g.put(33, 13, 'j'); g.put(12, 6, 'w'); g.put(25, 6, 'w'); g.put(39, 6, 'w')
    g.cups([(10, 13), (13, 11), (17, 13), (20, 13), (26, 13), (31, 13), (33, 11), (38, 13), (41, 13), (48, 4),
            (50, 4), (52, 4), (52, 13)])
    return g

def r3():  # the boiler room: valve, the duct (Benny), the toppled water heater (Dex), the boiler (Theo)
    g = Grid(56, 17)
    g.rect(0, 0, 56, 2, '#'); g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(10, 13, 'G')                                 # Gus, in three blankets
    g.rect(16, 12, 2, 2, '#')                          # crates
    g.hline(18, 10, 3, '='); g.hline(20, 8, 3, '='); g.hline(21, 6, 2, '=')   # shelves up to the duct
    g.rect(23, 2, 13, 9, '#'); g.hline(23, 5, 13, '.') # the mass (rows 2..10) with a crawl duct (row 5)
    g.put(23, 13, 'J')                                 # boiler-room door (rows 11..13)
    g.put(21, 13, 'V')                                 # steam valve
    g.put(31, 13, 'S')                                 # steam leak in the corridor
    g.put(26, 13, 'C')                                 # toppled water heater (Dex), 1x2
    g.put(38, 13, 'L')                                 # pilot light + door release (Benny drops in here)
    g.put(46, 13, 'K')                                 # THE BOILER (Theo), 2x3
    g.put(7, 13, 'A'); g.put(41, 13, 'B')
    g.put(4, 4, 'Y'); g.put(14, 4, 'Y'); g.put(42, 4, 'Y'); g.put(52, 4, 'Y'); g.put(50, 13, 'x')
    g.cups([(12, 11), (16, 11), (19, 9), (21, 7), (22, 5), (27, 5), (31, 5), (35, 5), (28, 11), (34, 13),
            (40, 11), (44, 13), (50, 11), (53, 13)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
