import {
    AsyncResourceBuilder,
    AsyncResourceBuilderWithId,
    createAsyncResource,
    createAsyncResourceWithId
} from "../../src";

describe("AsyncResourceBuilder", () => {
    // Test setup
    const data = "data";
    const resourceBuilder: AsyncResourceBuilder<string> = new AsyncResourceBuilder<string>();

    test('init', () => {
        const resource = resourceBuilder.init();
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (without data)', () => {
        const resource = resourceBuilder.pending();
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (with data)', () => {
        const resource = resourceBuilder.pending(data);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('appendPending', () => {
        const previousResource = createAsyncResource.success<string>(data);
        const resource = resourceBuilder.appendPending(previousResource);

        // Test previous resource is unchanged
        expect(previousResource.pending).toBe(false);
        expect(previousResource.error).toBe(null);
        expect(previousResource.data).toBe(data);

        // Test new resource
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const resource = resourceBuilder.success(data);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = resourceBuilder.error(error);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(null);
    });
})

describe("AsyncResourceBuilderWithId", () => {
    // Test setup
    const ID = 12;
    const data = "data";
    const resourceBuilder: AsyncResourceBuilderWithId<string, number>
        = new AsyncResourceBuilderWithId<string, number>(ID);

    test('init', () => {
        const resource = resourceBuilder.init();
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (without data)', () => {
        const resource = resourceBuilder.pending();
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (with data)', () => {
        const resource = resourceBuilder.pending(data);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('appendPending', () => {
        const previousResource = createAsyncResourceWithId.success<string, number>(ID, data);
        const resource = resourceBuilder.appendPending(previousResource);

        // Test previous resource is unchanged
        expect(previousResource.id).toBe(ID);
        expect(previousResource.pending).toBe(false);
        expect(previousResource.error).toBe(null);
        expect(previousResource.data).toBe(data);

        // Test new resource
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const resource = resourceBuilder.success(data);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = resourceBuilder.error(error);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(null);
    });
})

describe("createAsyncResource", () => {
    // Test setup
    const data = "data";
    
    test('init', () => {
        const resource = createAsyncResource.init<string>();
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (without data)', () => {
        const resource = createAsyncResource.pending<string>();
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (with data)', () => {
        const resource = createAsyncResource.pending<string>(data);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('appendPending', () => {
        const previousResource = createAsyncResource.success<string>(data);
        const resource = createAsyncResource.appendPending(previousResource);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const resource = createAsyncResource.success<string>(data);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = createAsyncResource.error<string>(error);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(null);
    });
})

describe("createAsyncResourceWithId", () => {
    // Test setup
    const ID = 12;
    const data = "data";

    test('init', () => {
        const resource = createAsyncResourceWithId.init<string, number>(ID);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (without data)', () => {
        const resource = createAsyncResourceWithId.pending<string, number>(ID);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(null);
    });

    test('pending (with data)', () => {
        const resource = createAsyncResourceWithId.pending<string, number>(ID, data);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('appendPending', () => {
        const previousResource = createAsyncResourceWithId.success<string, number>(ID, data);
        const resource = createAsyncResourceWithId.appendPending(previousResource);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(true);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('success', () => {
        const resource = createAsyncResourceWithId.success<string, number>(ID, data);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(null);
        expect(resource.data).toBe(data);
    });

    test('error', () => {
        const error = new Error("test error");
        const resource = createAsyncResourceWithId.error<string, number>(ID, error);
        expect(resource.id).toBe(ID);
        expect(resource.pending).toBe(false);
        expect(resource.error).toBe(error);
        expect(resource.data).toBe(null);
    });
})
