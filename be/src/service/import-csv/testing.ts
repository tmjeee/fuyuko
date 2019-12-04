
import {createReadStream} from "fs";

import parse from 'csv-parse';
import fs from "fs";
import path from 'path';
import util from 'util';
import {createInterface} from "readline";
import {finished, Readable} from "stream";
import {Parser} from "csv-parse/lib";

/*
const d = () => {
    return new Promise((res, rej) =>{
        const r = createInterface({
            input: createReadStream('data.csv')
        });
        r.on('line', (line) => {
            console.log('** line', line);
            if (line.indexOf('comment') >= 0) {
                console.log('** end readline');
                r.close();
                r.removeAllListeners();
            }
        })
        .on('close', () => {
            console.log('** close');
            res('xxx');
        })
        .on('SIGTSTP', () => {
            rej('SIGTSTP')
        })
        .on('SIGINT', () => {
            rej('SIGINT');
        })
    });
}
*/


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



const f = async ()=> {
    const file = `${__dirname}${path.sep}data.csv`;
    const rs = fs.createReadStream(file);
    finished(rs, (err) => {
        if (err) {
            console.error('Stream failed.', err);
        } else {
            console.log('Stream is done reading.');
        }
    });
    rs.resume();
}


(async () => {
    const r = await e();
    // const r = await f();
    console.log('end ', r);
})();
