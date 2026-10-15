import sys; sys.path.insert(0, '.')
from mapgen import Grid

def r1():  # Larkspur St., the night before: drop ladder (Mila), the neon sign (Theo), Vance's security shutter (Dex)
    g = Grid(64, 17)
    g.rect(0, 14, 64, 3, '#')
    g.put(2, 13, '@')
    g.hline(44, 9, 12, '=')                            # café awning (x44..55)
    g.put(55, 13, 'T')                                 # drop ladder at the awning's end (rows 9..13)
    g.vline(43, 9, 5, 'M')                             # drainpipe up to the awning (Mila)
    g.put(48, 8, 'L')                                  # ladder release
    g.put(50, 7, 'K')                                  # the busted neon sign (3 wide)
    g.rect(57, 0, 1, 11, '#'); g.put(57, 13, 'U')      # café front + Vance's security shutter
    g.put(60, 13, 'X')
    g.put(8, 13, 'A'); g.put(38, 13, 'B')
    g.put(14, 13, 'q'); g.put(26, 13, 'q'); g.put(20, 13, 'h'); g.put(33, 13, 'j'); g.put(5, 10, 'w'); g.put(30, 10, 'w')
    g.cups([(10, 11), (13, 13), (17, 11), (21, 13), (24, 11), (29, 13), (32, 11), (36, 13), (40, 11), (44, 8),
            (47, 8), (53, 8), (54, 8), (59, 11)])
    return g

def r2():  # the Daily Grind: pigeons (Juno), the couch (Dex), Old Faithful (Theo), string-light clips (Mila)
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(13, 13, 'P')                                 # the pigeons are back
    g.put(17, 13, 'C')                                 # the couch (3 wide)
    g.put(25, 13, 'Z')                                 # its spot (3 wide)
    g.put(32, 13, 'E')                                 # Old Faithful (2x2)
    g.put(35, 13, 'S')                                 # steam (until fixed)
    g.rect(38, 12, 6, 2, '#')                          # the counter
    g.hline(40, 8, 3, '='); g.put(41, 7, 'L')          # light clip A (from the counter)
    g.rect(48, 13, 2, 1, '#')                          # table
    g.hline(50, 10, 3, '='); g.put(51, 9, 'Y')         # light clip B (from the table)
    g.put(57, 13, 'X')
    g.put(8, 13, 'A'); g.put(29, 13, 'B'); g.put(45, 13, 'F')
    g.put(6, 7, 'w'); g.put(46, 6, 'i'); g.put(54, 6, 'o'); g.put(21, 6, 'i')
    g.cups([(10, 11), (12, 13), (16, 11), (20, 11), (22, 13), (28, 11), (30, 13), (37, 13), (39, 11), (42, 11),
            (40, 7), (42, 7), (46, 11), (50, 9), (52, 9), (55, 11)])
    return g

def r3():  # the kitchen: 100 muffins. Mixer (Dex), pantry (Benny), flour (Mila), the oven (Theo); steam + conveyor
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(10, 13, 'C')                                 # the industrial mixer (Dex)
    g.put(17, 13, 'Z')                                 # mixer station mark
    g.hline(20, 14, 7, '{')                            # dish conveyor (pushes back)
    g.put(29, 13, 'S'); g.put(32, 13, 'T')             # steam vents (alternating)
    g.rect(36, 2, 1, 9, '#'); g.put(36, 12, 'G'); g.put(36, 13, 'V')   # pantry wall, door, vent
    g.put(38, 13, 'L')                                 # pantry door release (Benny)
    g.vline(42, 4, 10, 'M'); g.hline(43, 4, 4, '='); g.put(45, 3, 'F')   # shelving ladder + top shelf: flour (Mila)
    g.put(50, 13, 'K')                                 # THE OVEN (Theo), 2x2
    g.put(57, 13, 'X')
    g.put(7, 13, 'A'); g.put(27, 13, 'B'); g.put(40, 13, 'E')
    g.put(5, 9, 'y'); g.put(22, 9, 'y'); g.put(48, 9, 'y')
    g.cups([(8, 11), (13, 13), (15, 11), (21, 13), (24, 13), (27, 11), (30, 11), (34, 13), (39, 11), (43, 3),
            (44, 3), (47, 11), (53, 11), (55, 13)])
    return g

def r4():  # the rooftop: Mrs. Petrakis (Priya), trampoline to the searchlight (Theo), karaoke (Juno), antenna (Mila)
    g = Grid(60, 17)
    g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(12, 13, 'N')                                 # Mrs. Petrakis, moon-bathing (Priya)
    g.put(17, 13, 'R'); g.put(20, 13, 'W')             # Roz and Holloway (chat)
    g.put(24, 13, 'Q')                                 # the karaoke machine (Juno), 2 wide
    g.put(30, 13, 'S')                                 # trampoline (2 wide)
    g.hline(32, 7, 9, '=')                             # water tower catwalk
    g.put(37, 6, 'K')                                  # the searchlight (Theo)
    g.vline(48, 5, 9, 'M'); g.hline(49, 5, 3, '='); g.put(50, 4, 'L'); g.put(51, 4, '*')   # TV antenna + top: banner rope + golden mug (Mila)
    g.put(57, 13, 'X')
    g.put(8, 13, 'A'); g.put(28, 13, 'B'); g.put(44, 13, 'E')
    g.cups([(10, 11), (15, 13), (19, 11), (23, 11), (27, 13), (31, 9), (33, 6), (35, 6), (39, 6), (42, 11),
            (46, 13), (49, 4), (54, 11)])
    return g

def r5():  # the grand reopening: Vance + the critic (Priya), piano (Dex), banner (Mila), stage lights (Theo),
           # the deed (Benny), the show (Juno)
    g = Grid(60, 17)
    g.rect(0, 0, 60, 2, '#'); g.rect(0, 14, 60, 3, '#')
    g.put(2, 13, '@')
    g.put(10, 13, 'N')                                 # Mr. Vance
    g.put(13, 13, 'O')                                 # the food critic
    g.put(17, 13, 'P')                                 # the piano (3x2)
    g.put(26, 13, 'Z')                                 # stage mark (3 wide)
    g.hline(21, 8, 3, '='); g.put(22, 7, 'L')          # banner clip, left (Mila, from the piano)
    g.put(32, 13, 'Q')                                 # Juno's microphone, center stage
    g.rect(36, 12, 6, 2, '#')                          # the counter
    g.hline(38, 8, 3, '='); g.put(39, 7, 'Y')          # banner clip, right (Mila, from the counter)
    g.put(44, 13, 'K')                                 # stage lighting board (Theo)
    g.rect(48, 2, 1, 9, '#'); g.put(48, 12, 'G'); g.put(48, 13, 'V')   # back office: wall, door, vent
    g.put(53, 13, 'J')                                 # the deed, in Vance's briefcase (Benny)
    g.put(7, 13, 'A'); g.put(24, 13, 'B'); g.put(46, 13, 'E')
    g.put(5, 7, 'w'); g.put(56, 7, 'w'); g.put(20, 4, 'z'); g.put(29, 4, 'z'); g.put(43, 4, 'z')
    g.cups([(9, 11), (15, 11), (21, 13), (22, 6), (23, 6), (24, 11), (29, 13), (31, 11), (34, 13), (37, 11),
            (40, 11), (40, 6), (43, 11), (46, 11), (50, 11), (55, 13), (57, 11)])
    return g

if __name__ == '__main__':
    for f in (r1, r2, r3, r4, r5):
        print('=====', f.__name__); g = f(); print(g.js())
