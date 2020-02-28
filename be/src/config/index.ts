
const regexp = /--(.*)=(.*)/;
const SelfReloadJson = require('self-reload-json');

const overrideWithProcessArgv = (config: any) => {
    const args: string[] = process.argv.slice(2);
    console.log('**** args', args);
    for (const arg of args) {
        const match: string[] = arg.match(regexp);
        if (match && match.length == 3) {
            config[match[1]] = match[2];
        }
    }
};

const config = new SelfReloadJson(require('path').resolve(__dirname, './config.json'));
overrideWithProcessArgv(config);
config.on('updated', function(json: any) {
    overrideWithProcessArgv(config);
});

export default config;
