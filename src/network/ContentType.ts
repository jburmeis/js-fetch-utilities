export enum ContentType {
    Json = "Json",
    Text = "Text",
    ArrayBuffer = "ArrayBuffer",
    Blob = "Blob",
};

export function getMimeType(contentType: ContentType): string {
    switch (contentType) {
        case ContentType.Json:
            return "application/json";
        case ContentType.Text:
            return "text/plain";
        case ContentType.ArrayBuffer:
        case ContentType.Blob:
            return "application/octet-stream";
    }
}