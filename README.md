# Fetch Utilities
A small utility library to simplify the usage of the Fetch API. It consists of:
- Methods to perform `fetch()` requests 
- Types to represent the state of a resource within the process (init, pending, success, error)

# Fetch Requests
This library uses chain syntax to assemble and dispatch HTTP requests. Here is an example:
```javascript
    const data = await fetchJson("/url")
        .withJsonBody({...})
        .withMethod(HttpMethod.PUT)
        .addBasicAuthorization("username", "password")
        .send();
```
Each request starts with a `send` or `fetch-` that defines the base URL and the result type you expect from the server. `with-` methods add an optional payload body, `add-` methods additional settings like headers or query parameters. Finally a `send-` method concludes the chain. It dispatches the request and defines how you want to handle the response.

## URL and Response Type
Choose the appropriate method, depending on the type of the data you expect from the server:
```javascript
// Send request without caring about a response
send("/url")

// Send request expecting a response with payload
fetchJson("/url")
fetchText("/url")
fetchArrayBuffer("/url")
fetchBlob("/url")

// Use fetchJson with generics to indicate the type of the result data (the actual data is not checked!)
fetchJson<number[]>("/url")  // Expect the server to send an array of numbers
```

## Response Handling (send-)
Choose how you want to handle the response:
```javascript
// Handle response with standard Promises
try {
    const result = await fetchJson<number[]>("/url").send();
    console.log(result);
} catch(error) {
    console.log(error);
}

// Handle response with callback functions for success and error
fetchJson<number[]>("/url").sendToCallbacks(
    data => console.log(success),
    error => console.log(error)
)

// Handle response with a single callback function that is called 
// with an AsyncResource for the current state (pending, success, error)
fetchJson<number[]>("/url").sendToAsyncResourceCallback(resouce => console.log(resource))

// Handle response with a single callback function that is called 
// with an AsyncResourceWithId for the current state (pending, success, error)
fetchJson<number[]>("/url").sendToAsyncResourceCallbackWithId(resouce => console.log(resource), "request-id")
```

## Payloads (with-)
Use the `with-` methods to add a payload to the request:
```javascript
fetchText("/url").withArrayBufferBody(...)
fetchText("/url").withBlobBody(...)
fetchText("/url").withJsonBody(...)
fetchText("/url").withTextBody(...)
```
Note: JSON payloads are stringified using `JSON.stringify` automatically. Just pass the JavaScript object.

## HTTP Request Type
If you don't add a payload, the HTTP request type will default to `GET`. If you add one, it will default to `POST`. 
You can set the request type explicitly:
```javascript
fetchText("/url").withMethod(HttpMethod.PUT)
```

## Additional parameters (add-)
Use the `add-` methods to add parameters to the request:

### Header parameters
```javascript
fetchText("/url").addHeader("Accept", "application/xml")
```

### Authorization Headers
```javascript
fetchText("/url").addBasicAuthorization("user", "password")
fetchText("/url").addBearerTokenAuthorization("my-token")
```

### URL query parameter
```javascript
fetchText("/url").addQueryParameter("id", 128)
```
Note: Of course you may also put query parameters directly into the /url. For complex values you might choose this option, as they are processed by the `query-string` library that can deal with tricky edge cases.


# Async Resource
When fetching resources from a server (or another asynchronous process) you typically have to track the status of the process. The `AsyncResorce` types wrap a resource with their current state (pending, success, error).

## Async Resource
There are two versions: The standard version and an extension with an additional 'ID' property. 
Depending on your architecture, this property can be helpful to identify the resources in further processing.
```javascript
AsyncResource<PayloadType> = {
    pending: boolean,
    data: PayloadType | null,
    error: Error | null,
}

AsyncResource<PayloadType, IdType> = {
    id: IdType,
    pending: boolean,
    data: PayloadType | null,
    error: Error | null,
}
```

### Possible States
In most cases you should only represent four states in an `AsyncResource`:
| State | Pending | Data | Error |
| ----------- | ----------- | ----------- | ----------- |
| Init | false | null | null
| Pending | true | null | null
| Success | false | present | null
| Error | false | null | present
| (Updating data) | true | present | null
For some applications you might want the dual 'updating' state, i.e. have both the `data` and `pending` property set. An application might hold on to the current data of a resource while fetching for an update without clearing the old data until the updated data is available. 
It is recommended to use the following creator functions to create valid instances:

