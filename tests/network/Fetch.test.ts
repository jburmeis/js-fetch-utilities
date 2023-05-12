import { server } from './test-server';
import {
    send,
    fetchText,
    fetchJson,
    fetchArrayBuffer,
    fetchBlob,
    HttpMethod,
    AsyncResource,
    createAsyncResource,
    AsyncResourceWithId,
    createAsyncResourceWithId,
} from '../../src'
import { 
    AsyncResourceCallbackHelper, 
    AsyncResourceWithIdCallbackHelper 
} from './AsyncResourceCallbackHelpers';

// Test server setup (enable request interception and teardown)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("fetch send()", () => {
    test('should return data on success', async () => {
        const response = await fetchText("http://localhost:8080/static-text").send();
        expect(response).toBe("GET/reply");
    });

    test('should throw on invalid URL', async () => {
        expect(async () => await fetchText("/invalid-url").send()).rejects.toThrow();
    });

    test('should throw on error response code', async () => {
        expect(async () => await fetchText("http://localhost:8080/error-code-400").send()).rejects.toThrow();
    });
})

describe("fetch sendToCallbacks()", () => {
    test('should call data function on success', (done) => {
        fetchText("http://localhost:8080/static-text").sendToCallbacks(
            data => { expect(data).toBe("GET/reply"); done(); },
            error => null
        )
    });

    test('should call error function on invalid URL', (done) => {
        fetchText("/static-text").sendToCallbacks(
            data => { },
            error => { done(); }
        )
    });

    test('should call error function on error response code', (done) => {
        fetchText("http://localhost:8080/error-code-400").sendToCallbacks(
            data => null,
            error => { expect(error.name).toBe("Connection Error"); done(); }
        )
    });
})

describe("fetch sendToAsyncResourceCallback()", () => {
    test('should call data function on success', (done) => {
        const expectedStates: AsyncResource<string>[] = [
            createAsyncResource.pending(),
            createAsyncResource.success("GET/reply"),
        ];
        const callbackTestObj = new AsyncResourceCallbackHelper<string>(expectedStates, done);

        fetchText("http://localhost:8080/static-text")
            .sendToAsyncResourceCallback(resource => callbackTestObj.callback(resource));
    })

    test('should create error resource on invalid URL', (done) => {
        const expectedStates: AsyncResource<string>[] = [
            createAsyncResource.pending(),
            createAsyncResource.error(new Error()),
        ];
        const callbackTestObj = new AsyncResourceCallbackHelper<string>(expectedStates, done);

        fetchText("/static-text")
            .sendToAsyncResourceCallback(resource => callbackTestObj.callback(resource));
    });

    test('should create error resource on error response code', (done) => {
        const expectedStates: AsyncResource<string>[] = [
            createAsyncResource.pending(),
            createAsyncResource.error(new Error()),
        ];
        const callbackTestObj = new AsyncResourceCallbackHelper<string>(expectedStates, done);

        fetchText("http://localhost:8080/error-code-400")
            .sendToAsyncResourceCallback(resource => callbackTestObj.callback(resource));
    });
});

describe("fetch sendToAsyncResourceCallbackWithId()", () => {
    test('should call data function on success', (done) => {
        const expectedStates: AsyncResourceWithId<string, string>[] = [
            createAsyncResourceWithId.pending("id-0"),
            createAsyncResourceWithId.success("id-0", "GET/reply"),
        ];
        const callbackTestObj = new AsyncResourceWithIdCallbackHelper<string, string>(expectedStates, done);

        fetchText("http://localhost:8080/static-text")
            .sendToAsyncResourceCallbackWithId(resource => callbackTestObj.callback(resource), "id-0");
    })

    test('should create error resource on invalid URL', (done) => {
        const expectedStates: AsyncResourceWithId<string, string>[] = [
            createAsyncResourceWithId.pending("id-0"),
            createAsyncResourceWithId.error("id-0", new Error()),
        ];
        const callbackTestObj = new AsyncResourceWithIdCallbackHelper<string, string>(expectedStates, done);

        fetchText("/static-text")
            .sendToAsyncResourceCallbackWithId(resource => callbackTestObj.callback(resource), "id-0");
    });

    test('should create error resource on error response code', (done) => {
        const expectedStates: AsyncResourceWithId<string, string>[] = [
            createAsyncResourceWithId.pending("id-0"),
            createAsyncResourceWithId.error("id-0", new Error()),
        ];
        const callbackTestObj = new AsyncResourceWithIdCallbackHelper<string, string>(expectedStates, done);

        fetchText("http://localhost:8080/error-code-400")
            .sendToAsyncResourceCallbackWithId(resource => callbackTestObj.callback(resource), "id-0");
    });
});

describe("send", () => {
    test('should success silently', async () => {
        await send("http://localhost:8080/accept-if-payload-is-ok").withTextBody("ok").send();
    })

    test('should fail for invalid request', async () => {
        expect(async () => await send("http://localhost:8080/accept-if-payload-is-ok").withTextBody("wrong").send())
            .rejects.toThrow();
    });
})

describe("fetchText", () => {
    test('should return text-payloads', async () => {
        const response = await fetchText("http://localhost:8080/static-text").send();
        expect(response).toBe("GET/reply");
    });

    test('should set the correct ‘accept‘ header ', async () => {
        const response = await fetchText("http://localhost:8080/return-headers-as-json").send();
        expect(JSON.parse(response)["accept"]).toBe("text/plain");
    });
})

