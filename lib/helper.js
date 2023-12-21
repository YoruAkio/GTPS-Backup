const fs = require('fs');
const exec = require('child_process').exec;
const config = require('../config.js');
const progresBar = new (require('cli-progress').SingleBar)(
    {},
    require('cli-progress').Presets.shades_classic,
);
const axios = require('axios');

module.exports = {
    makeDatabaseArchive,
    getFileSize,
    getFilesLength,
    uploadFile,
    uploadDatabase,
    moveFile,
};

function uploadDatabase() {
    progresBar.start(
        fs.lstatSync(
            `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}.rar`,
        ).size,
        0,
    );
    let totalUploaded = 0;

    let data = new FormData();

    data.append(
        'file',
        fs.createReadStream(
            './Backup/' + config.serverConfig.archiveName + '.rar',
        ),
    );

    // data.append(
    //     'file',
    //     fs
    //         .createReadStream(
    //             `${config.serverConfig.folderBackup}/${config.serverConfig.archiveName}.rar`,
    //         )
    //         .on('data', chunk => {
    //             totalUploaded += chunk.length;
    //             progresBar.update(totalUploaded);
    //         }),
    // );

    axios
        .post('https://crepe.moe/upload', data, {
            headers: config.serverConfig.hostCookie,
        })
        .then(res => {
            console.log(res.data.data.url.full);
        });
}

/**
 * @param {String} filePath
 * @param {String} fileName
 * @returns {Promise<void>}
 */
function uploadFile(filePath, fileName) {
    if (!fs.existsSync(filePath)) throw new Error('File is not found');

    const data = new FormData();

    data.append('file', fs.readFileSync(filePath), fileName);

    axios
        .post('https://crepe.moe/upload', data, {
            headers: {
                Cookies: config.serverConfig.cookies,
            },
        })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log(err);
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
        console.log(`Your archive will be moved into Backup folder`);
        setTimeout(() => {
            // moveFile(
            //     `${config.serverConfig.archiveName}.rar`,
            //     `${config.serverConfig.folderBackup}`,
            // );
            exec(
                `mv ${config.serverConfig.archiveName}.rar ${config.serverConfig.folderBackup}`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        process.exit();
                    }

                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        process.exit();
                    }

                    console.log(`Archive has been move to Backup folder!`);
                },
            );
        }, 2000);
    });
}

/**
 * @param {String} file
 * @param {String} destination
 * @returns {Promise<void>}
 */

function moveFile(file, destination) {
    if (!fs.existsSync(file)) throw new Error('File is not found');
    if (!fs.existsSync(destination))
        throw new Error('Destination is not found');

    exec(`move ${file} ${destination}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log(`Archive has been move to Backup folder!`);
    });
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
