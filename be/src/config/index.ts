
const SelfReloadJson = require('self-reload-json');

const config = new SelfReloadJson(require('path').resolve(__dirname, './config.json'));

export default config;
