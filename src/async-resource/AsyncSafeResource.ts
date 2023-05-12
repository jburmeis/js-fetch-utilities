/*******************************************************************************
 *  Type definitions
 ******************************************************************************/

/**
* A type definition to encode the status of a resource that is asynchronously fetched or otherwise created. 
* In contrast to {@link AsyncResource} this variant ensures that the data component is always set.
 */
type AsyncSafeResourceBase<PayloadType> = {
    pending: boolean;
    data: PayloadType;
    error: Error | null;
}

/**
* A type definition to encode the status of a resource that is asynchronously fetched or otherwise created.
* It extends {@link AsyncResourceBase} with an ID property.
* In contrast to {@link AsyncResource} this variant ensures that the data component is always set.
 */
export type AsyncSafeResourceWithId<PayloadType, IdType> = AsyncSafeResourceBase<PayloadType> & {
    id: IdType;
}

/**
* A type definition to encode the status of a resource that is asynchronously fetched or otherwise created. 
* In contrast to {@link AsyncResource} this variant ensures that the data component is always set.
 */
export type AsyncSafeResource<PayloadType, IdType = void> =
    IdType extends void ? AsyncSafeResourceBase<PayloadType> : AsyncSafeResourceWithId<PayloadType, IdType>;


// Internal creator method that shall be used in this module (to hopefully reduce bundle size)
function _createAsyncSafeResource<PayloadType>(
    pending: boolean, data: PayloadType, error: Error | null
): AsyncSafeResource<PayloadType> {
    return {
        pending: pending,
        data: data,
        error: error
    }
}

// Internal creator method that shall be used in this module (to hopefully reduce bundle size)
function _createAsyncSafeResourceWithId<PayloadType, IdType>(
    id: IdType, pending: boolean, data: PayloadType, error: Error | null
): AsyncSafeResourceWithId<PayloadType, IdType> {
    return {
        id: id,
        pending: pending,
        data: data,
        error: error
    }
}


/*******************************************************************************
 *  Builder classes & methods
 ******************************************************************************/

/**
 * A builder class to create valid instances of {@link AsyncSafeResource}. 
 * This can be more convenient than {@link createAsyncSafeResource} 
 * if you need to create multiple instances for one resource type. 
 */
export class AsyncSafeResourceBuilder<PayloadType> {
    private readonly data: PayloadType;

    constructor(data: PayloadType) {
        this.data = data;
    }

    static fromCurrentResource<PayloadType>(resource: AsyncSafeResource<PayloadType>)
        : AsyncSafeResourceBuilder<PayloadType> {
        return new AsyncSafeResourceBuilder(resource.data);
    }

    // This is the same as success
    init(): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(false, this.data, null);
    }

    pending(): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(true, this.data, null);
    }

    success(data: PayloadType): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(false, data, null);
    }

    error(error: Error): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(false, this.data, error);
    }
}

/**
 * A builder class to create valid instances of {@link AsyncSafeResource} with ID. 
 * This can be more convenient than {@link createAsyncSafeResource} 
 * if you need to create multiple instances for one resource type. 
 */
export class AsyncSafeResourceBuilderWithId<PayloadType, IdType> {
    private readonly id: IdType;
    private readonly data: PayloadType;

    constructor(id: IdType, data: PayloadType) {
        this.id = id;
        this.data = data;
    }

    static fromCurrentResource<PayloadType, IdType>(resource: AsyncSafeResourceWithId<PayloadType, IdType>)
        : AsyncSafeResourceBuilderWithId<PayloadType, IdType> {
        return new AsyncSafeResourceBuilderWithId(resource.id, resource.data);
    }

    // This is the same as success
    init(): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(this.id, false, this.data, null);
    }

    pending(): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(this.id, true, this.data, null);
    }

    success(data: PayloadType): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(this.id, false, data, null);
    }

    error(error: Error): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(this.id, false, this.data, error);
    }
}

/**
 * A collection of utility methods to create valid instances of {@link AsyncSafeResource} manually
 */
export const createAsyncSafeResource = {
    // This is the same as success
    init<PayloadType>(data: PayloadType): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(false, data, null);
    },

    pending<PayloadType>(data: PayloadType, error?: Error): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(true, data, error ?? null);
    },

    appendPending<PayloadType>(previousState: AsyncSafeResource<PayloadType>): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(true, previousState.data, previousState.error);
    },

    success<PayloadType>(data: PayloadType): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(false, data, null);
    },

    error<PayloadType>(data: PayloadType, error: Error): AsyncSafeResource<PayloadType> {
        return _createAsyncSafeResource<PayloadType>(false, data, error);
    },
}

/**
 * A collection of utility methods to create valid instances of {@link AsyncSafeResource} with IDs manually
 */
export const createAsyncSafeResourceWithId = {
    // This is the same as success
    init<PayloadType, IdType>(id: IdType, data: PayloadType): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(id, false, data, null);
    },

    pending<PayloadType, IdType>(id: IdType, data: PayloadType, error?: Error): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(id, true, data, error ?? null);
    },

    appendPending<PayloadType, IdType>(previousState: AsyncSafeResourceWithId<PayloadType, IdType>): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(previousState.id, true, previousState.data, previousState.error);
    },

    success<PayloadType, IdType>(id: IdType, data: PayloadType): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(id, false, data, null);
    },

    error<PayloadType, IdType>(id: IdType, data: PayloadType, error: Error): AsyncSafeResourceWithId<PayloadType, IdType> {
        return _createAsyncSafeResourceWithId<PayloadType, IdType>(id, false, data, error);
    },
}
