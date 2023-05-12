import qs from 'query-string';
import { ConnectionError } from "./ConnectionError";
import { ContentType, getMimeType } from "./ContentType";
import { HttpMethod } from './HttpMethod';
import { encode as encodeBase64 } from 'base-64';
import { FetchBody, ParameterList } from "./InternalTypes";
import { 
    AsyncResource, AsyncResourceBuilder, 
    AsyncResourceBuilderWithId, AsyncResourceWithId 
} from "../async-resource/AsyncResource";

const fetchOptions = {
    credentials: 'same-origin' as RequestCredentials,
};

/**
 * Creates a new builder to send a HTTP request without expecting any response.
 */
export function send(url: string): FetchBuilder<void> {
    return new FetchBuilder(url);
}

/**
 * Creates a new builder to send a HTTP request and receive the response body as JSON.
 */
 export function fetchJson<PayloadType>(url: string): FetchBuilder<PayloadType> {
    return new FetchBuilder(url, ContentType.Json);
}

/**
 * Creates a new builder to send a HTTP request and receive the response body as plain text.
 */
 export function fetchText(url: string): FetchBuilder<string> {
    return new FetchBuilder(url, ContentType.Text);
}

/**
 * Creates a new builder to send a HTTP request and receive the response body as ArrayBuffer.
 */
 export function fetchArrayBuffer(url: string): FetchBuilder<ArrayBuffer> {
    return new FetchBuilder(url, ContentType.ArrayBuffer);
}

/**
 * Creates a new builder to send a HTTP request and receive the response body as Blob.
 */
 export function fetchBlob(url: string): FetchBuilder<Blob> {
    return new FetchBuilder(url, ContentType.Blob);
}


export class FetchBuilder<PayloadType> {
    private url: string;
    private method?: HttpMethod;
    private queryParams?: ParameterList;
    private headers?: ParameterList;
    private body?: FetchBody;
    private responseBodyType?: ContentType;

    constructor(url: string, responseBodyType?: ContentType) {
        this.url = url;
        this.responseBodyType = responseBodyType;
    };

    /**
     * Define the HTTP method (GET, POST, PUT, ...)
     * If not set explicitly, defaults to GET (without body) and POST (with body).
     */
    public withMethod(method: HttpMethod): FetchBuilder<PayloadType> {
        this.method = method;
        return this;
    }

    /**
     * Add a body to the HTTP request to be encoded as JSON.
     * If no method is set explicitly, the HTTP method will be set to POST.
     */
    public withJsonBody(body: Object): FetchBuilder<PayloadType> {
        this.body = { type: ContentType.Json, content: body };
        return this;
    }

    /**
     * Add a body to the HTTP request to be encoded as plain text.
     * If no method is set explicitly, the HTTP method will be set to POST.
     */
     public withTextBody(body: string): FetchBuilder<PayloadType> {
        this.body = { type: ContentType.Text, content: body };
        return this;
    }

    /**
     * Add a body to the HTTP request to be encoded as ArrayBuffer.
     * If no method is set explicitly, the HTTP method will be set to POST.
     */
     public withArrayBufferBody(body: ArrayBuffer): FetchBuilder<PayloadType> {
        this.body = { type: ContentType.ArrayBuffer, content: body };
        return this;
    }

    /**
     * Add a body to the HTTP request to be encoded as Blob.
     * If no method is set explicitly, the HTTP method will be set to POST.
     */
     public withBlobBody(body: Blob): FetchBuilder<PayloadType> {
        this.body = { type: ContentType.Blob, content: body };
        return this;
    }

    /**
     * Add a key-value pair to the HTTP headers for this request.
     * This will overwrite any headers that are set per default (e.g. content-type).
     */
    public addHeader(param: string, value: string): FetchBuilder<PayloadType> {
        if(!this.headers){
            this.headers = {};
        }
        this.headers[param] = value;
        return this;
    }

    /**
     * Sets the HTTP Authorization header of this request with the basic auth method.
     */
     public addBasicAuthorization(username: string, password: string): FetchBuilder<PayloadType> {
        const value = 'Basic ' + encodeBase64(username + ":" + password);
        return this.addHeader('Authorization', value);
    }

    /**
     * Sets the HTTP Authorization header of this request with the bearer token method.
     */
     public addBearerTokenAuthorization(token: string): FetchBuilder<PayloadType> {
        return this.addHeader('Authorization', `Bearer ${token}`);
    }

