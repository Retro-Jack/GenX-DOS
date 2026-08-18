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
                            data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  2600  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Breakout             (1978)  BREAKOUT º\necho                 º   2.  Adventure            (1980)  ADVENTUR º\necho                 º   3.  Space Invaders       (1980)  INVADERS º\necho                 º   4.  Asteroids            (1981)  ASTEROID º\necho                 º   5.  Missile Command      (1981)  MISSILE  º\necho                 º   6.  Pac-Man              (1982)  PACMAN   º\necho                 º   7.  Pitfall!             (1982)  PITFALL  º\necho                 º   8.  River Raid           (1982)  RIVERAID º\necho                 º   9.  Yars' Revenge        (1982)  YARS     º\necho                 º  10.  Centipede            (1983)  CENTIPED º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                            name: 'adventur.bat',
                            link: '../systems/stella/play.html?game=adventure',
                          },
                          {
                            name: 'asteroid.bat',
                            link: '../systems/stella/play.html?game=asteroids',
                          },
                          {
                            name: 'pacman.bat',
                            link: '../systems/stella/play.html?game=pacman',
                          },
                          {
                            name: 'pitfall.bat',
                            link: '../systems/stella/play.html?game=pitfall',
                          },
                          {
                            name: 'invaders.bat',
                            link: '../systems/stella/play.html?game=invaders',
                          },
                          {
                            name: 'breakout.bat',
                            link: '../systems/stella/play.html?game=breakout',
                          },
                          {
                            name: 'missile.bat',
                            link: '../systems/stella/play.html?game=missile',
                          },
                          {
                            name: 'yars.bat',
                            link: '../systems/stella/play.html?game=yars',
                          },
                          {
                            name: 'centiped.bat',
                            link: '../systems/stella/play.html?game=centipede',
                          },
                          {
                            name: 'riveraid.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  7800  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Asteroids            (1986)  ASTEROID º\necho                 º   2.  Centipede            (1986)  CENTIPED º\necho                 º   3.  Joust                (1986)  JOUST    º\necho                 º   4.  Ms. Pac-Man          (1986)  MSPACMAN º\necho                 º   5.  Xevious              (1986)  XEVIOUS  º\necho                 º   6.  Desert Falcon        (1987)  DESERTFL º\necho                 º   7.  Dig Dug              (1987)  DIGDUG   º\necho                 º   8.  Food Fight           (1987)  FOODFGHT º\necho                 º   9.  Galaga               (1987)  GALAGA   º\necho                 º  10.  Robotron 2084        (1987)  ROBOTRON º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'asteroid.bat',
                            link: '../systems/js7800/play.html?game=asteroids',
                          },
                          {
                            name: 'centiped.bat',
                            link: '../systems/js7800/play.html?game=centipede',
                          },
                          {
                            name: 'joust.bat',
                            link: '../systems/js7800/play.html?game=joust',
                          },
                          {
                            name: 'mspacman.bat',
                            link: '../systems/js7800/play.html?game=mspacman',
                          },
                          {
                            name: 'galaga.bat',
                            link: '../systems/js7800/play.html?game=galaga',
                          },
                          {
                            name: 'desertfl.bat',
                            link: '../systems/js7800/play.html?game=desertfl',
                          },
                          {
                            name: 'digdug.bat',
                            link: '../systems/js7800/play.html?game=digdug',
                          },
                          {
                            name: 'xevious.bat',
                            link: '../systems/js7800/play.html?game=xevious',
                          },
                          {
                            name: 'foodfght.bat',
                            link: '../systems/js7800/play.html?game=foodfight',
                          },
                          {
                            name: 'robotron.bat',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               ATARI  CONSOLES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari 2600           (1977)  2600     º\necho                 º                                             º\necho                 º   2.  Atari 7800           (1986)  7800     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             NINTENDO  NES  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Super Mario Bros.    (1985)  MARIO    º\necho                 º   2.  Castlevania          (1987)  CASTLEV  º\necho                 º   3.  Kid Icarus           (1987)  KIDICARU º\necho                 º   4.  Mega Man             (1987)  MEGAMAN  º\necho                 º   5.  Metroid              (1987)  METROID  º\necho                 º   6.  Mike Tyson's P-O!!   (1987)  PUNCHOUT º\necho                 º   7.  The Legend of Zelda  (1987)  ZELDA    º\necho                 º   8.  Contra               (1988)  CONTRA   º\necho                 º   9.  Tetris               (1989)  TETRIS   º\necho                 º  10.  Final Fantasy        (1990)  FINALFNT º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                        name: 'smb.bat',
                        link: '../systems/jsnes/play.html?game=smb',
                      },
                      {
                        name: 'kidicaru.bat',
                        link: '../systems/jsnes/play.html?game=kidicarus',
                      },
                      {
                        name: 'zelda.bat',
                        link: '../systems/jsnes/play.html?game=zelda',
                      },
                      {
                        name: 'contra.bat',
                        link: '../systems/jsnes/play.html?game=contra',
                      },
                      {
                        name: 'megaman.bat',
                        link: '../systems/jsnes/play.html?game=megaman',
                      },
                      {
                        name: 'castlev.bat',
                        link: '../systems/jsnes/play.html?game=castlvnia',
                      },
                      {
                        name: 'metroid.bat',
                        link: '../systems/jsnes/play.html?game=metroid',
                      },
                      {
                        name: 'tetris.bat',
                        link: '../systems/jsnes/play.html?game=tetris',
                      },
                      {
                        name: 'punchout.bat',
                        link: '../systems/jsnes/play.html?game=punchout',
                      },
                      {
                        name: 'finalfnt.bat',
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
                        data: "echo off\ncls\necho                ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                º            INTELLIVISION  GAMES             º\necho                ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                º                                             º\necho                º   1.  Adventure            (1981)  ADVENT   º\necho                º   2.  Astrosmash           (1981)  ASTRO    º\necho                º   3.  B-17 Bomber          (1981)  B-17     º\necho                º   4.  Snafu                (1981)  SNAFU    º\necho                º   5.  Star Strike          (1981)  STARSTRK º\necho                º   6.  TRON: Deadly Discs   (1981)  TRON     º\necho                º   7.  Atlantis             (1982)  ATLANTIS º\necho                º   8.  Lock 'N' Chase       (1982)  LOCKCHAS º\necho                º   9.  Night Stalker        (1982)  NIGHTSTK º\necho                º  10.  BurgerTime           (1983)  BURGER   º\necho                º                                             º\necho                º   0.  Back                                  º\necho                º                                             º\necho                ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                º        Type a number and press ENTER        º\necho                ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                        name: 'astro.bat',
                        link: '../systems/intv/play.html?game=astro',
                      },
                      {
                        name: 'burger.bat',
                        link: '../systems/intv/play.html?game=burger',
                      },
                      {
                        name: 'tron.bat',
                        link: '../systems/intv/play.html?game=tron',
                      },
                      {
                        name: 'snafu.bat',
                        link: '../systems/intv/play.html?game=snafu',
                      },
                      {
                        name: 'b-17.bat',
                        link: '../systems/intv/play.html?game=b17',
                      },
                      {
                        name: 'nightstk.bat',
                        link: '../systems/intv/play.html?game=nightstk',
                      },
                      {
                        name: 'advent.bat',
                        link: '../systems/intv/play.html?game=advent',
                      },
                      {
                        name: 'atlantis.bat',
                        link: '../systems/intv/play.html?game=atlantis',
                      },
                      {
                        name: 'lockchas.bat',
                        link: '../systems/intv/play.html?game=lockchase',
                      },
                      {
                        name: 'starstrk.bat',
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
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             COLECOVISION  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Carnival             (1982)  CARNIVAL º\necho                 º   2.  Cosmic Avenger       (1982)  COSMIC   º\necho                 º   3.  Donkey Kong          (1982)  DKONG    º\necho                 º   4.  Lady Bug             (1982)  LADYBUG  º\necho                 º   5.  Mouse Trap           (1982)  MOUSETRP º\necho                 º   6.  Smurf Rescue         (1982)  SMURF    º\necho                 º   7.  Venture              (1982)  VENTURE  º\necho                 º   8.  Zaxxon               (1982)  ZAXXON   º\necho                 º   9.  Mr. Do!              (1983)  MRDO     º\necho                 º  10.  Q*bert               (1983)  QBERT    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        name: 'dkong.bat',
                        link: '../systems/coleco/play.html?game=dkong',
                      },
                      {
                        name: 'cosmic.bat',
                        link: '../systems/coleco/play.html?game=cosmic',
                      },
                      {
                        name: 'ladybug.bat',
                        link: '../systems/coleco/play.html?game=ladybug',
                      },
                      {
                        name: 'mousetrp.bat',
                        link: '../systems/coleco/play.html?game=mousetrp',
                      },
                      {
                        name: 'carnival.bat',
                        link: '../systems/coleco/play.html?game=carnival',
                      },
                      {
                        name: 'venture.bat',
                        link: '../systems/coleco/play.html?game=venture',
                      },
                      {
                        name: 'smurf.bat',
                        link: '../systems/coleco/play.html?game=smurf',
                      },
                      {
                        name: 'zaxxon.bat',
                        link: '../systems/coleco/play.html?game=zaxxon',
                      },
                      {
                        name: 'mrdo.bat',
                        link: '../systems/coleco/play.html?game=mrdo',
                      },
                      {
                        name: 'qbert.bat',
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
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               ODYSSEYý  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Cosmic Conflict!     (1979)  COSMIC   º\necho                 º   2.  Alien Invaders+!     (1980)  ALIENPLS º\necho                 º   3.  K.C. Munchkin!       (1981)  KCMUNCH  º\necho                 º   4.  Quest for Rings!     (1981)  QRINGS   º\necho                 º   5.  UFO!                 (1981)  UFO      º\necho                 º   6.  Atlantis             (1982)  ATLANTIS º\necho                 º   7.  Demon Attack         (1982)  DEMON    º\necho                 º   8.  Pick Axe Pete!       (1982)  PICKAXE  º\necho                 º   9.  Smithereens!         (1982)  SMITHER  º\necho                 º  10.  Killer Bees!         (1983)  KILLBEES º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        name: 'cosmic.bat',
                        link: '../systems/odyssey2/play.html?game=cosmic',
                      },
                      {
                        name: 'alienpls.bat',
                        link: '../systems/odyssey2/play.html?game=alienplus',
                      },
                      {
                        name: 'kcmunch.bat',
                        link: '../systems/odyssey2/play.html?game=kcmunch',
                      },
                      {
                        name: 'qrings.bat',
                        link: '../systems/odyssey2/play.html?game=qrings',
                      },
                      {
                        name: 'ufo.bat',
                        link: '../systems/odyssey2/play.html?game=ufo',
                      },
                      {
                        name: 'atlantis.bat',
                        link: '../systems/odyssey2/play.html?game=atlantis',
                      },
                      {
                        name: 'demon.bat',
                        link: '../systems/odyssey2/play.html?game=demon',
                      },
                      {
                        name: 'pickaxe.bat',
                        link: '../systems/odyssey2/play.html?game=pickaxe',
                      },
                      {
                        name: 'smither.bat',
                        link: '../systems/odyssey2/play.html?game=smither',
                      },
                      {
                        name: 'killbees.bat',
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
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º         SEGA  MASTER  SYSTEM  GAMES         º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Alex Kidd            (1986)  ALEXKIDD º\necho                 º   2.  Fantasy Zone         (1986)  FANTZONE º\necho                 º   3.  Wonder Boy           (1986)  WONDRBOY º\necho                 º   4.  Out Run              (1987)  OUTRUN   º\necho                 º   5.  Phantasy Star        (1988)  PHANTSTR º\necho                 º   6.  R-Type               (1988)  RTYPE    º\necho                 º   7.  Shinobi              (1988)  SHINOBI  º\necho                 º   8.  Psycho Fox           (1989)  PSYCHFOX º\necho                 º   9.  Castle of Illusion   (1990)  CASTLE   º\necho                 º  10.  Sonic the Hedgehog   (1991)  SONIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        name: 'alexkidd.bat',
                        link: '../systems/sms/play.html?game=alexkidd',
                      },
                      {
                        name: 'fantzone.bat',
                        link: '../systems/sms/play.html?game=fantzone',
                      },
                      {
                        name: 'wondrboy.bat',
                        link: '../systems/sms/play.html?game=wondrboy',
                      },
                      {
                        name: 'outrun.bat',
                        link: '../systems/sms/play.html?game=outrun',
                      },
                      {
                        name: 'phantstr.bat',
                        link: '../systems/sms/play.html?game=phantstr',
                      },
                      {
                        name: 'rtype.bat',
                        link: '../systems/sms/play.html?game=rtype',
                      },
                      {
                        name: 'shinobi.bat',
                        link: '../systems/sms/play.html?game=shinobi',
                      },
                      {
                        name: 'psychfox.bat',
                        link: '../systems/sms/play.html?game=psychfox',
                      },
                      {
                        name: 'castle.bat',
                        link: '../systems/sms/play.html?game=castle',
                      },
                      {
                        name: 'sonic.bat',
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
            ],
            files: [
              {
                name: 'menu.bat',
                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              CONSOLE  SYSTEMS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari                (1977)  ATARI    º\necho                 º   2.  ColecoVision         (1982)  CVISION  º\necho                 º   3.  Intellivision        (1979)  INTV     º\necho                 º   4.  NES                  (1985)  NES      º\necho                 º   5.  Odysseyý             (1978)  ODYSSEY2 º\necho                 º   6.  Sega Master System   (1986)  SMS      º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              BBC  MICRO  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Snapper              (1982)  SNAPPER  º\necho                 º   2.  Chuckie Egg          (1983)  CHUCKEGG º\necho                 º   3.  Elite                (1984)  ELITE    º\necho                 º   4.  Frak!                (1984)  FRAK     º\necho                 º   5.  Repton               (1985)  REPTON   º\necho                 º   6.  Castle Quest         (1985)  CASTLEQ  º\necho                 º   7.  Jet Set Willy        (1986)  JETWILLY º\necho                 º   8.  Thrust               (1986)  THRUST   º\necho                 º   9.  Firetrack            (1987)  FIRETRAK º\necho                 º  10.  Exile                (1988)  EXILE    º\necho                 º                                             º\necho                 º  11.  BASIC system prompt          PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'elite.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Acornsoft/Elite.ssd&autoboot&GP.A=A&GP.RB=SPACE&GP.LB=SLASH&GP.D12=S&GP.D13=X&GP.D14=COMMA&GP.D15=PERIOD',
                          },
                          {
                            name: 'chuckegg.bat',
                            link: '../systems/bbcmicro/dist/?disc1=AnF/ChuckieEgg.ssd&autoboot&GP.FIRE=SPACE&GP.D12=A&GP.D13=Z&GP.D14=COMMA&GP.D15=PERIOD',
                          },
                          {
                            name: 'repton.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Superior/Repton.ssd&autoboot',
                          },
                          {
                            name: 'castleq.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Micropower/CastleQuest.ssd&autoboot',
                          },
                          {
                            name: 'jetwilly.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Tynesoft/JetSetWilly.ssd&autoboot',
                          },
                          {
                            name: 'frak.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Aardvark/Frak.ssd&autoboot',
                          },
                          {
                            name: 'exile.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Superior/Exile.ssd&autoboot',
                          },
                          {
                            name: 'thrust.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Superior/Thrust.ssd&autoboot&GP.D14=CAPSLOCK&GP.D15=CTRL&GP.D12=SHIFT&GP.B=SPACE',
                          },
                          {
                            name: 'snapper.bat',
                            link: '../systems/bbcmicro/dist/?disc1=Acornsoft/Snapper-v1-alt.ssd&autoboot',
                          },
                          {
                            name: 'firetrak.bat',
                            link: '../systems/bbcmicro/dist/?disc1=ElectricDreams/Firetrack.ssd&autoboot',
                          },
                          {
                            name: 'prompt.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           ACORN  ELECTRON  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Cybertron Mission    (1983)  CYBRTRON º\necho                 º   2.  Snapper              (1983)  SNAPPER  º\necho                 º   3.  Starship Command     (1983)  STARSHIP º\necho                 º   4.  Boxer                (1984)  BOXER    º\necho                 º   5.  Citadel              (1985)  CITADEL  º\necho                 º   6.  Elite                (1985)  ELITE    º\necho                 º                                             º\necho                 º   7.  Electron BASIC prompt       BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'snapper.bat',
                            link: '../systems/electron/play.html?game=snapper',
                          },
                          {
                            name: 'citadel.bat',
                            link: '../systems/electron/play.html?game=citadel',
                          },
                          {
                            name: 'starship.bat',
                            link: '../systems/electron/play.html?game=starship',
                          },
                          {
                            name: 'boxer.bat',
                            link: '../systems/electron/play.html?game=boxer',
                          },
                          {
                            name: 'cybrtron.bat',
                            link: '../systems/electron/play.html?game=cybertron',
                          },
                          {
                            name: 'elite.bat',
                            link: '../systems/electron/play.html?game=elite',
                          },
                          {
                            name: 'basic.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           MASTER-ENHANCED  TITLES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Commando             (1985)  COMMANDO º\necho                 º   2.  Galaforce            (1986)  GALFORCE º\necho                 º   3.  Elite                (1986)  ELITE    º\necho                 º   4.  Crazee Rider         (1987)  CRAZEE   º\necho                 º   5.  Bonecruncher         (1987)  BONECRUN º\necho                 º   6.  Palace of Magic      (1987)  PALACE   º\necho                 º   7.  Fair or Foul         (1988)  BFMOF    º\necho                 º   8.  Ballistix            (1989)  BALLISTX º\necho                 º   9.  Holed Out            (1989)  HOLEDOUT º\necho                 º  10.  Nevryon              (1990)  NEVRYON  º\necho                 º                                             º\necho                 º  11.  BBC BASIC prompt            PROMPT    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'elite.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Acornsoft/EliteMaster.dsd&autoboot',
                          },
                          {
                            name: 'nevryon.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=4thDimension/Nevryon.ssd&autoboot',
                          },
                          {
                            name: 'galforce.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/Galaforce.ssd&autoboot',
                          },
                          {
                            name: 'palace.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/PalaceOfMagic.ssd&autoboot',
                          },
                          {
                            name: 'bonecrun.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/BoneCruncher.ssd&autoboot',
                          },
                          {
                            name: 'crazee.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/CrazeeRider.ssd&autoboot',
                          },
                          {
                            name: 'commando.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Elite/Commando.ssd&autoboot',
                          },
                          {
                            name: 'bfmof.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/ByFairMeansOrFoul.ssd&autoboot',
                          },
                          {
                            name: 'holedout.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=4thDimension/HoledOut.ssd&autoboot',
                          },
                          {
                            name: 'ballistx.bat',
                            link: '../systems/bbcmaster/dist/?model=Master&disc1=Superior/Ballistix.ssd&autoboot',
                          },
                          {
                            name: 'prompt.bat',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ACORN  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  BBC Micro            (1981)  BBC      º\necho                 º                                             º\necho                 º   2.  Acorn Electron       (1983)  ELECTRON º\necho                 º                                             º\necho                 º   3.  BBC Master           (1986)  MASTER   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               APPLE  I  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Game of Life         (1970)  LIFE     º\necho                 º   2.  Hamurabi             (1971)  HAMURABI º\necho                 º   3.  Hunt the Wumpus      (1973)  WUMPUS   º\necho                 º   4.  Blackjack            (1976)  BLACKJK  º\necho                 º   5.  Microchess           (1976)  CHESS    º\necho                 º   6.  Lunar Lander         (1976)  LUNAR    º\necho                 º   7.  Star Trek            (1977)  STARTREK º\necho                 º   8.  Checkers             (1978)  CHECKERS º\necho                 º   9.  Apple 30th Anniv.    (2006)  APPLE30  º\necho                 º  10.  15 Puzzle            (2020)  PUZZLE15 º\necho                 º                                             º\necho                 º  11.  Woz Monitor prompt          PROMPT    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'startrek.bat',
                            link: '../systems/apple1/play.html?tape=startrek',
                          },
                          {
                            name: 'blackjk.bat',
                            link: '../systems/apple1/play.html?tape=blackjack',
                          },
                          {
                            name: 'chess.bat',
                            link: '../systems/apple1/play.html?tape=chess',
                          },
                          {
                            name: 'hamurabi.bat',
                            link: '../systems/apple1/play.html?tape=hamurabi',
                          },
                          {
                            name: 'lunar.bat',
                            link: '../systems/apple1/play.html?tape=lunar',
                          },
                          {
                            name: 'wumpus.bat',
                            link: '../systems/apple1/play.html?tape=wumpus',
                          },
                          {
                            name: 'checkers.bat',
                            link: '../systems/apple1/play.html?tape=checkers',
                          },
                          {
                            name: 'puzzle15.bat',
                            link: '../systems/apple1/play.html?tape=puzzle15',
                          },
                          {
                            name: 'life.bat',
                            link: '../systems/apple1/play.html?tape=life',
                          },
                          {
                            name: 'apple30.bat',
                            link: '../systems/apple1/play.html?tape=apple30',
                          },
                          {
                            name: 'prompt.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              APPLE  ][  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Lemonade Stand       (1979)  LEMONADE º\necho                 º   2.  Castle Wolfenstein   (1981)  WOLF     º\necho                 º   3.  Choplifter           (1982)  CHOPLIFT º\necho                 º   4.  Aztec                (1982)  AZTEC    º\necho                 º   5.  Lode Runner          (1983)  LODERUN  º\necho                 º   6.  Sammy Lightfoot      (1983)  SAMMY    º\necho                 º   7.  Hard Hat Mack        (1983)  HARDHAT  º\necho                 º   8.  Archon               (1984)  ARCHON   º\necho                 º   9.  Karateka             (1984)  KARATEKA º\necho                 º  10.  The Oregon Trail     (1985)  OREGON   º\necho                 º                                             º\necho                 º  11.  Applesoft BASIC              BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'archon.bat',
                            link: '../systems/apple2/play.html?game=archon',
                          },
                          {
                            name: 'lemonade.bat',
                            link: '../systems/apple2/play.html?game=lemonade',
                          },
                          {
                            name: 'wolf.bat',
                            link: '../systems/apple2/play.html?game=wolf',
                          },
                          {
                            name: 'choplift.bat',
                            link: '../systems/apple2/play.html?game=choplift',
                          },
                          {
                            name: 'aztec.bat',
                            link: '../systems/apple2/play.html?game=aztec',
                          },
                          {
                            name: 'loderun.bat',
                            link: '../systems/apple2/play.html?game=loderun',
                          },
                          {
                            name: 'sammy.bat',
                            link: '../systems/apple2/play.html?game=sammy',
                          },
                          {
                            name: 'hardhat.bat',
                            link: '../systems/apple2/play.html?game=hardhat',
                          },
                          {
                            name: 'karateka.bat',
                            link: '../systems/apple2/play.html?game=karateka',
                          },
                          {
                            name: 'oregon.bat',
                            link: '../systems/apple2/play.html?game=oregon',
                          },
                          {
                            name: 'basic.bat',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              APPLE  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Apple I              (1976)  APPLE1   º\necho                 º                                             º\necho                 º   2.  Apple ][             (1977)  APPLEII  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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

              // COMMODORE (PET + VIC-20 + MAX + C64 + C16 + Plus/4 + C128 all via EmulatorJS + VICE)
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  PET  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Star Trek            (1977)  STARTREK º\necho                 º   2.  Adventureland        (1979)  ADVLAND  º\necho                 º   3.  Android NIM          (1979)  ANDNIM   º\necho                 º   4.  Lunar Lander         (1979)  LUNAR    º\necho                 º   5.  Hangman              (1980)  HANGMAN  º\necho                 º   6.  Space Invaders       (1980)  INVADER  º\necho                 º   7.  ComputerSpace 2001   (1981)  CS2001   º\necho                 º   8.  Crazy Balloon        (1981)  CRZBALLN º\necho                 º   9.  Frogger              (1981)  FROGGER  º\necho                 º  10.  Pac-Man              (1982)  PACMAN   º\necho                 º                                             º\necho                 º  11.  BASIC 2 prompt              BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'startrek.bat',
                            link: '../systems/pet/play.html?game=startrek',
                          },
                          {
                            name: 'andnim.bat',
                            link: '../systems/pet/play.html?game=andnim',
                          },
                          {
                            name: 'lunar.bat',
                            link: '../systems/pet/play.html?game=lunar',
                          },
                          {
                            name: 'advland.bat',
                            link: '../systems/pet/play.html?game=advland',
                          },
                          {
                            name: 'hangman.bat',
                            link: '../systems/pet/play.html?game=hangman',
                          },
                          {
                            name: 'invader.bat',
                            link: '../systems/pet/play.html?game=invader',
                          },
                          {
                            name: 'crzballn.bat',
                            link: '../systems/pet/play.html?game=crzballn',
                          },
                          {
                            name: 'cs2001.bat',
                            link: '../systems/pet/play.html?game=cs2001',
                          },
                          {
                            name: 'frogger.bat',
                            link: '../systems/pet/play.html?game=frogger',
                          },
                          {
                            name: 'pacman.bat',
                            link: '../systems/pet/play.html?game=pacman',
                          },
                          {
                            name: 'basic.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          COMMODORE  VIC-20  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Avenger              (1981)  AVENGER  º\necho                 º   2.  Radar Rat Race       (1981)  RATRACE  º\necho                 º   3.  Choplifter           (1982)  CHOPPER  º\necho                 º   4.  Gorf                 (1982)  GORF     º\necho                 º   5.  Gridrunner           (1982)  GRIDRUN  º\necho                 º   6.  Omega Race           (1982)  OMEGA    º\necho                 º   7.  Atlantis             (1983)  ATLANTIS º\necho                 º   8.  Demon Attack         (1983)  DEMONATK º\necho                 º   9.  Frogger              (1983)  FROGGER  º\necho                 º  10.  Pac-Man              (1983)  PACMAN   º\necho                 º                                             º\necho                 º  11.  BASIC prompt                BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'avenger.bat',
                            link: '../systems/vic20/play.html?game=avenger',
                          },
                          {
                            name: 'ratrace.bat',
                            link: '../systems/vic20/play.html?game=ratrace',
                          },
                          {
                            name: 'gorf.bat',
                            link: '../systems/vic20/play.html?game=gorf',
                          },
                          {
                            name: 'omega.bat',
                            link: '../systems/vic20/play.html?game=omega',
                          },
                          {
                            name: 'chopper.bat',
                            link: '../systems/vic20/play.html?game=chopper',
                          },
                          {
                            name: 'gridrun.bat',
                            link: '../systems/vic20/play.html?game=gridrun',
                          },
                          {
                            name: 'frogger.bat',
                            link: '../systems/vic20/play.html?game=frogger',
                          },
                          {
                            name: 'pacman.bat',
                            link: '../systems/vic20/play.html?game=pacman',
                          },
                          {
                            name: 'atlantis.bat',
                            link: '../systems/vic20/play.html?game=atlantis',
                          },
                          {
                            name: 'demonatk.bat',
                            link: '../systems/vic20/play.html?game=demonatk',
                          },
                          {
                            name: 'basic.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º       COMMODORE  MAX  MACHINE  GAMES        º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Clowns               (1982)  CLOWNS   º\necho                 º   2.  Jupiter Lander       (1982)  JUPITER  º\necho                 º   3.  Mole Attack          (1982)  MOLATAK  º\necho                 º   4.  Money Wars           (1982)  MONYWARS º\necho                 º   5.  Omega Race           (1982)  OMEGRACE º\necho                 º   6.  Radar Rat Race       (1982)  RRR      º\necho                 º   7.  Slalom               (1982)  SLALOM   º\necho                 º   8.  Speed/Bingo Math     (1982)  SPEEDMTH º\necho                 º   9.  Billiards            (1983)  BILLIARD º\necho                 º  10.  Pinball Spectacular  (1983)  PINBALL  º\necho                 º                                             º\necho                 º  11.  MAX BASIC cartridge         BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'clowns.bat',
                            link: '../systems/max/play.html?game=clowns',
                          },
                          {
                            name: 'omegrace.bat',
                            link: '../systems/max/play.html?game=omegrace',
                          },
                          {
                            name: 'rrr.bat',
                            link: '../systems/max/play.html?game=rrr',
                          },
                          {
                            name: 'jupiter.bat',
                            link: '../systems/max/play.html?game=jupiter',
                          },
                          {
                            name: 'molatak.bat',
                            link: '../systems/max/play.html?game=molatak',
                          },
                          {
                            name: 'monywars.bat',
                            link: '../systems/max/play.html?game=monywars',
                          },
                          {
                            name: 'speedmth.bat',
                            link: '../systems/max/play.html?game=speedmth',
                          },
                          {
                            name: 'slalom.bat',
                            link: '../systems/max/play.html?game=slalom',
                          },
                          {
                            name: 'billiard.bat',
                            link: '../systems/max/play.html?game=billiard',
                          },
                          {
                            name: 'pinball.bat',
                            link: '../systems/max/play.html?game=pinball',
                          },
                          {
                            name: 'basic.bat',
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
                            data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  64  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Beach Head           (1983)  BEACHHD  º\necho                 º   2.  Forbidden Forest     (1983)  FORBFRST º\necho                 º   3.  Boulder Dash         (1984)  BOULDER  º\necho                 º   4.  Impossible Mission   (1984)  IMPMISS  º\necho                 º   5.  Elite                (1985)  ELITE    º\necho                 º   6.  Ghosts 'n Goblins    (1986)  GHOSTS   º\necho                 º   7.  Uridium              (1986)  URIDIUM  º\necho                 º   8.  The Last Ninja       (1987)  LASTNINJ º\necho                 º   9.  Wizball              (1987)  WIZBALL  º\necho                 º  10.  PETSCII Robots       (2021)  PETROBOT º\necho                 º                                             º\necho                 º  11.  BASIC prompt                BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                            name: 'lastninj.bat',
                            link: '../systems/c64/play.html?game=lastninja',
                          },
                          {
                            name: 'impmiss.bat',
                            link: '../systems/c64/play.html?game=impmiss',
                          },
                          {
                            name: 'wizball.bat',
                            link: '../systems/c64/play.html?game=wizball',
                          },
                          {
                            name: 'elite.bat',
                            link: '../systems/c64/play.html?game=elite',
                          },
                          {
                            name: 'uridium.bat',
                            link: '../systems/c64/play.html?game=uridium',
                          },
                          {
                            name: 'beachhd.bat',
                            link: '../systems/c64/play.html?game=beachhd',
                          },
                          {
                            name: 'boulder.bat',
                            link: '../systems/c64/play.html?game=boulder',
                          },
                          {
                            name: 'forbfrst.bat',
                            link: '../systems/c64/play.html?game=forbfrst',
                          },
                          {
                            name: 'ghosts.bat',
                            link: '../systems/c64/play.html?game=ghosts',
                          },
                          {
                            name: 'petrobot.bat',
                            link: '../systems/c64/play.html?game=petrobot',
                          },
                          {
                            name: 'basic.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  C16  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Fire Ant             (1984)  FIREANT  º\necho                 º   2.  Skramble             (1984)  SKRAMBLE º\necho                 º   3.  Tower of Evil        (1984)  TOWREVIL º\necho                 º   4.  Xargon Wars          (1984)  XARGON   º\necho                 º   5.  Berks                (1985)  BERKS    º\necho                 º   6.  Big Mac              (1985)  BIGMAC   º\necho                 º   7.  Hustler              (1985)  HUSTLER  º\necho                 º   8.  Tom Thumb            (1985)  TOMTHUMB º\necho                 º   9.  Tutti Frutti         (1985)  TUTTIFRT º\necho                 º  10.  Mr. Puniverse        (1986)  PUNIVRSE º\necho                 º                                             º\necho                 º  11.  BASIC 3.5 prompt            BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'fireant.bat',
                            link: '../systems/c16/play.html?game=fireant',
                          },
                          {
                            name: 'skramble.bat',
                            link: '../systems/c16/play.html?game=skramble',
                          },
                          {
                            name: 'towrevil.bat',
                            link: '../systems/c16/play.html?game=towrevil',
                          },
                          {
                            name: 'xargon.bat',
                            link: '../systems/c16/play.html?game=xargon',
                          },
                          {
                            name: 'berks.bat',
                            link: '../systems/c16/play.html?game=berks',
                          },
                          {
                            name: 'bigmac.bat',
                            link: '../systems/c16/play.html?game=bigmac',
                          },
                          {
                            name: 'hustler.bat',
                            link: '../systems/c16/play.html?game=hustler',
                          },
                          {
                            name: 'tomthumb.bat',
                            link: '../systems/c16/play.html?game=tomthumb',
                          },
                          {
                            name: 'tuttifrt.bat',
                            link: '../systems/c16/play.html?game=tuttifrt',
                          },
                          {
                            name: 'punivrse.bat',
                            link: '../systems/c16/play.html?game=punivrse',
                          },
                          {
                            name: 'basic.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          COMMODORE  PLUS/4  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Blagger              (1984)  BLAGGER  º\necho                 º   2.  Popeye               (1984)  POPEYE   º\necho                 º   3.  Citadel              (1985)  CITADEL  º\necho                 º   4.  Kikstart             (1985)  KIKSTART º\necho                 º   5.  Punchy               (1985)  PUNCHY   º\necho                 º   6.  Rockman              (1985)  ROCKMAN  º\necho                 º   7.  Saboteur             (1985)  SABOTEUR º\necho                 º   8.  Squirm               (1985)  SQUIRM   º\necho                 º   9.  Mercenary            (1986)  MERCNARY º\necho                 º  10.  Trailblazer          (1986)  TRAILBLZ º\necho                 º                                             º\necho                 º  11.  BASIC 3.5 prompt            BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'blagger.bat',
                            link: '../systems/plus4/play.html?game=blagger',
                          },
                          {
                            name: 'popeye.bat',
                            link: '../systems/plus4/play.html?game=popeye',
                          },
                          {
                            name: 'citadel.bat',
                            link: '../systems/plus4/play.html?game=citadel',
                          },
                          {
                            name: 'kikstart.bat',
                            link: '../systems/plus4/play.html?game=kikstart',
                          },
                          {
                            name: 'punchy.bat',
                            link: '../systems/plus4/play.html?game=punchy',
                          },
                          {
                            name: 'rockman.bat',
                            link: '../systems/plus4/play.html?game=rockman',
                          },
                          {
                            name: 'saboteur.bat',
                            link: '../systems/plus4/play.html?game=saboteur',
                          },
                          {
                            name: 'squirm.bat',
                            link: '../systems/plus4/play.html?game=squirm',
                          },
                          {
                            name: 'mercnary.bat',
                            link: '../systems/plus4/play.html?game=mercnary',
                          },
                          {
                            name: 'trailblz.bat',
                            link: '../systems/plus4/play.html?game=trailblz',
                          },
                          {
                            name: 'basic.bat',
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
                  {
                    name: 'C128',
                    directories: [
                      {
                        name: 'GAMES',
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  128  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  128 Crush            (1985)  CRUSH    º\necho                 º   2.  Rocky Horror Show    (1985)  ROCKYH   º\necho                 º   3.  The Last V8          (1985)  LASTV8   º\necho                 º   4.  Star Fleet I         (1987)  STARFLT1 º\necho                 º   5.  Invaders             (19xx)  INVADERS º\necho                 º   6.  Uniquest             (19xx)  UNIQUEST º\necho                 º   7.  World at War         (2017)  WORLDWAR º\necho                 º   8.  Phazer               (2023)  PHAZER   º\necho                 º   9.  Rockfall 128         (2023)  ROCKFALL º\necho                 º  10.  Wumpus 2.0           (2023)  WUMPUS   º\necho                 º                                             º\necho                 º  11.  BASIC 7.0 prompt            BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
                          },
                          {
                            name: '0.bat',
                            data: 'echo off\ncd ..\ncd ..\nmenu\n',
                          },
                          {
                            name: '1.bat',
                            data: 'crush\n',
                          },
                          {
                            name: '2.bat',
                            data: 'rockyh\n',
                          },
                          {
                            name: '3.bat',
                            data: 'lastv8\n',
                          },
                          {
                            name: '4.bat',
                            data: 'starflt1\n',
                          },
                          {
                            name: '5.bat',
                            data: 'invaders\n',
                          },
                          {
                            name: '6.bat',
                            data: 'uniquest\n',
                          },
                          {
                            name: '7.bat',
                            data: 'worldwar\n',
                          },
                          {
                            name: '8.bat',
                            data: 'phazer\n',
                          },
                          {
                            name: '9.bat',
                            data: 'rockfall\n',
                          },
                          {
                            name: '10.bat',
                            data: 'wumpus\n',
                          },
                          {
                            name: '11.bat',
                            data: 'basic\n',
                          },
                          {
                            name: 'lastv8.bat',
                            link: '../systems/c128/play.html?game=lastv8',
                          },
                          {
                            name: 'rockyh.bat',
                            link: '../systems/c128/play.html?game=rockyh',
                          },
                          {
                            name: 'crush.bat',
                            link: '../systems/c128/play.html?game=crush',
                          },
                          {
                            name: 'worldwar.bat',
                            link: '../systems/c128/play.html?game=worldwar',
                          },
                          {
                            name: 'invaders.bat',
                            link: '../systems/c128/play.html?game=invaders',
                          },
                          {
                            name: 'wumpus.bat',
                            link: '../systems/c128/play.html?game=wumpus',
                          },
                          {
                            name: 'starflt1.bat',
                            link: '../systems/c128/play.html?game=starflt1',
                          },
                          {
                            name: 'rockfall.bat',
                            link: '../systems/c128/play.html?game=rockfall',
                          },
                          {
                            name: 'phazer.bat',
                            link: '../systems/c128/play.html?game=phazer',
                          },
                          {
                            name: 'uniquest.bat',
                            link: '../systems/c128/play.html?game=uniquest',
                          },
                          {
                            name: 'basic.bat',
                            link: '../systems/c128/play.html?game=basic',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  COMPUTERS             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Commodore PET        (1977)  PET      º\necho                 º   2.  Commodore VIC-20     (1980)  VIC20    º\necho                 º   3.  Commodore MAX        (1982)  MAX      º\necho                 º   4.  Commodore 64         (1982)  C64      º\necho                 º   5.  Commodore C16        (1984)  C16      º\necho                 º   6.  Commodore Plus/4     (1984)  PLUS4    º\necho                 º   7.  Commodore 128        (1985)  C128     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                    name: '7.bat',
                    data: 'cd c128\ncd games\nmenu\n',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ATARI  400  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Space Invaders       (1980)  INVADERS º\necho                 º   2.  Asteroids            (1981)  ASTEROID º\necho                 º   3.  Defender             (1981)  DEFENDER º\necho                 º   4.  Missile Command      (1981)  MISSILE  º\necho                 º   5.  Centipede            (1982)  CENTIPED º\necho                 º   6.  Choplifter           (1982)  CHOPLIFT º\necho                 º   7.  Pac-Man              (1982)  PACMAN   º\necho                 º   8.  Dig Dug              (1983)  DIGDUG   º\necho                 º   9.  Donkey Kong          (1983)  DKONG    º\necho                 º  10.  Joust                (1983)  JOUST    º\necho                 º                                             º\necho                 º  11.  Atari BASIC prompt           BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'missile.bat',
                            link: '../systems/atari400/play.html?game=missile',
                          },
                          {
                            name: 'asteroid.bat',
                            link: '../systems/atari400/play.html?game=asteroid',
                          },
                          {
                            name: 'defender.bat',
                            link: '../systems/atari400/play.html?game=defender',
                          },
                          {
                            name: 'invaders.bat',
                            link: '../systems/atari400/play.html?game=invaders',
                          },
                          {
                            name: 'pacman.bat',
                            link: '../systems/atari400/play.html?game=pacman',
                          },
                          {
                            name: 'centiped.bat',
                            link: '../systems/atari400/play.html?game=centiped',
                          },
                          {
                            name: 'choplift.bat',
                            link: '../systems/atari400/play.html?game=chopliftr',
                          },
                          {
                            name: 'dkong.bat',
                            link: '../systems/atari400/play.html?game=dkong',
                          },
                          {
                            name: 'joust.bat',
                            link: '../systems/atari400/play.html?game=joust',
                          },
                          {
                            name: 'digdug.bat',
                            link: '../systems/atari400/play.html?game=digdug',
                          },
                          {
                            name: 'basic.bat',
                            link: '../systems/atari400/play.html',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  800XL  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Star Raiders         (1979)  STARRAID º\necho                 º   2.  Eastern Front 1941   (1981)  EASTFRNT º\necho                 º   3.  Miner 2049er         (1982)  MINER2K  º\necho                 º   4.  Archon               (1983)  ARCHON   º\necho                 º   5.  M.U.L.E.             (1983)  MULE     º\necho                 º   6.  Pole Position        (1983)  POLEPOS  º\necho                 º   7.  Boulder Dash         (1984)  BOULDER  º\necho                 º   8.  Bruce Lee            (1984)  BRUCELEE º\necho                 º   9.  Ballblazer           (1985)  BALLBLZR º\necho                 º  10.  Rescue on Fractalus! (1985)  FRACTLUS º\necho                 º                                             º\necho                 º  11.  Atari BASIC prompt           BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'starraid.bat',
                            link: '../systems/atari800/play.html?game=starraid',
                          },
                          {
                            name: 'mule.bat',
                            link: '../systems/atari800/play.html?game=mule',
                          },
                          {
                            name: 'boulder.bat',
                            link: '../systems/atari800/play.html?game=boulder',
                          },
                          {
                            name: 'archon.bat',
                            link: '../systems/atari800/play.html?game=archon',
                          },
                          {
                            name: 'ballblzr.bat',
                            link: '../systems/atari800/play.html?game=ballblzr',
                          },
                          {
                            name: 'fractlus.bat',
                            link: '../systems/atari800/play.html?game=fractlus',
                          },
                          {
                            name: 'brucelee.bat',
                            link: '../systems/atari800/play.html?game=brucelee',
                          },
                          {
                            name: 'miner2k.bat',
                            link: '../systems/atari800/play.html?game=miner2k',
                          },
                          {
                            name: 'polepos.bat',
                            link: '../systems/atari800/play.html?game=polepos',
                          },
                          {
                            name: 'eastfrnt.bat',
                            link: '../systems/atari800/play.html?game=eastfrnt',
                          },
                          {
                            name: 'basic.bat',
                            link: '../systems/atari800/play.html',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ATARI  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari 400            (1979)  400      º\necho                 º                                             º\necho                 º   2.  Atari 800XL          (1983)  800XL    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          SINCLAIR  SPECTRUM  GAMES          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atic Atac            (1983)  ATATAC   º\necho                 º   2.  Chuckie Egg          (1983)  CHUCKEGG º\necho                 º   3.  Manic Miner          (1983)  MANICMN  º\necho                 º   4.  Pssst                (1983)  PSSST    º\necho                 º   5.  Jet Set Willy        (1984)  JETWILLY º\necho                 º   6.  Knight Lore          (1984)  KNGTLORE º\necho                 º   7.  Sabre Wulf           (1984)  SABRWULF º\necho                 º   8.  Skool Daze           (1984)  SKOOLDZD º\necho                 º   9.  Underwurlde          (1984)  UWURLDE  º\necho                 º  10.  Dizzy                (1987)  DIZZY    º\necho                 º                                             º\necho                 º  11.  ZX BASIC prompt              BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'basic.bat',
                            link: '../systems/jsspeccy/play.html',
                          },
                          {
                            name: 'manicmn.bat',
                            link: '../systems/jsspeccy/play.html?game=manicmn',
                          },
                          {
                            name: 'jetwilly.bat',
                            link: '../systems/jsspeccy/play.html?game=jetwilly',
                          },
                          {
                            name: 'chuckegg.bat',
                            link: '../systems/jsspeccy/play.html?game=chuckegg',
                          },
                          {
                            name: 'sabrwulf.bat',
                            link: '../systems/jsspeccy/play.html?game=sabrwulf',
                          },
                          {
                            name: 'kngtlore.bat',
                            link: '../systems/jsspeccy/play.html?game=kngtlore',
                          },
                          {
                            name: 'atatac.bat',
                            link: '../systems/jsspeccy/play.html?game=atatac',
                          },
                          {
                            name: 'pssst.bat',
                            link: '../systems/jsspeccy/play.html?game=pssst',
                          },
                          {
                            name: 'uwurlde.bat',
                            link: '../systems/jsspeccy/play.html?game=uwurlde',
                          },
                          {
                            name: 'dizzy.bat',
                            link: '../systems/jsspeccy/play.html?game=dizzy',
                          },
                          {
                            name: 'skooldzd.bat',
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
                                data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º         SINCLAIR  ZX81  -  1K CHESS         º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º     Choose the computer's opening move      º\necho                 º                                             º\necho                 º   1.  Queen's Pawn         (1.d4)  1KCHESSQ º\necho                 º                                             º\necho                 º   2.  King's Pawn          (1.e4)  1KCHESSK º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                                name: '1kchessk.bat',
                                link: '../systems/jtyone/play.html?game=1kchessk',
                              },
                              {
                                name: '1kchessq.bat',
                                link: '../systems/jtyone/play.html?game=1kchessq',
                              },
                            ],
                          },
                        ],
                        files: [
                          {
                            name: 'menu.bat',
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            SINCLAIR  ZX81  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  3D Defender          (1981)  3DDEFEND º\necho                 º   2.  3D Monster Maze      (1981)  MONSTMZE º\necho                 º   3.  1K Chess             (1982)  1KCHESS  º\necho                 º   4.  Black Crystal        (1982)  BLKCRYST º\necho                 º   5.  City of Xon          (1982)  CITYXON  º\necho                 º   6.  Frogger              (1982)  FROGGER  º\necho                 º   7.  Galaxians            (1982)  GALAXIAN º\necho                 º   8.  3D Grand Prix        (1983)  GP3D     º\necho                 º   9.  Maze Death Race      (1983)  MAZERACE º\necho                 º  10.  Night Gunner         (1983)  NIGHTGUN º\necho                 º                                             º\necho                 º  11.  ZX81 BASIC prompt            BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'basic.bat',
                            link: '../systems/jtyone/play.html',
                          },
                          {
                            name: 'monstmze.bat',
                            link: '../systems/jtyone/play.html?game=monstmze',
                          },
                          {
                            name: '3ddefend.bat',
                            link: '../systems/jtyone/play.html?game=3ddefend',
                          },
                          {
                            name: 'nightgun.bat',
                            link: '../systems/jtyone/play.html?game=nightgun',
                          },
                          {
                            name: 'galaxian.bat',
                            link: '../systems/jtyone/play.html?game=galaxian',
                          },
                          {
                            name: '1kchess.bat',
                            data: 'echo off\ncd 1kchess\nmenu\n',
                          },
                          {
                            name: 'frogger.bat',
                            link: '../systems/jtyone/play.html?game=frogger',
                          },
                          {
                            name: 'cityxon.bat',
                            link: '../systems/jtyone/play.html?game=cityxon',
                          },
                          {
                            name: 'blkcryst.bat',
                            link: '../systems/jtyone/play.html?game=blkcryst',
                          },
                          {
                            name: 'gp3d.bat',
                            link: '../systems/jtyone/play.html?game=gp3d',
                          },
                          {
                            name: 'mazerace.bat',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             SINCLAIR  COMPUTERS             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Sinclair ZX81        (1981)  ZX81     º\necho                 º                                             º\necho                 º   2.  Sinclair Spectrum    (1982)  SPECTRUM º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             AMSTRAD  CPC  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Bruce Lee            (1984)  BRUCE    º\necho                 º   2.  Roland on the Run    (1984)  ROLAND   º\necho                 º   3.  3D Starstrike        (1985)  STARSTRK º\necho                 º   4.  Tau Ceti             (1986)  TAUCETI  º\necho                 º   5.  The Eidolon          (1986)  EIDOLON  º\necho                 º   6.  Head over Heels      (1987)  HEADOVER º\necho                 º   7.  Chase H.Q.           (1989)  CHASEHQ  º\necho                 º   8.  Rick Dangerous       (1989)  RICK     º\necho                 º   9.  Prince of Persia     (1990)  PRINCE   º\necho                 º  10.  3D Construction Kit  (1991)  3DKIT    º\necho                 º                                             º\necho                 º  11.  Locomotive BASIC prompt     BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        data: 'headover\n',
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
                        name: 'basic.bat',
                        link: '../systems/cpc/play.html',
                      },
                      {
                        name: '3dkit.bat',
                        link: '../systems/cpc/play.html?game=3dkit',
                      },
                      {
                        name: 'roland.bat',
                        link: '../systems/cpc/play.html?game=roland',
                      },
                      {
                        name: 'starstrk.bat',
                        link: '../systems/cpc/play.html?game=starstrike',
                      },
                      {
                        name: 'bruce.bat',
                        link: '../systems/cpc/play.html?game=bruce',
                      },
                      {
                        name: 'prince.bat',
                        link: '../systems/cpc/play.html?game=prince',
                      },
                      {
                        name: 'tauceti.bat',
                        link: '../systems/cpc/play.html?game=tauceti',
                      },
                      {
                        name: 'eidolon.bat',
                        link: '../systems/cpc/play.html?game=eidolon',
                      },
                      {
                        name: 'headover.bat',
                        link: '../systems/cpc/play.html?game=headover',
                      },
                      {
                        name: 'rick.bat',
                        link: '../systems/cpc/play.html?game=rick',
                      },
                      {
                        name: 'chasehq.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             TANDY  COCO  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Mega-Bug             (1981)  MEGABUG  º\necho                 º   2.  Poltergeist          (1981)  POLTRGST º\necho                 º   3.  Popcorn              (1981)  POPCORN  º\necho                 º   4.  Canyon Climber       (1982)  CANYON   º\necho                 º   5.  Demon Attack         (1982)  DEMON    º\necho                 º   6.  Daggorath            (1982)  DAGGOR   º\necho                 º   7.  Monster Maze         (1982)  MONSTRMZ º\necho                 º   8.  Downland             (1983)  DOWNLAND º\necho                 º   9.  Galactic Attack      (1983)  GALACTIC º\necho                 º  10.  Polaris              (1983)  POLARIS  º\necho                 º                                             º\necho                 º  11.  Color BASIC prompt           PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'daggor.bat',
                            link: '../systems/xroar/play.html?game=daggor',
                          },
                          {
                            name: 'downland.bat',
                            link: '../systems/xroar/play.html?game=downland',
                          },
                          {
                            name: 'canyon.bat',
                            link: '../systems/xroar/play.html?game=canyon',
                          },
                          {
                            name: 'demon.bat',
                            link: '../systems/xroar/play.html?game=demon',
                          },
                          {
                            name: 'polaris.bat',
                            link: '../systems/xroar/play.html?game=polaris',
                          },
                          {
                            name: 'galactic.bat',
                            link: '../systems/xroar/play.html?game=galactic',
                          },
                          {
                            name: 'popcorn.bat',
                            link: '../systems/xroar/play.html?game=popcorn',
                          },
                          {
                            name: 'megabug.bat',
                            link: '../systems/xroar/play.html?game=megabug',
                          },
                          {
                            name: 'poltrgst.bat',
                            link: '../systems/xroar/play.html?game=poltrgst',
                          },
                          {
                            name: 'monstrmz.bat',
                            link: '../systems/xroar/play.html?game=monstrmz',
                          },
                          {
                            name: 'prompt.bat',
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
                        directories: [],
                        files: [
                          {
                            name: 'menu.bat',
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          TRS-80  MODEL III  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Galaxy Invasion      (1980)  GALAXY   º\necho                 º   2.  Cosmic Fighter       (1980)  COSMIC   º\necho                 º   3.  Attack Force         (1980)  ATTACK   º\necho                 º   4.  Super Nova           (1980)  SUPERNOV º\necho                 º   5.  Defense Command      (1981)  DEFENSE  º\necho                 º   6.  Robot Attack         (1981)  ROBOT    º\necho                 º   7.  Armored Patrol       (1981)  ARMORED  º\necho                 º   8.  Sea Dragon           (1982)  SEADRGN  º\necho                 º   9.  Crazy Painter        (1982)  CRAZYPNT º\necho                 º  10.  Space Castle         (1982)  CASTLE   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'galaxy.bat',
                            link: '../systems/trs80/play.html?game=galaxy',
                          },
                          {
                            name: 'cosmic.bat',
                            link: '../systems/trs80/play.html?game=cosmic',
                          },
                          {
                            name: 'attack.bat',
                            link: '../systems/trs80/play.html?game=attack',
                          },
                          {
                            name: 'supernov.bat',
                            link: '../systems/trs80/play.html?game=supernov',
                          },
                          {
                            name: 'defense.bat',
                            link: '../systems/trs80/play.html?game=defense',
                          },
                          {
                            name: 'robot.bat',
                            link: '../systems/trs80/play.html?game=robot',
                          },
                          {
                            name: 'armored.bat',
                            link: '../systems/trs80/play.html?game=armored',
                          },
                          {
                            name: 'seadrgn.bat',
                            link: '../systems/trs80/play.html?game=seadrgn',
                          },
                          {
                            name: 'crazypnt.bat',
                            link: '../systems/trs80/play.html?game=crazypnt',
                          },
                          {
                            name: 'castle.bat',
                            link: '../systems/trs80/play.html?game=castle',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           TRS-80  MODEL 100  GAMES          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Bowling              (1984)  BOWLING  º\necho                 º   2.  Codebreaker          (1984)  CODEBREK º\necho                 º   3.  ELIZA                (1984)  ELIZA    º\necho                 º   4.  Four Seasons         (1984)  FSNSOL   º\necho                 º   5.  Invisible Maze       (1984)  INVMAZE  º\necho                 º   6.  Paper Rock Scissors  (1984)  PRS      º\necho                 º   7.  Road Rally           (1984)  RALLY    º\necho                 º   8.  Skydiver             (1984)  SKYDIVER º\necho                 º   9.  Slot Machine         (1984)  SLOTS    º\necho                 º  10.  Worm Hole (Snake)    (1984)  WORMHOLE º\necho                 º                                             º\necho                 º  11.  Startup Menu                 M100     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'bowling.bat',
                            link: '../systems/m100/play.html?game=bowling',
                          },
                          {
                            name: 'codebrek.bat',
                            link: '../systems/m100/play.html?game=codebrek',
                          },
                          {
                            name: 'eliza.bat',
                            link: '../systems/m100/play.html?game=eliza',
                          },
                          {
                            name: 'fsnsol.bat',
                            link: '../systems/m100/play.html?game=fsnsol',
                          },
                          {
                            name: 'invmaze.bat',
                            link: '../systems/m100/play.html?game=invmaze',
                          },
                          {
                            name: 'prs.bat',
                            link: '../systems/m100/play.html?game=prs',
                          },
                          {
                            name: 'rally.bat',
                            link: '../systems/m100/play.html?game=rally',
                          },
                          {
                            name: 'skydiver.bat',
                            link: '../systems/m100/play.html?game=skydiver',
                          },
                          {
                            name: 'slots.bat',
                            link: '../systems/m100/play.html?game=slots',
                          },
                          {
                            name: 'wormhole.bat',
                            link: '../systems/m100/play.html?game=wormhole',
                          },
                          {
                            name: 'm100.bat',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              TANDY  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  TRS-80 Model III     (1980)  TRS80    º\necho                 º                                             º\necho                 º   2.  Color Computer       (1980)  COCO     º\necho                 º                                             º\necho                 º   3.  Model 100 (Portable) (1983)  M100     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           TI-99/4A  -  CARTRIDGES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Hunt the Wumpus      (1980)  WUMPUS   º\necho                 º   2.  Car Wars             (1981)  CARWARS  º\necho                 º   3.  TI Invaders          (1981)  TIINVAD  º\necho                 º   4.  Tombstone City       (1981)  TMBCITY  º\necho                 º   5.  Alpiner              (1982)  ALPINER  º\necho                 º   6.  Microsurgeon         (1982)  MICROSRG º\necho                 º   7.  Munch Man            (1982)  MUNCHMAN º\necho                 º   8.  Parsec               (1982)  PARSEC   º\necho                 º   9.  Tunnels of Doom      (1982)  DOOM     º\necho                 º  10.  Buck Rogers          (1983)  BUCKRGRS º\necho                 º                                             º\necho                 º  11.  TI BASIC prompt              PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        name: 'wumpus.bat',
                        link: '../systems/js99er/play.html?game=wumpus',
                      },
                      {
                        name: 'carwars.bat',
                        link: '../systems/js99er/play.html?game=carwars',
                      },
                      {
                        name: 'tiinvad.bat',
                        link: '../systems/js99er/play.html?game=tiinvad',
                      },
                      {
                        name: 'tmbcity.bat',
                        link: '../systems/js99er/play.html?game=tmbcity',
                      },
                      {
                        name: 'alpiner.bat',
                        link: '../systems/js99er/play.html?game=alpiner',
                      },
                      {
                        name: 'microsrg.bat',
                        link: '../systems/js99er/play.html?game=microsrg',
                      },
                      {
                        name: 'munchman.bat',
                        link: '../systems/js99er/play.html?game=munchman',
                      },
                      {
                        name: 'parsec.bat',
                        link: '../systems/js99er/play.html?game=parsec',
                      },
                      {
                        name: 'doom.bat',
                        link: '../systems/js99er/play.html?game=doom',
                      },
                      {
                        name: 'buckrgrs.bat',
                        link: '../systems/js99er/play.html?game=buckrgrs',
                      },
                      {
                        name: 'prompt.bat',
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
                            data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             MSX1  -  CARTRIDGES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Antarctic Adventure  (1983)  ANTRCTIC º\necho                 º   2.  Athletic Land        (1984)  ATHLETIC º\necho                 º   3.  Eggerland Mystery    (1985)  EGGRLAND º\necho                 º   4.  King's Valley        (1985)  KINGSVAL º\necho                 º   5.  Pippols              (1985)  PIPPOLS  º\necho                 º   6.  Road Fighter         (1985)  ROADFGTR º\necho                 º   7.  Yie Ar Kung-Fu       (1985)  YIEARKF  º\necho                 º   8.  Knightmare           (1986)  KNIGHTMR º\necho                 º   9.  Nemesis              (1986)  NEMESIS  º\necho                 º  10.  The Goonies          (1986)  GOONIES  º\necho                 º                                             º\necho                 º  11.  MSX BASIC prompt             PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                            name: 'antrctic.bat',
                            link: '../systems/msx1/?ROM=games/antarcticadv.zip&M=MSX1&game=antrctic',
                          },
                          {
                            name: 'athletic.bat',
                            link: '../systems/msx1/?ROM=games/athleticland.zip&M=MSX1&game=athletic',
                          },
                          {
                            name: 'pippols.bat',
                            link: '../systems/msx1/?ROM=games/pippols.zip&M=MSX1&game=pippols',
                          },
                          {
                            name: 'roadfgtr.bat',
                            link: '../systems/msx1/?ROM=games/roadfighter.zip&M=MSX1&game=roadfgtr',
                          },
                          {
                            name: 'kingsval.bat',
                            link: '../systems/msx1/?ROM=games/kingsvalley.zip&M=MSX1&game=kingsval',
                          },
                          {
                            name: 'yiearkf.bat',
                            link: '../systems/msx1/?ROM=games/yiearkungfu.zip&M=MSX1&game=yiearkf',
                          },
                          {
                            name: 'eggrland.bat',
                            link: '../systems/msx1/?ROM=games/eggerland.zip&M=MSX1&game=eggrland',
                          },
                          {
                            name: 'knightmr.bat',
                            link: '../systems/msx1/?ROM=games/knightmare.zip&M=MSX1&game=knightmr',
                          },
                          {
                            name: 'nemesis.bat',
                            link: '../systems/msx1/?ROM=games/nemesis.zip&M=MSX1&game=nemesis',
                          },
                          {
                            name: 'goonies.bat',
                            link: '../systems/msx1/?ROM=games/goonies.zip&M=MSX1&game=goonies',
                          },
                          {
                            name: 'prompt.bat',
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
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           MSX2  -  CARTS  &  DISKS          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Castle Excellent     (1986)  CASTLEEX º\necho                 º   2.  Vampire Killer       (1986)  VAMPKILL º\necho                 º   3.  Bubble Bobble        (1987)  BUBBLBOB º\necho                 º   4.  F-1 Spirit           (1987)  F1SPIRIT º\necho                 º   5.  Metal Gear           (1987)  METLGEAR º\necho                 º   6.  The Treasure of Usas (1987)  USAS     º\necho                 º   7.  Aleste               (1988)  ALESTE   º\necho                 º   8.  Parodius Da!         (1988)  PARODIUS º\necho                 º   9.  Space Manbow         (1989)  MANBOW   º\necho                 º  10.  Quarth               (1990)  QUARTH   º\necho                 º                                             º\necho                 º  11.  MSX BASIC prompt             PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                            name: 'vampkill.bat',
                            link: '../systems/msx2/?ROM=games/vampirekill.zip&M=MSX2&game=vampkill',
                          },
                          {
                            name: 'castleex.bat',
                            link: '../systems/msx2/?ROM=games/castleexcl.zip&M=MSX2&game=castleex',
                          },
                          {
                            name: 'bubblbob.bat',
                            link: '../systems/msx2/?ROM=games/bubblebobble.zip&M=MSX2&game=bubblbob',
                          },
                          {
                            name: 'metlgear.bat',
                            link: '../systems/msx2/?ROM=games/metalgear.zip&M=MSX2&game=metlgear',
                          },
                          {
                            name: 'usas.bat',
                            link: '../systems/msx2/?ROM=games/usas.zip&M=MSX2&game=usas',
                          },
                          {
                            name: 'f1spirit.bat',
                            link: '../systems/msx2/?ROM=games/f1spirit.zip&M=MSX2&game=f1spirit',
                          },
                          {
                            name: 'aleste.bat',
                            link: '../systems/msx2/?ROM=games/aleste.zip&M=MSX2&game=aleste',
                          },
                          {
                            name: 'parodius.bat',
                            link: '../systems/msx2/?ROM=games/parodius.zip&M=MSX2&game=parodius',
                          },
                          {
                            name: 'manbow.bat',
                            link: '../systems/msx2/?ROM=games/spacemanbow.zip&M=MSX2&game=manbow',
                          },
                          {
                            name: 'quarth.bat',
                            link: '../systems/msx2/?ROM=games/quarth.zip&M=MSX2&game=quarth',
                          },
                          {
                            name: 'prompt.bat',
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
                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                MSX  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  MSX                  (1983)  MSX1     º\necho                 º                                             º\necho                 º   2.  MSX2                 (1986)  MSX2     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               HOME  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Acorn                (1981)  ACORN    º\necho                 º   2.  Amstrad              (1984)  CPC      º\necho                 º   3.  Apple                (1976)  APPLE    º\necho                 º   4.  Atari                (1979)  ATARI    º\necho                 º   5.  Commodore            (1977)  COMMODRE º\necho                 º   6.  MSX                  (1983)  MSX      º\necho                 º   7.  Sinclair             (1981)  SINCLAIR º\necho                 º   8.  Tandy                (1980)  TANDY    º\necho                 º   9.  Texas Instruments    (1979)  TI99     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                directories: [
                  {
                    name: 'GAMES',
                    files: [
                      {
                        name: 'menu.bat',
                        data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             NINTENDO  GAME  BOY             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Tetris               (1989)  TETRIS   º\necho                 º   2.  Super Mario Land     (1989)  SMLAND   º\necho                 º   3.  Castlevania          (1989)  CASTLEV  º\necho                 º   4.  Gargoyle's Quest     (1990)  GARGOYLE º\necho                 º   5.  Final Fantasy Adv.   (1991)  FFADV    º\necho                 º   6.  Kirby's Dream Land   (1992)  KIRBY    º\necho                 º   7.  Link's Awakening     (1993)  ZELDA    º\necho                 º   8.  Donkey Kong          (1994)  DKONG    º\necho                 º   9.  Pokemon Red          (1996)  POKEMON  º\necho                 º  10.  Shantae              (2002)  SHANTAE  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                        name: 'tetris.bat',
                        link: '../systems/gbc/play.html?game=tetris',
                      },
                      {
                        name: 'smland.bat',
                        link: '../systems/gbc/play.html?game=smland',
                      },
                      {
                        name: 'castlev.bat',
                        link: '../systems/gbc/play.html?game=castlev',
                      },
                      {
                        name: 'gargoyle.bat',
                        link: '../systems/gbc/play.html?game=gargoyle',
                      },
                      {
                        name: 'kirby.bat',
                        link: '../systems/gbc/play.html?game=kirby',
                      },
                      {
                        name: 'zelda.bat',
                        link: '../systems/gbc/play.html?game=zelda',
                      },
                      {
                        name: 'dkong.bat',
                        link: '../systems/gbc/play.html?game=dkong',
                      },
                      {
                        name: 'pokemon.bat',
                        link: '../systems/gbc/play.html?game=pokemon',
                      },
                      {
                        name: 'ffadv.bat',
                        link: '../systems/gbc/play.html?game=ffadv',
                      },
                      {
                        name: 'shantae.bat',
                        link: '../systems/gbc/play.html?game=shantae',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'LYNX',
                directories: [
                  {
                    name: 'GAMES',
                    files: [
                      {
                        name: 'menu.bat',
                        data: "echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                 ATARI  LYNX                 º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  California Games     (1989)  CALGAMES º\necho                 º   2.  Chip's Challenge     (1989)  CHIPS    º\necho                 º   3.  Electrocop           (1989)  ELECTRO  º\necho                 º   4.  Blue Lightning       (1989)  BLUELGHT º\necho                 º   5.  Warbirds             (1989)  WARBIRDS º\necho                 º   6.  Zarlor Mercenary     (1990)  ZARLOR   º\necho                 º   7.  Klax                 (1990)  KLAX     º\necho                 º   8.  Slime World          (1990)  SLIME    º\necho                 º   9.  S.T.U.N. Runner      (1991)  STUNRUN  º\necho                 º  10.  Rampart              (1991)  RAMPART  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n",
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
                        name: 'calgames.bat',
                        link: '../systems/lynx/play.html?game=calgames',
                      },
                      {
                        name: 'chips.bat',
                        link: '../systems/lynx/play.html?game=chips',
                      },
                      {
                        name: 'electro.bat',
                        link: '../systems/lynx/play.html?game=electro',
                      },
                      {
                        name: 'bluelght.bat',
                        link: '../systems/lynx/play.html?game=bluelght',
                      },
                      {
                        name: 'warbirds.bat',
                        link: '../systems/lynx/play.html?game=warbirds',
                      },
                      {
                        name: 'zarlor.bat',
                        link: '../systems/lynx/play.html?game=zarlor',
                      },
                      {
                        name: 'klax.bat',
                        link: '../systems/lynx/play.html?game=klax',
                      },
                      {
                        name: 'slime.bat',
                        link: '../systems/lynx/play.html?game=slime',
                      },
                      {
                        name: 'stunrun.bat',
                        link: '../systems/lynx/play.html?game=stunrun',
                      },
                      {
                        name: 'rampart.bat',
                        link: '../systems/lynx/play.html?game=rampart',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'GAMEGEAR',
                directories: [
                  {
                    name: 'GAMES',
                    files: [
                      {
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               SEGA  GAME  GEAR              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Columns              (1991)  COLUMNS  º\necho                 º   2.  Sonic the Hedgehog   (1991)  SONIC    º\necho                 º   3.  Shinobi              (1991)  SHINOBI  º\necho                 º   4.  Aerial Assault       (1992)  AERIAL   º\necho                 º   5.  Streets of Rage      (1992)  RAGE     º\necho                 º   6.  Defenders of Oasis   (1992)  OASIS    º\necho                 º   7.  Land of Illusion     (1993)  ILLUSION º\necho                 º   8.  Mortal Kombat        (1993)  KOMBAT   º\necho                 º   9.  Mean Bean Machine    (1993)  MEANBEAN º\necho                 º  10.  Tails Adventure      (1995)  TAILS    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
                        name: 'columns.bat',
                        link: '../systems/gamegear/play.html?game=columns',
                      },
                      {
                        name: 'sonic.bat',
                        link: '../systems/gamegear/play.html?game=sonic',
                      },
                      {
                        name: 'shinobi.bat',
                        link: '../systems/gamegear/play.html?game=shinobi',
                      },
                      {
                        name: 'aerial.bat',
                        link: '../systems/gamegear/play.html?game=aerial',
                      },
                      {
                        name: 'rage.bat',
                        link: '../systems/gamegear/play.html?game=rage',
                      },
                      {
                        name: 'oasis.bat',
                        link: '../systems/gamegear/play.html?game=oasis',
                      },
                      {
                        name: 'illusion.bat',
                        link: '../systems/gamegear/play.html?game=illusion',
                      },
                      {
                        name: 'kombat.bat',
                        link: '../systems/gamegear/play.html?game=kombat',
                      },
                      {
                        name: 'meanbean.bat',
                        link: '../systems/gamegear/play.html?game=meanbean',
                      },
                      {
                        name: 'tails.bat',
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
                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              HANDHELD  CONSOLES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Nintendo Game Boy    (1989)  GAMEBOY  º\necho                 º                                             º\necho                 º   2.  Atari Lynx           (1989)  LYNX     º\necho                 º                                             º\necho                 º   3.  Sega Game Gear       (1990)  GAMEGEAR º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
              },
              { name: '1.bat', data: 'cd gameboy\ncd games\nmenu\n' },
              { name: '2.bat', data: 'cd lynx\ncd games\nmenu\n' },
              { name: '3.bat', data: 'cd gamegear\ncd games\nmenu\n' },
              { name: '0.bat', data: 'echo off\ncd ..\nmenu\n' },
            ],
          },
        ],
        files: [
          {
            name: 'menu.bat',
            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             EMULATOR  LAUNCHER              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Home Computers            HOMECOMP    º\necho                 º                                             º\necho                 º   2.  Games Consoles            CONSOLE     º\necho                 º                                             º\necho                 º   3.  Handheld Consoles         HANDHELD    º\necho                 º                                             º\necho                 º                                             º\necho                 º   4.  GenX-DOS Wiki             WIKI        º\necho                 º                                             º\necho                 º   0.  Exit                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n',
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
            data: 'wiki\n',
          },
          {
            name: 'wiki.bat',
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
