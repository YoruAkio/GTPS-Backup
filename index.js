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
helper.checkRequiredFolder();

async function backupDatabase() {
    try {
        if (config.serverConfig.backupAllDatabase === true) {
            await helper.archiveAllDatabase().then(async () => {
                console.log('Uploading to discord...');

            const fileBackup = await fs.promises.readFile(
                `./Backup/${config.serverConfig.archiveName}.rar`,
            );

            const link = await helper.uploadToFileio(
                fileBackup,
                `${config.serverConfig.archiveName}.rar`,
            );

            await discord.sendCustomMessage({
                message: `All databases have been archived.`,
                embeds: new EmbedBuilder()
                    .setTitle('All Databases Archived')
                    .setDescription(
                        `All databases have been archived and uploaded into file.io\nNOTE: If you want to download the archive, you can download it from the attachment below and the link will be expired in 14 days.`,
                    )
                    .setFields([
                        {
                            name: 'Download Link (file.io)',
                            value: link,
                        },
                    ])
                    .setColor('#00ff00')
                    .setTimestamp(),
                files: {
                    attachment: fileBackup,
                    name: `${config.serverConfig.archiveName}.rar`,
                },
            });

            helper.renameAfterSend();
            })
        } else {
            await helper.makeDatabaseArchive(
                'a -r',
                `${config.serverConfig.archiveName}.rar`,
                `${config.serverConfig.databaseFolder}`,
            );

            console.log('Uploading to discord...');

            const fileBackup = await fs.promises.readFile(
                `./Backup/${config.serverConfig.archiveName}.rar`,
            );

            const link = await helper.uploadToFileio(
                fileBackup,
                `${config.serverConfig.archiveName}.rar`,
            );

            await discord.sendCustomMessage({
                message: `Database has been archived with name ${config.serverConfig.archiveName}.rar`,
                embeds: new EmbedBuilder()
                    .setTitle('GracePS-Database.rar')
                    .setDescription(
                        `Your database has been archived and uploaded into file.io\n\n**Note:**\nIf you want to download the archive, you can download it from the attachment below and the link will be expired in 14 days.`,
                    )
                    .setFields([
                        {
                            name: 'Download Link (file.io)',
                            value: link,
                        },
                    ])
                    .setColor('#00ff00')
                    .setTimestamp(),
                files: {
                    attachment: fileBackup,
                    name: `${config.serverConfig.archiveName}.rar`,
                },
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// Run backup immediately when the program starts
backupDatabase();

// Then run backup repeatedly after the cooldown period
setInterval(backupDatabase, config.serverConfig.backupCooldown * 1000 * 60);