    /**
     * Adds a query parameter to the URL. Favor this instead of adding the parameters manually to the URL.
     */
     public addQueryParameter(param: string, value: any): FetchBuilder<PayloadType> {
        if(!this.queryParams){
            this.queryParams = {};
        }
        this.queryParams[param] = value;
        return this;
    }

    /**
     * Executes the HTTP request. Returns the response body as promise.
     */
     public send(): Promise<PayloadType> {
        const endpoint = this.assembleEndpoint();
        const request = this.assembleRequest();
        const responseBodyMappingFunction = this.getResponseBodyMappingFunction();

        return this.fetchPromise(endpoint, request, responseBodyMappingFunction);
    }

    /**
     * Executes the HTTP request. Returns the response body or process error via callback functions.
     */
     public async sendToCallbacks(resultCallback: (content: PayloadType) => void, errorCallback?: (error: Error) => void ) {
        try {
            resultCallback(await this.send());
        } catch(error: any) {
            if(errorCallback){
                errorCallback(error);
            }
        }
    }

    /**
     * Executes the HTTP request. Encodes the state of the fetch process (pending, success, error) as {@link AsyncResource} 
     * whose state is communcated via a callback function.
     */
    public async sendToAsyncResourceCallback(resourceCallback: (resource: AsyncResource<PayloadType>) => void) {
        const builder = new AsyncResourceBuilder<PayloadType>();
        resourceCallback(builder.pending());
        try {
            resourceCallback(builder.success(await this.send()));
        } catch (error: any) {
            resourceCallback(builder.error(error));
        }
    }

    /**
     * Executes the HTTP request. Encodes the state of the fetch process (pending, success, error) as {@link AsyncResource}
     * whose state is communcated via a callback function.
     */
    public async sendToAsyncResourceCallbackWithId<IdType>(resourceCallback: (resource: AsyncResourceWithId<PayloadType, IdType>) => void, id: IdType) {
        const builder = new AsyncResourceBuilderWithId<PayloadType, IdType>(id);
        resourceCallback(builder.pending());
        try {
            resourceCallback(builder.success(await this.send()));
        } catch (error: any) {
            resourceCallback(builder.error(error));
        }
    }

    private async fetchPromise(endpoint: string, requestObj: RequestInit, resultMapFunc: (result: Response) => Promise<any>): Promise<PayloadType> {
        const response = await fetch(endpoint, requestObj);
        if (response.ok) {
            return resultMapFunc(response);
        } else {
            throw new ConnectionError(response);
        }
    }
    
    private assembleEndpoint(): string {
        if (this.queryParams) {
            const stringifiedQueryParams = qs.stringify(this.queryParams);
            return `${this.url}?${stringifiedQueryParams}`;
        } else {
            return this.url;
        }
    }
    
    private assembleRequest(): RequestInit {
        const method = this.determineMethod();
        const body = this.encodeBody();
        const headers = this.assembleHeaders();
        return { ...fetchOptions, method: method, headers: headers, body: body };
    }

    private determineMethod(): HttpMethod {
        // If explictly set, use this
        if(this.method){
            return this.method;
        }

        // Otherwise use GET or POST, depending on body present
        return this.body ? HttpMethod.POST : HttpMethod.GET;
    }

    private encodeBody(): string | ArrayBuffer | Blob | undefined {
        if(!this.body) {
            return undefined;
        }
        
        if(this.body.type === ContentType.Json){
            return JSON.stringify(this.body.content);
        }
        return this.body.content;
    }

    private assembleHeaders(): ParameterList {
        const fetchHeaders: ParameterList = { };

        // Accept (response body)
        if(this.responseBodyType){
            fetchHeaders["Accept"] = getMimeType(this.responseBodyType);
        }

        // Content-type (request body)
        if(this.body){
            fetchHeaders["Content-Type"] = getMimeType(this.body.type);
        }

        // User-defined headers (added last, to allow overwriting)
        if(this.headers) {
            Object.assign(fetchHeaders, this.headers);
        }

        return fetchHeaders;
    }

    private getResponseBodyMappingFunction(): (result: Response) => Promise<any> {
        if (!this.responseBodyType) {
            return (result: Response) => Promise.resolve(result);
        }

        switch (this.responseBodyType) {
            case ContentType.Json:
                return (result: Response) => result.json();
            case ContentType.Text:
                return (result: Response) => result.text();
            case ContentType.ArrayBuffer:
                return (result: Response) => result.arrayBuffer();
            case ContentType.Blob:
                return (result: Response) => result.blob();
        }
    }
} 
