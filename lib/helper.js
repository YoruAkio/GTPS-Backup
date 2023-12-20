const fs = require('fs');
const exec = require('child_process').exec;
const config = require('../config.js');

module.exports = {
    makeArchive,
    getFileSize,
    getFilesLength,
};

/**
 * @param {Object} options
 * @param {String} destination
 * @param {String} source
 * @returns {Promise<void>}
 */
async function makeArchive(options, destination, source) {
    if (config.serverConfig.archivePasswordiSActive === true) {
        if (!config.serverConfig.archivePassword)
            throw new Error('Archive password is not found');
        options += ` -hp${config.serverConfig.archivePassword}`;
    }
    exec(`rar ${options} ${destination} ${source}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log(
            `Database has been archived with name ${config.serverConfig.archiveName}.rar`,
        );
        console.log(`Your archive will be moved into Backup folder`);
        setTimeout(() => {
            exec(
                `move ${config.serverConfig.archiveName}.rar ${config.serverConfig.folderBackup}\\`,
            );
        }, 2000);
    });
}

function convertBytes(value, toBe) {
    switch (toBe) {
        case 'kb':
            return value / 1024;
        case 'mb':
            return value / Math.pow(1024, 2);
        case 'gb':
            return value / Math.pow(1024, 3);
        default:
            return value;
    }
}

/**
 * @param {String} file
 * @param {String} toBe
 * @returns {Number}
 */

function getFileSize(file, toBe) {
    if (!fs.existsSync(file)) throw new Error('File is not found');
    if (toBe !== 'bytes' && toBe !== 'kb' && toBe !== 'mb' && toBe !== 'gb')
        throw new Error('Invalid value');

    if (!toBe) {
        return fs.statSync(file).size;
    } else {
        return convertBytes(fs.statSync(file).size, toBe);
    }

    return stats;
}

/**
 * @param {String} folder
 * @returns {Number}
 */
function getFilesLength(folder) {
    fs.readdir(folder, (err, files) => {
        return files.length;
    });
}