describe("fetchJson", () => {
    test('should return json-payloads', async () => {
        const response = await fetchJson<any[]>("http://localhost:8080/static-json").send();
        expect(response.length).toBe(2);

        expect(response[0]["message"]).toBe("reply");
        expect(response[0]["value"]).toBe(1);
        expect(response[1]["message"]).toBe("reply");
        expect(response[1]["value"]).toBe(2);
    });

    test('should set the correct ‘accept‘ header ', async () => {
        const response = await fetchJson<any>("http://localhost:8080/return-headers-as-json").send();
        expect(response["accept"]).toBe("application/json");
    });
})

describe("fetchArrayBuffer", () => {
    test('should return arraybuffer-payloads', async () => {
        const response = await fetchArrayBuffer("http://localhost:8080/static-arraybuffer").send();
        const array = new Uint8Array(response);
        expect(array[0]).toBe(255);
        expect(array[1]).toBe(0);
        expect(array[2]).toBe(128);
        expect(array[3]).toBe(18);
    });

    /*
    test('should set the correct ‘accept‘ header ', async () => {
        // Cannot test this, because fetchArrayBuffer converts the response
        const response = await fetchArrayBuffer("http://localhost:8080/return-headers-as-json").send();
        expect((response as any)["accept"]).toBe("application/octet-stream");  
    });
    */
})

describe("fetchBlob", () => {
    test('should return blob-payloads', async () => {
        const response = await fetchBlob("http://localhost:8080/static-blob").send();
        const object = JSON.parse(await response.text());

        expect(object["message"]).toBe("blob");
        expect(object["value"]).toBe(3);
    });

    /*
    test('should set the correct ‘accept‘ header ', async () => {
        // Cannot test this, because fetchBlob converts the response
        const response = await fetchBlob("http://localhost:8080/return-headers-as-json").send();
        expect((response as any)["accept"]).toBe("application/octet-stream");
    });
    */
})

describe("fetch (with request payloads)", () => {
    test('with implicit POST json body', async () => {
        const response = await fetchJson<any>("http://localhost:8080/return-post-json")
            .withJsonBody({ message: "post", value: 3 })
            .send();

        expect(response["message"]).toBe("post");
        expect(response["value"]).toBe(3);
    });

    test('with explicit PATCH json body', async () => {
        const response = await fetchText("http://localhost:8080/return-json-body-array-length")
            .withJsonBody([{ message: "post1" }, { message: "post2" }, { message: "post3" }])
            .withMethod(HttpMethod.PATCH)
            .send();

        expect(response).toBe("3");
    });

    test('with text body', async () => {
        const response = await fetchText("http://localhost:8080/return-text-body-char-length")
            .withTextBody("message")
            .send();

        expect(response).toBe("7");
    });

    test('with arraybuffer body', async () => {
        const buffer = new Uint8Array([255, 0, 128, 18]).buffer;
        const response = await fetchJson<number[]>("http://localhost:8080/return-uint8-arraybuffer-as-json-array")
            .withArrayBufferBody(buffer)
            .send();

        expect(response[0]).toBe(255);
        expect(response[1]).toBe(0);
        expect(response[2]).toBe(128);
        expect(response[3]).toBe(18);
    });

    test('with blob body', async () => {
        // Cannot test this, because test-server cannot parse blob body
    });

})


describe("fetch (with HTTP methods)", () => {
    test('fetchText with implicit GET', async () => {
        const response = await fetchText("http://localhost:8080/static-text").send();
        expect(response).toBe("GET/reply");
    });
    test('fetchText with explicit GET', async () => {
        const response = await fetchText("http://localhost:8080/static-text").withMethod(HttpMethod.GET).send();
        expect(response).toBe("GET/reply");
    });
    test('fetchText with explicit POST', async () => {
        const response = await fetchText("http://localhost:8080/static-text").withMethod(HttpMethod.POST).send();
        expect(response).toBe("POST/reply");
    });
    test('fetchText with explicit PUT', async () => {
        const response = await fetchText("http://localhost:8080/static-text").withMethod(HttpMethod.PUT).send();
        expect(response).toBe("PUT/reply");
    });
    test('fetchText with explicit DELETE', async () => {
        const response = await fetchText("http://localhost:8080/static-text").withMethod(HttpMethod.DELETE).send();
        expect(response).toBe("DELETE/reply");
    });
    test('fetchText with explicit PATCH', async () => {
        const response = await fetchText("http://localhost:8080/static-text").withMethod(HttpMethod.PATCH).send();
        expect(response).toBe("PATCH/reply");
    });
})

describe("fetch (with headers)", () => {
    test('fetchJson with custom headers', async () => {
        const response = await fetchJson<any>("http://localhost:8080/return-headers-as-json")
            .addHeader("x-custom-header-1", "test")
            .addHeader("x-custom-header-2", "124")
            .send();

        expect(response["x-custom-header-1"]).toBe("test");
        expect(response["x-custom-header-2"]).toBe("124");
    });

    test('fetchJson with basic-auth', async () => {
        const response = await fetchJson<any>("http://localhost:8080/return-headers-as-json")
            .addBasicAuthorization("aladdin", "opensesame")
            .send();

        expect(response["authorization"]).toBe("Basic YWxhZGRpbjpvcGVuc2VzYW1l");
    });

    test('fetchJson with bearer-token-auth', async () => {
        const response = await fetchJson<any>("http://localhost:8080/return-headers-as-json")
            .addBearerTokenAuthorization("YWxhZGRpbjpvcGVuc2VzYW1l")
            .send();

        expect(response["authorization"]).toBe("Bearer YWxhZGRpbjpvcGVuc2VzYW1l");
    });
})

describe("fetch (with query parameters)", () => {
    test('fetchJson with query parameters', async () => {
        const response = await fetchJson<any>("http://localhost:8080/return-query-params-as-json")
            .addQueryParameter("message", "query")
            .addQueryParameter("value", 10)
            .send();

        expect(response["message"]).toBe("query");
        expect(response["value"]).toBe("10");
    });
})