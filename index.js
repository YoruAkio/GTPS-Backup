const fs = require('fs');
const figlet = require('figlet');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const FormData = require('form-data');
const config = require('./config.js');
const axios = require('axios');
const { exec } = require('child_process');
const { exit } = require('process');
const helper = require('./lib/helper.js');

const client = new WebhookClient({
    url: config.discordConfig.webhookUrl,
});

// Innitialize
console.clear();

// Please if you use this source code don't remove this credits
require('./utils/consoleIntro.js');

// Check the all folder hat required
if (
    !fs.existsSync(config.serverConfig.folderWorld) ||
    !fs.existsSync(config.serverConfig.folderPlayer)
) {
    console.log(
        `Your database folder or world folder or player folder is not found!`,
    );
    exit();
}

setInterval(() => {
    helper
        .makeDatabaseArchive(
            'a -r',
            `${config.serverConfig.archiveName}.rar`,
            `${config.serverConfig.databaseFolder}`,
        )
        .then(() => {
            console.log('Uploading to crepe.moe...');

            setTimeout(() => {
                helper.uploadDatabase();
            }, 5000);
        })
        .catch(err => {
            console.log(err);
        });
}, 20000); // 5 minutes
