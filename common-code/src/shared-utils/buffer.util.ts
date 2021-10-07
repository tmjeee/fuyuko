import {FileDataObject} from "../model/file.model";

export const fromFileToFileDataObject = async (file: File): Promise<FileDataObject> => {
   const dataString: string = await fromFileToString(file);
   const fileDataObject: FileDataObject =  new FileDataObject(file.name, file.size, file.type, dataString);
   return fileDataObject;
};

export const fromStringToBuffer = (data: string): Buffer => {
   return Buffer.from(new Uint8Array(JSON.parse(data)).buffer);
};

export const fromFileToString = async (file: File): Promise<string> => {
   const arrayBuffer: ArrayBuffer = await (file as any).arrayBuffer();;
   const dataString: string = fromArrayBufferToString(arrayBuffer);
   return dataString;
};

export const fromArrayBufferToString = (arrayBuffer: ArrayBuffer): string => {
   const dataString = JSON.stringify(Array.from(new Uint8Array(arrayBuffer)));
   return dataString;
};
