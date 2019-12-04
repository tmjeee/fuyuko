
import {createInterface} from 'readline';
import {createReadStream} from "fs";

const d = () => {
    return new Promise((res, rej) =>{
        const r = createInterface({
            input: createReadStream('data.csv')
        });
        r.on('line', (line) => {
            console.log(line);
        })
        .on('SIGTSTP', () => {
            rej('SIGTSTP')
        })
        .on('SIGINT', () => {
            rej('SIGINT');
        })
    });
}

(async () => {
    await d();
    console.log('end');
})();
