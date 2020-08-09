export class FileDataObject {
    constructor(fileDataObject?: FileDataObject) {
        if (fileDataObject) {
            this.name = fileDataObject.name;
            this.size = fileDataObject.size;
            this.type = fileDataObject.type;
            this.data = fileDataObject.data;
        }
    }
    name: string;
    size: number;
    type: string;
    data: string; // string of array of number eg. `[1,2,3,4]`
    getDataAsBuffer(): Buffer {
        const b: Buffer = Buffer.from(new Uint8Array(JSON.parse(this.data)).buffer);
        return b;
    }
};
