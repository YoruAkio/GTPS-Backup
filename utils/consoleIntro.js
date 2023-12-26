const { ansiColor } = require('./mainUtils.js');
const gradient = require('gradient-string');
// const figlet = require('figlet');
const Logger = require('./Logger.js');

const devName = `

 ██████╗████████╗██████╗ ███████╗      ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗ 
██╔════╝╚══██╔══╝██╔══██╗██╔════╝      ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗
██║  ███╗  ██║   ██████╔╝███████╗█████╗██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝
██║   ██║  ██║   ██╔═══╝ ╚════██║╚════╝██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝ 
╚██████╔╝  ██║   ██║     ███████║      ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║     
 ╚═════╝   ╚═╝   ╚═╝     ╚══════╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     
                                                                                        
`;
console.info(gradient.fruit(devName));
console.info(
    gradient.instagram(
        'Current Version: ' + require('../package.json').version,
    ),
);

const clearStyle = ansiColor(0, 'sgr');
const underlineStyle = ansiColor(4, 'sgr');
const whiteColor = ansiColor(15, 'foreground');
const yellowColor = ansiColor(11, 'foreground');
const blueBrightColor = ansiColor(33, 'foreground');

Logger.info(
    'Client',
    whiteColor +
        'Copyright (C) 2023 YoruAkio. All rights reserved.' +
        clearStyle,
);
Logger.info(
    'Client',
    'Current Repository: https://github/YoruAkio/GTPS-Backup' +
        clearStyle +
        `\n`,
);
