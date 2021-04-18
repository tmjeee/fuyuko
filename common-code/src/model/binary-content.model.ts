

export interface BinaryContent {
    id: number,
    name: string,
    mimeType: string,
    size: number,
    content: Buffer | string
}