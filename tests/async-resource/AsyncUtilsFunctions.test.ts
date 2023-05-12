import {
    anyResourceInState,
    allResourcesInState,
    noResourceInState,
    countResourcesInState,
    createAsyncResource,
    createAsyncResourceWithId,
    AsyncResourceState,
    AsyncResource,
} from "../../src";

describe("anyResourceInState", () => {
    test('should return true if a resource in the given state exists', () => {
        const resources: AsyncResource<unknown>[] = [
            createAsyncResource.success<string>(""),
            createAsyncResourceWithId.success<number, string>("id", 0),
            createAsyncResource.pending<string>()
        ]
        expect(anyResourceInState(AsyncResourceState.Pending, ...resources)).toBeTruthy;
        expect(anyResourceInState(AsyncResourceState.Success, ...resources)).toBeTruthy;
    });

    test('should return true if no resource in the given state exists', () => {
        const resources: AsyncResource<unknown>[] = [
            createAsyncResource.success<string>(""),
            createAsyncResourceWithId.success<number, string>("id", 0),
            createAsyncResource.pending<string>()
        ]
        expect(anyResourceInState(AsyncResourceState.Error, ...resources)).toBeFalsy;
        expect(anyResourceInState(AsyncResourceState.Init, ...resources)).toBeFalsy;
    });
})

describe("allResourcesInState", () => {
    test('should return true if all resource are in the given state', () => {
        const resources: AsyncResource<unknown>[] = [
            createAsyncResource.success<string>(""),
            createAsyncResourceWithId.success<number, string>("id", 0),
            createAsyncResource.success<string>("")
        ]
        expect(allResourcesInState(AsyncResourceState.Success, ...resources)).toBeTruthy;
    });
    
    test('should return false if not all resource are in the given state', () => {
        const resources: AsyncResource<unknown>[] = [
            createAsyncResource.success<string>(""),
            createAsyncResourceWithId.success<number, string>("id", 0),
            createAsyncResource.pending<string>()
        ]
        expect(allResourcesInState(AsyncResourceState.Success, ...resources)).toBeFalsy;
        expect(allResourcesInState(AsyncResourceState.Pending, ...resources)).toBeFalsy;
        expect(allResourcesInState(AsyncResourceState.Error, ...resources)).toBeFalsy;
        expect(allResourcesInState(AsyncResourceState.Init, ...resources)).toBeFalsy;
    });
})

describe("noResourceInState", () => {
    test('should return true if no resource is in the given state', () => {
        const resources: AsyncResource<unknown>[] = [
            createAsyncResource.success<string>(""),
            createAsyncResourceWithId.success<number, string>("id", 0),
            createAsyncResource.success<string>("")
        ]
        expect(noResourceInState(AsyncResourceState.Pending, ...resources)).toBeTruthy;
        expect(noResourceInState(AsyncResourceState.Error, ...resources)).toBeTruthy;
        expect(noResourceInState(AsyncResourceState.Init, ...resources)).toBeTruthy;
    });
    
    test('should return false if any resource has the given state', () => {
        const resources: AsyncResource<unknown>[] = [
            createAsyncResource.success<string>(""),
            createAsyncResourceWithId.success<number, string>("id", 0),
            createAsyncResource.pending<string>()
        ]
        expect(noResourceInState(AsyncResourceState.Pending, ...resources)).toBeFalsy;
        expect(noResourceInState(AsyncResourceState.Success, ...resources)).toBeFalsy;
    });
})

describe("countResourcesInState", () => {
    // Test setup
    const resources: AsyncResource<unknown>[] = [
        createAsyncResource.success<string>(""),
        createAsyncResourceWithId.pending<number, string>("id"),
        createAsyncResource.success<string>("")
    ];

    test('should return how many resources are in the given state (Init)', () => {
        expect(countResourcesInState(AsyncResourceState.Init, ...resources)).toBe(0);
    });  
    test('should return how many resources are in the given state (Pending)', () => {
        expect(countResourcesInState(AsyncResourceState.Pending, ...resources)).toBe(1);
    });  
    test('should return how many resources are in the given state (Success)', () => {
        expect(countResourcesInState(AsyncResourceState.Success, ...resources)).toBe(2);
    });  
    test('should return how many resources are in the given state (Error)', () => {
        expect(countResourcesInState(AsyncResourceState.Error, ...resources)).toBe(0);
    });  
})

