import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # 3rd floor hallway: Holloway inspecting door to door
    g = Grid(52, 17)
    g.rect(0, 0, 52, 2, '#'); g.rect(0, 14, 52, 3, '#')
    g.put(2, 13, '@')
    g.put(9, 13, 'C')                                  # Sarge's terrarium (Dex)
    g.put(13, 13, 'Z')                                 # 3B doorway mark
    g.put(26, 13, 'W')                                 # Holloway, clipboard in hand
    g.put(19, 13, 'P'); g.put(27, 13, 'Q'); g.put(35, 13, 'R')   # doorways to hide in
    g.put(43, 13, 'K')                                 # stairwell keypad (Theo)
    g.rect(45, 2, 1, 9, '#'); g.put(45, 13, 'G')       # stairwell door
    g.put(48, 13, 'X')
    g.put(6, 13, 'A'); g.put(15, 13, 'B'); g.put(40, 13, 'E')
    g.put(23, 7, 'i'); g.put(31, 7, 'i'); g.put(39, 7, 'i'); g.put(10, 8, 'l'); g.put(30, 8, 'l'); g.put(46, 13, 'f')
    g.cups([(11, 11), (16, 13), (17, 11), (22, 13), (24, 11), (30, 13), (32, 11), (38, 13), (41, 11), (44, 11),
            (47, 13), (50, 13), (50, 11)])
    return g

def r2():  # apartment 3A: hide the evidence
    g = Grid(52, 17)
    g.rect(0, 0, 52, 2, '#'); g.rect(0, 14, 52, 3, '#')
    g.put(2, 13, '@')
    g.put(14, 13, 'K')                                 # Tidy-Bot prototype, haywire (Theo)
    g.put(19, 13, 'F')                                 # the fridge (Dex)
    g.put(24, 13, 'Z')                                 # cover the iguana hole
    g.hline(28, 12, 3, '=')                            # kitchen shelf
    g.vline(33, 6, 8, 'M'); g.rect(34, 6, 2, 8, '#')   # tall bookshelf with a climbable side (Mila)
    g.put(35, 5, 'L')                                  # heat-lamp switch on top
    g.hline(38, 9, 3, '='); g.put(39, 8, '*')          # hidden treasure shelf (from the bookshelf top)
    g.put(49, 13, 'X')
    g.put(8, 13, 'A'); g.put(29, 13, 'B')
    g.put(5, 13, 'a'); g.put(10, 7, 'w'); g.put(44, 7, 'w'); g.put(42, 13, 't'); g.put(16, 6, 'i'); g.put(27, 6, 'o')
    g.cups([(10, 11), (12, 13), (16, 11), (21, 11), (26, 13), (28, 11), (30, 11), (34, 5), (37, 13), (40, 8),
            (44, 11), (46, 13)])
    return g

def r3():  # Holloway's office: Roz at the door, the vent, the safe, the rulebook
    g = Grid(52, 17)
    g.rect(0, 0, 52, 2, '#'); g.rect(0, 14, 52, 3, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'N')                                 # Roz (Priya)
    g.rect(20, 2, 1, 9, '#'); g.put(20, 12, 'G'); g.put(20, 13, 'V')   # office wall, door, vent grate
    g.put(22, 13, 'L')                                 # door release (Benny)
    g.rect(27, 12, 2, 2, '#'); g.rect(30, 10, 2, 4, '#')   # filing cabinets
    g.hline(33, 8, 3, '='); g.put(34, 7, 'K')          # shelf + the safe (Theo)
    g.put(40, 13, 'F'); g.put(45, 13, 'R')             # fern, coat rack (hide)
    g.put(43, 13, 'W')                                 # Holloway pacing
    g.put(48, 13, 'B')                                 # the rulebook, on the desk
    g.put(8, 13, 'A'); g.put(24, 13, 'E')
    g.put(5, 7, 'i'); g.put(37, 6, 'o'); g.put(26, 7, 'i'); g.put(50, 13, 'f'); g.put(14, 7, 'w')
    g.cups([(10, 11), (15, 13), (18, 11), (23, 11), (25, 13), (27, 11), (31, 9), (33, 7), (35, 7), (38, 13),
            (42, 11), (47, 11), (50, 11)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3):
        print('=====', f.__name__); g = f(); print(g.js())
