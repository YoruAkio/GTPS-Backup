module.exports = class Discord {
    constructor(client, options) {
        this.client = client;
        this.options = options;
    }
    /**
     * @param {string} name
     * @param {string} message
     * @param {string} avatarURL
     */
    sendMessage(message, { name, attachment }, avatarURL) {
        this.client.send({
            username:  this.client.config.discordConfig.webhookName,
            content: message,
            files: [{ attachment, name }],
            avatarURL: avatarURL ? avatarURL : null,
        });
    }
    /**
     * @param {string} name
     * @param {Object} embed
     * @param {string} avatarURL
     */
    sendEmbed({ embeds }, avatarURL) {
        this.client.send({
            username:  this.client.config.discordConfig.webhookName,
            embeds: [embeds],
            avatarURL: avatarURL ? avatarURL : null,
        });
    }
    /**
     * @param {string} name
     * @param {string} attachment
     * @param {string} avatarURL
     */
    sendAttachment({ name, attachment }, avatarURL) {
        this.client.send({
            username:  this.client.config.discordConfig.webhookName,
            files: [{ attachment, name }],
            avatarURL: avatarURL ? avatarURL : null,
        });
    }
    /**
     * @param {string} message
     * @param {Object} embed
     * @param {Object} files
     * @param {string} avatarURL
     */
    sendCustomMessage({ message, embeds, files }, avatarURL) {
        return new Promise((resolve, reject) => {
            this.client
                .send({
                    username:  this.client.config.discordConfig.webhookName,
                    content: message,
                    embeds: [embeds],
                    files: [files],
                    avatarURL: avatarURL ? avatarURL : null,
                })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    getClientAvatar() {
        return this.client.user.displayAvatarURL();
    }
};
