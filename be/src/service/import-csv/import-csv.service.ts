

import fs from 'fs';
import parse, {Parser} from "csv-parse";
import path from 'path';
import util from 'util';

export const readCsv = async <T>(b: Buffer): Promise<T[]> => {
    return new Promise((res, rej) => {
        const csvobjs: T[] = [];
        const parser: Parser = parse({
            skip_empty_lines: true,
            relax_column_count: true,
            columns: true
        });

        for (const line of b.toString().split(/(:?\r|\n|\r\n)/g)) {
            parser.write(line);
        }
        parser.end();

        parser.on("readable", () => {
            let l;
            while(l = parser.read()) {
                csvobjs.push(l);
            }
        });
        parser.on("end", () => {
            res(csvobjs);
        });
        parser.on('error', (err) => {
            rej(err);
        });
    });
}

/*
(async()=>{
    const f = `${__dirname}${path.sep}attributes.csv`;
    const buffer: Buffer = await util.promisify(fs.readFile)(f);
    const r = await readCsv(buffer);
    console.log(r);
})();
 */

