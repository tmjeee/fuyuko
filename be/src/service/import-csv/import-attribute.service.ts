import {AttributeDataImport, DataImport} from "../../model/data-import.model";
import parse from 'csv-parse';
import {Parser} from "csv-parse";

export const previewAttributeDataImport = async (content: Buffer): Promise<AttributeDataImport> => {
   return new Promise((res, rej) => {

       const parser: Parser = parse();

       parser.write(content);
       parser.end();

       parser.on('readable', () => {
           let l;
           while(l = parser.read()) {

           }

       });
       parser.on('end', () => {

       });
       parser.on('error', () => {

       });
   });


    return null;
}