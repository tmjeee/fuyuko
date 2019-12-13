

import parse, {Parser} from "csv-parse";
import {Pair1, Pair2} from "../../model/attribute.model";


export const readPair1Csv = async (b: string): Promise<Pair1[]> => {
    return new Promise((res, rej) => {
        const pairs: Pair1[] = [];
        const parser: Parser = parse({
            delimiter: '|',
            skip_empty_lines: true,
            relax_column_count: true,
            columns: false
        });
        parser.on("readable", () => {
            let l;
            while(l = parser.read()) {
                // l =  [ 'key1=value1', 'key2=value2', 'key3=value3' ]
                console.log('***', l);
            }
        });
        parser.on("end", () => {
            res(null);
        });
        parser.on('error', (err) => {
            rej(err);
        });

        console.log('****');

        parser.write(b);
        parser.end();
    });
}

export const readPair2Csv = async (b: string): Promise<Pair2[]> => {
    return null;
}

export const readCsv = async <T>(b: Buffer): Promise<T[]> => {
    return new Promise((res, rej) => {
        const csvobjs: T[] = [];
        const parser: Parser = parse({
            skip_empty_lines: true,
            relax_column_count: true,
            columns: true
        });

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


        for (const line of b.toString().split(/(:?\r|\n|\r\n)/g)) {
            parser.write(line);
        }
        parser.end();
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

