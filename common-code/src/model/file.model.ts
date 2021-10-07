export class FileDataObject {
    constructor(public name: string,
                public size: number,
                public type: string,
                public data: string /* string of array of number eg. `[1,2,3,5]`*/) {
        this.name = name;
        this.size = size;
        this.type = type;
        this.data = data;
    }
    getDataAsBuffer(): Buffer {
        const b: Buffer = Buffer.from(new Uint8Array(JSON.parse(this.data)).buffer);
        return b;
    }
};
