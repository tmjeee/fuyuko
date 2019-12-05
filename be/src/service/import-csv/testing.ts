
import {createReadStream} from "fs";

import parse from 'csv-parse';
import fs from "fs";
import path from 'path';
import util from 'util';
import {createInterface, Interface} from "readline";
import {finished, Readable} from "stream";
import {Parser} from "csv-parse/lib";
import os from 'os';

const d = async () => {
    const parser: Parser = parse({
        skip_empty_lines: true,
        relax_column_count: true,
        columns: true
    });
    return new Promise((res, rej) => {
        const file = `${__dirname}${path.sep}data.csv`;
        const r: Interface = createInterface({
            input: createReadStream(file)
        });
        r.on('line', (line: string) => {
            console.log('** line', line);
            if (line.trim().startsWith('#')) {
            } else {
                parser.write(`${line}${os.EOL}`);
            }
        })
        .on('close', () => {
            console.log('** close');
            parser.end();
        })
        .on('SIGTSTP', () => {
            console.log('SIGTSTP');
            parser.end();
        })
        .on('SIGINT', () => {
            console.log('SIGINT');
            rej();
        });


        parser.on('readable', () => {
            let rec;
            while(rec = parser.read()) {
                console.log(rec);
            }
        });
        parser.on('end', () => {
            console.log(' parser end');
            res();
        });
        parser.on('error', (err) => {
            console.error('error');
            rej(err);
        });
    });
}


const e = async () => {
  const file = `${__dirname}${path.sep}data.csv`;
  const data: Buffer = await util.promisify(fs.readFile)(file);
  const parser: Parser = parse({
     skip_empty_lines: true,
     relax_column_count: true,
     columns: true
  });
  parser.write(data);
  parser.end();
  parser.on('readable', () => {
      let rec;
      while(rec = parser.read()) {
          console.log(rec);
      }
  });
  parser.on('end', () => {
      console.log('end');
  });
  parser.on('error', (err) => {
      console.error('error');
  });
}




(async () => {
    //const r = await e();
    const r = await d();
    console.log('end ', r);
})();
