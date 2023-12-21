var log4js = require('log4js');

module.exports = class Logger {
    /**
     * @param {string} log
     * @param {string} content
     */
    static debug(log, content) {
        var logger = log4js.getLogger(log);

        logger.level = 'debug';
        logger.debug(content);
    }
    /**
     * @param {string} log
     * @param {string} content
     */
    static info(log, content) {
        var logger = log4js.getLogger(log);

        logger.level = 'info';
        logger.info(content);
    }
    /**
     * @param {string} log
     * @param {string} content
     */
    static warn(log, content) {
        var logger = log4js.getLogger(log);

        logger.level = 'warn';
        logger.warn(content);
    }
    /**
     * @param {string} log
     * @param {string} content
     */
    static error(log, content) {
        var logger = log4js.getLogger(log);

        logger.level = 'error';
        logger.error(content);
    }
    /**
     * @param {string} log
     * @param {string} content
     */
    static fatal(log, content) {
        var logger = log4js.getLogger(log);

        logger.level = 'fatal';
        logger.fatal(content);
    }
};
