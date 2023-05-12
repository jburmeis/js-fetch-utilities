import {
    AsyncResourceBuilder,
    AsyncResourceState,
    AsyncSafeResourceBuilder,
    createAsyncResource,
    isAsyncResourceInState
} from "../../src";


describe("isAsyncResourceInState", () => {
    // Test setup
    const resourceBuilder: AsyncResourceBuilder<string> = new AsyncResourceBuilder<string>();

    test('should detect the init state', () => {
        expect(isAsyncResourceInState(resourceBuilder.init(), AsyncResourceState.Init)).toBeTruthy;
    });
    test('should detect not being in init state', () => {
        expect(isAsyncResourceInState(resourceBuilder.success("data"), AsyncResourceState.Init)).toBeFalsy;
    });
    test('should detect the pending state', () => {
        expect(isAsyncResourceInState(resourceBuilder.pending(), AsyncResourceState.Pending)).toBeTruthy;
    });
    test('should detect not being in pending state', () => {
        expect(isAsyncResourceInState(resourceBuilder.success("data"), AsyncResourceState.Pending)).toBeFalsy;
    });
    test('should detect the success state', () => {
        expect(isAsyncResourceInState(resourceBuilder.success("data"), AsyncResourceState.Success)).toBeTruthy;
    });
    test('should detect the success state', () => {
        expect(isAsyncResourceInState(resourceBuilder.success(""), AsyncResourceState.Success)).toBeTruthy;
    });
    test('should detect the success state (empty string)', () => {
        expect(isAsyncResourceInState(createAsyncResource.success(""), AsyncResourceState.Success)).toBeTruthy;
    });
    test('should detect the success state (numeric 0)', () => {
        expect(isAsyncResourceInState(createAsyncResource.success(0), AsyncResourceState.Success)).toBeTruthy;
    });
    test('should detect the success state (boolean false)', () => {
        expect(isAsyncResourceInState(createAsyncResource.success(false), AsyncResourceState.Success)).toBeTruthy;
    });
    test('should detect not being in success state', () => {
        expect(isAsyncResourceInState(resourceBuilder.init(), AsyncResourceState.Success)).toBeFalsy;
    });
    test('should detect the error state', () => {
        expect(isAsyncResourceInState(resourceBuilder.error(new Error()), AsyncResourceState.Error)).toBeTruthy;
    });
    test('should detect not being in error state', () => {
        expect(isAsyncResourceInState(resourceBuilder.init(), AsyncResourceState.Error)).toBeFalsy;
    });
})

describe("isAsyncResourceInState (with async safe resource => data is also available)", () => {
    // Test setup
    const resourceBuilder: AsyncSafeResourceBuilder<string> = new AsyncSafeResourceBuilder<string>("data");

    test('should correctly detect the pending state', () => {
        expect(isAsyncResourceInState(resourceBuilder.pending(), AsyncResourceState.Pending)).toBeTruthy;
    });
    test('should correctly detect the success state', () => {
        expect(isAsyncResourceInState(resourceBuilder.success("data"), AsyncResourceState.Success)).toBeTruthy;
    });
    test('should correctly detect the error state', () => {
        expect(isAsyncResourceInState(resourceBuilder.error(new Error()), AsyncResourceState.Error)).toBeTruthy;
    });
})