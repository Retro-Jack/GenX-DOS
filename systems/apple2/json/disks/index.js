// Local disk catalog — used by the bundled disk-loader UI. We hide the
// loader chrome in play.html and launch via ?disk=KEY (resolved against
// this directory), but the bundle still loads index.js at boot, so it
// must exist and define `disk_index` as an array.
disk_index = [
    { filename: 'json/disks/lemonade.json', name: 'Lemonade Stand',     category: 'Apple' },
    { filename: 'json/disks/wolf.json',     name: 'Castle Wolfenstein', category: 'Muse' },
    { filename: 'json/disks/choplift.json', name: 'Choplifter',         category: 'Broderbund' },
    { filename: 'json/disks/aztec.json',    name: 'Aztec',              category: 'Datamost' },
    { filename: 'json/disks/loderun.json',  name: 'Lode Runner',        category: 'Broderbund' },
    { filename: 'json/disks/sammy.json',    name: 'Sammy Lightfoot',    category: 'Sierra' },
    { filename: 'json/disks/hardhat.json',  name: 'Hard Hat Mack',      category: 'Electronic Arts' },
    { filename: 'json/disks/karateka.json', name: 'Karateka',           category: 'Broderbund' },
    { filename: 'json/disks/oregon.json',   name: 'The Oregon Trail',   category: 'MECC' },
    { filename: 'json/disks/archon.json',  name: 'Archon',             category: 'Electronic Arts' },
];
