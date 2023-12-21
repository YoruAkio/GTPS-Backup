const fs = require('fs');
const Discord = require('discord.js');
const DiscordUtils = require('./lib/discord.js');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const config = require('./config.js');
const { exit } = require('process');
const helper = require('./lib/helper.js');

const client = new WebhookClient({
    url: config.discordConfig.webhookUrl,
});

const discord = new DiscordUtils(client, {
    config: require('./config.js'),
    discord: Discord,
});

// Please if you use this source code don't remove this credits
console.clear();
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

setTimeout(() => {
    helper
        .makeDatabaseArchive(
            'a -r',
            `${config.serverConfig.archiveName}.rar`,
            `${config.serverConfig.databaseFolder}`,
        )
        .then(() => {
            console.log('Uploading to discord...');

            const fileBackup = fs.readFileSync(
                `./Backup/${config.serverConfig.archiveName}.rar`,
            );

            discord
                .sendCustomMessage({
                    message: `Database has been archived with name ${config.serverConfig.archiveName}.rar`,
                    embeds: new EmbedBuilder()
                        .setTitle('GracePS-Database.rar')
                        .setDescription(
                            `Your archive will be moved into Backup folder\n\n**Note:**\nIf you want to download the archive, you can download it from the attachment below.`,
                        )
                        .setColor('#00ff00')
                        .setTimestamp(),
                    files: {
                        attachment: fileBackup,
                        name: `${config.serverConfig.archiveName}.rar`,
                    },
                })
                .then(() => {
                    const date = new Date();
                    const formattedDate = `${date.getDate()}-${
                        date.getMonth() + 1
                    }-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

                    fs.rename(
                        `./Backup/${config.serverConfig.archiveName}.rar`,
                        `./Backup/${config.serverConfig.archiveName}_${formattedDate}.rar`,
                        err => {
                            if (err) throw err;
                            console.log('Rename complete!');
                        },
                    );
                });
        })
        .catch(err => {
            console.log(err);
        });
}, config.serverConfig.backupCooldown * 1000);