### Create directly with functions
```javascript
const resource = createAsyncResource.init<string>();
const resource = createAsyncResource.pending<string>(?data);
const resource = createAsyncResource.success<string>(data);
const resource = createAsyncResource.error<string>(error);
const resource = createAsyncResource.appendPending<string>(previousState);

const resource = createAsyncResourceWithId.init<string, number>(128);
const resource = createAsyncResourceWithId.pending<string, number>(128, ?data);
const resource = createAsyncResourceWithId.success<string, number>(128, data);
const resource = createAsyncResourceWithId.error<string, number>(128, error);
const resource = createAsyncResourceWithId.appendPending<string, number>(previousState);
```

### Create with builders
```javascript
const resourceBuilder = new AsyncResourceBuilder<string>();
const resource = resourceBuilder.init();
const resource = resourceBuilder.pending(?data);
const resource = resourceBuilder.success(data);
const resource = resourceBuilder.error(error);
const resource = resourceBuilder.appendPending(previousResource);

const resourceBuilder = new AsyncResourceBuilderWithId<string, number>(128);
...
```

## Async Safe Resource
This variant ensures that the `data` property of a resource is always set to a valid value, i.e. is never null. If you can provide a reasonable initial value, this can simplify handling resources in an application since you don't have to check for null data as much. Safe resources will be commonly in dual states, i.e. having `data` and `pending` property active when the resource is updated.
```
AsyncSafeResource<PayloadType> = {
    pending: boolean,
    data: PayloadType,
    error: Error | null,
}

AsyncSafeResource<PayloadType, IdType> = {
    id: IdType,
    pending: boolean,
    data: PayloadType,
    error: Error | null,
}
```

### Create directly with functions
```javascript
const resource = createAsyncSafeResource.init<string>("data");
const resource = createAsyncSafeResource.pending<string>("data");
const resource = createAsyncSafeResource.success<string>("data");
const resource = createAsyncSafeResource.error<string>("data", error);
const resource = createAsyncSafeResource.appendPending<string>(previousState);

const resource = createAsyncSafeResourceWithId.init<string, number>(128, "data");
...
```

### Create with builders
```javascript
const resourceBuilder = new AsyncSafeResourceBuilder<string>("data");
const resourceBuilder = AsyncSafeResourceBuilder.fromCurrentResource(resource);

const resource = resourceBuilder.init();
const resource = resourceBuilder.pending();
const resource = resourceBuilder.success(data);
const resource = resourceBuilder.error(error);

const resourceBuilder = new AsyncSafeResourceBuilderWithId<string, number>(128, "data");
...
```

## Utility Methods
If you need to wait for multiple resources (e.g. in application startup), you can use these methods to aggregate their state:
```javascript
const resources: AsyncResource<string>[] = [...];

anyResourceInState(AsyncResourceState.Success, ...resources);
allResourcesInState(AsyncResourceState.Success, ...resources);
noResourceInState(AsyncResourceState.Success, ...resources);
countResourcesInState(AsyncResourceState.Success, ...resources);
```

## Examples
### In a React component
```javascript
const Component:FC = () => {
    // Fetch a resource and track state in React.useState
    const [resource, setResouce] = useState<AsyncResource<string[]>>(createAsyncResource.init());

    useEffect(() => {
        fetchJson<string[]>("/api/data").sendToAsyncResourceCallback(setResource)
    }, [])

    // the same with callbacks:
    useEffect(() => {
        setResource(createAsyncResource<string[]>.pending());
        fetchJson<string[]>("/api/data").sendToCallbacks(
            data => setResource(createAsyncResource<string[]>.success(data))
            error => setResource(createAsyncResource<string[]>.error(error))
        )
    }, [])

    // or shorter with a builder:
    useEffect(() => {
        const resourceBuilder = new AsyncResourceBuilder<string[]>();
        setResource(resourceBuilder.pending());
        fetchJson<string[]>("/api/data").sendToCallbacks(
            data => setResource(resourceBuilder.success(data))
            error => setResource(resourceBuilder.error(error))
        )
    }, [])

    // or with conventional promises:
    useEffect(async () => {
        try {
            setResource(createAsyncResource<string[]>.pending());
            const data = await fetchJson<string[]>("/api/data").send();
            setResource(createAsyncResource.success<string[]>(data));
        } catch(error: any) {
            setResource(createAsyncResource<string[]>.error(error));
        }
    }, [])


    // Now use the data for conditional rendering:
    const { data, pending, error } = resource;
    if(data) {
        return <div>Data: {data.length}</div>
    }
    if(pending) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div>Error: {error.message}</div>
    }
    return null
}
```
