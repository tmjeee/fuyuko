import {i, w} from "../logger";
import {reset} from "../db/db";

const regexp = /--(.*)=(.*)/;
const SelfReloadJson = require('self-reload-json');

const overrideWithProcessArgv = async (config: any) => {
  const args: string[] = process.argv.slice(2);
  for (const arg of args) {
      const match: string[] = arg.match(regexp);
      if (match && match.length == 3) {
          try {
              i(`process argv ${arg}`);
              config[match[1]] = JSON.parse(match[2]);
          } catch (err) {
              config[match[1]] = (match[2]);
              w(`failed to JSON parse value ${match[2]} for overriding property ${match[1]} using value as is`);
          }
          i(`Command line arguments ${match[1]}=${match[2]} will override the one in config.json`);
      }
  }
  reset && await reset();
};

const config = new SelfReloadJson(require('path').resolve(__dirname, './config.json'));
(async () => {
    await overrideWithProcessArgv(config)
})();
config.on('updated', async function(json: any) {
    await overrideWithProcessArgv(config);
});

export default config;
