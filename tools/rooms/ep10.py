import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # the expo floor: Tidy-Bot bolts, security, the voice-activated door, the display in the aisle
    g = Grid(64, 17)
    g.rect(0, 0, 64, 2, '#'); g.rect(0, 14, 64, 3, '#')
    g.put(2, 13, '@')
    g.put(14, 13, 'R')                                 # Tidy-Bot (runs off)
    g.hline(16, 14, 8, '}')                            # moving walkway (helps)
    g.put(27, 13, 'N')                                 # expo security (Priya)
    g.rect(35, 2, 1, 9, '#'); g.put(35, 13, 'S')       # Kessler's voice-activated door demo (Juno)
    g.rect(41, 2, 8, 9, '#'); g.put(42, 13, 'C')       # low exhibit aisle + Robo-Butler display (Dex)
    g.vline(53, 4, 10, 'M'); g.hline(54, 4, 4, '='); g.put(56, 3, '*')   # jumbotron truss: golden mug (Mila)
    g.put(61, 13, 'X')
    g.put(8, 13, 'A'); g.put(24, 13, 'B'); g.put(38, 13, 'E')
    g.put(31, 9, 'n'); g.put(50, 9, 'n'); g.put(22, 9, 'n')
    g.cups([(10, 11), (17, 13), (20, 13), (23, 13), (25, 11), (30, 13), (32, 11), (37, 11), (40, 13), (45, 13),
            (50, 11), (54, 3), (57, 3), (59, 11)])
    return g

def r2():  # Kessler's booth: tesla fence + truss switch, the remote in the display case, the robo-dog gate
    g = Grid(56, 17)
    g.rect(0, 0, 56, 2, '#'); g.rect(0, 14, 56, 3, '#')
    g.put(2, 13, '@')
    g.put(11, 13, 'N')                                 # Dr. Kessler (Priya)
    g.vline(16, 5, 9, 'M'); g.hline(17, 5, 3, '=')     # truss + gantry (Mila)
    g.put(19, 4, 'L')                                  # tesla power switch
    g.rect(22, 2, 1, 9, '#'); g.put(22, 13, 'T')       # tesla fence (rows 11..13) under the booth wall
    g.put(30, 13, 'K')                                 # display case with the remote (Theo)
    g.put(41, 13, 'Q')                                 # Kessler's robo-dog (Juno)
    g.rect(45, 2, 1, 8, '#'); g.put(45, 13, 'G')       # the dog's gate (rows 10..13)
    g.put(53, 13, 'X')
    g.put(7, 13, 'A'); g.put(26, 13, 'B'); g.put(37, 13, 'E')
    g.put(4, 8, 'n'); g.put(33, 8, 'n'); g.put(49, 8, 'n'); g.put(28, 13, 'x')
    g.cups([(9, 11), (13, 13), (15, 11), (17, 4), (18, 4), (20, 11), (24, 13), (27, 11), (33, 13), (36, 11),
            (39, 13), (43, 11), (48, 13), (51, 11)])
    return g

def r3():  # the main stage: the judge, Kessler's machine on the power cable, speakers, Tidy-Bot on the truss
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'N')                                 # the judge (Priya)
    g.put(19, 13, 'C')                                 # Kessler-Matic 9000 parked on the power cable (Dex)
    g.put(28, 13, 'K')                                 # stage speakers (Theo), 1x2
    g.vline(40, 4, 10, 'M'); g.hline(36, 4, 4, '=')    # lighting truss + top platform (Mila)
    g.put(38, 3, 'R')                                  # Tidy-Bot, up on the truss
    g.put(8, 13, 'A'); g.put(24, 13, 'B'); g.put(32, 13, 'E')
    g.put(5, 8, 'n'); g.put(46, 8, 'n'); g.put(52, 13, 'x')
    g.cups([(10, 11), (15, 13), (16, 11), (25, 13), (26, 11), (30, 13), (34, 11), (37, 3), (39, 3), (42, 13),
            (45, 11), (49, 13), (53, 11), (56, 13)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
