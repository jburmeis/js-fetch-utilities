import { ContentType } from "./ContentType";

export type ParameterList = { [name: string]: string };

export type FetchBody =
    | { type: ContentType.Json, content: Object }
    | { type: ContentType.Text, content: string }
    | { type: ContentType.ArrayBuffer, content: ArrayBuffer }
    | { type: ContentType.Blob, content: Blob }
    ;