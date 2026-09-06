// ============================================================
// VIRTUAL FILESYSTEM
// Simulated C: drive with directories and files.
// Files have either a `link` (opens in new tab) or
// `data` (plain text / batch script content).
// ============================================================
var fs = [
  {
    name: 'c',
    directories: [
      {
        name: 'SYSTEMS',
        directories: [
          // ── CONSOLE ──────────────────────────────────────────────────────────
          {
            name: 'CONSOLE',
            directories: [
              // ATARI
              {
                name: 'ATARI',
                directories: [
                  {
                    name: '2600',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  2600  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Breakout                       (1978) º\necho                 º   2.  Adventure                      (1980) º\necho                 º   3.  Space Invaders                 (1980) º\necho                 º   4.  Asteroids                      (1981) º\necho                 º   5.  Missile Command                (1981) º\necho                 º   6.  Pac-Man                        (1982) º\necho                 º   7.  Pitfall!                       (1982) º\necho                 º   8.  River Raid                     (1982) º\necho                 º   9.  Yars\' Revenge                  (1982) º\necho                 º  10.  Centipede                      (1983) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'breakout\n',
                          },
                          {
                            name: '2.bat',
                            data: 'adventur\n',
                          },
                          {
                            name: '3.bat',
                            data: 'invaders\n',
                          },
                          {
                            name: '4.bat',
                            data: 'asteroid\n',
                          },
                          {
                            name: '5.bat',
                            data: 'missile\n',
                          },
                          {
                            name: '6.bat',
                            data: 'pacman\n',
                          },
                          {
                            name: '7.bat',
                            data: 'pitfall\n',
                          },
                          {
                            name: '8.bat',
                            data: 'riveraid\n',
                          },
                          {
                            name: '9.bat',
                            data: 'yars\n',
                          },
                          {
                            name: '10.bat',
                            data: 'centiped\n',
                          },
                          {
                            name: 'adventur.exe',
                            link: '../systems/stella/play.html?game=adventure',
                          },
                          {
                            name: 'asteroid.exe',
                            link: '../systems/stella/play.html?game=asteroids',
                          },
                          {
                            name: 'pacman.exe',
                            link: '../systems/stella/play.html?game=pacman',
                          },
                          {
                            name: 'pitfall.exe',
                            link: '../systems/stella/play.html?game=pitfall',
                          },
                          {
                            name: 'invaders.exe',
                            link: '../systems/stella/play.html?game=invaders',
                          },
                          {
                            name: 'breakout.exe',
                            link: '../systems/stella/play.html?game=breakout',
                          },
                          {
                            name: 'missile.exe',
                            link: '../systems/stella/play.html?game=missile',
                          },
                          {
                            name: 'yars.exe',
                            link: '../systems/stella/play.html?game=yars',
                          },
                          {
                            name: 'centiped.exe',
                            link: '../systems/stella/play.html?game=centipede',
                          },
                          {
                            name: 'riveraid.exe',
                            link: '../systems/stella/play.html?game=riverraid',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: '7800',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  7800  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Asteroids                      (1986) º\necho                 º   2.  Centipede                      (1986) º\necho                 º   3.  Joust                          (1986) º\necho                 º   4.  Ms. Pac-Man                    (1986) º\necho                 º   5.  Xevious                        (1986) º\necho                 º   6.  Desert Falcon                  (1987) º\necho                 º   7.  Dig Dug                        (1987) º\necho                 º   8.  Food Fight                     (1987) º\necho                 º   9.  Galaga                         (1987) º\necho                 º  10.  Robotron 2084                  (1987) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'asteroid\n',
                          },
                          {
                            name: '2.bat',
                            data: 'centiped\n',
                          },
                          {
                            name: '3.bat',
                            data: 'joust\n',
                          },
                          {
                            name: '4.bat',
                            data: 'mspacman\n',
                          },
                          {
                            name: '5.bat',
                            data: 'xevious\n',
                          },
                          {
                            name: '6.bat',
                            data: 'desertfl\n',
                          },
                          {
                            name: '7.bat',
                            data: 'digdug\n',
                          },
                          {
                            name: '8.bat',
                            data: 'foodfght\n',
                          },
                          {
                            name: '9.bat',
                            data: 'galaga\n',
                          },
                          {
                            name: '10.bat',
                            data: 'robotron\n',
                          },
                          {
                            name: 'asteroid.exe',
                            link: '../systems/js7800/play.html?game=asteroids',
                          },
                          {
                            name: 'centiped.exe',
                            link: '../systems/js7800/play.html?game=centipede',
                          },
                          {
                            name: 'joust.exe',
                            link: '../systems/js7800/play.html?game=joust',
                          },
                          {
                            name: 'mspacman.exe',
                            link: '../systems/js7800/play.html?game=mspacman',
                          },
                          {
                            name: 'galaga.exe',
                            link: '../systems/js7800/play.html?game=galaga',
                          },
                          {
                            name: 'desertfl.exe',
                            link: '../systems/js7800/play.html?game=desertfl',
                          },
                          {
                            name: 'digdug.exe',
                            link: '../systems/js7800/play.html?game=digdug',
                          },
                          {
                            name: 'xevious.exe',
                            link: '../systems/js7800/play.html?game=xevious',
                          },
                          {
                            name: 'foodfght.exe',
                            link: '../systems/js7800/play.html?game=foodfight',
                          },
                          {
                            name: 'robotron.exe',
                            link: '../systems/js7800/play.html?game=robotron',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               ATARI  CONSOLES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari 2600                     (1977) º\necho                 º                                             º\necho                 º   2.  Atari 7800                     (1986) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd 2600\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd 7800\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },
              {
                name: 'NES',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             NINTENDO  NES  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Super Mario Bros.              (1985) º\necho                 º   2.  Castlevania                    (1987) º\necho                 º   3.  Kid Icarus                     (1987) º\necho                 º   4.  Mega Man                       (1987) º\necho                 º   5.  Metroid                        (1987) º\necho                 º   6.  Mike Tyson\'s P-O!!             (1987) º\necho                 º   7.  Zelda: Link\'s Awakening        (1987) º\necho                 º   8.  Contra                         (1988) º\necho                 º   9.  Tetris                         (1989) º\necho                 º  10.  Final Fantasy                  (1990) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'smb\n',
                      },
                      {
                        name: '2.bat',
                        data: 'castlev\n',
                      },
                      {
                        name: '3.bat',
                        data: 'kidicaru\n',
                      },
                      {
                        name: '4.bat',
                        data: 'megaman\n',
                      },
                      {
                        name: '5.bat',
                        data: 'metroid\n',
                      },
                      {
                        name: '6.bat',
                        data: 'punchout\n',
                      },
                      {
                        name: '7.bat',
                        data: 'zelda\n',
                      },
                      {
                        name: '8.bat',
                        data: 'contra\n',
                      },
                      {
                        name: '9.bat',
                        data: 'tetris\n',
                      },
                      {
                        name: '10.bat',
                        data: 'finalfnt\n',
                      },
                      {
                        name: 'smb.exe',
                        link: '../systems/jsnes/play.html?game=smb',
                      },
                      {
                        name: 'kidicaru.exe',
                        link: '../systems/jsnes/play.html?game=kidicarus',
                      },
                      {
                        name: 'zelda.exe',
                        link: '../systems/jsnes/play.html?game=zelda',
                      },
                      {
                        name: 'contra.exe',
                        link: '../systems/jsnes/play.html?game=contra',
                      },
                      {
                        name: 'megaman.exe',
                        link: '../systems/jsnes/play.html?game=megaman',
                      },
                      {
                        name: 'castlev.exe',
                        link: '../systems/jsnes/play.html?game=castlvnia',
                      },
                      {
                        name: 'metroid.exe',
                        link: '../systems/jsnes/play.html?game=metroid',
                      },
                      {
                        name: 'tetris.exe',
                        link: '../systems/jsnes/play.html?game=tetris',
                      },
                      {
                        name: 'punchout.exe',
                        link: '../systems/jsnes/play.html?game=punchout',
                      },
                      {
                        name: 'finalfnt.exe',
                        link: '../systems/jsnes/play.html?game=finalfnts',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                  },
                ],
              },

              {
                name: 'INTV',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            INTELLIVISION  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Adventure                      (1981) º\necho                 º   2.  Astrosmash                     (1981) º\necho                 º   3.  B-17 Bomber                    (1981) º\necho                 º   4.  Snafu                          (1981) º\necho                 º   5.  Star Strike                    (1981) º\necho                 º   6.  TRON: Deadly Discs             (1981) º\necho                 º   7.  Atlantis                       (1982) º\necho                 º   8.  Lock 'N' Chase                 (1982) º\necho                 º   9.  Night Stalker                  (1982) º\necho                 º  10.  BurgerTime                     (1983) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'advent\n',
                      },
                      {
                        name: '2.bat',
                        data: 'astro\n',
                      },
                      {
                        name: '3.bat',
                        data: 'b-17\n',
                      },
                      {
                        name: '4.bat',
                        data: 'snafu\n',
                      },
                      {
                        name: '5.bat',
                        data: 'starstrk\n',
                      },
                      {
                        name: '6.bat',
                        data: 'tron\n',
                      },
                      {
                        name: '7.bat',
                        data: 'atlantis\n',
                      },
                      {
                        name: '8.bat',
                        data: 'burger\n',
                      },
                      {
                        name: '9.bat',
                        data: 'lockchas\n',
                      },
                      {
                        name: '10.bat',
                        data: 'nightstk\n',
                      },
                      {
                        name: 'astro.exe',
                        link: '../systems/intv/play.html?game=astro',
                      },
                      {
                        name: 'burger.exe',
                        link: '../systems/intv/play.html?game=burger',
                      },
                      {
                        name: 'tron.exe',
                        link: '../systems/intv/play.html?game=tron',
                      },
                      {
                        name: 'snafu.exe',
                        link: '../systems/intv/play.html?game=snafu',
                      },
                      {
                        name: 'b-17.bat',
                        link: '../systems/intv/play.html?game=b17',
                      },
                      {
                        name: 'nightstk.exe',
                        link: '../systems/intv/play.html?game=nightstk',
                      },
                      {
                        name: 'advent.exe',
                        link: '../systems/intv/play.html?game=advent',
                      },
                      {
                        name: 'atlantis.exe',
                        link: '../systems/intv/play.html?game=atlantis',
                      },
                      {
                        name: 'lockchas.exe',
                        link: '../systems/intv/play.html?game=lockchase',
                      },
                      {
                        name: 'starstrk.exe',
                        link: '../systems/intv/play.html?game=starstrk',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                  },
                ],
              },

              {
                name: 'CVISION',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             COLECOVISION  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Carnival                       (1982) º\necho                 º   2.  Cosmic Avenger                 (1982) º\necho                 º   3.  Donkey Kong                    (1982) º\necho                 º   4.  Lady Bug                       (1982) º\necho                 º   5.  Mouse Trap                     (1982) º\necho                 º   6.  Smurf: Rescue in Gargamel\'s    (1982) º\necho                 º   7.  Venture                        (1982) º\necho                 º   8.  Zaxxon                         (1982) º\necho                 º   9.  Mr. Do!                        (1983) º\necho                 º  10.  Q*bert                         (1983) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'carnival\n',
                      },
                      {
                        name: '2.bat',
                        data: 'cosmic\n',
                      },
                      {
                        name: '3.bat',
                        data: 'dkong\n',
                      },
                      {
                        name: '4.bat',
                        data: 'ladybug\n',
                      },
                      {
                        name: '5.bat',
                        data: 'mousetrp\n',
                      },
                      {
                        name: '6.bat',
                        data: 'smurf\n',
                      },
                      {
                        name: '7.bat',
                        data: 'venture\n',
                      },
                      {
                        name: '8.bat',
                        data: 'zaxxon\n',
                      },
                      {
                        name: '9.bat',
                        data: 'mrdo\n',
                      },
                      {
                        name: '10.bat',
                        data: 'qbert\n',
                      },
                      {
                        name: 'dkong.exe',
                        link: '../systems/coleco/play.html?game=dkong',
                      },
                      {
                        name: 'cosmic.exe',
                        link: '../systems/coleco/play.html?game=cosmic',
                      },
                      {
                        name: 'ladybug.exe',
                        link: '../systems/coleco/play.html?game=ladybug',
                      },
                      {
                        name: 'mousetrp.exe',
                        link: '../systems/coleco/play.html?game=mousetrp',
                      },
                      {
                        name: 'carnival.exe',
                        link: '../systems/coleco/play.html?game=carnival',
                      },
                      {
                        name: 'venture.exe',
                        link: '../systems/coleco/play.html?game=venture',
                      },
                      {
                        name: 'smurf.exe',
                        link: '../systems/coleco/play.html?game=smurf',
                      },
                      {
                        name: 'zaxxon.exe',
                        link: '../systems/coleco/play.html?game=zaxxon',
                      },
                      {
                        name: 'mrdo.exe',
                        link: '../systems/coleco/play.html?game=mrdo',
                      },
                      {
                        name: 'qbert.exe',
                        link: '../systems/coleco/play.html?game=qbert',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                  },
                ],
              },

              {
                name: 'ODYSSEY2',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               ODYSSEYý  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Cosmic Conflict!               (1979) º\necho                 º   2.  Alien Invaders+!               (1980) º\necho                 º   3.  K.C. Munchkin!                 (1981) º\necho                 º   4.  Quest for Rings!               (1981) º\necho                 º   5.  UFO!                           (1981) º\necho                 º   6.  Atlantis                       (1982) º\necho                 º   7.  Demon Attack                   (1982) º\necho                 º   8.  Pick Axe Pete!                 (1982) º\necho                 º   9.  Smithereens!                   (1982) º\necho                 º  10.  Killer Bees!                   (1983) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'cosmic\n',
                      },
                      {
                        name: '2.bat',
                        data: 'alienpls\n',
                      },
                      {
                        name: '3.bat',
                        data: 'kcmunch\n',
                      },
                      {
                        name: '4.bat',
                        data: 'qrings\n',
                      },
                      {
                        name: '5.bat',
                        data: 'ufo\n',
                      },
                      {
                        name: '6.bat',
                        data: 'atlantis\n',
                      },
                      {
                        name: '7.bat',
                        data: 'demon\n',
                      },
                      {
                        name: '8.bat',
                        data: 'pickaxe\n',
                      },
                      {
                        name: '9.bat',
                        data: 'smither\n',
                      },
                      {
                        name: '10.bat',
                        data: 'killbees\n',
                      },
                      {
                        name: 'cosmic.exe',
                        link: '../systems/odyssey2/play.html?game=cosmic',
                      },
                      {
                        name: 'alienpls.exe',
                        link: '../systems/odyssey2/play.html?game=alienplus',
                      },
                      {
                        name: 'kcmunch.exe',
                        link: '../systems/odyssey2/play.html?game=kcmunch',
                      },
                      {
                        name: 'qrings.exe',
                        link: '../systems/odyssey2/play.html?game=qrings',
                      },
                      {
                        name: 'ufo.exe',
                        link: '../systems/odyssey2/play.html?game=ufo',
                      },
                      {
                        name: 'atlantis.exe',
                        link: '../systems/odyssey2/play.html?game=atlantis',
                      },
                      {
                        name: 'demon.exe',
                        link: '../systems/odyssey2/play.html?game=demon',
                      },
                      {
                        name: 'pickaxe.exe',
                        link: '../systems/odyssey2/play.html?game=pickaxe',
                      },
                      {
                        name: 'smither.exe',
                        link: '../systems/odyssey2/play.html?game=smither',
                      },
                      {
                        name: 'killbees.exe',
                        link: '../systems/odyssey2/play.html?game=killbees',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                  },
                ],
              },

              {
                name: 'SMS',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º         SEGA  MASTER  SYSTEM  GAMES         º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Alex Kidd in Miracle World     (1986) º\necho                 º   2.  Fantasy Zone                   (1986) º\necho                 º   3.  Wonder Boy                     (1986) º\necho                 º   4.  Out Run                        (1987) º\necho                 º   5.  Phantasy Star                  (1988) º\necho                 º   6.  R-Type                         (1988) º\necho                 º   7.  Shinobi                        (1988) º\necho                 º   8.  Psycho Fox                     (1989) º\necho                 º   9.  Castle of Illusion             (1990) º\necho                 º  10.  Sonic the Hedgehog             (1991) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'alexkidd\n',
                      },
                      {
                        name: '2.bat',
                        data: 'fantzone\n',
                      },
                      {
                        name: '3.bat',
                        data: 'wondrboy\n',
                      },
                      {
                        name: '4.bat',
                        data: 'outrun\n',
                      },
                      {
                        name: '5.bat',
                        data: 'phantstr\n',
                      },
                      {
                        name: '6.bat',
                        data: 'rtype\n',
                      },
                      {
                        name: '7.bat',
                        data: 'shinobi\n',
                      },
                      {
                        name: '8.bat',
                        data: 'psychfox\n',
                      },
                      {
                        name: '9.bat',
                        data: 'castle\n',
                      },
                      {
                        name: '10.bat',
                        data: 'sonic\n',
                      },
                      {
                        name: 'alexkidd.exe',
                        link: '../systems/sms/play.html?game=alexkidd',
                      },
                      {
                        name: 'fantzone.exe',
                        link: '../systems/sms/play.html?game=fantzone',
                      },
                      {
                        name: 'wondrboy.exe',
                        link: '../systems/sms/play.html?game=wondrboy',
                      },
                      {
                        name: 'outrun.exe',
                        link: '../systems/sms/play.html?game=outrun',
                      },
                      {
                        name: 'phantstr.exe',
                        link: '../systems/sms/play.html?game=phantstr',
                      },
                      {
                        name: 'rtype.exe',
                        link: '../systems/sms/play.html?game=rtype',
                      },
                      {
                        name: 'shinobi.exe',
                        link: '../systems/sms/play.html?game=shinobi',
                      },
                      {
                        name: 'psychfox.exe',
                        link: '../systems/sms/play.html?game=psychfox',
                      },
                      {
                        name: 'castle.exe',
                        link: '../systems/sms/play.html?game=castle',
                      },
                      {
                        name: 'sonic.exe',
                        link: '../systems/sms/play.html?game=sonic',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\n',
                  },
                ],
              },
              {
                name: 'VECTREX',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          VECTREX  COMMERCIAL  GAMES         º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Berzerk                        (1982) º\necho                 º   2.  Cosmic Chasm                   (1982) º\necho                 º   3.  Rip-Off                        (1982) º\necho                 º   4.  Scramble                       (1982) º\necho                 º   5.  Solar Quest                    (1982) º\necho                 º   6.  Star Trek                      (1982) º\necho                 º   7.  Polar Rescue                   (1983) º\necho                 º   8.  Pole Position                  (1983) º\necho                 º   9.  Spike                          (1983) º\necho                 º  10.  Star Castle                    (1983) º\necho                 º                                             º\necho                 º  11.  Mine Storm (built-in)                 º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'berzerk\n',
                      },
                      {
                        name: '2.bat',
                        data: 'cosmicch\n',
                      },
                      {
                        name: '3.bat',
                        data: 'ripoff\n',
                      },
                      {
                        name: '4.bat',
                        data: 'scramble\n',
                      },
                      {
                        name: '5.bat',
                        data: 'solarqst\n',
                      },
                      {
                        name: '6.bat',
                        data: 'startrek\n',
                      },
                      {
                        name: '7.bat',
                        data: 'polarrsc\n',
                      },
                      {
                        name: '8.bat',
                        data: 'polepos\n',
                      },
                      {
                        name: '9.bat',
                        data: 'spike\n',
                      },
                      {
                        name: '10.bat',
                        data: 'starcasl\n',
                      },
                      {
                        name: '11.bat',
                        data: 'minestrm\n',
                      },
                      {
                        name: 'starcasl.exe',
                        link: '../systems/jsvecx/play.html?game=starcasl',
                      },
                      {
                        name: 'berzerk.exe',
                        link: '../systems/jsvecx/play.html?game=berzerk',
                      },
                      {
                        name: 'cosmicch.exe',
                        link: '../systems/jsvecx/play.html?game=cosmicch',
                      },
                      {
                        name: 'polepos.exe',
                        link: '../systems/jsvecx/play.html?game=polepos',
                      },
                      {
                        name: 'polarrsc.exe',
                        link: '../systems/jsvecx/play.html?game=polarrsc',
                      },
                      {
                        name: 'spike.exe',
                        link: '../systems/jsvecx/play.html?game=spike',
                      },
                      {
                        name: 'startrek.exe',
                        link: '../systems/jsvecx/play.html?game=startrek',
                      },
                      {
                        name: 'solarqst.exe',
                        link: '../systems/jsvecx/play.html?game=solarqst',
                      },
                      {
                        name: 'ripoff.exe',
                        link: '../systems/jsvecx/play.html?game=ripoff',
                      },
                      {
                        name: 'scramble.exe',
                        link: '../systems/jsvecx/play.html?game=scramble',
                      },
                      {
                        name: 'minestrm.exe',
                        link: '../systems/jsvecx/play.html?game=minestrm',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\n',
                  },
                ],
              },
            ],
            files: [
              {
                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              CONSOLE  SYSTEMS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari                     (1977-1986) º\necho                 º   2.  ColecoVision                   (1982) º\necho                 º   3.  Intellivision                  (1979) º\necho                 º   4.  NES                            (1985) º\necho                 º   5.  Odysseyý                       (1978) º\necho                 º   6.  Sega Master System             (1986) º\necho                 º   7.  Vectrex                        (1982) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
              },
              {
                name: '1.bat',
                data: 'cd atari\nmenu\n',
              },
              {
                name: '2.bat',
                data: 'cd cvision\nmenu\n',
              },
              {
                name: '3.bat',
                data: 'cd intv\nmenu\n',
              },
              {
                name: '4.bat',
                data: 'cd nes\nmenu\n',
              },
              {
                name: '5.bat',
                data: 'cd odyssey2\nmenu\n',
              },
              {
                name: '6.bat',
                data: 'cd sms\nmenu\n',
              },
              {
                name: '7.bat',
                data: 'cd vectrex\nmenu\n',
              },
              {
                name: '0.bat',
                data: 'cd ..\nmenu\n',
              },
            ],
          },

          // ── HOME COMPUTERS ───────────────────────────────────────────────────
          {
            name: 'HOMECOMP',
            directories: [
              // ACORN (BBC Micro 1981 + Electron 1983)
              {
                name: 'ACORN',
                directories: [
                  {
                    name: 'BBC',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              BBC  MICRO  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Snapper                        (1982) º\necho                 º   2.  Chuckie Egg                    (1983) º\necho                 º   3.  Elite                          (1984) º\necho                 º   4.  Frak!                          (1984) º\necho                 º   5.  Repton                         (1985) º\necho                 º   6.  Castle Quest                   (1985) º\necho                 º   7.  Jet Set Willy                  (1986) º\necho                 º   8.  Thrust                         (1986) º\necho                 º   9.  Firetrack                      (1987) º\necho                 º  10.  Exile                          (1988) º\necho                 º                                             º\necho                 º  11.  BASIC system prompt                   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'snapper\n',
                          },
                          {
                            name: '2.bat',
                            data: 'chuckegg\n',
                          },
                          {
                            name: '3.bat',
                            data: 'elite\n',
                          },
                          {
                            name: '4.bat',
                            data: 'frak\n',
                          },
                          {
                            name: '5.bat',
                            data: 'repton\n',
                          },
                          {
                            name: '6.bat',
                            data: 'castleq\n',
                          },
                          {
                            name: '7.bat',
                            data: 'jetwilly\n',
                          },
                          {
                            name: '8.bat',
                            data: 'thrust\n',
                          },
                          {
                            name: '9.bat',
                            data: 'firetrak\n',
                          },
                          {
                            name: '10.bat',
                            data: 'exile\n',
                          },
                          {
                            name: '11.bat',
                            data: 'prompt\n',
                          },
                          {
                            name: 'elite.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Acornsoft/Elite.ssd&autoboot&GP.A=A&GP.RB=SPACE&GP.LB=SLASH&GP.D12=S&GP.D13=X&GP.D14=COMMA&GP.D15=PERIOD',
                          },
                          {
                            name: 'chuckegg.exe',
                            link: '../systems/bbcmicro/dist/?disc1=AnF/ChuckieEgg.ssd&autoboot&GP.FIRE=SPACE&GP.D12=A&GP.D13=Z&GP.D14=COMMA&GP.D15=PERIOD',
                          },
                          {
                            name: 'repton.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Superior/Repton.ssd&autoboot',
                          },
                          {
                            name: 'castleq.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Micropower/CastleQuest.ssd&autoboot',
                          },
                          {
                            name: 'jetwilly.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Tynesoft/JetSetWilly.ssd&autoboot',
                          },
                          {
                            name: 'frak.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Aardvark/Frak.ssd&autoboot',
                          },
                          {
                            name: 'exile.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Superior/Exile.ssd&autoboot',
                          },
                          {
                            name: 'thrust.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Superior/Thrust.ssd&autoboot&GP.D14=CAPSLOCK&GP.D15=CTRL&GP.D12=SHIFT&GP.B=SPACE',
                          },
                          {
                            name: 'snapper.exe',
                            link: '../systems/bbcmicro/dist/?disc1=Acornsoft/Snapper-v1-alt.ssd&autoboot',
                          },
                          {
                            name: 'firetrak.exe',
                            link: '../systems/bbcmicro/dist/?disc1=ElectricDreams/Firetrack.ssd&autoboot',
                          },
                          {
                            name: 'prompt.exe',
                            link: '../systems/bbcmicro/dist/?disc1=blank.ssd',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'ELECTRON',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           ACORN  ELECTRON  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Cybertron Mission              (1983) º\necho                 º   2.  Snapper                        (1983) º\necho                 º   3.  Starship Command               (1983) º\necho                 º   4.  Boxer                          (1984) º\necho                 º   5.  Citadel                        (1985) º\necho                 º   6.  Elite                          (1985) º\necho                 º                                             º\necho                 º   7.  Electron BASIC prompt                 º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'cybrtron\n',
                          },
                          {
                            name: '2.bat',
                            data: 'snapper\n',
                          },
                          {
                            name: '3.bat',
                            data: 'starship\n',
                          },
                          {
                            name: '4.bat',
                            data: 'boxer\n',
                          },
                          {
                            name: '5.bat',
                            data: 'citadel\n',
                          },
                          {
                            name: '6.bat',
                            data: 'elite\n',
                          },
                          {
                            name: '7.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'snapper.exe',
                            link: '../systems/electron/play.html?game=snapper',
                          },
                          {
                            name: 'citadel.exe',
                            link: '../systems/electron/play.html?game=citadel',
                          },
                          {
                            name: 'starship.exe',
                            link: '../systems/electron/play.html?game=starship',
                          },
                          {
                            name: 'boxer.exe',
                            link: '../systems/electron/play.html?game=boxer',
                          },
                          {
                            name: 'cybrtron.exe',
                            link: '../systems/electron/play.html?game=cybertron',
                          },
                          {
                            name: 'elite.exe',
                            link: '../systems/electron/play.html?game=elite',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/electron/play.html',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'MASTER',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           MASTER-ENHANCED  TITLES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Commando                       (1985) º\necho                 º   2.  Galaforce                      (1986) º\necho                 º   3.  Elite                          (1986) º\necho                 º   4.  Crazee Rider                   (1987) º\necho                 º   5.  Bonecruncher                   (1987) º\necho                 º   6.  Palace of Magic                (1987) º\necho                 º   7.  Fair or Foul                   (1988) º\necho                 º   8.  Ballistix                      (1989) º\necho                 º   9.  Holed Out                      (1989) º\necho                 º  10.  Nevryon                        (1990) º\necho                 º                                             º\necho                 º  11.  BBC BASIC prompt                      º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'commando\n',
                          },
                          {
                            name: '2.bat',
                            data: 'galforce\n',
                          },
                          {
                            name: '3.bat',
                            data: 'elite\n',
                          },
                          {
                            name: '4.bat',
                            data: 'crazee\n',
                          },
                          {
                            name: '5.bat',
                            data: 'bonecrun\n',
                          },
                          {
                            name: '6.bat',
                            data: 'palace\n',
                          },
                          {
                            name: '7.bat',
                            data: 'bfmof\n',
                          },
                          {
                            name: '8.bat',
                            data: 'ballistx\n',
                          },
                          {
                            name: '9.bat',
                            data: 'holedout\n',
                          },
                          {
                            name: '10.bat',
                            data: 'nevryon\n',
                          },
                          {
                            name: '11.bat',
                            data: 'prompt\n',
                          },
                          {
                            name: 'elite.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Acornsoft/EliteMaster.dsd&autoboot',
                          },
                          {
                            name: 'nevryon.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=4thDimension/Nevryon.ssd&autoboot',
                          },
                          {
                            name: 'galforce.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/Galaforce.ssd&autoboot',
                          },
                          {
                            name: 'palace.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/PalaceOfMagic.ssd&autoboot',
                          },
                          {
                            name: 'bonecrun.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/BoneCruncher.ssd&autoboot',
                          },
                          {
                            name: 'crazee.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/CrazeeRider.ssd&autoboot',
                          },
                          {
                            name: 'commando.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Elite/Commando.ssd&autoboot',
                          },
                          {
                            name: 'bfmof.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/ByFairMeansOrFoul.ssd&autoboot',
                          },
                          {
                            name: 'holedout.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=4thDimension/HoledOut.ssd&autoboot',
                          },
                          {
                            name: 'ballistx.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/Ballistix.ssd&autoboot',
                          },
                          {
                            name: 'prompt.exe',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=blank.ssd',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ACORN  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  BBC Micro                      (1981) º\necho                 º                                             º\necho                 º   2.  Acorn Electron                 (1983) º\necho                 º                                             º\necho                 º   3.  BBC Master                     (1986) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd bbc\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd electron\ncd games\nmenu\n',
                  },
                  {
                    name: '3.bat',
                    data: 'cd master\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },

              // APPLE (Apple I 1976 + Apple ][+ 1977)
              {
                name: 'APPLE',
                directories: [
                  {
                    name: 'APPLE1',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               APPLE  I  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Game of Life                   (1970) º\necho                 º   2.  Hamurabi                       (1971) º\necho                 º   3.  Hunt the Wumpus                (1973) º\necho                 º   4.  Blackjack                      (1976) º\necho                 º   5.  Microchess                     (1976) º\necho                 º   6.  Lunar Lander                   (1976) º\necho                 º   7.  Star Trek                      (1977) º\necho                 º   8.  Checkers                       (1978) º\necho                 º   9.  Apple 30th Anniv.              (2006) º\necho                 º  10.  15 Puzzle                      (2020) º\necho                 º                                             º\necho                 º  11.  Woz Monitor prompt                    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'life\n',
                          },
                          {
                            name: '2.bat',
                            data: 'hamurabi\n',
                          },
                          {
                            name: '3.bat',
                            data: 'wumpus\n',
                          },
                          {
                            name: '4.bat',
                            data: 'blackjk\n',
                          },
                          {
                            name: '5.bat',
                            data: 'chess\n',
                          },
                          {
                            name: '6.bat',
                            data: 'lunar\n',
                          },
                          {
                            name: '7.bat',
                            data: 'startrek\n',
                          },
                          {
                            name: '8.bat',
                            data: 'checkers\n',
                          },
                          {
                            name: '9.bat',
                            data: 'apple30\n',
                          },
                          {
                            name: '10.bat',
                            data: 'puzzle15\n',
                          },
                          {
                            name: '11.bat',
                            data: 'prompt\n',
                          },
                          {
                            name: 'startrek.exe',
                            link: '../systems/apple1/play.html?tape=startrek',
                          },
                          {
                            name: 'blackjk.exe',
                            link: '../systems/apple1/play.html?tape=blackjack',
                          },
                          {
                            name: 'chess.exe',
                            link: '../systems/apple1/play.html?tape=chess',
                          },
                          {
                            name: 'hamurabi.exe',
                            link: '../systems/apple1/play.html?tape=hamurabi',
                          },
                          {
                            name: 'lunar.exe',
                            link: '../systems/apple1/play.html?tape=lunar',
                          },
                          {
                            name: 'wumpus.exe',
                            link: '../systems/apple1/play.html?tape=wumpus',
                          },
                          {
                            name: 'checkers.exe',
                            link: '../systems/apple1/play.html?tape=checkers',
                          },
                          {
                            name: 'puzzle15.exe',
                            link: '../systems/apple1/play.html?tape=puzzle15',
                          },
                          {
                            name: 'life.exe',
                            link: '../systems/apple1/play.html?tape=life',
                          },
                          {
                            name: 'apple30.exe',
                            link: '../systems/apple1/play.html?tape=apple30',
                          },
                          {
                            name: 'prompt.exe',
                            link: '../systems/apple1/play.html',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'APPLEII',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              APPLE  ][  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Lemonade Stand                 (1979) º\necho                 º   2.  Castle Wolfenstein             (1981) º\necho                 º   3.  Choplifter                     (1982) º\necho                 º   4.  Aztec                          (1982) º\necho                 º   5.  Lode Runner                    (1983) º\necho                 º   6.  Sammy Lightfoot                (1983) º\necho                 º   7.  Hard Hat Mack                  (1983) º\necho                 º   8.  Archon                         (1984) º\necho                 º   9.  Karateka                       (1984) º\necho                 º  10.  The Oregon Trail               (1985) º\necho                 º                                             º\necho                 º  11.  Applesoft BASIC                       º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'lemonade\n',
                          },
                          {
                            name: '2.bat',
                            data: 'wolf\n',
                          },
                          {
                            name: '3.bat',
                            data: 'choplift\n',
                          },
                          {
                            name: '4.bat',
                            data: 'aztec\n',
                          },
                          {
                            name: '5.bat',
                            data: 'loderun\n',
                          },
                          {
                            name: '6.bat',
                            data: 'sammy\n',
                          },
                          {
                            name: '7.bat',
                            data: 'hardhat\n',
                          },
                          {
                            name: '8.bat',
                            data: 'archon\n',
                          },
                          {
                            name: '9.bat',
                            data: 'karateka\n',
                          },
                          {
                            name: '10.bat',
                            data: 'oregon\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'archon.exe',
                            link: '../systems/apple2/play.html?game=archon',
                          },
                          {
                            name: 'lemonade.exe',
                            link: '../systems/apple2/play.html?game=lemonade',
                          },
                          {
                            name: 'wolf.exe',
                            link: '../systems/apple2/play.html?game=wolf',
                          },
                          {
                            name: 'choplift.exe',
                            link: '../systems/apple2/play.html?game=choplift',
                          },
                          {
                            name: 'aztec.exe',
                            link: '../systems/apple2/play.html?game=aztec',
                          },
                          {
                            name: 'loderun.exe',
                            link: '../systems/apple2/play.html?game=loderun',
                          },
                          {
                            name: 'sammy.exe',
                            link: '../systems/apple2/play.html?game=sammy',
                          },
                          {
                            name: 'hardhat.exe',
                            link: '../systems/apple2/play.html?game=hardhat',
                          },
                          {
                            name: 'karateka.exe',
                            link: '../systems/apple2/play.html?game=karateka',
                          },
                          {
                            name: 'oregon.exe',
                            link: '../systems/apple2/play.html?game=oregon',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/apple2/play.html',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              APPLE  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Apple I                        (1976) º\necho                 º                                             º\necho                 º   2.  Apple ][                       (1977) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd apple1\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd appleii\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },

              // COMMODORE (PET + VIC-20 + MAX + C64 + C16 + Plus/4 all via EmulatorJS + VICE)
              {
                name: 'COMMODRE',
                directories: [
                  {
                    name: 'PET',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  PET  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Star Trek                      (1977) º\necho                 º   2.  Adventureland                  (1979) º\necho                 º   3.  Android NIM                    (1979) º\necho                 º   4.  Lunar Lander                   (1979) º\necho                 º   5.  Hangman                        (1980) º\necho                 º   6.  Space Invaders                 (1980) º\necho                 º   7.  ComputerSpace 2001             (1981) º\necho                 º   8.  Crazy Balloon                  (1981) º\necho                 º   9.  Frogger                        (1981) º\necho                 º  10.  Pac-Man                        (1982) º\necho                 º                                             º\necho                 º  11.  BASIC 2 prompt                        º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'startrek\n',
                          },
                          {
                            name: '2.bat',
                            data: 'advland\n',
                          },
                          {
                            name: '3.bat',
                            data: 'andnim\n',
                          },
                          {
                            name: '4.bat',
                            data: 'lunar\n',
                          },
                          {
                            name: '5.bat',
                            data: 'hangman\n',
                          },
                          {
                            name: '6.bat',
                            data: 'invader\n',
                          },
                          {
                            name: '7.bat',
                            data: 'cs2001\n',
                          },
                          {
                            name: '8.bat',
                            data: 'crzballn\n',
                          },
                          {
                            name: '9.bat',
                            data: 'frogger\n',
                          },
                          {
                            name: '10.bat',
                            data: 'pacman\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'startrek.exe',
                            link: '../systems/pet/play.html?game=startrek',
                          },
                          {
                            name: 'andnim.exe',
                            link: '../systems/pet/play.html?game=andnim',
                          },
                          {
                            name: 'lunar.exe',
                            link: '../systems/pet/play.html?game=lunar',
                          },
                          {
                            name: 'advland.exe',
                            link: '../systems/pet/play.html?game=advland',
                          },
                          {
                            name: 'hangman.exe',
                            link: '../systems/pet/play.html?game=hangman',
                          },
                          {
                            name: 'invader.exe',
                            link: '../systems/pet/play.html?game=invader',
                          },
                          {
                            name: 'crzballn.exe',
                            link: '../systems/pet/play.html?game=crzballn',
                          },
                          {
                            name: 'cs2001.exe',
                            link: '../systems/pet/play.html?game=cs2001',
                          },
                          {
                            name: 'frogger.exe',
                            link: '../systems/pet/play.html?game=frogger',
                          },
                          {
                            name: 'pacman.exe',
                            link: '../systems/pet/play.html?game=pacman',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/pet/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'VIC20',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          COMMODORE  VIC-20  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Avenger                        (1981) º\necho                 º   2.  Radar Rat Race                 (1981) º\necho                 º   3.  Choplifter                     (1982) º\necho                 º   4.  Gorf                           (1982) º\necho                 º   5.  Gridrunner                     (1982) º\necho                 º   6.  Omega Race                     (1982) º\necho                 º   7.  Atlantis                       (1983) º\necho                 º   8.  Demon Attack                   (1983) º\necho                 º   9.  Frogger                        (1983) º\necho                 º  10.  Pac-Man                        (1983) º\necho                 º                                             º\necho                 º  11.  BASIC prompt                          º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'avenger\n',
                          },
                          {
                            name: '2.bat',
                            data: 'ratrace\n',
                          },
                          {
                            name: '3.bat',
                            data: 'chopper\n',
                          },
                          {
                            name: '4.bat',
                            data: 'gorf\n',
                          },
                          {
                            name: '5.bat',
                            data: 'gridrun\n',
                          },
                          {
                            name: '6.bat',
                            data: 'omega\n',
                          },
                          {
                            name: '7.bat',
                            data: 'atlantis\n',
                          },
                          {
                            name: '8.bat',
                            data: 'demonatk\n',
                          },
                          {
                            name: '9.bat',
                            data: 'frogger\n',
                          },
                          {
                            name: '10.bat',
                            data: 'pacman\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'avenger.exe',
                            link: '../systems/vic20/play.html?game=avenger',
                          },
                          {
                            name: 'ratrace.exe',
                            link: '../systems/vic20/play.html?game=ratrace',
                          },
                          {
                            name: 'gorf.exe',
                            link: '../systems/vic20/play.html?game=gorf',
                          },
                          {
                            name: 'omega.exe',
                            link: '../systems/vic20/play.html?game=omega',
                          },
                          {
                            name: 'chopper.exe',
                            link: '../systems/vic20/play.html?game=chopper',
                          },
                          {
                            name: 'gridrun.exe',
                            link: '../systems/vic20/play.html?game=gridrun',
                          },
                          {
                            name: 'frogger.exe',
                            link: '../systems/vic20/play.html?game=frogger',
                          },
                          {
                            name: 'pacman.exe',
                            link: '../systems/vic20/play.html?game=pacman',
                          },
                          {
                            name: 'atlantis.exe',
                            link: '../systems/vic20/play.html?game=atlantis',
                          },
                          {
                            name: 'demonatk.exe',
                            link: '../systems/vic20/play.html?game=demonatk',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/vic20/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'MAX',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º       COMMODORE  MAX  MACHINE  GAMES        º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Clowns                         (1982) º\necho                 º   2.  Jupiter Lander                 (1982) º\necho                 º   3.  Mole Attack                    (1982) º\necho                 º   4.  Money Wars                     (1982) º\necho                 º   5.  Omega Race                     (1982) º\necho                 º   6.  Radar Rat Race                 (1982) º\necho                 º   7.  Slalom                         (1982) º\necho                 º   8.  Speed/Bingo Math               (1982) º\necho                 º   9.  Billiards                      (1983) º\necho                 º  10.  Pinball Spectacular            (1983) º\necho                 º                                             º\necho                 º  11.  MAX BASIC cartridge                   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'clowns\n',
                          },
                          {
                            name: '2.bat',
                            data: 'jupiter\n',
                          },
                          {
                            name: '3.bat',
                            data: 'molatak\n',
                          },
                          {
                            name: '4.bat',
                            data: 'monywars\n',
                          },
                          {
                            name: '5.bat',
                            data: 'omegrace\n',
                          },
                          {
                            name: '6.bat',
                            data: 'rrr\n',
                          },
                          {
                            name: '7.bat',
                            data: 'slalom\n',
                          },
                          {
                            name: '8.bat',
                            data: 'speedmth\n',
                          },
                          {
                            name: '9.bat',
                            data: 'billiard\n',
                          },
                          {
                            name: '10.bat',
                            data: 'pinball\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'clowns.exe',
                            link: '../systems/max/play.html?game=clowns',
                          },
                          {
                            name: 'omegrace.exe',
                            link: '../systems/max/play.html?game=omegrace',
                          },
                          {
                            name: 'rrr.exe',
                            link: '../systems/max/play.html?game=rrr',
                          },
                          {
                            name: 'jupiter.exe',
                            link: '../systems/max/play.html?game=jupiter',
                          },
                          {
                            name: 'molatak.exe',
                            link: '../systems/max/play.html?game=molatak',
                          },
                          {
                            name: 'monywars.exe',
                            link: '../systems/max/play.html?game=monywars',
                          },
                          {
                            name: 'speedmth.exe',
                            link: '../systems/max/play.html?game=speedmth',
                          },
                          {
                            name: 'slalom.exe',
                            link: '../systems/max/play.html?game=slalom',
                          },
                          {
                            name: 'billiard.exe',
                            link: '../systems/max/play.html?game=billiard',
                          },
                          {
                            name: 'pinball.exe',
                            link: '../systems/max/play.html?game=pinball',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/max/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'C64',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  64  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Beach Head                     (1983) º\necho                 º   2.  Forbidden Forest               (1983) º\necho                 º   3.  Boulder Dash                   (1984) º\necho                 º   4.  Impossible Mission             (1984) º\necho                 º   5.  Elite                          (1985) º\necho                 º   6.  Ghosts \'n Goblins              (1986) º\necho                 º   7.  Uridium                        (1986) º\necho                 º   8.  The Last Ninja                 (1987) º\necho                 º   9.  Wizball                        (1987) º\necho                 º  10.  PETSCII Robots                 (2021) º\necho                 º                                             º\necho                 º  11.  BASIC prompt                          º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'beachhd\n',
                          },
                          {
                            name: '2.bat',
                            data: 'forbfrst\n',
                          },
                          {
                            name: '3.bat',
                            data: 'boulder\n',
                          },
                          {
                            name: '4.bat',
                            data: 'impmiss\n',
                          },
                          {
                            name: '5.bat',
                            data: 'elite\n',
                          },
                          {
                            name: '6.bat',
                            data: 'ghosts\n',
                          },
                          {
                            name: '7.bat',
                            data: 'uridium\n',
                          },
                          {
                            name: '8.bat',
                            data: 'lastninj\n',
                          },
                          {
                            name: '9.bat',
                            data: 'wizball\n',
                          },
                          {
                            name: '10.bat',
                            data: 'petrobot\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'lastninj.exe',
                            link: '../systems/c64/play.html?game=lastninja',
                          },
                          {
                            name: 'impmiss.exe',
                            link: '../systems/c64/play.html?game=impmiss',
                          },
                          {
                            name: 'wizball.exe',
                            link: '../systems/c64/play.html?game=wizball',
                          },
                          {
                            name: 'elite.exe',
                            link: '../systems/c64/play.html?game=elite',
                          },
                          {
                            name: 'uridium.exe',
                            link: '../systems/c64/play.html?game=uridium',
                          },
                          {
                            name: 'beachhd.exe',
                            link: '../systems/c64/play.html?game=beachhd',
                          },
                          {
                            name: 'boulder.exe',
                            link: '../systems/c64/play.html?game=boulder',
                          },
                          {
                            name: 'forbfrst.exe',
                            link: '../systems/c64/play.html?game=forbfrst',
                          },
                          {
                            name: 'ghosts.exe',
                            link: '../systems/c64/play.html?game=ghosts',
                          },
                          {
                            name: 'petrobot.exe',
                            link: '../systems/c64/play.html?game=petrobot',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/c64/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'C16',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  C16  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Fire Ant                       (1984) º\necho                 º   2.  Skramble                       (1984) º\necho                 º   3.  Tower of Evil                  (1984) º\necho                 º   4.  Xargon Wars                    (1984) º\necho                 º   5.  Berks                          (1985) º\necho                 º   6.  Big Mac                        (1985) º\necho                 º   7.  Hustler                        (1985) º\necho                 º   8.  Tom Thumb                      (1985) º\necho                 º   9.  Tutti Frutti                   (1985) º\necho                 º  10.  Mr. Puniverse                  (1986) º\necho                 º                                             º\necho                 º  11.  BASIC 3.5 prompt                      º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'fireant\n',
                          },
                          {
                            name: '2.bat',
                            data: 'skramble\n',
                          },
                          {
                            name: '3.bat',
                            data: 'towrevil\n',
                          },
                          {
                            name: '4.bat',
                            data: 'xargon\n',
                          },
                          {
                            name: '5.bat',
                            data: 'berks\n',
                          },
                          {
                            name: '6.bat',
                            data: 'bigmac\n',
                          },
                          {
                            name: '7.bat',
                            data: 'hustler\n',
                          },
                          {
                            name: '8.bat',
                            data: 'tomthumb\n',
                          },
                          {
                            name: '9.bat',
                            data: 'tuttifrt\n',
                          },
                          {
                            name: '10.bat',
                            data: 'punivrse\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'fireant.exe',
                            link: '../systems/c16/play.html?game=fireant',
                          },
                          {
                            name: 'skramble.exe',
                            link: '../systems/c16/play.html?game=skramble',
                          },
                          {
                            name: 'towrevil.exe',
                            link: '../systems/c16/play.html?game=towrevil',
                          },
                          {
                            name: 'xargon.exe',
                            link: '../systems/c16/play.html?game=xargon',
                          },
                          {
                            name: 'berks.exe',
                            link: '../systems/c16/play.html?game=berks',
                          },
                          {
                            name: 'bigmac.exe',
                            link: '../systems/c16/play.html?game=bigmac',
                          },
                          {
                            name: 'hustler.exe',
                            link: '../systems/c16/play.html?game=hustler',
                          },
                          {
                            name: 'tomthumb.exe',
                            link: '../systems/c16/play.html?game=tomthumb',
                          },
                          {
                            name: 'tuttifrt.exe',
                            link: '../systems/c16/play.html?game=tuttifrt',
                          },
                          {
                            name: 'punivrse.exe',
                            link: '../systems/c16/play.html?game=punivrse',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/c16/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'PLUS4',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          COMMODORE  PLUS/4  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Blagger                        (1984) º\necho                 º   2.  Popeye                         (1984) º\necho                 º   3.  Citadel                        (1985) º\necho                 º   4.  Kikstart                       (1985) º\necho                 º   5.  Punchy                         (1985) º\necho                 º   6.  Rockman                        (1985) º\necho                 º   7.  Saboteur                       (1985) º\necho                 º   8.  Squirm                         (1985) º\necho                 º   9.  Mercenary                      (1986) º\necho                 º  10.  Trailblazer                    (1986) º\necho                 º                                             º\necho                 º  11.  BASIC 3.5 prompt                      º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'blagger\n',
                          },
                          {
                            name: '2.bat',
                            data: 'popeye\n',
                          },
                          {
                            name: '3.bat',
                            data: 'citadel\n',
                          },
                          {
                            name: '4.bat',
                            data: 'kikstart\n',
                          },
                          {
                            name: '5.bat',
                            data: 'punchy\n',
                          },
                          {
                            name: '6.bat',
                            data: 'rockman\n',
                          },
                          {
                            name: '7.bat',
                            data: 'saboteur\n',
                          },
                          {
                            name: '8.bat',
                            data: 'squirm\n',
                          },
                          {
                            name: '9.bat',
                            data: 'mercnary\n',
                          },
                          {
                            name: '10.bat',
                            data: 'trailblz\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'blagger.exe',
                            link: '../systems/plus4/play.html?game=blagger',
                          },
                          {
                            name: 'popeye.exe',
                            link: '../systems/plus4/play.html?game=popeye',
                          },
                          {
                            name: 'citadel.exe',
                            link: '../systems/plus4/play.html?game=citadel',
                          },
                          {
                            name: 'kikstart.exe',
                            link: '../systems/plus4/play.html?game=kikstart',
                          },
                          {
                            name: 'punchy.exe',
                            link: '../systems/plus4/play.html?game=punchy',
                          },
                          {
                            name: 'rockman.exe',
                            link: '../systems/plus4/play.html?game=rockman',
                          },
                          {
                            name: 'saboteur.exe',
                            link: '../systems/plus4/play.html?game=saboteur',
                          },
                          {
                            name: 'squirm.exe',
                            link: '../systems/plus4/play.html?game=squirm',
                          },
                          {
                            name: 'mercnary.exe',
                            link: '../systems/plus4/play.html?game=mercnary',
                          },
                          {
                            name: 'trailblz.exe',
                            link: '../systems/plus4/play.html?game=trailblz',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/plus4/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  COMPUTERS             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Commodore PET                  (1977) º\necho                 º   2.  Commodore VIC-20               (1980) º\necho                 º   3.  Commodore MAX                  (1982) º\necho                 º   4.  Commodore 64                   (1982) º\necho                 º   5.  Commodore C16                  (1984) º\necho                 º   6.  Commodore Plus/4               (1984) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd pet\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd vic20\ncd games\nmenu\n',
                  },
                  {
                    name: '3.bat',
                    data: 'cd max\ncd games\nmenu\n',
                  },
                  {
                    name: '4.bat',
                    data: 'cd c64\ncd games\nmenu\n',
                  },
                  {
                    name: '5.bat',
                    data: 'cd c16\ncd games\nmenu\n',
                  },
                  {
                    name: '6.bat',
                    data: 'cd plus4\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },

              // ATARI (placeholder — Atari home computers have no local emulator yet)
              {
                name: 'ATARI',
                directories: [
                  {
                    name: '400',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ATARI  400  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Space Invaders                 (1980) º\necho                 º   2.  Asteroids                      (1981) º\necho                 º   3.  Defender                       (1981) º\necho                 º   4.  Missile Command                (1981) º\necho                 º   5.  Centipede                      (1982) º\necho                 º   6.  Choplifter                     (1982) º\necho                 º   7.  Pac-Man                        (1982) º\necho                 º   8.  Dig Dug                        (1983) º\necho                 º   9.  Donkey Kong                    (1983) º\necho                 º  10.  Joust                          (1983) º\necho                 º                                             º\necho                 º  11.  Atari BASIC prompt                    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'invaders\n',
                          },
                          {
                            name: '2.bat',
                            data: 'asteroid\n',
                          },
                          {
                            name: '3.bat',
                            data: 'defender\n',
                          },
                          {
                            name: '4.bat',
                            data: 'missile\n',
                          },
                          {
                            name: '5.bat',
                            data: 'centiped\n',
                          },
                          {
                            name: '6.bat',
                            data: 'choplift\n',
                          },
                          {
                            name: '7.bat',
                            data: 'pacman\n',
                          },
                          {
                            name: '8.bat',
                            data: 'digdug\n',
                          },
                          {
                            name: '9.bat',
                            data: 'dkong\n',
                          },
                          {
                            name: '10.bat',
                            data: 'joust\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'missile.exe',
                            link: '../systems/atari400/play.html?game=missile',
                          },
                          {
                            name: 'asteroid.exe',
                            link: '../systems/atari400/play.html?game=asteroid',
                          },
                          {
                            name: 'defender.exe',
                            link: '../systems/atari400/play.html?game=defender',
                          },
                          {
                            name: 'invaders.exe',
                            link: '../systems/atari400/play.html?game=invaders',
                          },
                          {
                            name: 'pacman.exe',
                            link: '../systems/atari400/play.html?game=pacman',
                          },
                          {
                            name: 'centiped.exe',
                            link: '../systems/atari400/play.html?game=centiped',
                          },
                          {
                            name: 'choplift.exe',
                            link: '../systems/atari400/play.html?game=chopliftr',
                          },
                          {
                            name: 'dkong.exe',
                            link: '../systems/atari400/play.html?game=dkong',
                          },
                          {
                            name: 'joust.exe',
                            link: '../systems/atari400/play.html?game=joust',
                          },
                          {
                            name: 'digdug.exe',
                            link: '../systems/atari400/play.html?game=digdug',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/atari400/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: '800XL',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  800XL  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Star Raiders                   (1979) º\necho                 º   2.  Eastern Front 1941             (1981) º\necho                 º   3.  Miner 2049er                   (1982) º\necho                 º   4.  Archon                         (1983) º\necho                 º   5.  M.U.L.E.                       (1983) º\necho                 º   6.  Pole Position                  (1983) º\necho                 º   7.  Boulder Dash                   (1984) º\necho                 º   8.  Bruce Lee                      (1984) º\necho                 º   9.  Ballblazer                     (1985) º\necho                 º  10.  Rescue on Fractalus!           (1985) º\necho                 º                                             º\necho                 º  11.  Atari BASIC prompt                    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'starraid\n',
                          },
                          {
                            name: '2.bat',
                            data: 'eastfrnt\n',
                          },
                          {
                            name: '3.bat',
                            data: 'miner2k\n',
                          },
                          {
                            name: '4.bat',
                            data: 'archon\n',
                          },
                          {
                            name: '5.bat',
                            data: 'mule\n',
                          },
                          {
                            name: '6.bat',
                            data: 'polepos\n',
                          },
                          {
                            name: '7.bat',
                            data: 'boulder\n',
                          },
                          {
                            name: '8.bat',
                            data: 'brucelee\n',
                          },
                          {
                            name: '9.bat',
                            data: 'ballblzr\n',
                          },
                          {
                            name: '10.bat',
                            data: 'fractlus\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'starraid.exe',
                            link: '../systems/atari800/play.html?game=starraid',
                          },
                          {
                            name: 'mule.exe',
                            link: '../systems/atari800/play.html?game=mule',
                          },
                          {
                            name: 'boulder.exe',
                            link: '../systems/atari800/play.html?game=boulder',
                          },
                          {
                            name: 'archon.exe',
                            link: '../systems/atari800/play.html?game=archon',
                          },
                          {
                            name: 'ballblzr.exe',
                            link: '../systems/atari800/play.html?game=ballblzr',
                          },
                          {
                            name: 'fractlus.exe',
                            link: '../systems/atari800/play.html?game=fractlus',
                          },
                          {
                            name: 'brucelee.exe',
                            link: '../systems/atari800/play.html?game=brucelee',
                          },
                          {
                            name: 'miner2k.exe',
                            link: '../systems/atari800/play.html?game=miner2k',
                          },
                          {
                            name: 'polepos.exe',
                            link: '../systems/atari800/play.html?game=polepos',
                          },
                          {
                            name: 'eastfrnt.exe',
                            link: '../systems/atari800/play.html?game=eastfrnt',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/atari800/play.html?game=basic',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ATARI  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari 400                      (1979) º\necho                 º                                             º\necho                 º   2.  Atari 800XL                    (1983) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd 400\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd 800xl\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },

              // SINCLAIR (Spectrum + ZX81)
              {
                name: 'SINCLAIR',
                directories: [
                  {
                    name: 'SPECTRUM',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          SINCLAIR  SPECTRUM  GAMES          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atic Atac                      (1983) º\necho                 º   2.  Chuckie Egg                    (1983) º\necho                 º   3.  Manic Miner                    (1983) º\necho                 º   4.  Pssst                          (1983) º\necho                 º   5.  Jet Set Willy                  (1984) º\necho                 º   6.  Knight Lore                    (1984) º\necho                 º   7.  Sabre Wulf                     (1984) º\necho                 º   8.  Skool Daze                     (1984) º\necho                 º   9.  Underwurlde                    (1984) º\necho                 º  10.  Dizzy                          (1987) º\necho                 º                                             º\necho                 º  11.  ZX BASIC prompt                       º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'atatac\n',
                          },
                          {
                            name: '2.bat',
                            data: 'chuckegg\n',
                          },
                          {
                            name: '3.bat',
                            data: 'manicmn\n',
                          },
                          {
                            name: '4.bat',
                            data: 'pssst\n',
                          },
                          {
                            name: '5.bat',
                            data: 'jetwilly\n',
                          },
                          {
                            name: '6.bat',
                            data: 'kngtlore\n',
                          },
                          {
                            name: '7.bat',
                            data: 'sabrwulf\n',
                          },
                          {
                            name: '8.bat',
                            data: 'skooldzd\n',
                          },
                          {
                            name: '9.bat',
                            data: 'uwurlde\n',
                          },
                          {
                            name: '10.bat',
                            data: 'dizzy\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/jsspeccy/play.html',
                          },
                          {
                            name: 'manicmn.exe',
                            link: '../systems/jsspeccy/play.html?game=manicmn',
                          },
                          {
                            name: 'jetwilly.exe',
                            link: '../systems/jsspeccy/play.html?game=jetwilly',
                          },
                          {
                            name: 'chuckegg.exe',
                            link: '../systems/jsspeccy/play.html?game=chuckegg',
                          },
                          {
                            name: 'sabrwulf.exe',
                            link: '../systems/jsspeccy/play.html?game=sabrwulf',
                          },
                          {
                            name: 'kngtlore.exe',
                            link: '../systems/jsspeccy/play.html?game=kngtlore',
                          },
                          {
                            name: 'atatac.exe',
                            link: '../systems/jsspeccy/play.html?game=atatac',
                          },
                          {
                            name: 'pssst.exe',
                            link: '../systems/jsspeccy/play.html?game=pssst',
                          },
                          {
                            name: 'uwurlde.exe',
                            link: '../systems/jsspeccy/play.html?game=uwurlde',
                          },
                          {
                            name: 'dizzy.exe',
                            link: '../systems/jsspeccy/play.html?game=dizzy',
                          },
                          {
                            name: 'skooldzd.exe',
                            link: '../systems/jsspeccy/play.html?game=skooldzd',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'ZX81',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [
                          {
                            name: '1KCHESS',
                            directories: [],
                            files: [
                              {
                                name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º         SINCLAIR  ZX81  -  1K CHESS         º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º     Choose the computer's opening move      º\necho                 º                                             º\necho                 º   1.  Queen\'s Pawn         (1.d4)           º\necho                 º                                             º\necho                 º   2.  King\'s Pawn          (1.e4)           º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                              },
                              {
                                name: '0.bat',
                                data: 'echo off\ncd ..\nmenu\n',
                              },
                              {
                                name: '1.bat',
                                data: '1kchessq\n',
                              },
                              {
                                name: '2.bat',
                                data: '1kchessk\n',
                              },
                              {
                                name: '1kchessk.exe',
                                link: '../systems/jtyone/play.html?game=1kchessk',
                              },
                              {
                                name: '1kchessq.exe',
                                link: '../systems/jtyone/play.html?game=1kchessq',
                              },
                            ],
                          },
                        ],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            SINCLAIR  ZX81  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  3D Defender                    (1981) º\necho                 º   2.  3D Monster Maze                (1981) º\necho                 º   3.  1K Chess                       (1982) º\necho                 º   4.  Black Crystal                  (1982) º\necho                 º   5.  City of Xon                    (1982) º\necho                 º   6.  Frogger                        (1982) º\necho                 º   7.  Galaxians                      (1982) º\necho                 º   8.  3D Grand Prix                  (1983) º\necho                 º   9.  Maze Death Race                (1983) º\necho                 º  10.  Night Gunner                   (1983) º\necho                 º                                             º\necho                 º  11.  ZX81 BASIC prompt                     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: '3ddefend\n',
                          },
                          {
                            name: '2.bat',
                            data: 'monstmze\n',
                          },
                          {
                            name: '3.bat',
                            data: '1kchess\n',
                          },
                          {
                            name: '4.bat',
                            data: 'blkcryst\n',
                          },
                          {
                            name: '5.bat',
                            data: 'cityxon\n',
                          },
                          {
                            name: '6.bat',
                            data: 'frogger\n',
                          },
                          {
                            name: '7.bat',
                            data: 'galaxian\n',
                          },
                          {
                            name: '8.bat',
                            data: 'gp3d\n',
                          },
                          {
                            name: '9.bat',
                            data: 'mazerace\n',
                          },
                          {
                            name: '10.bat',
                            data: 'nightgun\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'basic.exe',
                            link: '../systems/jtyone/play.html',
                          },
                          {
                            name: 'monstmze.exe',
                            link: '../systems/jtyone/play.html?game=monstmze',
                          },
                          {
                            name: '3ddefend.exe',
                            link: '../systems/jtyone/play.html?game=3ddefend',
                          },
                          {
                            name: 'nightgun.exe',
                            link: '../systems/jtyone/play.html?game=nightgun',
                          },
                          {
                            name: 'galaxian.exe',
                            link: '../systems/jtyone/play.html?game=galaxian',
                          },
                          {
                            name: '1kchess.bat',
                            data: 'echo off\ncd 1kchess\nmenu\n',
                          },
                          {
                            name: 'frogger.exe',
                            link: '../systems/jtyone/play.html?game=frogger',
                          },
                          {
                            name: 'cityxon.exe',
                            link: '../systems/jtyone/play.html?game=cityxon',
                          },
                          {
                            name: 'blkcryst.exe',
                            link: '../systems/jtyone/play.html?game=blkcryst',
                          },
                          {
                            name: 'gp3d.exe',
                            link: '../systems/jtyone/play.html?game=gp3d',
                          },
                          {
                            name: 'mazerace.exe',
                            link: '../systems/jtyone/play.html?game=mazerace',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             SINCLAIR  COMPUTERS             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Sinclair ZX81                  (1981) º\necho                 º                                             º\necho                 º   2.  Sinclair Spectrum              (1982) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd zx81\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd spectrum\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },
              {
                name: 'CPC',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             AMSTRAD  CPC  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Bruce Lee                      (1984) º\necho                 º   2.  Roland on the Run              (1984) º\necho                 º   3.  3D Starstrike                  (1985) º\necho                 º   4.  Tau Ceti                       (1986) º\necho                 º   5.  The Eidolon                    (1986) º\necho                 º   6.  R-Type                         (1988) º\necho                 º   7.  Chase H.Q.                     (1989) º\necho                 º   8.  Rick Dangerous                 (1989) º\necho                 º   9.  Prince of Persia               (1990) º\necho                 º  10.  3D Construction Kit            (1991) º\necho                 º                                             º\necho                 º  11.  Locomotive BASIC prompt               º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'bruce\n',
                      },
                      {
                        name: '2.bat',
                        data: 'roland\n',
                      },
                      {
                        name: '3.bat',
                        data: 'starstrk\n',
                      },
                      {
                        name: '4.bat',
                        data: 'tauceti\n',
                      },
                      {
                        name: '5.bat',
                        data: 'eidolon\n',
                      },
                      {
                        name: '6.bat',
                        data: 'rtype\n',
                      },
                      {
                        name: '7.bat',
                        data: 'chasehq\n',
                      },
                      {
                        name: '8.bat',
                        data: 'rick\n',
                      },
                      {
                        name: '9.bat',
                        data: 'prince\n',
                      },
                      {
                        name: '10.bat',
                        data: '3dkit\n',
                      },
                      {
                        name: '11.bat',
                        data: 'basic\n',
                      },
                      {
                        name: 'basic.exe',
                        link: '../systems/cpc/play.html',
                      },
                      {
                        name: '3dkit.exe',
                        link: '../systems/cpc/play.html?game=3dkit',
                      },
                      {
                        name: 'roland.exe',
                        link: '../systems/cpc/play.html?game=roland',
                      },
                      {
                        name: 'starstrk.exe',
                        link: '../systems/cpc/play.html?game=starstrike',
                      },
                      {
                        name: 'bruce.exe',
                        link: '../systems/cpc/play.html?game=bruce',
                      },
                      {
                        name: 'prince.exe',
                        link: '../systems/cpc/play.html?game=prince',
                      },
                      {
                        name: 'tauceti.exe',
                        link: '../systems/cpc/play.html?game=tauceti',
                      },
                      {
                        name: 'eidolon.exe',
                        link: '../systems/cpc/play.html?game=eidolon',
                      },
                      {
                        name: 'rtype.exe',
                        link: '../systems/cpc/play.html?game=rtype',
                      },
                      {
                        name: 'rick.exe',
                        link: '../systems/cpc/play.html?game=rick',
                      },
                      {
                        name: 'chasehq.exe',
                        link: '../systems/cpc/play.html?game=chasehq',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                  },
                ],
              },
              {
                name: 'TANDY',
                directories: [
                  {
                    name: 'COCO',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             TANDY  COCO  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Mega-Bug                       (1981) º\necho                 º   2.  Poltergeist                    (1981) º\necho                 º   3.  Popcorn                        (1981) º\necho                 º   4.  Canyon Climber                 (1982) º\necho                 º   5.  Demon Attack                   (1982) º\necho                 º   6.  Dungeons of Daggorath          (1982) º\necho                 º   7.  Monster Maze                   (1982) º\necho                 º   8.  Downland                       (1983) º\necho                 º   9.  Galactic Attack                (1983) º\necho                 º  10.  Polaris                        (1983) º\necho                 º                                             º\necho                 º  11.  Color BASIC prompt                    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'megabug\n',
                          },
                          {
                            name: '2.bat',
                            data: 'poltrgst\n',
                          },
                          {
                            name: '3.bat',
                            data: 'popcorn\n',
                          },
                          {
                            name: '4.bat',
                            data: 'canyon\n',
                          },
                          {
                            name: '5.bat',
                            data: 'demon\n',
                          },
                          {
                            name: '6.bat',
                            data: 'daggor\n',
                          },
                          {
                            name: '7.bat',
                            data: 'monstrmz\n',
                          },
                          {
                            name: '8.bat',
                            data: 'downland\n',
                          },
                          {
                            name: '9.bat',
                            data: 'galactic\n',
                          },
                          {
                            name: '10.bat',
                            data: 'polaris\n',
                          },
                          {
                            name: '11.bat',
                            data: 'prompt\n',
                          },
                          {
                            name: 'daggor.exe',
                            link: '../systems/xroar/play.html?game=daggor',
                          },
                          {
                            name: 'downland.exe',
                            link: '../systems/xroar/play.html?game=downland',
                          },
                          {
                            name: 'canyon.exe',
                            link: '../systems/xroar/play.html?game=canyon',
                          },
                          {
                            name: 'demon.exe',
                            link: '../systems/xroar/play.html?game=demon',
                          },
                          {
                            name: 'polaris.exe',
                            link: '../systems/xroar/play.html?game=polaris',
                          },
                          {
                            name: 'galactic.exe',
                            link: '../systems/xroar/play.html?game=galactic',
                          },
                          {
                            name: 'popcorn.exe',
                            link: '../systems/xroar/play.html?game=popcorn',
                          },
                          {
                            name: 'megabug.exe',
                            link: '../systems/xroar/play.html?game=megabug',
                          },
                          {
                            name: 'poltrgst.exe',
                            link: '../systems/xroar/play.html?game=poltrgst',
                          },
                          {
                            name: 'monstrmz.exe',
                            link: '../systems/xroar/play.html?game=monstrmz',
                          },
                          {
                            name: 'prompt.exe',
                            link: '../systems/xroar/play.html',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'TRS80',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [
                          {
                            name: 'DOS',
                            directories: [],
                            files: [
                              {
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º      TRS-80  MODEL III  -  SYSTEM DISKS     º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º    Choose a disk operating system to boot   º\necho                 º                                             º\necho                 º   1.  TRSDOS 1.3                     (1981) º\necho                 º                                             º\necho                 º   2.  LDOS 5.3.1                     (1991) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                              },
                              {
                                name: '0.bat',
                                data: 'echo off\ncd ..\nmenu\n',
                              },
                              {
                                name: '1.bat',
                                data: 'trsdos\n',
                              },
                              {
                                name: '2.bat',
                                data: 'ldos\n',
                              },
                              {
                                name: 'trsdos.exe',
                                link: '../systems/trs80/play.html?game=trsdos',
                              },
                              {
                                name: 'ldos.exe',
                                link: '../systems/trs80/play.html?game=ldos',
                              },
                            ],
                          },
                        ],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          TRS-80  MODEL III  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Galaxy Invasion                (1980) º\necho                 º   2.  Cosmic Fighter                 (1980) º\necho                 º   3.  Attack Force                   (1980) º\necho                 º   4.  Super Nova                     (1980) º\necho                 º   5.  Defense Command                (1981) º\necho                 º   6.  Robot Attack                   (1981) º\necho                 º   7.  Armored Patrol                 (1981) º\necho                 º   8.  Sea Dragon                     (1982) º\necho                 º   9.  Crazy Painter                  (1982) º\necho                 º  10.  Space Castle                   (1982) º\necho                 º                                             º\necho                 º  11.  System disks                          º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'galaxy\n',
                          },
                          {
                            name: '2.bat',
                            data: 'cosmic\n',
                          },
                          {
                            name: '3.bat',
                            data: 'attack\n',
                          },
                          {
                            name: '4.bat',
                            data: 'supernov\n',
                          },
                          {
                            name: '5.bat',
                            data: 'defense\n',
                          },
                          {
                            name: '6.bat',
                            data: 'robot\n',
                          },
                          {
                            name: '7.bat',
                            data: 'armored\n',
                          },
                          {
                            name: '8.bat',
                            data: 'seadrgn\n',
                          },
                          {
                            name: '9.bat',
                            data: 'crazypnt\n',
                          },
                          {
                            name: '10.bat',
                            data: 'castle\n',
                          },
                          {
                            name: 'galaxy.exe',
                            link: '../systems/trs80/play.html?game=galaxy',
                          },
                          {
                            name: 'cosmic.exe',
                            link: '../systems/trs80/play.html?game=cosmic',
                          },
                          {
                            name: 'attack.exe',
                            link: '../systems/trs80/play.html?game=attack',
                          },
                          {
                            name: 'supernov.exe',
                            link: '../systems/trs80/play.html?game=supernov',
                          },
                          {
                            name: 'defense.exe',
                            link: '../systems/trs80/play.html?game=defense',
                          },
                          {
                            name: 'robot.exe',
                            link: '../systems/trs80/play.html?game=robot',
                          },
                          {
                            name: 'armored.exe',
                            link: '../systems/trs80/play.html?game=armored',
                          },
                          {
                            name: 'seadrgn.exe',
                            link: '../systems/trs80/play.html?game=seadrgn',
                          },
                          {
                            name: 'crazypnt.exe',
                            link: '../systems/trs80/play.html?game=crazypnt',
                          },
                          {
                            name: 'castle.exe',
                            link: '../systems/trs80/play.html?game=castle',
                          },
                          {
                            name: '11.bat',
                            data: 'dos\n',
                          },
                          {
                            name: 'dos.bat',
                            data: 'echo off\ncd dos\nmenu\n',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'M100',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           TRS-80  MODEL 100  GAMES          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Bowling                        (1984) º\necho                 º   2.  Codebreaker                    (1984) º\necho                 º   3.  ELIZA                          (1984) º\necho                 º   4.  Four Seasons Solitaire         (1984) º\necho                 º   5.  Invisible Maze                 (1984) º\necho                 º   6.  Paper, Rock, Scissors          (1984) º\necho                 º   7.  Road Rally                     (1984) º\necho                 º   8.  Skydiver                       (1984) º\necho                 º   9.  Slot Machine                   (1984) º\necho                 º  10.  Worm Hole                      (1984) º\necho                 º                                             º\necho                 º  11.  Startup Menu                          º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'bowling\n',
                          },
                          {
                            name: '2.bat',
                            data: 'codebrek\n',
                          },
                          {
                            name: '3.bat',
                            data: 'eliza\n',
                          },
                          {
                            name: '4.bat',
                            data: 'fsnsol\n',
                          },
                          {
                            name: '5.bat',
                            data: 'invmaze\n',
                          },
                          {
                            name: '6.bat',
                            data: 'prs\n',
                          },
                          {
                            name: '7.bat',
                            data: 'rally\n',
                          },
                          {
                            name: '8.bat',
                            data: 'skydiver\n',
                          },
                          {
                            name: '9.bat',
                            data: 'slots\n',
                          },
                          {
                            name: '10.bat',
                            data: 'wormhole\n',
                          },
                          {
                            name: '11.bat',
                            data: 'm100\n',
                          },
                          {
                            name: 'bowling.exe',
                            link: '../systems/m100/play.html?game=bowling',
                          },
                          {
                            name: 'codebrek.exe',
                            link: '../systems/m100/play.html?game=codebrek',
                          },
                          {
                            name: 'eliza.exe',
                            link: '../systems/m100/play.html?game=eliza',
                          },
                          {
                            name: 'fsnsol.exe',
                            link: '../systems/m100/play.html?game=fsnsol',
                          },
                          {
                            name: 'invmaze.exe',
                            link: '../systems/m100/play.html?game=invmaze',
                          },
                          {
                            name: 'prs.exe',
                            link: '../systems/m100/play.html?game=prs',
                          },
                          {
                            name: 'rally.exe',
                            link: '../systems/m100/play.html?game=rally',
                          },
                          {
                            name: 'skydiver.exe',
                            link: '../systems/m100/play.html?game=skydiver',
                          },
                          {
                            name: 'slots.exe',
                            link: '../systems/m100/play.html?game=slots',
                          },
                          {
                            name: 'wormhole.exe',
                            link: '../systems/m100/play.html?game=wormhole',
                          },
                          {
                            name: 'm100.exe',
                            link: '../systems/m100/play.html',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              TANDY  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  TRS-80 Model III               (1980) º\necho                 º                                             º\necho                 º   2.  Color Computer                 (1980) º\necho                 º                                             º\necho                 º   3.  Model 100 (Portable)           (1983) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd trs80\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd coco\ncd games\nmenu\n',
                  },
                  {
                    name: '3.bat',
                    data: 'cd m100\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },

              // TI-99/4A
              {
                name: 'TI99',
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           TI-99/4A  -  CARTRIDGES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Hunt the Wumpus                (1980) º\necho                 º   2.  Car Wars                       (1981) º\necho                 º   3.  TI Invaders                    (1981) º\necho                 º   4.  Tombstone City: 21st Century   (1981) º\necho                 º   5.  Alpiner                        (1982) º\necho                 º   6.  Microsurgeon                   (1982) º\necho                 º   7.  Munch Man                      (1982) º\necho                 º   8.  Parsec                         (1982) º\necho                 º   9.  Tunnels of Doom                (1982) º\necho                 º  10.  Buck Rogers: Planet of Zoom    (1983) º\necho                 º                                             º\necho                 º  11.  TI BASIC prompt                       º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'echo off\ncd ..\ncd ..\nmenu\n',
                      },
                      {
                        name: '1.bat',
                        data: 'wumpus\n',
                      },
                      {
                        name: '2.bat',
                        data: 'carwars\n',
                      },
                      {
                        name: '3.bat',
                        data: 'tiinvad\n',
                      },
                      {
                        name: '4.bat',
                        data: 'tmbcity\n',
                      },
                      {
                        name: '5.bat',
                        data: 'alpiner\n',
                      },
                      {
                        name: '6.bat',
                        data: 'microsrg\n',
                      },
                      {
                        name: '7.bat',
                        data: 'munchman\n',
                      },
                      {
                        name: '8.bat',
                        data: 'parsec\n',
                      },
                      {
                        name: '9.bat',
                        data: 'doom\n',
                      },
                      {
                        name: '10.bat',
                        data: 'buckrgrs\n',
                      },
                      {
                        name: '11.bat',
                        data: 'prompt\n',
                      },
                      {
                        name: 'wumpus.exe',
                        link: '../systems/js99er/play.html?game=wumpus',
                      },
                      {
                        name: 'carwars.exe',
                        link: '../systems/js99er/play.html?game=carwars',
                      },
                      {
                        name: 'tiinvad.exe',
                        link: '../systems/js99er/play.html?game=tiinvad',
                      },
                      {
                        name: 'tmbcity.exe',
                        link: '../systems/js99er/play.html?game=tmbcity',
                      },
                      {
                        name: 'alpiner.exe',
                        link: '../systems/js99er/play.html?game=alpiner',
                      },
                      {
                        name: 'microsrg.exe',
                        link: '../systems/js99er/play.html?game=microsrg',
                      },
                      {
                        name: 'munchman.exe',
                        link: '../systems/js99er/play.html?game=munchman',
                      },
                      {
                        name: 'parsec.exe',
                        link: '../systems/js99er/play.html?game=parsec',
                      },
                      {
                        name: 'doom.exe',
                        link: '../systems/js99er/play.html?game=doom',
                      },
                      {
                        name: 'buckrgrs.exe',
                        link: '../systems/js99er/play.html?game=buckrgrs',
                      },
                      {
                        name: 'prompt.exe',
                        link: '../systems/js99er/play.html',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                  },
                ],
              },

              // MSX
              {
                name: 'MSX',
                directories: [
                  {
                    name: 'MSX1',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             MSX1  -  CARTRIDGES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Antarctic Adventure            (1983) º\necho                 º   2.  Athletic Land                  (1984) º\necho                 º   3.  Eggerland Mystery              (1985) º\necho                 º   4.  King\'s Valley                  (1985) º\necho                 º   5.  Pippols                        (1985) º\necho                 º   6.  Road Fighter                   (1985) º\necho                 º   7.  Yie Ar Kung-Fu                 (1985) º\necho                 º   8.  Knightmare                     (1986) º\necho                 º   9.  Nemesis                        (1986) º\necho                 º  10.  The Goonies                    (1986) º\necho                 º                                             º\necho                 º  11.  MSX BASIC prompt                      º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'antrctic\n',
                          },
                          {
                            name: '2.bat',
                            data: 'athletic\n',
                          },
                          {
                            name: '3.bat',
                            data: 'eggrland\n',
                          },
                          {
                            name: '4.bat',
                            data: 'kingsval\n',
                          },
                          {
                            name: '5.bat',
                            data: 'pippols\n',
                          },
                          {
                            name: '6.bat',
                            data: 'roadfgtr\n',
                          },
                          {
                            name: '7.bat',
                            data: 'yiearkf\n',
                          },
                          {
                            name: '8.bat',
                            data: 'knightmr\n',
                          },
                          {
                            name: '9.bat',
                            data: 'nemesis\n',
                          },
                          {
                            name: '10.bat',
                            data: 'goonies\n',
                          },
                          {
                            name: '11.bat',
                            data: 'prompt\n',
                          },
                          {
                            name: 'antrctic.exe',
                            link: '../systems/msx1/?ROM=games/antarcticadv.zip&M=MSX1&game=antrctic',
                          },
                          {
                            name: 'athletic.exe',
                            link: '../systems/msx1/?ROM=games/athleticland.zip&M=MSX1&game=athletic',
                          },
                          {
                            name: 'pippols.exe',
                            link: '../systems/msx1/?ROM=games/pippols.zip&M=MSX1&game=pippols',
                          },
                          {
                            name: 'roadfgtr.exe',
                            link: '../systems/msx1/?ROM=games/roadfighter.zip&M=MSX1&game=roadfgtr',
                          },
                          {
                            name: 'kingsval.exe',
                            link: '../systems/msx1/?ROM=games/kingsvalley.zip&M=MSX1&game=kingsval',
                          },
                          {
                            name: 'yiearkf.exe',
                            link: '../systems/msx1/?ROM=games/yiearkungfu.zip&M=MSX1&game=yiearkf',
                          },
                          {
                            name: 'eggrland.exe',
                            link: '../systems/msx1/?ROM=games/eggerland.zip&M=MSX1&game=eggrland',
                          },
                          {
                            name: 'knightmr.exe',
                            link: '../systems/msx1/?ROM=games/knightmare.zip&M=MSX1&game=knightmr',
                          },
                          {
                            name: 'nemesis.exe',
                            link: '../systems/msx1/?ROM=games/nemesis.zip&M=MSX1&game=nemesis',
                          },
                          {
                            name: 'goonies.exe',
                            link: '../systems/msx1/?ROM=games/goonies.zip&M=MSX1&game=goonies',
                          },
                          {
                            name: 'prompt.exe',
                            link: '../systems/msx1/?M=MSX1',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                  {
                    name: 'MSX2',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           MSX2  -  CARTS  &  DISKS          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Castle Excellent               (1986) º\necho                 º   2.  Vampire Killer                 (1986) º\necho                 º   3.  Bubble Bobble                  (1987) º\necho                 º   4.  F-1 Spirit: Way to Formula-1   (1987) º\necho                 º   5.  Metal Gear                     (1987) º\necho                 º   6.  The Treasure of Usas           (1987) º\necho                 º   7.  Aleste                         (1988) º\necho                 º   8.  Parodius Da!                   (1988) º\necho                 º   9.  Space Manbow                   (1989) º\necho                 º  10.  Quarth                         (1990) º\necho                 º                                             º\necho                 º  11.  MSX BASIC prompt                      º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'castleex\n',
                          },
                          {
                            name: '2.bat',
                            data: 'vampkill\n',
                          },
                          {
                            name: '3.bat',
                            data: 'bubblbob\n',
                          },
                          {
                            name: '4.bat',
                            data: 'f1spirit\n',
                          },
                          {
                            name: '5.bat',
                            data: 'metlgear\n',
                          },
                          {
                            name: '6.bat',
                            data: 'usas\n',
                          },
                          {
                            name: '7.bat',
                            data: 'aleste\n',
                          },
                          {
                            name: '8.bat',
                            data: 'parodius\n',
                          },
                          {
                            name: '9.bat',
                            data: 'manbow\n',
                          },
                          {
                            name: '10.bat',
                            data: 'quarth\n',
                          },
                          {
                            name: '11.bat',
                            data: 'prompt\n',
                          },
                          {
                            name: 'vampkill.exe',
                            link: '../systems/msx2/?ROM=games/vampirekill.zip&M=MSX2&game=vampkill',
                          },
                          {
                            name: 'castleex.exe',
                            link: '../systems/msx2/?ROM=games/castleexcl.zip&M=MSX2&game=castleex',
                          },
                          {
                            name: 'bubblbob.exe',
                            link: '../systems/msx2/?ROM=games/bubblebobble.zip&M=MSX2&game=bubblbob',
                          },
                          {
                            name: 'metlgear.exe',
                            link: '../systems/msx2/?ROM=games/metalgear.zip&M=MSX2&game=metlgear',
                          },
                          {
                            name: 'usas.exe',
                            link: '../systems/msx2/?ROM=games/usas.zip&M=MSX2&game=usas',
                          },
                          {
                            name: 'f1spirit.exe',
                            link: '../systems/msx2/?ROM=games/f1spirit.zip&M=MSX2&game=f1spirit',
                          },
                          {
                            name: 'aleste.exe',
                            link: '../systems/msx2/?ROM=games/aleste.zip&M=MSX2&game=aleste',
                          },
                          {
                            name: 'parodius.exe',
                            link: '../systems/msx2/?ROM=games/parodius.zip&M=MSX2&game=parodius',
                          },
                          {
                            name: 'manbow.exe',
                            link: '../systems/msx2/?ROM=games/spacemanbow.zip&M=MSX2&game=manbow',
                          },
                          {
                            name: 'quarth.exe',
                            link: '../systems/msx2/?ROM=games/quarth.zip&M=MSX2&game=quarth',
                          },
                          {
                            name: 'prompt.exe',
                            link: '../systems/msx2/?M=MSX2',
                          },
                        ],
                      },
                    ],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n',
                      },
                    ],
                  },
                ],
                files: [
                  {
                    name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                MSX  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  MSX                            (1983) º\necho                 º                                             º\necho                 º   2.  MSX2                           (1986) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                  },
                  {
                    name: '1.bat',
                    data: 'cd msx1\ncd games\nmenu\n',
                  },
                  {
                    name: '2.bat',
                    data: 'cd msx2\ncd games\nmenu\n',
                  },
                  {
                    name: '0.bat',
                    data: 'cd ..\nmenu\n',
                  },
                ],
              },
            ],
            files: [
              {
                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               HOME  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Acorn                     (1981-1986) º\necho                 º   2.  Amstrad                        (1984) º\necho                 º   3.  Apple                     (1976-1977) º\necho                 º   4.  Atari                     (1979-1983) º\necho                 º   5.  Commodore                 (1977-1984) º\necho                 º   6.  MSX                       (1983-1986) º\necho                 º   7.  Sinclair                  (1981-1982) º\necho                 º   8.  Tandy                     (1980-1983) º\necho                 º   9.  Texas Instruments              (1979) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
              },
              {
                name: '1.bat',
                data: 'cd acorn\nmenu\n',
              },
              {
                name: '2.bat',
                data: 'cd cpc\ncd games\nmenu\n',
              },
              {
                name: '3.bat',
                data: 'cd apple\nmenu\n',
              },
              {
                name: '4.bat',
                data: 'cd atari\nmenu\n',
              },
              {
                name: '5.bat',
                data: 'cd commodre\nmenu\n',
              },
              {
                name: '6.bat',
                data: 'cd msx\nmenu\n',
              },
              {
                name: '7.bat',
                data: 'cd sinclair\nmenu\n',
              },
              {
                name: '8.bat',
                data: 'cd tandy\nmenu\n',
              },
              {
                name: '9.bat',
                data: 'cd ti99\ncd games\nmenu\n',
              },
              {
                name: '0.bat',
                data: 'cd ..\nmenu\n',
              },
            ],
          },

          {
            name: 'HANDHELD',
            directories: [
              {
                name: 'GAMEBOY',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             NINTENDO  GAME  BOY             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Tetris                         (1989) º\necho                 º   2.  Super Mario Land               (1989) º\necho                 º   3.  Castlevania: The Adventure     (1989) º\necho                 º   4.  Gargoyle\'s Quest               (1990) º\necho                 º   5.  Final Fantasy Adventure        (1991) º\necho                 º   6.  Kirby\'s Dream Land             (1992) º\necho                 º   7.  Zelda: Link\'s Awakening        (1993) º\necho                 º   8.  Donkey Kong                    (1994) º\necho                 º   9.  Pok\x82mon Red                    (1996) º\necho                 º  10.  Shantae                        (2002) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                      },
                      { name: '1.bat', data: 'tetris\n' },
                      { name: '2.bat', data: 'smland\n' },
                      { name: '3.bat', data: 'castlev\n' },
                      { name: '4.bat', data: 'gargoyle\n' },
                      { name: '5.bat', data: 'ffadv\n' },
                      { name: '6.bat', data: 'kirby\n' },
                      { name: '7.bat', data: 'zelda\n' },
                      { name: '8.bat', data: 'dkong\n' },
                      { name: '9.bat', data: 'pokemon\n' },
                      { name: '10.bat', data: 'shantae\n' },
                      { name: '0.bat', data: 'echo off\ncd ..\ncd ..\nmenu\n' },
                      {
                        name: 'tetris.exe',
                        link: '../systems/gbc/play.html?game=tetris',
                      },
                      {
                        name: 'smland.exe',
                        link: '../systems/gbc/play.html?game=smland',
                      },
                      {
                        name: 'castlev.exe',
                        link: '../systems/gbc/play.html?game=castlev',
                      },
                      {
                        name: 'gargoyle.exe',
                        link: '../systems/gbc/play.html?game=gargoyle',
                      },
                      {
                        name: 'kirby.exe',
                        link: '../systems/gbc/play.html?game=kirby',
                      },
                      {
                        name: 'zelda.exe',
                        link: '../systems/gbc/play.html?game=zelda',
                      },
                      {
                        name: 'dkong.exe',
                        link: '../systems/gbc/play.html?game=dkong',
                      },
                      {
                        name: 'pokemon.exe',
                        link: '../systems/gbc/play.html?game=pokemon',
                      },
                      {
                        name: 'ffadv.exe',
                        link: '../systems/gbc/play.html?game=ffadv',
                      },
                      {
                        name: 'shantae.exe',
                        link: '../systems/gbc/play.html?game=shantae',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'LYNX',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                 ATARI  LYNX                 º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  California Games               (1989) º\necho                 º   2.  Chip\'s Challenge               (1989) º\necho                 º   3.  Electrocop                     (1989) º\necho                 º   4.  Blue Lightning                 (1989) º\necho                 º   5.  Warbirds                       (1989) º\necho                 º   6.  Zarlor Mercenary               (1990) º\necho                 º   7.  Klax                           (1990) º\necho                 º   8.  Todd\'s Adventures: Slime World (1990) º\necho                 º   9.  S.T.U.N. Runner                (1991) º\necho                 º  10.  Rampart                        (1991) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
                      },
                      { name: '1.bat', data: 'calgames\n' },
                      { name: '2.bat', data: 'chips\n' },
                      { name: '3.bat', data: 'electro\n' },
                      { name: '4.bat', data: 'bluelght\n' },
                      { name: '5.bat', data: 'warbirds\n' },
                      { name: '6.bat', data: 'zarlor\n' },
                      { name: '7.bat', data: 'klax\n' },
                      { name: '8.bat', data: 'slime\n' },
                      { name: '9.bat', data: 'stunrun\n' },
                      { name: '10.bat', data: 'rampart\n' },
                      { name: '0.bat', data: 'echo off\ncd ..\ncd ..\nmenu\n' },
                      {
                        name: 'calgames.exe',
                        link: '../systems/lynx/play.html?game=calgames',
                      },
                      {
                        name: 'chips.exe',
                        link: '../systems/lynx/play.html?game=chips',
                      },
                      {
                        name: 'electro.exe',
                        link: '../systems/lynx/play.html?game=electro',
                      },
                      {
                        name: 'bluelght.exe',
                        link: '../systems/lynx/play.html?game=bluelght',
                      },
                      {
                        name: 'warbirds.exe',
                        link: '../systems/lynx/play.html?game=warbirds',
                      },
                      {
                        name: 'zarlor.exe',
                        link: '../systems/lynx/play.html?game=zarlor',
                      },
                      {
                        name: 'klax.exe',
                        link: '../systems/lynx/play.html?game=klax',
                      },
                      {
                        name: 'slime.exe',
                        link: '../systems/lynx/play.html?game=slime',
                      },
                      {
                        name: 'stunrun.exe',
                        link: '../systems/lynx/play.html?game=stunrun',
                      },
                      {
                        name: 'rampart.exe',
                        link: '../systems/lynx/play.html?game=rampart',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'GAMEGEAR',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               SEGA  GAME  GEAR              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Columns                        (1991) º\necho                 º   2.  Sonic the Hedgehog             (1991) º\necho                 º   3.  Shinobi                        (1991) º\necho                 º   4.  Aerial Assault                 (1992) º\necho                 º   5.  Streets of Rage                (1992) º\necho                 º   6.  Defenders of Oasis             (1992) º\necho                 º   7.  Land of Illusion               (1993) º\necho                 º   8.  Mortal Kombat                  (1993) º\necho                 º   9.  Robotnik\'s Mean Bean Machine   (1993) º\necho                 º  10.  Tails Adventure                (1995) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      { name: '1.bat', data: 'columns\n' },
                      { name: '2.bat', data: 'sonic\n' },
                      { name: '3.bat', data: 'shinobi\n' },
                      { name: '4.bat', data: 'aerial\n' },
                      { name: '5.bat', data: 'rage\n' },
                      { name: '6.bat', data: 'oasis\n' },
                      { name: '7.bat', data: 'illusion\n' },
                      { name: '8.bat', data: 'kombat\n' },
                      { name: '9.bat', data: 'meanbean\n' },
                      { name: '10.bat', data: 'tails\n' },
                      { name: '0.bat', data: 'echo off\ncd ..\ncd ..\nmenu\n' },
                      {
                        name: 'columns.exe',
                        link: '../systems/gamegear/play.html?game=columns',
                      },
                      {
                        name: 'sonic.exe',
                        link: '../systems/gamegear/play.html?game=sonic',
                      },
                      {
                        name: 'shinobi.exe',
                        link: '../systems/gamegear/play.html?game=shinobi',
                      },
                      {
                        name: 'aerial.exe',
                        link: '../systems/gamegear/play.html?game=aerial',
                      },
                      {
                        name: 'rage.exe',
                        link: '../systems/gamegear/play.html?game=rage',
                      },
                      {
                        name: 'oasis.exe',
                        link: '../systems/gamegear/play.html?game=oasis',
                      },
                      {
                        name: 'illusion.exe',
                        link: '../systems/gamegear/play.html?game=illusion',
                      },
                      {
                        name: 'kombat.exe',
                        link: '../systems/gamegear/play.html?game=kombat',
                      },
                      {
                        name: 'meanbean.exe',
                        link: '../systems/gamegear/play.html?game=meanbean',
                      },
                      {
                        name: 'tails.exe',
                        link: '../systems/gamegear/play.html?game=tails',
                      },
                    ],
                  },
                ],
              },
            ],
            files: [
              {
                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              HANDHELD  CONSOLES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Nintendo Game Boy              (1989) º\necho                 º                                             º\necho                 º   2.  Atari Lynx                     (1989) º\necho                 º                                             º\necho                 º   3.  Sega Game Gear                 (1990) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
              },
              { name: '1.bat', data: 'cd gameboy\ncd games\nmenu\n' },
              { name: '2.bat', data: 'cd lynx\ncd games\nmenu\n' },
              { name: '3.bat', data: 'cd gamegear\ncd games\nmenu\n' },
              { name: '0.bat', data: 'echo off\ncd ..\nmenu\n' },
            ],
          },
          {
            name: 'ARCADE',
            directories: [
              {
                name: 'ATARI',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                ATARI  ARCADE                º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Asteroids                      (1979) º\necho                 º   2.  Battlezone                     (1980) º\necho                 º   3.  Centipede                      (1980) º\necho                 º   4.  Missile Command                (1980) º\necho                 º   5.  Tempest                        (1980) º\necho                 º   6.  I, Robot                       (1983) º\necho                 º   7.  Star Wars                      (1983) º\necho                 º   8.  Marble Madness                 (1984) º\necho                 º   9.  Paperboy                       (1984) º\necho                 º  10.  Gauntlet                       (1985) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'asteroid\n' },
                      { name: '2.bat', data: 'bzone\n' },
                      { name: '3.bat', data: 'centiped\n' },
                      { name: '4.bat', data: 'missile\n' },
                      { name: '5.bat', data: 'tempest\n' },
                      { name: '6.bat', data: 'irobot\n' },
                      { name: '7.bat', data: 'starwars\n' },
                      { name: '8.bat', data: 'marble\n' },
                      { name: '9.bat', data: 'paperboy\n' },
                      { name: '10.bat', data: 'gauntlet\n' },
                      {
                        name: 'asteroid.exe',
                        link: '../systems/arcade/play.html?game=asteroid',
                      },
                      {
                        name: 'bzone.exe',
                        link: '../systems/arcade/play.html?game=bzone',
                      },
                      {
                        name: 'centiped.exe',
                        link: '../systems/arcade/play.html?game=centiped',
                      },
                      {
                        name: 'missile.exe',
                        link: '../systems/arcade/play.html?game=missile',
                      },
                      {
                        name: 'tempest.exe',
                        link: '../systems/arcade/play.html?game=tempest',
                      },
                      {
                        name: 'irobot.exe',
                        link: '../systems/arcade/play.html?game=irobot',
                      },
                      {
                        name: 'starwars.exe',
                        link: '../systems/arcade/play.html?game=starwars',
                      },
                      {
                        name: 'marble.exe',
                        link: '../systems/arcade/play.html?game=marble',
                      },
                      {
                        name: 'paperboy.exe',
                        link: '../systems/arcade/play.html?game=paperboy',
                      },
                      {
                        name: 'gauntlet.exe',
                        link: '../systems/arcade/play.html?game=gauntlet',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'CAPCOM',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               CAPCOM  ARCADE                º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  1942                           (1984) º\necho                 º   2.  Commando                       (1985) º\necho                 º   3.  Ghosts\'n Goblins               (1985) º\necho                 º   4.  Gun.Smoke                      (1985) º\necho                 º   5.  Bionic Commando                (1987) º\necho                 º   6.  Black Tiger                    (1987) º\necho                 º   7.  Street Fighter                 (1987) º\necho                 º   8.  Forgotten Worlds               (1988) º\necho                 º   9.  Final Fight                    (1989) º\necho                 º  10.  Strider                        (1989) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: '1942\n' },
                      { name: '2.bat', data: 'commando\n' },
                      { name: '3.bat', data: 'gng\n' },
                      { name: '4.bat', data: 'gunsmoke\n' },
                      { name: '5.bat', data: 'bionicc\n' },
                      { name: '6.bat', data: 'blktiger\n' },
                      { name: '7.bat', data: 'sf1\n' },
                      { name: '8.bat', data: 'forgottn\n' },
                      { name: '9.bat', data: 'ffight\n' },
                      { name: '10.bat', data: 'strider\n' },
                      {
                        name: '1942.exe',
                        link: '../systems/arcade/play.html?game=1942',
                      },
                      {
                        name: 'commando.exe',
                        link: '../systems/arcade/play.html?game=commando',
                      },
                      {
                        name: 'gng.exe',
                        link: '../systems/arcade/play.html?game=gng',
                      },
                      {
                        name: 'gunsmoke.exe',
                        link: '../systems/arcade/play.html?game=gunsmoke',
                      },
                      {
                        name: 'bionicc.exe',
                        link: '../systems/arcade/play.html?game=bionicc',
                      },
                      {
                        name: 'blktiger.exe',
                        link: '../systems/arcade/play.html?game=blktiger',
                      },
                      {
                        name: 'sf1.exe',
                        link: '../systems/arcade/play.html?game=sf1',
                      },
                      {
                        name: 'forgottn.exe',
                        link: '../systems/arcade/play.html?game=forgottn',
                      },
                      {
                        name: 'ffight.exe',
                        link: '../systems/arcade/play.html?game=ffight',
                      },
                      {
                        name: 'strider.exe',
                        link: '../systems/arcade/play.html?game=strider',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'IREM',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                IREM  ARCADE                 º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Red Alert                      (1981) º\necho                 º   2.  Moon Patrol                    (1982) º\necho                 º   3.  10 Yard Fight                  (1983) º\necho                 º   4.  Traverse USA                   (1983) º\necho                 º   5.  Kung-Fu Master                 (1984) º\necho                 º   6.  Kid Niki                       (1986) º\necho                 º   7.  R-Type                         (1987) º\necho                 º   8.  Image Fight                    (1988) º\necho                 º   9.  Ninja Spirit                   (1988) º\necho                 º  10.  Vigilante                      (1988) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'redalert\n' },
                      { name: '2.bat', data: 'mpatrol\n' },
                      { name: '3.bat', data: 'yard\n' },
                      { name: '4.bat', data: 'travrusa\n' },
                      { name: '5.bat', data: 'kungfum\n' },
                      { name: '6.bat', data: 'kidniki\n' },
                      { name: '7.bat', data: 'rtype\n' },
                      { name: '8.bat', data: 'imgfight\n' },
                      { name: '9.bat', data: 'nspirit\n' },
                      { name: '10.bat', data: 'vigilant\n' },
                      {
                        name: 'redalert.exe',
                        link: '../systems/arcade/play.html?game=redalert',
                      },
                      {
                        name: 'mpatrol.exe',
                        link: '../systems/arcade/play.html?game=mpatrol',
                      },
                      {
                        name: 'yard.exe',
                        link: '../systems/arcade/play.html?game=yard',
                      },
                      {
                        name: 'travrusa.exe',
                        link: '../systems/arcade/play.html?game=travrusa',
                      },
                      {
                        name: 'kungfum.exe',
                        link: '../systems/arcade/play.html?game=kungfum',
                      },
                      {
                        name: 'kidniki.exe',
                        link: '../systems/arcade/play.html?game=kidniki',
                      },
                      {
                        name: 'rtype.exe',
                        link: '../systems/arcade/play.html?game=rtype',
                      },
                      {
                        name: 'imgfight.exe',
                        link: '../systems/arcade/play.html?game=imgfight',
                      },
                      {
                        name: 'nspirit.exe',
                        link: '../systems/arcade/play.html?game=nspirit',
                      },
                      {
                        name: 'vigilant.exe',
                        link: '../systems/arcade/play.html?game=vigilant',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'KONAMI',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               KONAMI  ARCADE                º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Frogger                        (1981) º\necho                 º   2.  Scramble                       (1981) º\necho                 º   3.  Time Pilot                     (1982) º\necho                 º   4.  Tutankham                      (1982) º\necho                 º   5.  Gyruss                         (1983) º\necho                 º   6.  Track & Field                  (1983) º\necho                 º   7.  Green Beret                    (1985) º\necho                 º   8.  Nemesis                        (1985) º\necho                 º   9.  Yie Ar Kung-Fu                 (1985) º\necho                 º  10.  Contra                         (1987) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'frogger\n' },
                      { name: '2.bat', data: 'scramble\n' },
                      { name: '3.bat', data: 'timeplt\n' },
                      { name: '4.bat', data: 'tutankhm\n' },
                      { name: '5.bat', data: 'gyruss\n' },
                      { name: '6.bat', data: 'trackfld\n' },
                      { name: '7.bat', data: 'gberet\n' },
                      { name: '8.bat', data: 'nemesis\n' },
                      { name: '9.bat', data: 'yiear\n' },
                      { name: '10.bat', data: 'contra\n' },
                      {
                        name: 'frogger.exe',
                        link: '../systems/arcade/play.html?game=frogger',
                      },
                      {
                        name: 'scramble.exe',
                        link: '../systems/arcade/play.html?game=scramble',
                      },
                      {
                        name: 'timeplt.exe',
                        link: '../systems/arcade/play.html?game=timeplt',
                      },
                      {
                        name: 'tutankhm.exe',
                        link: '../systems/arcade/play.html?game=tutankhm',
                      },
                      {
                        name: 'gyruss.exe',
                        link: '../systems/arcade/play.html?game=gyruss',
                      },
                      {
                        name: 'trackfld.exe',
                        link: '../systems/arcade/play.html?game=trackfld',
                      },
                      {
                        name: 'gberet.exe',
                        link: '../systems/arcade/play.html?game=gberet',
                      },
                      {
                        name: 'nemesis.exe',
                        link: '../systems/arcade/play.html?game=nemesis',
                      },
                      {
                        name: 'yiear.exe',
                        link: '../systems/arcade/play.html?game=yiear',
                      },
                      {
                        name: 'contra.exe',
                        link: '../systems/arcade/play.html?game=contra',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'MIDWAY',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               MIDWAY  ARCADE                º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Sea Wolf                       (1976) º\necho                 º   2.  Wizard of Wor                  (1980) º\necho                 º   3.  Gorf                           (1981) º\necho                 º   4.  Ms. Pac-Man                    (1981) º\necho                 º   5.  Omega Race                     (1981) º\necho                 º   6.  Satan\'s Hollow                 (1981) º\necho                 º   7.  Tron                           (1982) º\necho                 º   8.  Spy Hunter                     (1983) º\necho                 º   9.  Tapper                         (1983) º\necho                 º  10.  Rampage                        (1986) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'seawolf\n' },
                      { name: '2.bat', data: 'wow\n' },
                      { name: '3.bat', data: 'gorf\n' },
                      { name: '4.bat', data: 'mspacman\n' },
                      { name: '5.bat', data: 'omegrace\n' },
                      { name: '6.bat', data: 'shollow\n' },
                      { name: '7.bat', data: 'tron\n' },
                      { name: '8.bat', data: 'spyhunt\n' },
                      { name: '9.bat', data: 'tapper\n' },
                      { name: '10.bat', data: 'rampage\n' },
                      {
                        name: 'seawolf.exe',
                        link: '../systems/arcade/play.html?game=seawolf',
                      },
                      {
                        name: 'wow.exe',
                        link: '../systems/arcade/play.html?game=wow',
                      },
                      {
                        name: 'gorf.exe',
                        link: '../systems/arcade/play.html?game=gorf',
                      },
                      {
                        name: 'mspacman.exe',
                        link: '../systems/arcade/play.html?game=mspacman',
                      },
                      {
                        name: 'omegrace.exe',
                        link: '../systems/arcade/play.html?game=omegrace',
                      },
                      {
                        name: 'shollow.exe',
                        link: '../systems/arcade/play.html?game=shollow',
                      },
                      {
                        name: 'tron.exe',
                        link: '../systems/arcade/play.html?game=tron',
                      },
                      {
                        name: 'spyhunt.exe',
                        link: '../systems/arcade/play.html?game=spyhunt',
                      },
                      {
                        name: 'tapper.exe',
                        link: '../systems/arcade/play.html?game=tapper',
                      },
                      {
                        name: 'rampage.exe',
                        link: '../systems/arcade/play.html?game=rampage',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'NAMCO',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                NAMCO  ARCADE                º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Galaxian                       (1979) º\necho                 º   2.  Pac-Man                        (1980) º\necho                 º   3.  Rally-X                        (1980) º\necho                 º   4.  Bosconian                      (1981) º\necho                 º   5.  Galaga                         (1981) º\necho                 º   6.  Dig Dug                        (1982) º\necho                 º   7.  Pole Position                  (1982) º\necho                 º   8.  Xevious                        (1982) º\necho                 º   9.  Mappy                          (1983) º\necho                 º  10.  Rolling Thunder                (1986) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'galaxian\n' },
                      { name: '2.bat', data: 'puckman\n' },
                      { name: '3.bat', data: 'rallyx\n' },
                      { name: '4.bat', data: 'bosco\n' },
                      { name: '5.bat', data: 'galaga\n' },
                      { name: '6.bat', data: 'digdug\n' },
                      { name: '7.bat', data: 'polepos\n' },
                      { name: '8.bat', data: 'xevious\n' },
                      { name: '9.bat', data: 'mappy\n' },
                      { name: '10.bat', data: 'rthunder\n' },
                      {
                        name: 'galaxian.exe',
                        link: '../systems/arcade/play.html?game=galaxian',
                      },
                      {
                        name: 'puckman.exe',
                        link: '../systems/arcade/play.html?game=puckman',
                      },
                      {
                        name: 'rallyx.exe',
                        link: '../systems/arcade/play.html?game=rallyx',
                      },
                      {
                        name: 'bosco.exe',
                        link: '../systems/arcade/play.html?game=bosco',
                      },
                      {
                        name: 'galaga.exe',
                        link: '../systems/arcade/play.html?game=galaga',
                      },
                      {
                        name: 'digdug.exe',
                        link: '../systems/arcade/play.html?game=digdug',
                      },
                      {
                        name: 'polepos.exe',
                        link: '../systems/arcade/play.html?game=polepos',
                      },
                      {
                        name: 'xevious.exe',
                        link: '../systems/arcade/play.html?game=xevious',
                      },
                      {
                        name: 'mappy.exe',
                        link: '../systems/arcade/play.html?game=mappy',
                      },
                      {
                        name: 'rthunder.exe',
                        link: '../systems/arcade/play.html?game=rthunder',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'NINTENDO',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              NINTENDO  ARCADE               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Sheriff                        (1979) º\necho                 º   2.  Space Fever                    (1979) º\necho                 º   3.  HeliFire                       (1980) º\necho                 º   4.  Radar Scope                    (1980) º\necho                 º   5.  Space Firebird                 (1980) º\necho                 º   6.  Donkey Kong                    (1981) º\necho                 º   7.  Sky Skipper                    (1981) º\necho                 º   8.  Popeye                         (1982) º\necho                 º   9.  Mario Bros.                    (1983) º\necho                 º  10.  Punch-Out!!                    (1984) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'sheriff\n' },
                      { name: '2.bat', data: 'spacefev\n' },
                      { name: '3.bat', data: 'helifire\n' },
                      { name: '4.bat', data: 'radarscp\n' },
                      { name: '5.bat', data: 'spacefb\n' },
                      { name: '6.bat', data: 'dkong\n' },
                      { name: '7.bat', data: 'skyskipr\n' },
                      { name: '8.bat', data: 'popeye\n' },
                      { name: '9.bat', data: 'mario\n' },
                      { name: '10.bat', data: 'punchout\n' },
                      {
                        name: 'sheriff.exe',
                        link: '../systems/arcade/play.html?game=sheriff',
                      },
                      {
                        name: 'spacefev.exe',
                        link: '../systems/arcade/play.html?game=spacefev',
                      },
                      {
                        name: 'helifire.exe',
                        link: '../systems/arcade/play.html?game=helifire',
                      },
                      {
                        name: 'radarscp.exe',
                        link: '../systems/arcade/play.html?game=radarscp',
                      },
                      {
                        name: 'spacefb.exe',
                        link: '../systems/arcade/play.html?game=spacefb',
                      },
                      {
                        name: 'dkong.exe',
                        link: '../systems/arcade/play.html?game=dkong',
                      },
                      {
                        name: 'skyskipr.exe',
                        link: '../systems/arcade/play.html?game=skyskipr',
                      },
                      {
                        name: 'popeye.exe',
                        link: '../systems/arcade/play.html?game=popeye',
                      },
                      {
                        name: 'mario.exe',
                        link: '../systems/arcade/play.html?game=mario',
                      },
                      {
                        name: 'punchout.exe',
                        link: '../systems/arcade/play.html?game=punchout',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'SEGA',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                SEGA  ARCADE                 º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Turbo                          (1981) º\necho                 º   2.  Pengo                          (1982) º\necho                 º   3.  Zaxxon                         (1982) º\necho                 º   4.  Hang-On                        (1985) º\necho                 º   5.  Space Harrier                  (1985) º\necho                 º   6.  Fantasy Zone                   (1986) º\necho                 º   7.  Out Run                        (1986) º\necho                 º   8.  Shinobi                        (1987) º\necho                 º   9.  Altered Beast                  (1988) º\necho                 º  10.  Golden Axe                     (1989) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'turbo\n' },
                      { name: '2.bat', data: 'pengo\n' },
                      { name: '3.bat', data: 'zaxxon\n' },
                      { name: '4.bat', data: 'hangon\n' },
                      { name: '5.bat', data: 'sharrier\n' },
                      { name: '6.bat', data: 'fantzone\n' },
                      { name: '7.bat', data: 'outrun\n' },
                      { name: '8.bat', data: 'shinobi\n' },
                      { name: '9.bat', data: 'altbeast\n' },
                      { name: '10.bat', data: 'goldnaxe\n' },
                      {
                        name: 'turbo.exe',
                        link: '../systems/arcade/play.html?game=turbo',
                      },
                      {
                        name: 'pengo.exe',
                        link: '../systems/arcade/play.html?game=pengo',
                      },
                      {
                        name: 'zaxxon.exe',
                        link: '../systems/arcade/play.html?game=zaxxon',
                      },
                      {
                        name: 'hangon.exe',
                        link: '../systems/arcade/play.html?game=hangon',
                      },
                      {
                        name: 'sharrier.exe',
                        link: '../systems/arcade/play.html?game=sharrier',
                      },
                      {
                        name: 'fantzone.exe',
                        link: '../systems/arcade/play.html?game=fantzone',
                      },
                      {
                        name: 'outrun.exe',
                        link: '../systems/arcade/play.html?game=outrun',
                      },
                      {
                        name: 'shinobi.exe',
                        link: '../systems/arcade/play.html?game=shinobi',
                      },
                      {
                        name: 'altbeast.exe',
                        link: '../systems/arcade/play.html?game=altbeast',
                      },
                      {
                        name: 'goldnaxe.exe',
                        link: '../systems/arcade/play.html?game=goldnaxe',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'TAITO',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                TAITO  ARCADE                º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Space Invaders                 (1978) º\necho                 º   2.  Qix                            (1981) º\necho                 º   3.  Jungle King                    (1982) º\necho                 º   4.  Elevator Action                (1983) º\necho                 º   5.  Arkanoid                       (1986) º\necho                 º   6.  Bubble Bobble                  (1986) º\necho                 º   7.  Operation Wolf                 (1987) º\necho                 º   8.  Rastan                         (1987) º\necho                 º   9.  Chase H.Q.                     (1988) º\necho                 º  10.  The New Zealand Story          (1988) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'sitv\n' },
                      { name: '2.bat', data: 'qix\n' },
                      { name: '3.bat', data: 'junglek\n' },
                      { name: '4.bat', data: 'elevator\n' },
                      { name: '5.bat', data: 'arkanoid\n' },
                      { name: '6.bat', data: 'bublbobl\n' },
                      { name: '7.bat', data: 'opwolf\n' },
                      { name: '8.bat', data: 'rastan\n' },
                      { name: '9.bat', data: 'chasehq\n' },
                      { name: '10.bat', data: 'tnzs\n' },
                      {
                        name: 'sitv.exe',
                        link: '../systems/arcade/play.html?game=sitv',
                      },
                      {
                        name: 'qix.exe',
                        link: '../systems/arcade/play.html?game=qix',
                      },
                      {
                        name: 'junglek.exe',
                        link: '../systems/arcade/play.html?game=junglek',
                      },
                      {
                        name: 'elevator.exe',
                        link: '../systems/arcade/play.html?game=elevator',
                      },
                      {
                        name: 'arkanoid.exe',
                        link: '../systems/arcade/play.html?game=arkanoid',
                      },
                      {
                        name: 'bublbobl.exe',
                        link: '../systems/arcade/play.html?game=bublbobl',
                      },
                      {
                        name: 'opwolf.exe',
                        link: '../systems/arcade/play.html?game=opwolf',
                      },
                      {
                        name: 'rastan.exe',
                        link: '../systems/arcade/play.html?game=rastan',
                      },
                      {
                        name: 'chasehq.exe',
                        link: '../systems/arcade/play.html?game=chasehq',
                      },
                      {
                        name: 'tnzs.exe',
                        link: '../systems/arcade/play.html?game=tnzs',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'WILLIAMS',
                files: [],
                directories: [
                  {
                    name: 'GAMES',
                    directories: [],
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              WILLIAMS  ARCADE               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Defender                       (1980) º\necho                 º   2.  Bubbles                        (1982) º\necho                 º   3.  Joust                          (1982) º\necho                 º   4.  Robotron: 2084                 (1982) º\necho                 º   5.  Sinistar                       (1982) º\necho                 º   6.  Splat!                         (1982) º\necho                 º   7.  Blaster                        (1983) º\necho                 º   8.  Mystic Marathon                (1983) º\necho                 º   9.  Inferno                        (1984) º\necho                 º  10.  Narc                           (1988) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                      },
                      {
                        name: '0.bat',
                        data: 'cd ..\ncd ..\nmenu\n',
                      },
                      { name: '1.bat', data: 'defender\n' },
                      { name: '2.bat', data: 'bubbles\n' },
                      { name: '3.bat', data: 'joust\n' },
                      { name: '4.bat', data: 'robotron\n' },
                      { name: '5.bat', data: 'sinistar\n' },
                      { name: '6.bat', data: 'splat\n' },
                      { name: '7.bat', data: 'blaster\n' },
                      { name: '8.bat', data: 'mysticm\n' },
                      { name: '9.bat', data: 'inferno\n' },
                      { name: '10.bat', data: 'narc\n' },
                      {
                        name: 'defender.exe',
                        link: '../systems/arcade/play.html?game=defender',
                      },
                      {
                        name: 'bubbles.exe',
                        link: '../systems/arcade/play.html?game=bubbles',
                      },
                      {
                        name: 'joust.exe',
                        link: '../systems/arcade/play.html?game=joust',
                      },
                      {
                        name: 'robotron.exe',
                        link: '../systems/arcade/play.html?game=robotron',
                      },
                      {
                        name: 'sinistar.exe',
                        link: '../systems/arcade/play.html?game=sinistar',
                      },
                      {
                        name: 'splat.exe',
                        link: '../systems/arcade/play.html?game=splat',
                      },
                      {
                        name: 'blaster.exe',
                        link: '../systems/arcade/play.html?game=blaster',
                      },
                      {
                        name: 'mysticm.exe',
                        link: '../systems/arcade/play.html?game=mysticm',
                      },
                      {
                        name: 'inferno.exe',
                        link: '../systems/arcade/play.html?game=inferno',
                      },
                      {
                        name: 'narc.exe',
                        link: '../systems/arcade/play.html?game=narc',
                      },
                    ],
                  },
                ],
              },
            ],
            files: [
              {
                name: 'menu.bat',
                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ARCADE  MACHINES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari                     (1979-1985) º\necho                 º   2.  Capcom                    (1984-1989) º\necho                 º   3.  Irem                      (1981-1988) º\necho                 º   4.  Konami                    (1981-1987) º\necho                 º   5.  Midway                    (1976-1986) º\necho                 º   6.  Namco                     (1979-1986) º\necho                 º   7.  Nintendo                  (1979-1984) º\necho                 º   8.  Sega                      (1981-1989) º\necho                 º   9.  Taito                     (1978-1988) º\necho                 º  10.  Williams                  (1980-1988) º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
              },
              { name: '1.bat', data: 'cd atari\ncd games\nmenu\n' },
              { name: '2.bat', data: 'cd capcom\ncd games\nmenu\n' },
              { name: '3.bat', data: 'cd irem\ncd games\nmenu\n' },
              { name: '4.bat', data: 'cd konami\ncd games\nmenu\n' },
              { name: '5.bat', data: 'cd midway\ncd games\nmenu\n' },
              { name: '6.bat', data: 'cd namco\ncd games\nmenu\n' },
              { name: '7.bat', data: 'cd nintendo\ncd games\nmenu\n' },
              { name: '8.bat', data: 'cd sega\ncd games\nmenu\n' },
              { name: '9.bat', data: 'cd taito\ncd games\nmenu\n' },
              { name: '10.bat', data: 'cd williams\ncd games\nmenu\n' },
              {
                name: '0.bat',
                data: 'cd ..\nmenu\n',
              },
            ],
          },
        ],
        files: [
          {
            name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             EMULATOR  LAUNCHER              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Home Computers                        º\necho                 º                                             º\necho                 º   2.  Games Consoles                        º\necho                 º                                             º\necho                 º   3.  Handheld Consoles                     º\necho                 º                                             º\necho                 º   4.  Arcade Machines                       º\necho                 º                                             º\necho                 º                                             º\necho                 º   5.  GenX-DOS Wiki                         º\necho                 º                                             º\necho                 º   0.  Exit                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
          },
          {
            name: '1.bat',
            data: 'cd homecomp\nmenu\n',
          },
          {
            name: '2.bat',
            data: 'cd console\nmenu\n',
          },
          {
            name: '3.bat',
            data: 'cd handheld\nmenu\n',
          },
          {
            name: '4.bat',
            data: 'cd arcade\nmenu\n',
          },
          {
            name: '5.bat',
            data: 'wiki\n',
          },
          {
            name: 'wiki.exe',
            link: '../docs/wiki/',
          },
          {
            name: '0.bat',
            data: 'echo off\ncls\necho GenX-DOS (2026)\necho ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ\necho Type "help" or "menu" to continue.\necho on\n',
          },
        ],
      },
    ],
    files: [
      {
        name: 'autoexec.bat',
        data: 'menu\n',
      },
      {
        name: 'menu.bat',
                                data: 'cd systems\nmenu\n',
      },
    ],
  },
];
