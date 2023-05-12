/**
 * An error class that aggregates any kind of error that can occur
 * during operation of the Fetch API. 
 * Most common are network errors, or errors in parsing JSON payloads.
 */
export class ConnectionError extends Error {
    public readonly response: Response;

    constructor(response: Response) {
        super(`Connection Error ${response.status} (${response.statusText}) at ${response.url}`)
        this.name = "Connection Error";
        this.response = response;
    }
}