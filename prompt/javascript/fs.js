// ============================================================
// VIRTUAL FILESYSTEM
// Simulated C: drive with directories and files.
// Files have either a `link` (opens in new tab) or
// `data` (plain text / batch script content).
// ============================================================
var fs = [{
    name: 'c',
    directories: [{
        name: 'EMULATORS',
        directories: [
            // ── CONSOLE ──────────────────────────────────────────────────────────
            {
                name: 'CONSOLE',
                directories: [

                    // ATARI
                    {
                        name: 'ATARI',
                        directories: [{
                                name: '2600',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  2600  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Breakout             (1978)  BREAKOUT º\necho                 º   2.  Adventure            (1980)  ADVENTUREº\necho                 º   3.  Space Invaders       (1980)  INVADERS º\necho                 º   4.  Asteroids            (1981)  ASTEROIDSº\necho                 º   5.  Missile Command      (1981)  MISSILE  º\necho                 º   6.  Pac-Man              (1982)  PACMAN   º\necho                 º   7.  Pitfall!             (1982)  PITFALL  º\necho                 º   8.  River Raid           (1982)  RIVERRAIDº\necho                 º   9.  Yars\' Revenge        (1982)  YARS     º\necho                 º  10.  Centipede            (1983)  CENTIPEDEº\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'breakout\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'adventure\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'invaders\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'asteroids\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'missile\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'pacman\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'pitfall\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'riverraid\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'yars\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'centipede\n'
                                    }, {
                                        name: 'adventure.bat',
                                        link: '../emulators/stella/play.html?game=adventure'
                                    }, {
                                        name: 'asteroids.bat',
                                        link: '../emulators/stella/play.html?game=asteroids'
                                    }, {
                                        name: 'pacman.bat',
                                        link: '../emulators/stella/play.html?game=pacman'
                                    }, {
                                        name: 'pitfall.bat',
                                        link: '../emulators/stella/play.html?game=pitfall'
                                    }, {
                                        name: 'invaders.bat',
                                        link: '../emulators/stella/play.html?game=invaders'
                                    }, {
                                        name: 'breakout.bat',
                                        link: '../emulators/stella/play.html?game=breakout'
                                    }, {
                                        name: 'missile.bat',
                                        link: '../emulators/stella/play.html?game=missile'
                                    }, {
                                        name: 'yars.bat',
                                        link: '../emulators/stella/play.html?game=yars'
                                    }, {
                                        name: 'centipede.bat',
                                        link: '../emulators/stella/play.html?game=centipede'
                                    }, {
                                        name: 'riverraid.bat',
                                        link: '../emulators/stella/play.html?game=riverraid'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: '7800',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  7800  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Asteroids            (1986)  ASTEROIDSº\necho                 º   2.  Centipede            (1986)  CENTIPEDEº\necho                 º   3.  Joust                (1986)  JOUST    º\necho                 º   4.  Ms. Pac-Man          (1986)  MSPACMAN º\necho                 º   5.  Pole Position II     (1986)  POLEPOS2 º\necho                 º   6.  Xevious              (1986)  XEVIOUS  º\necho                 º   7.  Dig Dug              (1987)  DIGDUG   º\necho                 º   8.  Food Fight           (1987)  FOODFIGHTº\necho                 º   9.  Galaga               (1987)  GALAGA   º\necho                 º  10.  Robotron 2084        (1987)  ROBOTRON º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'asteroids\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'centipede\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'joust\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'mspacman\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'polepos2\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'xevious\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'digdug\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'foodfight\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'galaga\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'robotron\n'
                                    }, {
                                        name: 'asteroids.bat',
                                        link: '../emulators/js7800/play.html?game=asteroids'
                                    }, {
                                        name: 'centipede.bat',
                                        link: '../emulators/js7800/play.html?game=centipede'
                                    }, {
                                        name: 'joust.bat',
                                        link: '../emulators/js7800/play.html?game=joust'
                                    }, {
                                        name: 'mspacman.bat',
                                        link: '../emulators/js7800/play.html?game=mspacman'
                                    }, {
                                        name: 'galaga.bat',
                                        link: '../emulators/js7800/play.html?game=galaga'
                                    }, {
                                        name: 'polepos2.bat',
                                        link: '../emulators/js7800/play.html?game=polepos2'
                                    }, {
                                        name: 'digdug.bat',
                                        link: '../emulators/js7800/play.html?game=digdug'
                                    }, {
                                        name: 'xevious.bat',
                                        link: '../emulators/js7800/play.html?game=xevious'
                                    }, {
                                        name: 'foodfight.bat',
                                        link: '../emulators/js7800/play.html?game=foodfight'
                                    }, {
                                        name: 'robotron.bat',
                                        link: '../emulators/js7800/play.html?game=robotron'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            }
                        ],
                        files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               ATARI  CONSOLES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari 2600           (1977)  2600     º\necho                 º   2.  Atari 7800           (1986)  7800     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            },
                            {
                                name: '1.bat',
                                data: 'cd 2600\ncd games\nmenu\n'
                            },
                            {
                                name: '2.bat',
                                data: 'cd 7800\ncd games\nmenu\n'
                            },
                            {
                                name: '0.bat',
                                data: 'cd ..\nmenu\n'
                            }
                        ]
                    },
                    {
                        name: 'NES',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             NINTENDO  NES  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Super Mario Bros.    (1985)  MARIO    º\necho                 º   2.  Castlevania          (1987)  CASTLEV  º\necho                 º   3.  Metroid              (1987)  METROID  º\necho                 º   4.  Mike Tyson\'s P-O!!   (1987)  PUNCHOUT º\necho                 º   5.  Contra               (1988)  CONTRA   º\necho                 º   6.  Super Mario Bros. 2  (1988)  SMB2     º\necho                 º   7.  Mega Man 2           (1989)  MEGAMAN2 º\necho                 º   8.  Tetris               (1989)  TETRIS   º\necho                 º   9.  Final Fantasy        (1990)  FINALFNT º\necho                 º  10.  Super Mario Bros. 3  (1990)  MARIO 3  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'smb\n'
                            }, {
                                name: '2.bat',
                                data: 'castlvnia\n'
                            }, {
                                name: '3.bat',
                                data: 'metroid\n'
                            }, {
                                name: '4.bat',
                                data: 'punchout\n'
                            }, {
                                name: '5.bat',
                                data: 'contra\n'
                            }, {
                                name: '6.bat',
                                data: 'smb2\n'
                            }, {
                                name: '7.bat',
                                data: 'megaman2\n'
                            }, {
                                name: '8.bat',
                                data: 'tetris\n'
                            }, {
                                name: '9.bat',
                                data: 'finalfnts\n'
                            }, {
                                name: '10.bat',
                                data: 'smb3\n'
                            }, {
                                name: 'smb.bat',
                                link: '../emulators/jsnes/play.html?game=smb'
                            }, {
                                name: 'smb2.bat',
                                link: '../emulators/jsnes/play.html?game=smb2'
                            }, {
                                name: 'smb3.bat',
                                link: '../emulators/jsnes/play.html?game=smb3'
                            }, {
                                name: 'contra.bat',
                                link: '../emulators/jsnes/play.html?game=contra'
                            }, {
                                name: 'megaman2.bat',
                                link: '../emulators/jsnes/play.html?game=megaman2'
                            }, {
                                name: 'castlvnia.bat',
                                link: '../emulators/jsnes/play.html?game=castlvnia'
                            }, {
                                name: 'metroid.bat',
                                link: '../emulators/jsnes/play.html?game=metroid'
                            }, {
                                name: 'tetris.bat',
                                link: '../emulators/jsnes/play.html?game=tetris'
                            }, {
                                name: 'punchout.bat',
                                link: '../emulators/jsnes/play.html?game=punchout'
                            }, {
                                name: 'finalfnts.bat',
                                link: '../emulators/jsnes/play.html?game=finalfnts'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\necho.\n'
                        }]
                    },

                    {
                        name: 'INTV',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                º            INTELLIVISION  GAMES             º\necho                ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                º                                             º\necho                º   1.  Adventure            (1981)  ADVENT   º\necho                º   2.  Astrosmash           (1981)  ASTRO    º\necho                º   3.  B-17 Bomber          (1981)  B-17     º\necho                º   4.  Snafu                (1981)  SNAFU    º\necho                º   5.  Star Strike          (1981)  STARSTRK º\necho                º   6.  TRON: Deadly Discs   (1981)  TRON     º\necho                º   7.  Atlantis             (1982)  ATLANTIS º\necho                º   8.  BurgerTime           (1982)  BURGER   º\necho                º   9.  Lock \'N\' Chase       (1982)  LOCKCHASEº\necho                º  10.  Night Stalker        (1982)  NIGHTSTK º\necho                º                                             º\necho                º   0.  Back                                  º\necho                º                                             º\necho                ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                º        Type a number and press ENTER        º\necho                ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'advent\n'
                            }, {
                                name: '2.bat',
                                data: 'astro\n'
                            }, {
                                name: '3.bat',
                                data: 'b-17\n'
                            }, {
                                name: '4.bat',
                                data: 'snafu\n'
                            }, {
                                name: '5.bat',
                                data: 'starstrk\n'
                            }, {
                                name: '6.bat',
                                data: 'tron\n'
                            }, {
                                name: '7.bat',
                                data: 'atlantis\n'
                            }, {
                                name: '8.bat',
                                data: 'burger\n'
                            }, {
                                name: '9.bat',
                                data: 'lockchase\n'
                            }, {
                                name: '10.bat',
                                data: 'nightstk\n'
                            }, {
                                name: 'astro.bat',
                                link: '../emulators/intellivision/play.html?game=astro'
                            }, {
                                name: 'burger.bat',
                                link: '../emulators/intellivision/play.html?game=burger'
                            }, {
                                name: 'tron.bat',
                                link: '../emulators/intellivision/play.html?game=tron'
                            }, {
                                name: 'snafu.bat',
                                link: '../emulators/intellivision/play.html?game=snafu'
                            }, {
                                name: 'b-17.bat',
                                link: '../emulators/intellivision/play.html?game=b17'
                            }, {
                                name: 'nightstk.bat',
                                link: '../emulators/intellivision/play.html?game=nightstk'
                            }, {
                                name: 'advent.bat',
                                link: '../emulators/intellivision/play.html?game=advent'
                            }, {
                                name: 'atlantis.bat',
                                link: '../emulators/intellivision/play.html?game=atlantis'
                            }, {
                                name: 'lockchase.bat',
                                link: '../emulators/intellivision/play.html?game=lockchase'
                            }, {
                                name: 'starstrk.bat',
                                link: '../emulators/intellivision/play.html?game=starstrk'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\necho.\n'
                        }]
                    },

                    {
                        name: 'CVISION',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             COLECOVISION  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Carnival             (1982)  CARNIVAL º\necho                 º   2.  Cosmic Avenger       (1982)  COSMIC   º\necho                 º   3.  Donkey Kong          (1982)  DKONG    º\necho                 º   4.  Lady Bug             (1982)  LADYBUG  º\necho                 º   5.  Mouse Trap           (1982)  MOUSETRP º\necho                 º   6.  Smurf Rescue         (1982)  SMURF    º\necho                 º   7.  Venture              (1982)  VENTURE  º\necho                 º   8.  Zaxxon               (1982)  ZAXXON   º\necho                 º   9.  Mr. Do!              (1983)  MRDO     º\necho                 º  10.  Q*bert               (1983)  QBERT    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'carnival\n'
                            }, {
                                name: '2.bat',
                                data: 'cosmic\n'
                            }, {
                                name: '3.bat',
                                data: 'dkong\n'
                            }, {
                                name: '4.bat',
                                data: 'ladybug\n'
                            }, {
                                name: '5.bat',
                                data: 'mousetrp\n'
                            }, {
                                name: '6.bat',
                                data: 'smurf\n'
                            }, {
                                name: '7.bat',
                                data: 'venture\n'
                            }, {
                                name: '8.bat',
                                data: 'zaxxon\n'
                            }, {
                                name: '9.bat',
                                data: 'mrdo\n'
                            }, {
                                name: '10.bat',
                                data: 'qbert\n'
                            }, {
                                name: 'dkong.bat',
                                link: '../emulators/coleco/play.html?game=dkong'
                            }, {
                                name: 'cosmic.bat',
                                link: '../emulators/coleco/play.html?game=cosmic'
                            }, {
                                name: 'ladybug.bat',
                                link: '../emulators/coleco/play.html?game=ladybug'
                            }, {
                                name: 'mousetrp.bat',
                                link: '../emulators/coleco/play.html?game=mousetrp'
                            }, {
                                name: 'carnival.bat',
                                link: '../emulators/coleco/play.html?game=carnival'
                            }, {
                                name: 'venture.bat',
                                link: '../emulators/coleco/play.html?game=venture'
                            }, {
                                name: 'smurf.bat',
                                link: '../emulators/coleco/play.html?game=smurf'
                            }, {
                                name: 'zaxxon.bat',
                                link: '../emulators/coleco/play.html?game=zaxxon'
                            }, {
                                name: 'mrdo.bat',
                                link: '../emulators/coleco/play.html?game=mrdo'
                            }, {
                                name: 'qbert.bat',
                                link: '../emulators/coleco/play.html?game=qbert'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\necho.\n'
                        }]
                    },

                    {
                        name: 'ODYSSEY2',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               ODYSSEYý  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Cosmic Conflict!     (1979)  COSMIC   º\necho                 º   2.  Alien Invaders+!     (1980)  ALIENPLUSº\necho                 º   3.  K.C. Munchkin!       (1981)  KCMUNCH  º\necho                 º   4.  Quest for Rings!     (1981)  QRINGS   º\necho                 º   5.  UFO!                 (1981)  UFO      º\necho                 º   6.  Atlantis             (1982)  ATLANTIS º\necho                 º   7.  Demon Attack         (1982)  DEMON    º\necho                 º   8.  Pick Axe Pete!       (1982)  PICKAXE  º\necho                 º   9.  Smithereens!         (1982)  SMITHER  º\necho                 º  10.  Killer Bees!         (1983)  KILLBEES º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'cosmic\n'
                            }, {
                                name: '2.bat',
                                data: 'alienplus\n'
                            }, {
                                name: '3.bat',
                                data: 'kcmunch\n'
                            }, {
                                name: '4.bat',
                                data: 'qrings\n'
                            }, {
                                name: '5.bat',
                                data: 'ufo\n'
                            }, {
                                name: '6.bat',
                                data: 'atlantis\n'
                            }, {
                                name: '7.bat',
                                data: 'demon\n'
                            }, {
                                name: '8.bat',
                                data: 'pickaxe\n'
                            }, {
                                name: '9.bat',
                                data: 'smither\n'
                            }, {
                                name: '10.bat',
                                data: 'killbees\n'
                            }, {
                                name: 'cosmic.bat',
                                link: '../emulators/odyssey2/play.html?game=cosmic'
                            }, {
                                name: 'alienplus.bat',
                                link: '../emulators/odyssey2/play.html?game=alienplus'
                            }, {
                                name: 'kcmunch.bat',
                                link: '../emulators/odyssey2/play.html?game=kcmunch'
                            }, {
                                name: 'qrings.bat',
                                link: '../emulators/odyssey2/play.html?game=qrings'
                            }, {
                                name: 'ufo.bat',
                                link: '../emulators/odyssey2/play.html?game=ufo'
                            }, {
                                name: 'atlantis.bat',
                                link: '../emulators/odyssey2/play.html?game=atlantis'
                            }, {
                                name: 'demon.bat',
                                link: '../emulators/odyssey2/play.html?game=demon'
                            }, {
                                name: 'pickaxe.bat',
                                link: '../emulators/odyssey2/play.html?game=pickaxe'
                            }, {
                                name: 'smither.bat',
                                link: '../emulators/odyssey2/play.html?game=smither'
                            }, {
                                name: 'killbees.bat',
                                link: '../emulators/odyssey2/play.html?game=killbees'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\necho.\n'
                        }]
                    },

                    {
                        name: 'VECTREX',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          VECTREX  COMMERCIAL  GAMES         º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Berzerk              (1982)  BERZERK  º\necho                 º   2.  Cosmic Chasm         (1982)  COSMICCH º\necho                 º   3.  Rip-Off              (1982)  RIPOFF   º\necho                 º   4.  Scramble             (1982)  SCRAMBLE º\necho                 º   5.  Solar Quest          (1982)  SOLARQST º\necho                 º   6.  Star Trek            (1982)  STARTREK º\necho                 º   7.  Polar Rescue         (1983)  POLARRSC º\necho                 º   8.  Pole Position        (1983)  POLEPOS  º\necho                 º   9.  Spike                (1983)  SPIKE    º\necho                 º  10.  Star Castle          (1983)  STARCASL º\necho                 º                                             º\necho                 º  11.  Mine Storm (built-in)        MINESTRM º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'berzerk\n'
                            }, {
                                name: '2.bat',
                                data: 'cosmicch\n'
                            }, {
                                name: '3.bat',
                                data: 'ripoff\n'
                            }, {
                                name: '4.bat',
                                data: 'scramble\n'
                            }, {
                                name: '5.bat',
                                data: 'solarqst\n'
                            }, {
                                name: '6.bat',
                                data: 'startrek\n'
                            }, {
                                name: '7.bat',
                                data: 'polarrsc\n'
                            }, {
                                name: '8.bat',
                                data: 'polepos\n'
                            }, {
                                name: '9.bat',
                                data: 'spike\n'
                            }, {
                                name: '10.bat',
                                data: 'starcasl\n'
                            }, {
                                name: '11.bat',
                                data: 'minestrm\n'
                            }, {
                                name: 'starcasl.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Star%20Castle_1983&game=starcasl'
                            }, {
                                name: 'berzerk.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Berzerk_1982&game=berzerk'
                            }, {
                                name: 'cosmicch.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Cosmic%20Chasm_1982&game=cosmicch'
                            }, {
                                name: 'polepos.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Pole%20Position_1983&game=polepos'
                            }, {
                                name: 'polarrsc.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Polar%20Rescue_1983&game=polarrsc'
                            }, {
                                name: 'spike.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Spike_1983&game=spike'
                            }, {
                                name: 'startrek.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Star%20Trek_1982&game=startrek'
                            }, {
                                name: 'solarqst.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Solar%20Quest_1982&game=solarqst'
                            }, {
                                name: 'ripoff.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Rip-Off_1982&game=ripoff'
                            }, {
                                name: 'scramble.bat',
                                link: '../emulators/jsvecx/?rom=Commercial/Scramble_1982&game=scramble'
                            }, {
                                name: 'minestrm.bat',
                                link: '../emulators/jsvecx/?game=minestrm'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\n'
                        }]
                    },

                ],
                files: [{
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              CONSOLE  SYSTEMS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari                (1977)  ATARI    º\necho                 º   2.  ColecoVision         (1982)  CVISION  º\necho                 º   3.  Intellivision        (1979)  INTV     º\necho                 º   4.  NES                  (1985)  NES      º\necho                 º   5.  Odysseyý             (1978)  ODYSSEY2 º\necho                 º   6.  Vectrex              (1982)  VECTREX  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                    },
                    {
                        name: '1.bat',
                        data: 'cd atari\nmenu\n'
                    },
                    {
                        name: '2.bat',
                        data: 'cd cvision\nmenu\n'
                    },
                    {
                        name: '3.bat',
                        data: 'cd intv\nmenu\n'
                    },
                    {
                        name: '4.bat',
                        data: 'cd nes\nmenu\n'
                    },
                    {
                        name: '5.bat',
                        data: 'cd odyssey2\nmenu\n'
                    },
                    {
                        name: '6.bat',
                        data: 'cd vectrex\nmenu\n'
                    },
                    {
                        name: '0.bat',
                        data: 'cd ..\nmenu\n'
                    }
                ]
            },

            // ── HOME COMPUTERS ───────────────────────────────────────────────────
            {
                name: 'HOMECOMP',
                directories: [
                    // ACORN (BBC Micro 1981 + Electron 1983)
                    {
                        name: 'ACORN',
                        directories: [{
                                name: 'BBC',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              BBC  MICRO  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Snapper              (1982)  SNAPPER  º\necho                 º   2.  Chuckie Egg          (1983)  CHUCKEGG º\necho                 º   3.  Elite                (1984)  ELITE    º\necho                 º   4.  Manic Miner          (1984)  MANICMN  º\necho                 º   5.  Citadel              (1985)  CITADEL  º\necho                 º   6.  Jet Set Willy        (1985)  JETWILLY º\necho                 º   7.  Repton               (1985)  REPTON   º\necho                 º   8.  Thrust               (1986)  THRUST   º\necho                 º   9.  Uridium              (1986)  URIDIUM  º\necho                 º  10.  Exile                (1988)  EXILE    º\necho                 º                                             º\necho                 º  11.  BASIC system prompt          PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'snapper\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'chuckegg\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'elite\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'manicmn\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'citadel\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'jetwilly\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'repton\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'thrust\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'uridium\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'exile\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'prompt\n'
                                    }, {
                                        name: 'elite.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Acornsoft/Elite.ssd&autoboot'
                                    }, {
                                        name: 'chuckegg.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=AnF/ChuckieEgg.ssd&autoboot'
                                    }, {
                                        name: 'repton.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Superior/Repton.ssd&autoboot'
                                    }, {
                                        name: 'manicmn.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=SoftwareProjects/ManicMiner.ssd&autoboot'
                                    }, {
                                        name: 'jetwilly.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Tynesoft/JetSetWilly.ssd&autoboot'
                                    }, {
                                        name: 'citadel.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Superior/Citadel.ssd&autoboot'
                                    }, {
                                        name: 'exile.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Superior/Exile.ssd&autoboot'
                                    }, {
                                        name: 'thrust.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Superior/Thrust.ssd&autoboot'
                                    }, {
                                        name: 'snapper.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Acornsoft/Snapper-v1-alt.ssd&autoboot'
                                    }, {
                                        name: 'uridium.bat',
                                        link: '../emulators/jsbeeb/dist/?disc1=Hewson/Uridium.ssd&autoboot'
                                    }, {
                                        name: 'prompt.bat',
                                        link: '../emulators/jsbeeb/dist/'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'ELECTRON',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           ACORN  ELECTRON  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Hopper               (1983)  HOPPER   º\necho                 º   2.  Snapper              (1983)  SNAPPER  º\necho                 º   3.  Starship Command     (1983)  STARSHIP º\necho                 º   4.  Boxer                (1984)  BOXER    º\necho                 º   5.  Chuckie Egg          (1984)  CHUCKEGG º\necho                 º   6.  Cybertron Mission    (1984)  CYBRTRON º\necho                 º   7.  Frak!                (1984)  FRAK     º\necho                 º   8.  Citadel              (1985)  CITADEL  º\necho                 º   9.  Elite                (1985)  ELITE    º\necho                 º  10.  Repton 2             (1985)  REPTON2  º\necho                 º                                             º\necho                 º  11.  Electron BASIC prompt       BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'hopper\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'snapper\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'starship\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'boxer\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'chuckegg\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'cybrtron\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'frak\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'citadel\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'elite\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'repton2\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'snapper.bat',
                                        link: '../emulators/electron/play.html?game=snapper'
                                    }, {
                                        name: 'citadel.bat',
                                        link: '../emulators/electron/play.html?game=citadel'
                                    }, {
                                        name: 'starship.bat',
                                        link: '../emulators/electron/play.html?game=starship'
                                    }, {
                                        name: 'repton2.bat',
                                        link: '../emulators/electron/play.html?game=repton2'
                                    }, {
                                        name: 'boxer.bat',
                                        link: '../emulators/electron/play.html?game=boxer'
                                    }, {
                                        name: 'cybrtron.bat',
                                        link: '../emulators/electron/play.html?game=cybertron'
                                    }, {
                                        name: 'elite.bat',
                                        link: '../emulators/electron/play.html?game=elite'
                                    }, {
                                        name: 'chuckegg.bat',
                                        link: '../emulators/electron/play.html?game=chuckie'
                                    }, {
                                        name: 'frak.bat',
                                        link: '../emulators/electron/play.html?game=frak'
                                    }, {
                                        name: 'hopper.bat',
                                        link: '../emulators/electron/play.html?game=hopper'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/electron/play.html'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'MASTER',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           MASTER-ENHANCED  TITLES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Stryker\'s Run        (1986)  STRYKER  º\necho                 º   2.  Repton 3             (1986)  REPTON3  º\necho                 º   3.  Elite                (1986)  ELITE    º\necho                 º   4.  Crazee Rider         (1987)  CRAZEE   º\necho                 º   5.  Firetrack            (1987)  FIRETRAK º\necho                 º   6.  Repton Infinity      (1988)  REPTONINFº\necho                 º   7.  Fair or Foul         (1988)  BFMOF    º\necho                 º   8.  Holed Out            (1989)  HOLEDOUT º\necho                 º   9.  Last Ninja 2         (1990)  NINJA2   º\necho                 º  10.  Ballistix            (1990)  BALLISTX º\necho                 º                                             º\necho                 º  11.  BBC BASIC prompt            PROMPT    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'stryker\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'repton3\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'elite\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'crazee\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'firetrak\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'reptoninf\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'bfmof\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'holedout\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'ninja2\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'ballistx\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'prompt\n'
                                    }, {
                                        name: 'elite.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Acornsoft/EliteMaster.dsd&autoboot'
                                    }, {
                                        name: 'ninja2.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Superior/LastNinja2.ssd&autoboot'
                                    }, {
                                        name: 'repton3.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Superior/Repton3.ssd&autoboot'
                                    }, {
                                        name: 'reptoninf.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Superior/ReptonInfinity.ssd&autoboot'
                                    }, {
                                        name: 'firetrak.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=ElectricDreams/Firetrack.ssd&autoboot'
                                    }, {
                                        name: 'crazee.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Superior/CrazeeRider.ssd&autoboot'
                                    }, {
                                        name: 'stryker.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Superior/StrykersRun.ssd&autoboot'
                                    }, {
                                        name: 'bfmof.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Superior/ByFairMeansOrFoul.ssd&autoboot'
                                    }, {
                                        name: 'holedout.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=4thDimension/HoledOut.ssd&autoboot'
                                    }, {
                                        name: 'ballistx.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master&disc1=Superior/Ballistix.ssd&autoboot'
                                    }, {
                                        name: 'prompt.bat',
                                        link: '../emulators/jsbeeb/dist/?model=Master'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            }
                        ],
                        files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ACORN  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  BBC Micro            (1981)  BBC      º\necho                 º   2.  Acorn Electron       (1983)  ELECTRON º\necho                 º   3.  BBC Master           (1986)  MASTER   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            },
                            {
                                name: '1.bat',
                                data: 'cd bbc\ncd games\nmenu\n'
                            },
                            {
                                name: '2.bat',
                                data: 'cd electron\ncd games\nmenu\n'
                            },
                            {
                                name: '3.bat',
                                data: 'cd master\ncd games\nmenu\n'
                            },
                            {
                                name: '0.bat',
                                data: 'cd ..\nmenu\n'
                            }
                        ]
                    },

                    // APPLE (Apple I 1976 + Apple ][+ 1977)
                    {
                        name: 'APPLE',
                        directories: [{
                                name: 'APPLE1',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               APPLE  I  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Game of Life         (1970)  LIFE     º\necho                 º   2.  Hamurabi             (1971)  HAMURABI º\necho                 º   3.  Hunt the Wumpus      (1973)  WUMPUS   º\necho                 º   4.  Blackjack            (1976)  BLACKJK  º\necho                 º   5.  Microchess           (1976)  CHESS    º\necho                 º   6.  Lunar Lander         (1976)  LUNAR    º\necho                 º   7.  Star Trek            (1977)  STARTREK º\necho                 º   8.  Checkers             (1978)  CHECKERS º\necho                 º   9.  Apple 30th Anniv.    (2006)  APPLE30  º\necho                 º  10.  15 Puzzle            (2020)  PUZZLE15 º\necho                 º                                             º\necho                 º  11.  Woz Monitor prompt          PROMPT    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'life\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'hamurabi\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'wumpus\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'blackjk\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'chess\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'lunar\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'startrek\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'checkers\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'apple30\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'puzzle15\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'prompt\n'
                                    }, {
                                        name: 'startrek.bat',
                                        link: '../emulators/apple1/play.html?tape=startrek'
                                    }, {
                                        name: 'blackjk.bat',
                                        link: '../emulators/apple1/play.html?tape=blackjack'
                                    }, {
                                        name: 'chess.bat',
                                        link: '../emulators/apple1/play.html?tape=chess'
                                    }, {
                                        name: 'hamurabi.bat',
                                        link: '../emulators/apple1/play.html?tape=hamurabi'
                                    }, {
                                        name: 'lunar.bat',
                                        link: '../emulators/apple1/play.html?tape=lunar'
                                    }, {
                                        name: 'wumpus.bat',
                                        link: '../emulators/apple1/play.html?tape=wumpus'
                                    }, {
                                        name: 'checkers.bat',
                                        link: '../emulators/apple1/play.html?tape=checkers'
                                    }, {
                                        name: 'puzzle15.bat',
                                        link: '../emulators/apple1/play.html?tape=puzzle15'
                                    }, {
                                        name: 'life.bat',
                                        link: '../emulators/apple1/play.html?tape=life'
                                    }, {
                                        name: 'apple30.bat',
                                        link: '../emulators/apple1/play.html?tape=apple30'
                                    }, {
                                        name: 'prompt.bat',
                                        link: '../emulators/apple1/play.html'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'APPLEII',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              APPLE  ][  GAMES               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Lemonade Stand       (1979)  LEMONADE º\necho                 º   2.  Castle Wolfenstein   (1981)  WOLF     º\necho                 º   3.  Choplifter           (1982)  CHOPLIFT º\necho                 º   4.  Aztec                (1982)  AZTEC    º\necho                 º   5.  Lode Runner          (1983)  LODERUN  º\necho                 º   6.  Sammy Lightfoot      (1983)  SAMMY    º\necho                 º   7.  Hard Hat Mack        (1983)  HARDHAT  º\necho                 º   8.  Archon               (1984)  ARCHON   º\necho                 º   9.  Karateka             (1984)  KARATEKA º\necho                 º  10.  The Oregon Trail     (1985)  OREGON   º\necho                 º                                             º\necho                 º  11.  Applesoft BASIC              BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'lemonade\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'wolf\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'choplift\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'aztec\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'loderun\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'sammy\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'hardhat\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'archon\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'karateka\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'oregon\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'archon.bat',
                                        link: '../emulators/apple2/play.html?game=archon'
                                    }, {
                                        name: 'lemonade.bat',
                                        link: '../emulators/apple2/play.html?game=lemonade'
                                    }, {
                                        name: 'wolf.bat',
                                        link: '../emulators/apple2/play.html?game=wolf'
                                    }, {
                                        name: 'choplift.bat',
                                        link: '../emulators/apple2/play.html?game=choplift'
                                    }, {
                                        name: 'aztec.bat',
                                        link: '../emulators/apple2/play.html?game=aztec'
                                    }, {
                                        name: 'loderun.bat',
                                        link: '../emulators/apple2/play.html?game=loderun'
                                    }, {
                                        name: 'sammy.bat',
                                        link: '../emulators/apple2/play.html?game=sammy'
                                    }, {
                                        name: 'hardhat.bat',
                                        link: '../emulators/apple2/play.html?game=hardhat'
                                    }, {
                                        name: 'karateka.bat',
                                        link: '../emulators/apple2/play.html?game=karateka'
                                    }, {
                                        name: 'oregon.bat',
                                        link: '../emulators/apple2/play.html?game=oregon'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/apple2/play.html'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            }
                        ],
                        files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              APPLE  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Apple I              (1976)  APPLE1   º\necho                 º   2.  Apple ][             (1977)  APPLEII  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            },
                            {
                                name: '1.bat',
                                data: 'cd apple1\ncd games\nmenu\n'
                            },
                            {
                                name: '2.bat',
                                data: 'cd appleii\ncd games\nmenu\n'
                            },
                            {
                                name: '0.bat',
                                data: 'cd ..\nmenu\n'
                            }
                        ]
                    },

                    // COMMODORE (PET + VIC-20 + MAX + C64 + C16 + Plus/4 + C128 all via EmulatorJS + VICE)
                    {
                        name: 'COMMODRE',
                        directories: [{
                                name: 'PET',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  PET  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Star Trek            (1977)  STARTREK º\necho                 º   2.  Adventureland        (1979)  ADVLAND  º\necho                 º   3.  Android NIM          (1979)  ANDNIM   º\necho                 º   4.  Lunar Lander         (1979)  LUNAR    º\necho                 º   5.  Hangman              (1980)  HANGMAN  º\necho                 º   6.  Space Invaders       (1980)  INVADER  º\necho                 º   7.  ComputerSpace 2001   (1981)  CS2001   º\necho                 º   8.  Crazy Balloon        (1981)  CRZBALLN º\necho                 º   9.  Frogger              (1981)  FROGGER  º\necho                 º  10.  Pac-Man              (1982)  PACMAN   º\necho                 º                                             º\necho                 º  11.  BASIC 2 prompt              BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'startrek\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'advland\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'andnim\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'lunar\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'hangman\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'invader\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'cs2001\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'crzballn\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'frogger\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'pacman\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'startrek.bat',
                                        link: '../emulators/pet/play.html?game=startrek'
                                    }, {
                                        name: 'andnim.bat',
                                        link: '../emulators/pet/play.html?game=andnim'
                                    }, {
                                        name: 'lunar.bat',
                                        link: '../emulators/pet/play.html?game=lunar'
                                    }, {
                                        name: 'advland.bat',
                                        link: '../emulators/pet/play.html?game=advland'
                                    }, {
                                        name: 'hangman.bat',
                                        link: '../emulators/pet/play.html?game=hangman'
                                    }, {
                                        name: 'invader.bat',
                                        link: '../emulators/pet/play.html?game=invader'
                                    }, {
                                        name: 'crzballn.bat',
                                        link: '../emulators/pet/play.html?game=crzballn'
                                    }, {
                                        name: 'cs2001.bat',
                                        link: '../emulators/pet/play.html?game=cs2001'
                                    }, {
                                        name: 'frogger.bat',
                                        link: '../emulators/pet/play.html?game=frogger'
                                    }, {
                                        name: 'pacman.bat',
                                        link: '../emulators/pet/play.html?game=pacman'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/pet/play.html?game=basic'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'VIC20',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          COMMODORE  VIC-20  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Avenger              (1981)  AVENGER  º\necho                 º   2.  Radar Rat Race       (1981)  RATRACE  º\necho                 º   3.  Choplifter           (1982)  CHOPPER  º\necho                 º   4.  Gorf                 (1982)  GORF     º\necho                 º   5.  Gridrunner           (1982)  GRIDRUN  º\necho                 º   6.  Omega Race           (1982)  OMEGA    º\necho                 º   7.  Atlantis             (1983)  ATLANTIS º\necho                 º   8.  Demon Attack         (1983)  DEMONATK º\necho                 º   9.  Frogger              (1983)  FROGGER  º\necho                 º  10.  Pac-Man              (1983)  PACMAN   º\necho                 º                                             º\necho                 º  11.  BASIC prompt                BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'avenger\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'ratrace\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'chopper\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'gorf\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'gridrun\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'omega\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'atlantis\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'demonatk\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'frogger\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'pacman\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'avenger.bat',
                                        link: '../emulators/vic20/play.html?game=avenger'
                                    }, {
                                        name: 'ratrace.bat',
                                        link: '../emulators/vic20/play.html?game=ratrace'
                                    }, {
                                        name: 'gorf.bat',
                                        link: '../emulators/vic20/play.html?game=gorf'
                                    }, {
                                        name: 'omega.bat',
                                        link: '../emulators/vic20/play.html?game=omega'
                                    }, {
                                        name: 'chopper.bat',
                                        link: '../emulators/vic20/play.html?game=chopper'
                                    }, {
                                        name: 'gridrun.bat',
                                        link: '../emulators/vic20/play.html?game=gridrun'
                                    }, {
                                        name: 'frogger.bat',
                                        link: '../emulators/vic20/play.html?game=frogger'
                                    }, {
                                        name: 'pacman.bat',
                                        link: '../emulators/vic20/play.html?game=pacman'
                                    }, {
                                        name: 'atlantis.bat',
                                        link: '../emulators/vic20/play.html?game=atlantis'
                                    }, {
                                        name: 'demonatk.bat',
                                        link: '../emulators/vic20/play.html?game=demonatk'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/vic20/play.html?game=basic'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'MAX',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º       COMMODORE  MAX  MACHINE  GAMES        º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Clowns               (1982)  CLOWNS   º\necho                 º   2.  Jupiter Lander       (1982)  JUPITER  º\necho                 º   3.  Mole Attack          (1982)  MOLATAK  º\necho                 º   4.  Money Wars           (1982)  MONYWARS º\necho                 º   5.  Omega Race           (1982)  OMEGRACE º\necho                 º   6.  Radar Rat Race       (1982)  RRR      º\necho                 º   7.  Slalom               (1982)  SLALOM   º\necho                 º   8.  Speed/Bingo Math     (1982)  SPEEDMTH º\necho                 º   9.  Billiards            (1983)  BILLIARD º\necho                 º  10.  Pinball Spectacular  (1983)  PINBALL  º\necho                 º                                             º\necho                 º  11.  MAX BASIC cartridge         BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'clowns\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'jupiter\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'molatak\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'monywars\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'omegrace\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'rrr\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'slalom\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'speedmth\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'billiard\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'pinball\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'clowns.bat',
                                        link: '../emulators/max/play.html?game=clowns'
                                    }, {
                                        name: 'omegrace.bat',
                                        link: '../emulators/max/play.html?game=omegrace'
                                    }, {
                                        name: 'rrr.bat',
                                        link: '../emulators/max/play.html?game=rrr'
                                    }, {
                                        name: 'jupiter.bat',
                                        link: '../emulators/max/play.html?game=jupiter'
                                    }, {
                                        name: 'molatak.bat',
                                        link: '../emulators/max/play.html?game=molatak'
                                    }, {
                                        name: 'monywars.bat',
                                        link: '../emulators/max/play.html?game=monywars'
                                    }, {
                                        name: 'speedmth.bat',
                                        link: '../emulators/max/play.html?game=speedmth'
                                    }, {
                                        name: 'slalom.bat',
                                        link: '../emulators/max/play.html?game=slalom'
                                    }, {
                                        name: 'billiard.bat',
                                        link: '../emulators/max/play.html?game=billiard'
                                    }, {
                                        name: 'pinball.bat',
                                        link: '../emulators/max/play.html?game=pinball'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/max/play.html?game=basic'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'C64',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  64  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Beach Head           (1983)  BEACHHD  º\necho                 º   2.  Forbidden Forest     (1983)  FORBFRST º\necho                 º   3.  Hunchback            (1983)  HUNCHBCK º\necho                 º   4.  Boulder Dash         (1984)  BOULDER  º\necho                 º   5.  Impossible Mission   (1984)  IMPMISS  º\necho                 º   6.  Elite                (1985)  ELITE    º\necho                 º   7.  Ghosts \'n Goblins    (1986)  GHOSTS   º\necho                 º   8.  International Karate (1986)  INTLKRTE º\necho                 º   9.  The Last Ninja       (1987)  LASTNINJAº\necho                 º  10.  Wizball              (1987)  WIZBALL  º\necho                 º                                             º\necho                 º  11.  BASIC prompt                BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'beachhd\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'forbfrst\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'hunchbck\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'boulder\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'impmiss\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'elite\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'ghosts\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'intlkrte\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'lastninja\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'wizball\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'lastninja.bat',
                                        link: '../emulators/c64/play.html?game=lastninja'
                                    }, {
                                        name: 'impmiss.bat',
                                        link: '../emulators/c64/play.html?game=impmiss'
                                    }, {
                                        name: 'wizball.bat',
                                        link: '../emulators/c64/play.html?game=wizball'
                                    }, {
                                        name: 'elite.bat',
                                        link: '../emulators/c64/play.html?game=elite'
                                    }, {
                                        name: 'intlkrte.bat',
                                        link: '../emulators/c64/play.html?game=intlkrte'
                                    }, {
                                        name: 'beachhd.bat',
                                        link: '../emulators/c64/play.html?game=beachhd'
                                    }, {
                                        name: 'boulder.bat',
                                        link: '../emulators/c64/play.html?game=boulder'
                                    }, {
                                        name: 'forbfrst.bat',
                                        link: '../emulators/c64/play.html?game=forbfrst'
                                    }, {
                                        name: 'ghosts.bat',
                                        link: '../emulators/c64/play.html?game=ghosts'
                                    }, {
                                        name: 'hunchbck.bat',
                                        link: '../emulators/c64/play.html?game=hunchbck'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/c64/play.html?game=basic'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'C16',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  C16  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Fire Ant             (1984)  FIREANT  º\necho                 º   2.  Skramble             (1984)  SKRAMBLE º\necho                 º   3.  Tower of Evil        (1984)  TOWREVIL º\necho                 º   4.  Xargon Wars          (1984)  XARGON   º\necho                 º   5.  Berks                (1985)  BERKS    º\necho                 º   6.  Big Mac              (1985)  BIGMAC   º\necho                 º   7.  Hustler              (1985)  HUSTLER  º\necho                 º   8.  Tom Thumb            (1985)  TOMTHUMB º\necho                 º   9.  Tutti Frutti         (1985)  TUTTIFRT º\necho                 º  10.  Mr. Puniverse        (1986)  PUNIVRSE º\necho                 º                                             º\necho                 º  11.  BASIC 3.5 prompt            BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'fireant\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'skramble\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'towrevil\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'xargon\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'berks\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'bigmac\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'hustler\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'tomthumb\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'tuttifrt\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'punivrse\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'fireant.bat',
                                        link: '../emulators/c16/play.html?game=fireant'
                                    }, {
                                        name: 'skramble.bat',
                                        link: '../emulators/c16/play.html?game=skramble'
                                    }, {
                                        name: 'towrevil.bat',
                                        link: '../emulators/c16/play.html?game=towrevil'
                                    }, {
                                        name: 'xargon.bat',
                                        link: '../emulators/c16/play.html?game=xargon'
                                    }, {
                                        name: 'berks.bat',
                                        link: '../emulators/c16/play.html?game=berks'
                                    }, {
                                        name: 'bigmac.bat',
                                        link: '../emulators/c16/play.html?game=bigmac'
                                    }, {
                                        name: 'hustler.bat',
                                        link: '../emulators/c16/play.html?game=hustler'
                                    }, {
                                        name: 'tomthumb.bat',
                                        link: '../emulators/c16/play.html?game=tomthumb'
                                    }, {
                                        name: 'tuttifrt.bat',
                                        link: '../emulators/c16/play.html?game=tuttifrt'
                                    }, {
                                        name: 'punivrse.bat',
                                        link: '../emulators/c16/play.html?game=punivrse'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/c16/play.html?game=basic'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'PLUS4',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          COMMODORE  PLUS/4  GAMES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Blagger              (1984)  BLAGGER  º\necho                 º   2.  Popeye               (1984)  POPEYE   º\necho                 º   3.  Citadel              (1985)  CITADEL  º\necho                 º   4.  Kikstart             (1985)  KIKSTART º\necho                 º   5.  Punchy               (1985)  PUNCHY   º\necho                 º   6.  Rockman              (1985)  ROCKMAN  º\necho                 º   7.  Saboteur             (1985)  SABOTEUR º\necho                 º   8.  Squirm               (1985)  SQUIRM   º\necho                 º   9.  Mercenary            (1986)  MERCNARY º\necho                 º  10.  Trailblazer          (1986)  TRAILBLZ º\necho                 º                                             º\necho                 º  11.  BASIC 3.5 prompt            BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'blagger\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'popeye\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'citadel\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'kikstart\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'punchy\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'rockman\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'saboteur\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'squirm\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'mercnary\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'trailblz\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'blagger.bat',
                                        link: '../emulators/plus4/play.html?game=blagger'
                                    }, {
                                        name: 'popeye.bat',
                                        link: '../emulators/plus4/play.html?game=popeye'
                                    }, {
                                        name: 'citadel.bat',
                                        link: '../emulators/plus4/play.html?game=citadel'
                                    }, {
                                        name: 'kikstart.bat',
                                        link: '../emulators/plus4/play.html?game=kikstart'
                                    }, {
                                        name: 'punchy.bat',
                                        link: '../emulators/plus4/play.html?game=punchy'
                                    }, {
                                        name: 'rockman.bat',
                                        link: '../emulators/plus4/play.html?game=rockman'
                                    }, {
                                        name: 'saboteur.bat',
                                        link: '../emulators/plus4/play.html?game=saboteur'
                                    }, {
                                        name: 'squirm.bat',
                                        link: '../emulators/plus4/play.html?game=squirm'
                                    }, {
                                        name: 'mercnary.bat',
                                        link: '../emulators/plus4/play.html?game=mercnary'
                                    }, {
                                        name: 'trailblz.bat',
                                        link: '../emulators/plus4/play.html?game=trailblz'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/plus4/play.html?game=basic'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: 'C128',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  128  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  128 Crush            (1985)  CRUSH    º\necho                 º   2.  Rocky Horror Show    (1985)  ROCKYH   º\necho                 º   3.  The Last V8          (1985)  LASTV8   º\necho                 º   4.  Star Fleet I         (1987)  STARFLT1 º\necho                 º   5.  Invaders             (19xx)  INVADERS º\necho                 º   6.  Uniquest             (19xx)  UNIQUEST º\necho                 º   7.  World at War         (2017)  WORLDWAR º\necho                 º   8.  Phazer               (2023)  PHAZER   º\necho                 º   9.  Rockfall 128         (2023)  ROCKFALL º\necho                 º  10.  Wumpus 2.0           (2023)  WUMPUS   º\necho                 º                                             º\necho                 º  11.  BASIC 7.0 prompt            BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'crush\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'rockyh\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'lastv8\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'starflt1\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'invaders\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'uniquest\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'worldwar\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'phazer\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'rockfall\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'wumpus\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'lastv8.bat',
                                        link: '../emulators/c128/play.html?game=lastv8'
                                    }, {
                                        name: 'rockyh.bat',
                                        link: '../emulators/c128/play.html?game=rockyh'
                                    }, {
                                        name: 'crush.bat',
                                        link: '../emulators/c128/play.html?game=crush'
                                    }, {
                                        name: 'worldwar.bat',
                                        link: '../emulators/c128/play.html?game=worldwar'
                                    }, {
                                        name: 'invaders.bat',
                                        link: '../emulators/c128/play.html?game=invaders'
                                    }, {
                                        name: 'wumpus.bat',
                                        link: '../emulators/c128/play.html?game=wumpus'
                                    }, {
                                        name: 'starflt1.bat',
                                        link: '../emulators/c128/play.html?game=starflt1'
                                    }, {
                                        name: 'rockfall.bat',
                                        link: '../emulators/c128/play.html?game=rockfall'
                                    }, {
                                        name: 'phazer.bat',
                                        link: '../emulators/c128/play.html?game=phazer'
                                    }, {
                                        name: 'uniquest.bat',
                                        link: '../emulators/c128/play.html?game=uniquest'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/c128/play.html?game=basic'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },

                        ],
                        files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            COMMODORE  COMPUTERS             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Commodore PET        (1977)  PET      º\necho                 º   2.  Commodore VIC-20     (1980)  VIC20    º\necho                 º   3.  Commodore MAX        (1982)  MAX      º\necho                 º   4.  Commodore 64         (1982)  C64      º\necho                 º   5.  Commodore C16        (1984)  C16      º\necho                 º   6.  Commodore Plus/4     (1984)  PLUS4    º\necho                 º   7.  Commodore 128        (1985)  C128     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            },
                            {
                                name: '1.bat',
                                data: 'cd pet\ncd games\nmenu\n'
                            },
                            {
                                name: '2.bat',
                                data: 'cd vic20\ncd games\nmenu\n'
                            },
                            {
                                name: '3.bat',
                                data: 'cd max\ncd games\nmenu\n'
                            },
                            {
                                name: '4.bat',
                                data: 'cd c64\ncd games\nmenu\n'
                            },
                            {
                                name: '5.bat',
                                data: 'cd c16\ncd games\nmenu\n'
                            },
                            {
                                name: '6.bat',
                                data: 'cd plus4\ncd games\nmenu\n'
                            },
                            {
                                name: '7.bat',
                                data: 'cd c128\ncd games\nmenu\n'
                            },
                            {
                                name: '0.bat',
                                data: 'cd ..\nmenu\n'
                            }
                        ]
                    },

                    // ATARI (placeholder — Atari home computers have no local emulator yet)
                    {
                        name: 'ATARI',
                        directories: [{
                                name: '400',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ATARI  400  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Star Raiders         (1979)  STARRAID º\necho                 º   2.  Space Invaders       (1980)  INVADERS º\necho                 º   3.  Asteroids            (1981)  ASTEROID º\necho                 º   4.  Defender             (1981)  DEFENDER º\necho                 º   5.  Missile Command      (1981)  MISSILE  º\necho                 º   6.  Centipede            (1982)  CENTIPED º\necho                 º   7.  Choplifter           (1982)  CHOPLIFTRº\necho                 º   8.  Pac-Man              (1982)  PACMAN   º\necho                 º   9.  Dig Dug              (1983)  DIGDUG   º\necho                 º  10.  Donkey Kong          (1983)  DKONG    º\necho                 º  11.  Joust                (1983)  JOUST    º\necho                 º                                             º\necho                 º  12.  Atari BASIC prompt           BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'starraid\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'invaders\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'asteroid\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'defender\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'missile\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'centiped\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'chopliftr\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'pacman\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'digdug\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'dkong\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'joust\n'
                                    }, {
                                        name: '12.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'starraid.bat',
                                        link: '../emulators/atari800/play.html?game=starraid&machine=atari'
                                    }, {
                                        name: 'missile.bat',
                                        link: '../emulators/atari800/play.html?game=missile&machine=atari'
                                    }, {
                                        name: 'asteroid.bat',
                                        link: '../emulators/atari800/play.html?game=asteroid&machine=atari'
                                    }, {
                                        name: 'defender.bat',
                                        link: '../emulators/atari800/play.html?game=defender&machine=atari'
                                    }, {
                                        name: 'invaders.bat',
                                        link: '../emulators/atari800/play.html?game=invaders&machine=atari'
                                    }, {
                                        name: 'pacman.bat',
                                        link: '../emulators/atari800/play.html?game=pacman&machine=atari'
                                    }, {
                                        name: 'centiped.bat',
                                        link: '../emulators/atari800/play.html?game=centiped&machine=atari'
                                    }, {
                                        name: 'chopliftr.bat',
                                        link: '../emulators/atari800/play.html?game=chopliftr&machine=atari'
                                    }, {
                                        name: 'dkong.bat',
                                        link: '../emulators/atari800/play.html?game=dkong&machine=atari'
                                    }, {
                                        name: 'joust.bat',
                                        link: '../emulators/atari800/play.html?game=joust&machine=atari'
                                    }, {
                                        name: 'digdug.bat',
                                        link: '../emulators/atari800/play.html?game=digdug&machine=atari'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/atari800/play.html?machine=atari'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            },
                            {
                                name: '800XL',
                                directories: [{
                                    name: 'GAMES',
                                    directories: [],
                                    files: [{
                                        name: 'menu.bat',
                                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             ATARI  800XL  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Star Raiders         (1979)  STARRAID º\necho                 º   2.  Eastern Front 1941   (1981)  EASTFRNT º\necho                 º   3.  Miner 2049er         (1982)  MINER2K  º\necho                 º   4.  Archon               (1983)  ARCHON   º\necho                 º   5.  M.U.L.E.             (1983)  MULE     º\necho                 º   6.  Pole Position        (1983)  POLEPOS  º\necho                 º   7.  Boulder Dash         (1984)  BOULDER  º\necho                 º   8.  Bruce Lee            (1984)  BRUCELEE º\necho                 º   9.  Ballblazer           (1985)  BALLBLZR º\necho                 º  10.  Rescue on Fractalus! (1985)  FRACTLUS º\necho                 º                                             º\necho                 º  11.  Atari BASIC prompt           BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                    }, {
                                        name: '0.bat',
                                        data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                    }, {
                                        name: '1.bat',
                                        data: 'starraid\n'
                                    }, {
                                        name: '2.bat',
                                        data: 'eastfrnt\n'
                                    }, {
                                        name: '3.bat',
                                        data: 'miner2k\n'
                                    }, {
                                        name: '4.bat',
                                        data: 'archon\n'
                                    }, {
                                        name: '5.bat',
                                        data: 'mule\n'
                                    }, {
                                        name: '6.bat',
                                        data: 'polepos\n'
                                    }, {
                                        name: '7.bat',
                                        data: 'boulder\n'
                                    }, {
                                        name: '8.bat',
                                        data: 'brucelee\n'
                                    }, {
                                        name: '9.bat',
                                        data: 'ballblzr\n'
                                    }, {
                                        name: '10.bat',
                                        data: 'fractlus\n'
                                    }, {
                                        name: '11.bat',
                                        data: 'basic\n'
                                    }, {
                                        name: 'starraid.bat',
                                        link: '../emulators/atari800/play.html?game=starraid'
                                    }, {
                                        name: 'mule.bat',
                                        link: '../emulators/atari800/play.html?game=mule'
                                    }, {
                                        name: 'boulder.bat',
                                        link: '../emulators/atari800/play.html?game=boulder'
                                    }, {
                                        name: 'archon.bat',
                                        link: '../emulators/atari800/play.html?game=archon'
                                    }, {
                                        name: 'ballblzr.bat',
                                        link: '../emulators/atari800/play.html?game=ballblzr'
                                    }, {
                                        name: 'fractlus.bat',
                                        link: '../emulators/atari800/play.html?game=fractlus'
                                    }, {
                                        name: 'brucelee.bat',
                                        link: '../emulators/atari800/play.html?game=brucelee'
                                    }, {
                                        name: 'miner2k.bat',
                                        link: '../emulators/atari800/play.html?game=miner2k'
                                    }, {
                                        name: 'polepos.bat',
                                        link: '../emulators/atari800/play.html?game=polepos'
                                    }, {
                                        name: 'eastfrnt.bat',
                                        link: '../emulators/atari800/play.html?game=eastfrnt'
                                    }, {
                                        name: 'basic.bat',
                                        link: '../emulators/atari800/play.html'
                                    }]
                                }],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncd games\nmenu\necho.\n'
                                }]
                            }
                        ],
                        files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              ATARI  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atari 400            (1979)  400      º\necho                 º   2.  Atari 800XL          (1983)  800XL    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            },
                            {
                                name: '1.bat',
                                data: 'cd 400\ncd games\nmenu\n'
                            },
                            {
                                name: '2.bat',
                                data: 'cd 800xl\ncd games\nmenu\n'
                            },
                            {
                                name: '0.bat',
                                data: 'cd ..\nmenu\n'
                            }
                        ]
                    },

                    // SINCLAIR (Spectrum + ZX81)
                    {
                        name: 'SINCLAIR',
                        directories: [{
                            name: 'SPECTRUM',
                            directories: [{
                                name: 'GAMES',
                                directories: [],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º          SINCLAIR  SPECTRUM  GAMES          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Atic Atac            (1983)  ATATAC   º\necho                 º   2.  Chuckie Egg          (1983)  CHUCKEGG º\necho                 º   3.  Manic Miner          (1983)  MANICMN  º\necho                 º   4.  Pssst                (1983)  PSSST    º\necho                 º   5.  Jet Set Willy        (1984)  JETWILLY º\necho                 º   6.  Knight Lore          (1984)  KNGTLORE º\necho                 º   7.  Sabre Wulf           (1984)  SABRWULF º\necho                 º   8.  Skool Daze           (1984)  SKOOLDZD º\necho                 º   9.  Underwurlde          (1984)  UWURLDE  º\necho                 º  10.  Dizzy                (1987)  DIZZY    º\necho                 º                                             º\necho                 º  11.  ZX BASIC prompt              BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                }, {
                                    name: '0.bat',
                                    data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                }, {
                                    name: '1.bat',
                                    data: 'atatac\n'
                                }, {
                                    name: '2.bat',
                                    data: 'chuckegg\n'
                                }, {
                                    name: '3.bat',
                                    data: 'manicmn\n'
                                }, {
                                    name: '4.bat',
                                    data: 'pssst\n'
                                }, {
                                    name: '5.bat',
                                    data: 'jetwilly\n'
                                }, {
                                    name: '6.bat',
                                    data: 'kngtlore\n'
                                }, {
                                    name: '7.bat',
                                    data: 'sabrwulf\n'
                                }, {
                                    name: '8.bat',
                                    data: 'skooldzd\n'
                                }, {
                                    name: '9.bat',
                                    data: 'uwurlde\n'
                                }, {
                                    name: '10.bat',
                                    data: 'dizzy\n'
                                }, {
                                    name: '11.bat',
                                    data: 'basic\n'
                                }, {
                                    name: 'basic.bat',
                                    link: '../emulators/jsspeccy/play.html'
                                }, {
                                    name: 'manicmn.bat',
                                    link: '../emulators/jsspeccy/play.html?game=manicmn'
                                }, {
                                    name: 'jetwilly.bat',
                                    link: '../emulators/jsspeccy/play.html?game=jetwilly'
                                }, {
                                    name: 'chuckegg.bat',
                                    link: '../emulators/jsspeccy/play.html?game=chuckegg'
                                }, {
                                    name: 'sabrwulf.bat',
                                    link: '../emulators/jsspeccy/play.html?game=sabrwulf'
                                }, {
                                    name: 'kngtlore.bat',
                                    link: '../emulators/jsspeccy/play.html?game=kngtlore'
                                }, {
                                    name: 'atatac.bat',
                                    link: '../emulators/jsspeccy/play.html?game=atatac'
                                }, {
                                    name: 'pssst.bat',
                                    link: '../emulators/jsspeccy/play.html?game=pssst'
                                }, {
                                    name: 'uwurlde.bat',
                                    link: '../emulators/jsspeccy/play.html?game=uwurlde'
                                }, {
                                    name: 'dizzy.bat',
                                    link: '../emulators/jsspeccy/play.html?game=dizzy'
                                }, {
                                    name: 'skooldzd.bat',
                                    link: '../emulators/jsspeccy/play.html?game=skooldzd'
                                }]
                            }],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n'
                            }]
                        }, {
                            name: 'ZX81',
                            directories: [{
                                name: 'GAMES',
                                directories: [],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º            SINCLAIR  ZX81  GAMES            º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  3D Monster Maze      (1981)  MONSTMZE º\necho                 º   2.  Chess (Psion)        (1981)  CHESS    º\necho                 º   3.  Mazogs               (1981)  MAZOGS   º\necho                 º   4.  Black Crystal        (1982)  BLKCRYST º\necho                 º   5.  City of Xon          (1982)  CITYXON  º\necho                 º   6.  Frogger              (1982)  FROGGER  º\necho                 º   7.  Galaxians            (1982)  GALAXIAN º\necho                 º   8.  3D Grand Prix        (1983)  GP3D     º\necho                 º   9.  Maze Death Race      (1983)  MAZERACE º\necho                 º  10.  Night Gunner         (1983)  NIGHTGUN º\necho                 º                                             º\necho                 º  11.  ZX81 BASIC prompt            BASIC    º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                }, {
                                    name: '0.bat',
                                    data: 'echo off\ncd ..\ncd ..\nmenu\n'
                                }, {
                                    name: '1.bat',
                                    data: 'monstmze\n'
                                }, {
                                    name: '2.bat',
                                    data: 'chess\n'
                                }, {
                                    name: '3.bat',
                                    data: 'mazogs\n'
                                }, {
                                    name: '4.bat',
                                    data: 'blkcryst\n'
                                }, {
                                    name: '5.bat',
                                    data: 'cityxon\n'
                                }, {
                                    name: '6.bat',
                                    data: 'frogger\n'
                                }, {
                                    name: '7.bat',
                                    data: 'galaxian\n'
                                }, {
                                    name: '8.bat',
                                    data: 'gp3d\n'
                                }, {
                                    name: '9.bat',
                                    data: 'mazerace\n'
                                }, {
                                    name: '10.bat',
                                    data: 'nightgun\n'
                                }, {
                                    name: '11.bat',
                                    data: 'basic\n'
                                }, {
                                    name: 'basic.bat',
                                    link: '../emulators/jtyone/play.html'
                                }, {
                                    name: 'monstmze.bat',
                                    link: '../emulators/jtyone/play.html?game=monstmze'
                                }, {
                                    name: 'mazogs.bat',
                                    link: '../emulators/jtyone/play.html?game=mazogs'
                                }, {
                                    name: 'nightgun.bat',
                                    link: '../emulators/jtyone/play.html?game=nightgun'
                                }, {
                                    name: 'galaxian.bat',
                                    link: '../emulators/jtyone/play.html?game=galaxian'
                                }, {
                                    name: 'chess.bat',
                                    link: '../emulators/jtyone/play.html?game=chess'
                                }, {
                                    name: 'frogger.bat',
                                    link: '../emulators/jtyone/play.html?game=frogger'
                                }, {
                                    name: 'cityxon.bat',
                                    link: '../emulators/jtyone/play.html?game=cityxon'
                                }, {
                                    name: 'blkcryst.bat',
                                    link: '../emulators/jtyone/play.html?game=blkcryst'
                                }, {
                                    name: 'gp3d.bat',
                                    link: '../emulators/jtyone/play.html?game=gp3d'
                                }, {
                                    name: 'mazerace.bat',
                                    link: '../emulators/jtyone/play.html?game=mazerace'
                                }]
                            }],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n'
                            }]
                        }],
                        files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             SINCLAIR  COMPUTERS             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Sinclair ZX81        (1981)  ZX81     º\necho                 º   2.  Sinclair Spectrum    (1982)  SPECTRUM º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            },
                            {
                                name: '1.bat',
                                data: 'cd zx81\ncd games\nmenu\n'
                            },
                            {
                                name: '2.bat',
                                data: 'cd spectrum\ncd games\nmenu\n'
                            },
                            {
                                name: '0.bat',
                                data: 'cd ..\nmenu\n'
                            }
                        ]
                    },
                    {
                        name: 'CPC',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             AMSTRAD  CPC  GAMES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Bruce Lee            (1984)  BRUCE    º\necho                 º   2.  Roland on the Run    (1984)  ROLAND   º\necho                 º   3.  Elite                (1985)  ELITE    º\necho                 º   4.  Knight Lore          (1985)  KNIGHT   º\necho                 º   5.  Bomb Jack            (1986)  BOMBJACK º\necho                 º   6.  Get Dexter           (1986)  DEXTER   º\necho                 º   7.  Head over Heels      (1987)  HEADOVER º\necho                 º   8.  Chase H.Q.           (1989)  CHASEHQ  º\necho                 º   9.  Rick Dangerous       (1989)  RICK     º\necho                 º  10.  3D Construction Kit  (1991)  3DKIT    º\necho                 º                                             º\necho                 º  11.  Locomotive BASIC prompt     BASIC     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'bruce\n'
                            }, {
                                name: '2.bat',
                                data: 'roland\n'
                            }, {
                                name: '3.bat',
                                data: 'elite\n'
                            }, {
                                name: '4.bat',
                                data: 'knight\n'
                            }, {
                                name: '5.bat',
                                data: 'bombjack\n'
                            }, {
                                name: '6.bat',
                                data: 'dexter\n'
                            }, {
                                name: '7.bat',
                                data: 'headover\n'
                            }, {
                                name: '8.bat',
                                data: 'chasehq\n'
                            }, {
                                name: '9.bat',
                                data: 'rick\n'
                            }, {
                                name: '10.bat',
                                data: '3dkit\n'
                            }, {
                                name: '11.bat',
                                data: 'basic\n'
                            }, {
                                name: 'basic.bat',
                                link: '../emulators/amstradcpc/play.html'
                            }, {
                                name: '3dkit.bat',
                                link: '../emulators/amstradcpc/play.html?game=3dkit'
                            }, {
                                name: 'roland.bat',
                                link: '../emulators/amstradcpc/play.html?game=roland'
                            }, {
                                name: 'knight.bat',
                                link: '../emulators/amstradcpc/play.html?game=knight'
                            }, {
                                name: 'bruce.bat',
                                link: '../emulators/amstradcpc/play.html?game=bruce'
                            }, {
                                name: 'elite.bat',
                                link: '../emulators/amstradcpc/play.html?game=elite'
                            }, {
                                name: 'bombjack.bat',
                                link: '../emulators/amstradcpc/play.html?game=bombjack'
                            }, {
                                name: 'dexter.bat',
                                link: '../emulators/amstradcpc/play.html?game=dexter'
                            }, {
                                name: 'headover.bat',
                                link: '../emulators/amstradcpc/play.html?game=headover'
                            }, {
                                name: 'rick.bat',
                                link: '../emulators/amstradcpc/play.html?game=rick'
                            }, {
                                name: 'chasehq.bat',
                                link: '../emulators/amstradcpc/play.html?game=chasehq'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\necho.\n'
                        }]
                    },
                    {
                        name: 'COCO',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             TANDY  COCO  GAMES              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Mega-Bug             (1981)  MEGABUG  º\necho                 º   2.  Poltergeist          (1981)  POLTRGST º\necho                 º   3.  Popcorn              (1981)  POPCORN  º\necho                 º   4.  Canyon Climber       (1982)  CANYON   º\necho                 º   5.  Demon Attack         (1982)  DEMON    º\necho                 º   6.  Daggorath            (1982)  DAGGOR   º\necho                 º   7.  Monster Maze         (1982)  MONSTRMZ º\necho                 º   8.  Downland             (1983)  DOWNLAND º\necho                 º   9.  Galactic Attack      (1983)  GALACTIC º\necho                 º  10.  Polaris              (1983)  POLARIS  º\necho                 º                                             º\necho                 º  11.  Color BASIC prompt           PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'megabug\n'
                            }, {
                                name: '2.bat',
                                data: 'poltrgst\n'
                            }, {
                                name: '3.bat',
                                data: 'popcorn\n'
                            }, {
                                name: '4.bat',
                                data: 'canyon\n'
                            }, {
                                name: '5.bat',
                                data: 'demon\n'
                            }, {
                                name: '6.bat',
                                data: 'daggor\n'
                            }, {
                                name: '7.bat',
                                data: 'monstrmz\n'
                            }, {
                                name: '8.bat',
                                data: 'downland\n'
                            }, {
                                name: '9.bat',
                                data: 'galactic\n'
                            }, {
                                name: '10.bat',
                                data: 'polaris\n'
                            }, {
                                name: '11.bat',
                                data: 'prompt\n'
                            }, {
                                name: 'daggor.bat',
                                link: '../emulators/xroar/play.html?game=daggor'
                            }, {
                                name: 'downland.bat',
                                link: '../emulators/xroar/play.html?game=downland'
                            }, {
                                name: 'canyon.bat',
                                link: '../emulators/xroar/play.html?game=canyon'
                            }, {
                                name: 'demon.bat',
                                link: '../emulators/xroar/play.html?game=demon'
                            }, {
                                name: 'polaris.bat',
                                link: '../emulators/xroar/play.html?game=polaris'
                            }, {
                                name: 'galactic.bat',
                                link: '../emulators/xroar/play.html?game=galactic'
                            }, {
                                name: 'popcorn.bat',
                                link: '../emulators/xroar/play.html?game=popcorn'
                            }, {
                                name: 'megabug.bat',
                                link: '../emulators/xroar/play.html?game=megabug'
                            }, {
                                name: 'poltrgst.bat',
                                link: '../emulators/xroar/play.html?game=poltrgst'
                            }, {
                                name: 'monstrmz.bat',
                                link: '../emulators/xroar/play.html?game=monstrmz'
                            }, {
                                name: 'prompt.bat',
                                link: '../emulators/xroar/play.html'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\necho.\n'
                        }]
                    },

                    // TI-99/4A
                    {
                        name: 'TI99',
                        directories: [{
                            name: 'GAMES',
                            directories: [],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           TI-99/4A  -  CARTRIDGES           º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Hunt the Wumpus      (1980)  WUMPUS   º\necho                 º   2.  Car Wars             (1981)  CARWARS  º\necho                 º   3.  TI Invaders          (1981)  TIINVAD  º\necho                 º   4.  Tombstone City       (1981)  TMBCITY  º\necho                 º   5.  Alpiner              (1982)  ALPINER  º\necho                 º   6.  Microsurgeon         (1982)  MICROSRG º\necho                 º   7.  Munch Man            (1982)  MUNCHMAN º\necho                 º   8.  Parsec               (1982)  PARSEC   º\necho                 º   9.  Tunnels of Doom      (1982)  DOOM     º\necho                 º  10.  Buck Rogers          (1983)  BUCKRGRS º\necho                 º                                             º\necho                 º  11.  TI BASIC prompt              PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                            }, {
                                name: '0.bat',
                                data: 'echo off\ncd ..\ncd ..\nmenu\n'
                            }, {
                                name: '1.bat',
                                data: 'wumpus\n'
                            }, {
                                name: '2.bat',
                                data: 'carwars\n'
                            }, {
                                name: '3.bat',
                                data: 'tiinvad\n'
                            }, {
                                name: '4.bat',
                                data: 'tmbcity\n'
                            }, {
                                name: '5.bat',
                                data: 'alpiner\n'
                            }, {
                                name: '6.bat',
                                data: 'microsrg\n'
                            }, {
                                name: '7.bat',
                                data: 'munchman\n'
                            }, {
                                name: '8.bat',
                                data: 'parsec\n'
                            }, {
                                name: '9.bat',
                                data: 'doom\n'
                            }, {
                                name: '10.bat',
                                data: 'buckrgrs\n'
                            }, {
                                name: '11.bat',
                                data: 'prompt\n'
                            }, {
                                name: 'wumpus.bat',
                                link: '../emulators/js99er/play.html?game=wumpus'
                            }, {
                                name: 'carwars.bat',
                                link: '../emulators/js99er/play.html?game=carwars'
                            }, {
                                name: 'tiinvad.bat',
                                link: '../emulators/js99er/play.html?game=tiinvad'
                            }, {
                                name: 'tmbcity.bat',
                                link: '../emulators/js99er/play.html?game=tmbcity'
                            }, {
                                name: 'alpiner.bat',
                                link: '../emulators/js99er/play.html?game=alpiner'
                            }, {
                                name: 'microsrg.bat',
                                link: '../emulators/js99er/play.html?game=microsrg'
                            }, {
                                name: 'munchman.bat',
                                link: '../emulators/js99er/play.html?game=munchman'
                            }, {
                                name: 'parsec.bat',
                                link: '../emulators/js99er/play.html?game=parsec'
                            }, {
                                name: 'doom.bat',
                                link: '../emulators/js99er/play.html?game=doom'
                            }, {
                                name: 'buckrgrs.bat',
                                link: '../emulators/js99er/play.html?game=buckrgrs'
                            }, {
                                name: 'prompt.bat',
                                link: '../emulators/js99er/play.html'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncd games\nmenu\necho.\n'
                        }]
                    },

                    // MSX
                    {
                        name: 'MSX',
                        directories: [{
                            name: 'MSX1',
                            directories: [{
                                name: 'GAMES',
                                directories: [],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             MSX1  -  CARTRIDGES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Antarctic Adventure  (1983)  ANTRCTIC º\necho                 º   2.  Athletic Land        (1984)  ATHLETIC º\necho                 º   3.  Eggerland Mystery    (1985)  EGGRLAND º\necho                 º   4.  King\'s Valley        (1985)  KINGSVAL º\necho                 º   5.  Pippols              (1985)  PIPPOLS  º\necho                 º   6.  Road Fighter         (1985)  ROADFGTR º\necho                 º   7.  Yie Ar Kung-Fu       (1985)  YIEARKF  º\necho                 º   8.  Knightmare           (1986)  KNIGHTMR º\necho                 º   9.  Nemesis              (1986)  NEMESIS  º\necho                 º  10.  The Goonies          (1986)  GOONIES  º\necho                 º                                             º\necho                 º  11.  MSX BASIC prompt             PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                }, {
                                    name: '0.bat',
                                    data: 'echo off\ncd ..\ncd ..\ncd ..\nmenu\n'
                                }, {
                                    name: '1.bat',
                                    data: 'antrctic\n'
                                }, {
                                    name: '2.bat',
                                    data: 'athletic\n'
                                }, {
                                    name: '3.bat',
                                    data: 'eggrland\n'
                                }, {
                                    name: '4.bat',
                                    data: 'kingsval\n'
                                }, {
                                    name: '5.bat',
                                    data: 'pippols\n'
                                }, {
                                    name: '6.bat',
                                    data: 'roadfgtr\n'
                                }, {
                                    name: '7.bat',
                                    data: 'yiearkf\n'
                                }, {
                                    name: '8.bat',
                                    data: 'knightmr\n'
                                }, {
                                    name: '9.bat',
                                    data: 'nemesis\n'
                                }, {
                                    name: '10.bat',
                                    data: 'goonies\n'
                                }, {
                                    name: '11.bat',
                                    data: 'prompt\n'
                                }, {
                                    name: 'antrctic.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/antarcticadv.zip&M=MSX1&game=antrctic'
                                }, {
                                    name: 'athletic.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/athleticland.zip&M=MSX1&game=athletic'
                                }, {
                                    name: 'pippols.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/pippols.zip&M=MSX1&game=pippols'
                                }, {
                                    name: 'roadfgtr.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/roadfighter.zip&M=MSX1&game=roadfgtr'
                                }, {
                                    name: 'kingsval.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/kingsvalley.zip&M=MSX1&game=kingsval'
                                }, {
                                    name: 'yiearkf.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/yiearkungfu.zip&M=MSX1&game=yiearkf'
                                }, {
                                    name: 'eggrland.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/eggerland.zip&M=MSX1&game=eggrland'
                                }, {
                                    name: 'knightmr.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/knightmare.zip&M=MSX1&game=knightmr'
                                }, {
                                    name: 'nemesis.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/nemesis.zip&M=MSX1&game=nemesis'
                                }, {
                                    name: 'goonies.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx1/goonies.zip&M=MSX1&game=goonies'
                                }, {
                                    name: 'prompt.bat',
                                    link: '../emulators/webmsx/?M=MSX1'
                                }]
                            }],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n'
                            }]
                        }, {
                            name: 'MSX2',
                            directories: [{
                                name: 'GAMES',
                                directories: [],
                                files: [{
                                    name: 'menu.bat',
                                    data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º           MSX2  -  CARTS  &  DISKS          º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Castle Excellent     (1986)  CASTLEEX º\necho                 º   2.  King Kong 2          (1986)  KINGKNG2 º\necho                 º   3.  Vampire Killer       (1986)  VAMPKILL º\necho                 º   4.  F-1 Spirit           (1987)  F1SPIRIT º\necho                 º   5.  Metal Gear           (1987)  METLGEAR º\necho                 º   6.  The Treasure of Usas (1987)  USAS     º\necho                 º   7.  Aleste               (1988)  ALESTE   º\necho                 º   8.  Parodius Da!         (1988)  PARODIUS º\necho                 º   9.  Space Manbow         (1989)  MANBOW   º\necho                 º  10.  SD Snatcher          (1990)  SDSNATCH º\necho                 º                                             º\necho                 º  11.  MSX BASIC prompt             PROMPT   º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                                }, {
                                    name: '0.bat',
                                    data: 'echo off\ncd ..\ncd ..\ncd ..\nmenu\n'
                                }, {
                                    name: '1.bat',
                                    data: 'castleex\n'
                                }, {
                                    name: '2.bat',
                                    data: 'kingkng2\n'
                                }, {
                                    name: '3.bat',
                                    data: 'vampkill\n'
                                }, {
                                    name: '4.bat',
                                    data: 'f1spirit\n'
                                }, {
                                    name: '5.bat',
                                    data: 'metlgear\n'
                                }, {
                                    name: '6.bat',
                                    data: 'usas\n'
                                }, {
                                    name: '7.bat',
                                    data: 'aleste\n'
                                }, {
                                    name: '8.bat',
                                    data: 'parodius\n'
                                }, {
                                    name: '9.bat',
                                    data: 'manbow\n'
                                }, {
                                    name: '10.bat',
                                    data: 'sdsnatch\n'
                                }, {
                                    name: '11.bat',
                                    data: 'prompt\n'
                                }, {
                                    name: 'vampkill.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/vampirekill.zip&game=vampkill'
                                }, {
                                    name: 'castleex.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/castleexcl.zip&game=castleex'
                                }, {
                                    name: 'kingkng2.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/kingkong2.zip&game=kingkng2'
                                }, {
                                    name: 'metlgear.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/metalgear.zip&game=metlgear'
                                }, {
                                    name: 'usas.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/usas.zip&game=usas'
                                }, {
                                    name: 'f1spirit.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/f1spirit.zip&game=f1spirit'
                                }, {
                                    name: 'aleste.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/aleste.zip&game=aleste'
                                }, {
                                    name: 'parodius.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/parodius.zip&game=parodius'
                                }, {
                                    name: 'manbow.bat',
                                    link: '../emulators/webmsx/?ROM=games/msx2/spacemanbow.zip&game=manbow'
                                }, {
                                    name: 'sdsnatch.bat',
                                    link: '../emulators/webmsx/?ANY=games/msx2/sdsnatcher.zip&game=sdsnatch'
                                }, {
                                    name: 'prompt.bat',
                                    link: '../emulators/webmsx/'
                                }]
                            }],
                            files: [{
                                name: 'menu.bat',
                                data: 'echo off\ncd games\nmenu\necho.\n'
                            }]
                        }],
                        files: [{
                            name: 'menu.bat',
                            data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                MSX  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  MSX                  (1983)  MSX1     º\necho                 º   2.  MSX2                 (1986)  MSX2     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                        }, {
                            name: '1.bat',
                            data: 'cd msx1\ncd games\nmenu\n'
                        }, {
                            name: '2.bat',
                            data: 'cd msx2\ncd games\nmenu\n'
                        }, {
                            name: '0.bat',
                            data: 'cd ..\nmenu\n'
                        }]
                    },

                ],
                files: [{
                        name: 'menu.bat',
                        data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º               HOME  COMPUTERS               º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Acorn                (1981)  ACORN    º\necho                 º   2.  Amstrad              (1984)  CPC      º\necho                 º   3.  Apple                (1976)  APPLE    º\necho                 º   4.  Atari                (1979)  ATARI    º\necho                 º   5.  Commodore            (1977)  COMMODRE º\necho                 º   6.  MSX                  (1983)  MSX      º\necho                 º   7.  Sinclair             (1981)  SINCLAIR º\necho                 º   8.  Tandy                (1980)  COCO     º\necho                 º   9.  Texas Instruments    (1979)  TI99     º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
                    },
                    {
                        name: '1.bat',
                        data: 'cd acorn\nmenu\n'
                    },
                    {
                        name: '2.bat',
                        data: 'cd cpc\ncd games\nmenu\n'
                    },
                    {
                        name: '3.bat',
                        data: 'cd apple\nmenu\n'
                    },
                    {
                        name: '4.bat',
                        data: 'cd atari\nmenu\n'
                    },
                    {
                        name: '5.bat',
                        data: 'cd commodre\nmenu\n'
                    },
                    {
                        name: '6.bat',
                        data: 'cd msx\nmenu\n'
                    },
                    {
                        name: '7.bat',
                        data: 'cd sinclair\nmenu\n'
                    },
                    {
                        name: '8.bat',
                        data: 'cd coco\ncd games\nmenu\n'
                    },
                    {
                        name: '9.bat',
                        data: 'cd ti99\ncd games\nmenu\n'
                    },
                    {
                        name: '0.bat',
                        data: 'cd ..\nmenu\n'
                    }
                ]
            },

            {
                name: 'HANDHELD',
                directories: [{
                    name: 'GAMEBOY',
                    directories: [{
                        name: 'GAMES',
                        files: [
                            { name: 'menu.bat', data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             NINTENDO  GAME  BOY             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Tetris               (1989)  TETRIS   º\necho                 º   2.  Super Mario Land     (1989)  SMLAND   º\necho                 º   3.  Castlevania          (1989)  CASTLEV  º\necho                 º   4.  Metroid II           (1991)  METROID2 º\necho                 º   5.  Kirby\'s Dream Land   (1992)  KIRBY    º\necho                 º   6.  Link\'s Awakening     (1993)  ZELDA    º\necho                 º   7.  Donkey Kong          (1994)  DKONG    º\necho                 º   8.  Pokemon Red          (1996)  POKEMON  º\necho                 º   9.  Wario Land 3         (2000)  WARIO3   º\necho                 º  10.  Shantae              (2002)  SHANTAE  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n' },
                            { name: '1.bat', data: 'tetris\n' },
                            { name: '2.bat', data: 'smland\n' },
                            { name: '3.bat', data: 'castlev\n' },
                            { name: '4.bat', data: 'metroid2\n' },
                            { name: '5.bat', data: 'kirby\n' },
                            { name: '6.bat', data: 'zelda\n' },
                            { name: '7.bat', data: 'dkong\n' },
                            { name: '8.bat', data: 'pokemon\n' },
                            { name: '9.bat', data: 'wario3\n' },
                            { name: '10.bat', data: 'shantae\n' },
                            { name: '0.bat', data: 'echo off\ncd ..\ncd ..\nmenu\n' },
                            { name: 'tetris.bat', link: '../emulators/gbc/play.html?game=tetris' },
                            { name: 'smland.bat', link: '../emulators/gbc/play.html?game=smland' },
                            { name: 'castlev.bat', link: '../emulators/gbc/play.html?game=castlev' },
                            { name: 'metroid2.bat', link: '../emulators/gbc/play.html?game=metroid2' },
                            { name: 'kirby.bat', link: '../emulators/gbc/play.html?game=kirby' },
                            { name: 'zelda.bat', link: '../emulators/gbc/play.html?game=zelda' },
                            { name: 'dkong.bat', link: '../emulators/gbc/play.html?game=dkong' },
                            { name: 'pokemon.bat', link: '../emulators/gbc/play.html?game=pokemon' },
                            { name: 'wario3.bat', link: '../emulators/gbc/play.html?game=wario3' },
                            { name: 'shantae.bat', link: '../emulators/gbc/play.html?game=shantae' }
                        ]
                    }]
                }, {
                    name: 'LYNX',
                    directories: [{
                        name: 'GAMES',
                        files: [
                            { name: 'menu.bat', data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º                 ATARI  LYNX                 º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  California Games     (1989)  CALGAMES º\necho                 º   2.  Chip\'s Challenge     (1989)  CHIPS    º\necho                 º   3.  Electrocop           (1989)  ELECTRO  º\necho                 º   4.  Blue Lightning       (1989)  BLUELGHT º\necho                 º   5.  Warbirds             (1989)  WARBIRDS º\necho                 º   6.  Gauntlet III         (1990)  GAUNTLET º\necho                 º   7.  Klax                 (1990)  KLAX     º\necho                 º   8.  Slime World          (1990)  SLIME    º\necho                 º   9.  S.T.U.N. Runner      (1991)  STUNRUN  º\necho                 º  10.  Rampart              (1991)  RAMPART  º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n' },
                            { name: '1.bat', data: 'calgames\n' },
                            { name: '2.bat', data: 'chips\n' },
                            { name: '3.bat', data: 'electro\n' },
                            { name: '4.bat', data: 'bluelght\n' },
                            { name: '5.bat', data: 'warbirds\n' },
                            { name: '6.bat', data: 'gauntlet\n' },
                            { name: '7.bat', data: 'klax\n' },
                            { name: '8.bat', data: 'slime\n' },
                            { name: '9.bat', data: 'stunrun\n' },
                            { name: '10.bat', data: 'rampart\n' },
                            { name: '0.bat', data: 'echo off\ncd ..\ncd ..\nmenu\n' },
                            { name: 'calgames.bat', link: '../emulators/lynx/play.html?game=calgames' },
                            { name: 'chips.bat', link: '../emulators/lynx/play.html?game=chips' },
                            { name: 'electro.bat', link: '../emulators/lynx/play.html?game=electro' },
                            { name: 'bluelght.bat', link: '../emulators/lynx/play.html?game=bluelght' },
                            { name: 'warbirds.bat', link: '../emulators/lynx/play.html?game=warbirds' },
                            { name: 'gauntlet.bat', link: '../emulators/lynx/play.html?game=gauntlet' },
                            { name: 'klax.bat', link: '../emulators/lynx/play.html?game=klax' },
                            { name: 'slime.bat', link: '../emulators/lynx/play.html?game=slime' },
                            { name: 'stunrun.bat', link: '../emulators/lynx/play.html?game=stunrun' },
                            { name: 'rampart.bat', link: '../emulators/lynx/play.html?game=rampart' }
                        ]
                    }]
                }],
                files: [
                    { name: 'menu.bat', data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º              HANDHELD  CONSOLES             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Nintendo Game Boy    (1989)  GAMEBOY  º\necho                 º                                             º\necho                 º   2.  Atari Lynx           (1989)  LYNX     º\necho                 º                                             º\necho                 º   3.  Sega Game Gear       (1990)  GAMEGEAR º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n' },
                    { name: '1.bat', data: 'cd gameboy\ncd games\nmenu\n' },
                    { name: '2.bat', data: 'cd lynx\ncd games\nmenu\n' },
                    { name: '3.bat', data: 'echo off\ncls\necho.\necho.\necho      Sega Game Gear -- coming soon!\necho.\necho      Type  MENU  to return.\necho.\n' },
                    { name: '0.bat', data: 'echo off\ncd ..\nmenu\n' }
                ]
            },
        ],
        files: [{
                name: 'menu.bat',
                data: 'echo off\ncls\necho                 ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»\necho                 º             EMULATOR  LAUNCHER              º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º                                             º\necho                 º   1.  Home Computers            HOMECOMP    º\necho                 º                                             º\necho                 º   2.  Games Consoles            CONSOLE     º\necho                 º                                             º\necho                 º   3.  Handheld Consoles         HANDHELD    º\necho                 º                                             º\necho                 º                                             º\necho                 º   4.  GenX-DOS Wiki             WIKI        º\necho                 º                                             º\necho                 º   0.  Back                                  º\necho                 º                                             º\necho                 ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶\necho                 º        Type a number and press ENTER        º\necho                 ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼\necho.\n'
            },
            {
                name: '1.bat',
                data: 'cd homecomp\nmenu\n'
            },
            {
                name: '2.bat',
                data: 'cd console\nmenu\n'
            },
            {
                name: '3.bat',
                data: 'cd handheld\nmenu\n'
            },
            {
                name: '4.bat',
                data: 'wiki\n'
            },
            {
                name: 'wiki.bat',
                link: 'https://github.com/Retro-Jack/GenX-DOS/wiki'
            },
            {
                name: '0.bat',
                data: 'cd ..\nmenu\n'
            }
        ]
    }],
    files: [{
            name: 'autoexec.bat',
            data: 'menu\n'
        },
        {
            name: 'menu.bat',
            data: 'cd emulators\nmenu\n'
        }
    ]
}];