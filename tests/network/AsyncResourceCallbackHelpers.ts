import { AsyncResource, AsyncResourceWithId } from "../../src";

export class AsyncResourceCallbackHelper<PayloadType> {
    private readonly expectedResources: AsyncResource<PayloadType>[];
    private readonly doneFunc: () => void;
    private nextStateIdx = 0;

    constructor(expectedResources: AsyncResource<PayloadType>[], doneFunc: () => void) {
        this.expectedResources = expectedResources;
        this.doneFunc = doneFunc;
    }

    public callback(resource: AsyncResource<PayloadType>) {
        const expectedResource = this.expectedResources[this.nextStateIdx];

        expect(resource.pending).toBe(expectedResource.pending);
        expect(resource.data).toBe(expectedResource.data);
        expect(Boolean(resource.error)).toBe(Boolean(expectedResource.error));

        this.nextStateIdx++;
        if (this.nextStateIdx === this.expectedResources.length) {
            this.doneFunc();
        }
    }
}



export class AsyncResourceWithIdCallbackHelper<PayloadType, IdType> {
    private readonly expectedResources: AsyncResourceWithId<PayloadType, IdType>[];
    private readonly doneFunc: () => void;
    private nextStateIdx = 0;

    constructor(expectedResources: AsyncResourceWithId<PayloadType, IdType>[], doneFunc: () => void) {
        this.expectedResources = expectedResources;
        this.doneFunc = doneFunc;
    }

    public callback(resource: AsyncResourceWithId<PayloadType, IdType>) {
        const expectedResource = this.expectedResources[this.nextStateIdx];

        expect(resource.id).toBe(expectedResource.id);
        expect(resource.pending).toBe(expectedResource.pending);
        expect(resource.data).toBe(expectedResource.data);
        expect(Boolean(resource.error)).toBe(Boolean(expectedResource.error));

        this.nextStateIdx++;
        if (this.nextStateIdx === this.expectedResources.length) {
            this.doneFunc();
        }
    }
}