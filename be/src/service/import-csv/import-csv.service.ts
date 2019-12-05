

import parser from 'csv-parser';
import fs from 'fs';
import {Writable, Readable} from 'stream';
import parse = require("csv-parse/lib");


const readCsv = (b: Buffer): any => {

    parser = parse()

}


/*
class MyWriteStream extends Readable {
   constructor(options: any) {
       super(options);
   }

   _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
       // console.log('*** chunk')
       callback();
   }

   _read(size: number): void {
   }
}

const test = async () => {
    return new Promise((res, rej)=> {
        fs.createReadStream('data.csv')
            .pipe(csvParser({
                skipComments: false,
            }))
            .on('header', (header) => {
                console.log('header', header);
            })
            .on('data', (data) => {
                console.log('data', data);
            })
            .on('end', () => {
                console.log('end');
                res();
            })
            .on('error', (err) => {
                console.error(err);
                rej(err);
            })
    });
}


(async ()=> {
    await test().then((c) => {
        console.log('terminate');
    });
})();

*/
