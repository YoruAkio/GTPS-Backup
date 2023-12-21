const { format } = require('util');
const figlet = require('figlet');

function asciiArt(content) {
    figlet.textSync(content, { font: 'ANSI Shadow' });
}

const ansiColor = (code, mode) => {
    if (code === null)
        return console.log('[ansiColor] Please configure the color of ANSI.');
    if (!mode)
        return console.log(
            "[ansiColor] Please confirm the ANSI mode, including 'foreground', 'background' and 'sgr'.",
        );

    if (mode === 'foreground') return '\x1b[38;5;' + code.toString() + 'm';
    if (mode === 'background') return '\x1b[48;5;' + code.toString() + 'm';
    if (mode === 'sgr') return '\x1b[' + code.toString() + 'm';
};

module.exports = {
    asciiArt,
    ansiColor,
};
