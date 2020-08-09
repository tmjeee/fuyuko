import * as util from 'util';
import * as fs from 'fs';
import JSZip from "jszip";
import {Readable} from "stream";

export const unzipFromBuffer = async (buffer: Buffer, unzipFilePath: string): Promise<JSZip> => {
    return JSZip.loadAsync(buffer);
};

export const unzipFromStream = async (stream: Readable, unzipFilePath: string): Promise<JSZip> => {
  return JSZip.loadAsync(stream);
};

export const unzipFromPath = async (zipFilePath: string, unzipFilePath: string): Promise<JSZip> => {
   const data: Buffer = await (util.promisify(fs.readFile))(zipFilePath);
   return JSZip.loadAsync(data);
};

