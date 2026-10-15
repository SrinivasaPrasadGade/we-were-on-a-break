import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # backstage at the Rialto: stage manager, trampoline to the catwalk, top hat to the lift
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'N')                                 # stage manager (Priya)
    g.put(17, 13, 'S')                                 # trampoline (2 wide)
    g.hline(19, 7, 12, '=')                            # catwalk A
    g.put(26, 6, 'K')                                  # dead spotlight (Theo)
    g.put(33, 13, 'C')                                 # giant top hat (Dex)
    g.put(44, 13, 'Z')                                 # stage lift mark
    g.vline(39, 4, 10, 'M')                            # rigging rope (Mila)
    g.hline(40, 4, 6, '='); g.put(44, 3, '*')          # catwalk B: golden mug
    g.put(57, 13, 'X')
    g.put(8, 13, 'A'); g.put(15, 13, 'B'); g.put(30, 13, 'E')
    g.put(5, 13, 'x'); g.put(48, 13, 'x'); g.put(22, 13, 'j'); g.put(52, 9, 'n')
    g.cups([(10, 11), (15, 11), (18, 9), (20, 6), (23, 6), (29, 6), (32, 11), (36, 13), (38, 11), (41, 3), (42, 3),
            (47, 13), (50, 11), (53, 13), (56, 11)])
    return g

def r2():  # under the stage (dark): the rabbit's escape route, the tunnel, the lift motor room
    g = Grid(56, 17)
    g.rect(0, 0, 56, 2, '#'); g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(11, 13, 'R')                                 # Professor Fluffington
    g.put(17, 13, 'S')                                 # trampoline
    g.rect(20, 8, 11, 5, '#')                          # old stage-lift housing; crawl tunnel underneath (row 13)
    g.hline(31, 5, 3, '=')                             # high beam (Mila)
    g.rect(38, 2, 1, 9, '#'); g.put(38, 12, 'G'); g.put(38, 13, 'V')   # motor room wall, door, grate
    g.put(40, 13, 'L')                                 # door release (Benny)
    g.put(45, 13, 'K')                                 # stage-lift motor (Theo)
    g.put(53, 13, 'X')
    g.put(8, 13, 'A'); g.put(34, 13, 'B')
    g.put(6, 3, 'Y'); g.put(24, 3, 'Y'); g.put(44, 3, 'Y'); g.put(14, 13, 'x'); g.put(49, 13, 'x')
    g.cups([(10, 11), (14, 11), (18, 9), (22, 7), (25, 7), (28, 7), (23, 13), (27, 13), (32, 4), (33, 4), (35, 11), (37, 13),
            (42, 11), (47, 13), (50, 11)])
    return g

def r3():  # the stage: heckler, fly rail spotlight, magic box on the trapdoor, drumroll
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(13, 13, 'N')                                 # the heckler (Priya)
    g.put(20, 13, 'S')                                 # trampoline
    g.hline(22, 5, 9, '=')                             # fly rail (Mila: bounce + air jump)
    g.put(27, 4, 'L')                                  # spotlight aiming lever
    g.put(32, 13, 'C')                                 # the magic box (Dex)
    g.put(40, 13, 'Z')                                 # the trapdoor X
    g.put(44, 13, 'K')                                 # trapdoor mechanism (Theo)
    g.put(50, 13, 'Q')                                 # drum kit (Juno's drumroll)
    g.put(8, 13, 'A'); g.put(17, 13, 'B'); g.put(36, 13, 'E')
    g.put(4, 9, 'n'); g.put(55, 9, 'n')
    g.cups([(10, 11), (16, 13), (21, 9), (23, 4), (26, 4), (29, 4), (34, 11), (37, 13), (42, 11), (46, 13), (53, 11),
            (56, 13)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
