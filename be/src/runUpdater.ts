require('express-async-errors');
import * as updater from './updater/updater';

updater.runUpdate()
    .then((r: any) => {
        console.log(' *** done')
        process.exit(0);
    })
    .catch((e: Error) => {
        console.log(' *** error')
        process.exit(1);
    });
