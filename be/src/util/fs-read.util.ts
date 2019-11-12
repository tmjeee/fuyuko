import fs from "fs";
import util from "util";

export interface FsReadResult  {
    bytesRead: number;
    buffer: Buffer;
};

export const fsRead = (fs.read as any)[util.promisify.custom] =
    (fd:number, buf: Buffer, offset: number, length: number, position: number) => new Promise<FsReadResult>((res, rej) => {
        fs.read(fd, buf, offset, length, position, (err: Error, bytesRead: number, buffer: Buffer) => {
            if (err)
                rej(err)
            else
                res({bytesRead, buffer});
        });
    });

