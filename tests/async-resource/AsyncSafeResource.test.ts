import {
    AsyncSafeResourceBuilder,
    AsyncSafeResourceBuilderWithId,
    createAsyncSafeResource,
    createAsyncSafeResourceWithId
} from "../../src";

describe("AsyncSafeResourceBuilder", () => {
    // Test setup
    const data = "data";
    const resourceBuilder: AsyncSafeResourceBuilder<string> = new AsyncSafeResourceBuilder<string>(data);

    test('construct from existing resource', () => {
        const currentResource = createAsyncSafeResource.success(data);
        const builder = AsyncSafeResourceBuilder.fromCurrentResource(currentResource);
        const resource = builder.init();
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('init', () => {
        const resource = resourceBuilder.init();
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('pending', () => {
        const resource = resourceBuilder.pending();
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const newData = "new data";
        const resource = resourceBuilder.success(newData);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(newData);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = resourceBuilder.error(error);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });
})

describe("AsyncResourceBuilderWithId", () => {
    // Test setup
    const ID = 12;
    const data = "data";
    const resourceBuilder: AsyncSafeResourceBuilderWithId<string, number>
        = new AsyncSafeResourceBuilderWithId<string, number>(ID, data);

    test('construct from existing resource', () => {
        const currentResource = createAsyncSafeResourceWithId.success(ID, data);
        const builder = AsyncSafeResourceBuilderWithId.fromCurrentResource(currentResource);
        const resource = builder.init();
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });
        
    test('init', () => {
        const resource = resourceBuilder.init();
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('pending', () => {
        const resource = resourceBuilder.pending();
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const newData = "new data";
        const resource = resourceBuilder.success(newData);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(newData);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = resourceBuilder.error(error);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });
})

describe("createAsyncSafeResource", () => {
    const data = "data";

    test('init', () => {
        const resource = createAsyncSafeResource.init<string>(data);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('pending', () => {
        const resource = createAsyncSafeResource.pending<string>(data);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('pending with error', () => {
        const error = new Error();
        const resource = createAsyncSafeResource.pending<string>(data, error);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });

    test('appendPending', () => {
        const previousResource = createAsyncSafeResource.success<string>(data);
        const resource = createAsyncSafeResource.appendPending(previousResource);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('appendPending with error', () => {
        const error = new Error();
        const previousResource = createAsyncSafeResource.error<string>(data, error);
        const resource = createAsyncSafeResource.appendPending(previousResource);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const resource = createAsyncSafeResource.success<string>(data);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = createAsyncSafeResource.error<string>(data, error);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });
})

describe("createAsyncResourceWithId", () => {
    const ID = 12;
    const data = "data";

    test('init', () => {
        const resource = createAsyncSafeResourceWithId.init<string, number>(ID, data);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('pending', () => {
        const resource = createAsyncSafeResourceWithId.pending<string, number>(ID, data);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('pending with error', () => {
        const error = new Error();
        const resource = createAsyncSafeResourceWithId.pending<string, number>(ID, data, error);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });

    test('appendPending', () => {
        const previousResource = createAsyncSafeResourceWithId.success<string, number>(ID, data);
        const resource = createAsyncSafeResourceWithId.appendPending(previousResource);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('appendPending with error', () => {
        const error = new Error();
        const previousResource = createAsyncSafeResourceWithId.error<string, number>(ID, data, error);
        const resource = createAsyncSafeResourceWithId.appendPending(previousResource);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const resource = createAsyncSafeResourceWithId.success<string, number>(ID, data);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = createAsyncSafeResourceWithId.error<string, number>(ID, data, error);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(data);
    });
})
