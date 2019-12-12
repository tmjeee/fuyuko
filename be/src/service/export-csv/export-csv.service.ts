
import {Parser} from 'json2csv';

export const writeCsv = (fields: string[], data: any): string => {

    const parser = new Parser({
        fields
    });

    return parser.parse(data);
}