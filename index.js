const fs = require('fs');
const figlet = require('figlet');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const config = require('./config.js');

const client = new WebhookClient({
    url: 'https://discord.com/api/webhooks/1186186714721550417/FP27d47g1tdmUSYyjvoCVeSVQuDczeH0jNSPcKyxmyHjvAEjLgwB6LoFcuNAJATn-LvD',
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

