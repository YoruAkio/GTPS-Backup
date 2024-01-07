const fs = require('fs');
const Discord = require('discord.js');
const DiscordUtils = require('./lib/discord.js');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const config = require(process.cwd() + '/config.js');
const { exit } = require('process');
const helper = require('./lib/helper.js');

const client = new WebhookClient({
    url: config.discordConfig.webhookUrl,
});

client.config = config;

const discord = new DiscordUtils(client, {
    config: require(process.cwd() + '/config.js'),
    discord: Discord,
});

// Please if you use this source code don't remove this credits
console.clear();
require('./utils/consoleIntro.js');

helper.checkRequiredFolder();

async function backupDatabase() {
    try {
        if (config.serverConfig.backupAllDatabase === true) {
            await helper.archiveAllDatabase().then(async () => {
                setTimeout(async () => {
                    const fileBackup = await fs.promises.readFile(
                        `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}.rar`,
                    );

                    const fileInfo = helper.getFileInfo(
                        `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}.rar`,
                    );

                    console.log('Uploading to discord...');

                    await discord
                        .sendCustomMessage({
                            message: `All databases have been archived.`,
                            embeds: new EmbedBuilder()
                                .setTitle('All Databases Archived')
                                .setDescription(
                                    `All databases have been archived and uploaded into file.io\nNOTE: If you want to download the archive, you can download it from the attachment below and the link will be expired in 14 days.`,
                                )
                                .setFields([
                                    {
                                        name: 'Archive Name',
                                        value: fileInfo.data.name,
                                    },
                                    {
                                        name: 'Archive Size',
                                        value: fileInfo.data.size,
                                    },
                                ])
                                .setColor('#00ff00')
                                .setTimestamp(),
                            files: {
                                attachment: fileBackup,
                                name: `${config.serverConfig.archiveName}.rar`,
                            },
                        })
                        .then(() => {
                            helper.renameAfterSend();
                            console.log(`The message has been sent!`);
                        });
                }, 2000);
            });
        } else {
            await helper
                .makeDatabaseArchive(
                    'a -r',
                    `${config.serverConfig.archiveName}.rar`,
                    `${config.serverConfig.folderPlayer} ${config.serverConfig.folderWorld}`,
                )
                .then(async () => {
                    setTimeout(async () => {
                        const fileBackup = await fs.promises.readFile(
                            `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}.rar`,
                        );

                        const fileInfo = helper.getFileInfo(
                            `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}.rar`,
                        );
                        console.log('Uploading to discord...');

                        await discord
                            .sendCustomMessage({
                                message: `Database has been archived with name ${config.serverConfig.archiveName}.rar`,
                                embeds: new EmbedBuilder()
                                    .setTitle('GracePS-Database.rar')
                                    .setDescription(
                                        `Your database has been archived and uploaded into file.io\n\n**Note:**\nIf you want to download the archive, you can download it from the attachment below and the link will be expired in 14 days.`,
                                    )
                                    .setFields([
                                        {
                                            name: 'Archive Name',
                                            value: fileInfo.data.name,
                                        },
                                        {
                                            name: 'Archive Size',
                                            value: fileInfo.data.size,
                                        },
                                    ])
                                    .setColor('#00ff00')
                                    .setTimestamp(),
                                files: {
                                    attachment: fileBackup,
                                    name: `${config.serverConfig.archiveName}.rar`,
                                },
                            })
                            .then(() => {
                                helper.renameAfterSend();
                                console.log(`The message has been sent!`);
                            });
                    }, 2000);
                })
                .catch(err => {
                    console.log(err);
                    process.exit(1);
                });
        }
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

// Run backup immediately when the program starts
backupDatabase();

// Then run backup repeatedly after the cooldown period
setInterval(backupDatabase, config.serverConfig.backupCooldown * 1000);
