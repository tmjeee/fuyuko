

import parse, {Parser} from 'csv-parse';
import {Pair1, Pair2} from '@fuyuko-common/model/attribute.model';

export const readKeyPairs = (b: string): string[] => {
    return b.split('=').map((_: string) => _ && _.trim());
}


export const readPair1Csv = async (b: string): Promise<Pair1[]> => {
    return new Promise((res, rej) => {
        const pairs: Pair1[] = [];
        const parser: Parser = parse({
            delimiter: '|',
            skip_empty_lines: true,
            relax_column_count: true,
            columns: false
        });
        parser.on("readable", async () => {
            let l;
            while(l = parser.read()) {
                // l =  [ 'key1=value1', 'key2=value2', 'key3=value3' ]
                for (const _l of l) {
                    const p: string[] = readKeyPairs(_l);
                    if (p && p.length == 2) {
                        pairs.push({
                            id: -1,
                            key: p[0],
                            value: p[1]
                        } as Pair1);
                    }
                }
            }
        });
        parser.on("end", () => {
            res(pairs);
        });
        parser.on('error', (err) => {
            rej(err);
        });

        parser.write(b);
        parser.end();
    });
}

export const readPair2Csv = async (bb: string): Promise<Pair2[]> => {
    let b = bb ? bb : '';
    return new Promise((res, rej) => {
        const pairs: Pair2[] = [];
        const parser: Parser = parse({
            delimiter: '|',
            skip_empty_lines: true,
            relax_column_count: true,
            columns: false
        });
        parser.on("readable", async () => {
            let l;
            while(l = parser.read()) {
                // l =  [ 'key1=xkey1=value1', 'key1=xkey2=value2', 'key1=xkey3=value3' ]
                for (const _l of l) {
                    const p: string[] = readKeyPairs(_l);
                    if (p && p.length == 3) {
                        pairs.push({
                            id: -1,
                            key1: p[0],
                            key2: p[1],
                            value: p[2]
                        } as Pair2);
                    }
                }
            }
            parser.emit('x-done');
        });
        parser.on("end", () => {
            res(pairs);
        });
        parser.on('error', (err) => {
            rej(err);
        });

        parser.write(b);
        parser.end();
    });
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


