

import {Parser} from 'json2csv';


const parser = new Parser({
    fields: ['field1', 'field2', 'field3']
});

const data: any[] = [
    { field1: 12121, field2: 'a2', field3: 'a3'},
    { field1: 'b1,xxxx', field3: 'b3'},
    { field1: 'c1', field2: undefined, field3: null},
]

const csv = parser.parse(data);
console.log(csv);