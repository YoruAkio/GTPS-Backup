const fs = require('fs');
const figlet = require('figlet');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const FormData = require('form-data');
const config = require('./config.js');
const axios = require('axios');
const { exec } = require('child_process');
const { exit } = require('process');
const helper = require('./lib/helper.js');
const progresBar = new (require('cli-progress').SingleBar)(
    {},
    require('cli-progress').Presets.shades_classic,
);

const client = new WebhookClient({
    url: config.discordConfig.webhookUrl,
});

// Innitialize
console.clear();
console.log(
    figlet.textSync('GTPS Backup', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
    }),
);
// Please if you use this source code don't remove this credits
console.log('Made with ❤️ by YoruAkio');

// Check the all folder hat required
if (
    !fs.existsSync(config.serverConfig.folderWorld) ||
    !fs.existsSync(config.serverConfig.folderPlayer) ||
    !fs.existsSync(config.serverConfig.folderBackup) ||
    !config.serverConfig.hostCookie
) {
    console.log(
        `Your database folder or world folder or player folder is not found!`,
    );
    exit();
}

// Check the archive name
helper.makeArchive(
    'a -r',
    config.serverConfig.archiveName + '.rar',
    config.serverConfig.folderPlayer,
);

setTimeout(() => {
    const data = new FormData();
    console.log(
        `Uploading ${config.serverConfig.archiveName}.rar to file.io...`,
    );

    progresBar.start(
        fs.lstatSync('./Backup/' + config.serverConfig.archiveName + '.rar')
            .size,
        0,
    );
    let totalUploaded = 0;

    data.append(
        'file',
        // use lazy reading to get the progress bar lol
        fs
            .createReadStream(
                './Backup/' + config.serverConfig.archiveName + '.rar',
            )
            .on('data', chunk => {
                totalUploaded += chunk.length;
                progresBar.update(totalUploaded);
            }),
    );

    axios
        .post('https://file.io', data)
        .then(res => {
            progresBar.stop();
            console.log(`Uploaded: ${res.data.link}`);
        })
        .catch(e => {
            console.log(e);
        });
}, 5000);
