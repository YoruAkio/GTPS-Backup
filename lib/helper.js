const fs = require('fs');
const exec = require('child_process').exec;
const path = require('path');
const config = require('../config.js');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    makeDatabaseArchive,
    getFileSize,
    getFilesLength,
    moveFile,
    uploadToFileio,
    archiveAllDatabase,
    makeArchive,
    renameAfterSend,
    checkRequiredFolder,
    getFileInfo,
};

/**
 * @param {Buffer} fileBuf
 * @param {String} fileName
 * @returns {Promise<String>}
 */

async function uploadToFileio(fileBuf, fileName) {
    const formData = new FormData();
    formData.append('file', fileBuf, fileName);
    formData.append(
        'expires',
        config.serverConfig.archiveExpires
            ? config.serverConfig.archiveExpires
            : '14d',
    );

    const res = await axios.post('https://file.io/', formData, {
        headers: formData.getHeaders(),
    });
    return res.data.link;
}

/**
 * @returns {Promise<void>}
 */
async function archiveAllDatabase() {
    if (!fs.existsSync(config.serverConfig.databaseFolder)) {
        console.log('Database folder is not found');
        return;
    }

    console.log('All database backup has been activated!');
    const archiveName = `${config.serverConfig.archiveName}.rar`;
    const backupFolder = config.serverConfig.folderBackup;
    const databasePath = config.serverConfig.databaseFolder;

    try {
        await makeArchive('a -r', archiveName, databasePath).then(() => {
            console.log(
                `Database has been archived with name ${config.serverConfig.archiveName}.rar`,
            );
            console.log(`Your archive will be moved into Backup folder`);
            setTimeout(() => {
                moveFile(archiveName, backupFolder);
            }, 500);
        });
    } catch (err) {
        console.log(`Error archiving database: ${err.message}`);
    }

    const filesInBackup = fs.readdirSync(backupFolder);

    const res = {
        data: {},
    };

    filesInBackup.forEach(file => {
        if (file === archiveName) {
            res.data.name = file;
            res.data.size =
                getFileSize(path.join(backupFolder, file), 'mb').toFixed(2) +
                ' MB';
        }
    });

    return res;
}

/**
 * @param {String} mode
 * @param {String} archiveName
 * @param {String} filePath
 * @returns {Promise<void>}
 */
function makeArchive(mode, archiveName, filePath) {
    if (config.serverConfig.archivePasswordiSActive === true) {
        if (!config.serverConfig.archivePassword)
            throw new Error('Archive password is not found');
        mode += ` -hp${config.serverConfig.archivePassword}`;
    }
    const command = `rar ${mode} ${archiveName} ${filePath}`;

    return new Promise((resolve, reject) => {
        exec(command, error => {
            if (error) {
                console.log(
                    `Error creating archive ${archiveName}: ${error.message}`,
                );
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

/**
 * @param {Object} options
 * @param {String} destination
 * @param {String} source
 * @returns {Promise<void>}
 */
async function makeDatabaseArchive(options, destination, source) {
    if (config.serverConfig.archivePasswordiSActive === true) {
        if (!config.serverConfig.archivePassword)
            throw new Error('Archive password is not found');
        options += ` -hp${config.serverConfig.archivePassword}`;
    }
    exec(`rar ${options} ${destination} ${source}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            process.exit();
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            process.exit();
        }

        console.log(
            `Database has been archived with name ${config.serverConfig.archiveName}.rar`,
        );
        setTimeout(() => {
            moveFile(
                `${config.serverConfig.archiveName}.rar`,
                `${config.serverConfig.folderBackup}`,
            );
        }, 500);
    });
}

/**
 * @param {String} file
 * @returns {Promise<Object>}
 */
function getFileInfo(filePath) {
    const file = path.join(filePath);
    if (!fs.existsSync(file)) throw new Error('File is not found');

    const stats = fs.statSync(file);

    const res = {
        data: {},
    };

    res.data.name = path.basename(file);
    res.data.size = convertBytes(stats.size, 'mb').toFixed(2) + ' MB';

    return res;
}

/**
 * @returns {Promise<void>}
 */
function checkRequiredFolder() {
    if (
        !fs.existsSync(config.serverConfig.folderPlayer) ||
        !fs.existsSync(config.serverConfig.folderWorld) ||
        !fs.existsSync(config.serverConfig.databaseFolder)
    ) {
        console.log('Player, World, or Database folder is not found');
        process.exit();
    }
    if (!fs.existsSync(config.serverConfig.folderBackup)) {
        console.log(`Backup folder is not found, creating...`);
        fs.mkdirSync(config.serverConfig.folderBackup);
    }
}

/**
 * @returns {Promise<void>}
 */
function renameAfterSend() {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
    }-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;
    fs.renameSync(
        `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}.rar`,
        `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}_${formattedDate}.rar`,
    );
    console.log('Rename complete!');
}

/**
 * @param {String} file
 * @param {String} destination
 * @returns {Promise<void>}
 */
async function moveFile(fileName, targetFolder) {
    if (!fs.existsSync(fileName) || !fs.existsSync(targetFolder))
        throw new Error('File or destination is not found');

    const oldPath = path.join(process.cwd(), fileName);
    const newPath = path.join(targetFolder, fileName);

    try {
        fs.renameSync(oldPath, newPath);
        console.log(`Archive has been moved to ${targetFolder}`);
    } catch (err) {
        console.log(
            `Error moving or deleting file ${fileName}: ${err.message}`,
        );
    }
}

/**
 * @param {String} value
 * @param {String} toBe
 * @returns {Number}
 */
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
