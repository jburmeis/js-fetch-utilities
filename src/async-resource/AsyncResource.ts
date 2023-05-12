/*******************************************************************************
 *  Type definitions
 ******************************************************************************/

/**
 * A type definition to encode the status of a resource that is 
 * asynchronously fetched or otherwise created.
 */
type AsyncResourceBase<PayloadType> = {
    pending: boolean;
    data: PayloadType | null;
    error: Error | null;
}

/**
 * A type definition to encode the status of a resource that is 
 * asynchronously fetched or otherwise created. 
 * It extends {@link AsyncResourceBase} with an ID property.
 */
export type AsyncResourceWithId<PayloadType, IdType> = AsyncResourceBase<PayloadType> & {
    id: IdType;
}

/**
 * A type definition to encode the status of a resource that is 
 * asynchronously fetched or otherwise created.
 */
export type AsyncResource<PayloadType, IdType = void> =
    IdType extends void ? AsyncResourceBase<PayloadType> : AsyncResourceWithId<PayloadType, IdType>;

    
// Internal creator method that shall be used in this module (to hopefully reduce bundle size)
function _createAsyncResource<PayloadType>(
    pending: boolean, data: PayloadType | null, error: Error | null
): AsyncResource<PayloadType> {
    return {
        pending: pending,
        data: data,
        error: error
    }
}

// Internal creator method that shall be used in this module (to hopefully reduce bundle size)
function _createAsyncResourceWithId<PayloadType, IdType>(
    id: IdType, pending: boolean, data: PayloadType | null, error: Error | null
): AsyncResourceWithId<PayloadType, IdType> {
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
 * A builder class to create valid instances of {@link AsyncResource}. 
 * This can be more convenient than {@link createAsyncResource} 
 * if you need to create multiple instances for one resource type. 
 */
export class AsyncResourceBuilder<PayloadType> {
    init(): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(false, null, null);
    }

    pending(data?: PayloadType | null): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(true, data ?? null, null);
    }

    appendPending(previousState: AsyncResource<PayloadType>): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(true, previousState.data, previousState.error);
    }

    success(data: PayloadType): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(false, data, null);
    }

    error(error: Error): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(false, null, error);
    }
}

/**
 * A builder class to create valid instances of {@link AsyncResource} with ID. 
 * This can be more convenient than {@link createAsyncResource} 
 * if you need to create multiple instances for one resource type. 
 */
export class AsyncResourceBuilderWithId<PayloadType, IdType> {
    private readonly id: IdType;

    constructor(id: IdType) {
        this.id = id;
    }

    init(): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(this.id, false, null, null);
    }

    pending(data?: PayloadType | null): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(this.id, true, data ?? null, null);
    }

    appendPending(previousState: AsyncResourceWithId<PayloadType, IdType>): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(this.id, true, previousState.data, previousState.error);
    }

    success(data: PayloadType): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(this.id, false, data, null);
    }

    error(error: Error): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(this.id, false, null, error);
    }
}

/**
 * A collection of utility methods to create valid instances of {@link AsyncResource} manually
 */
export const createAsyncResource = {
    init<PayloadType>(): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(false, null, null);
    },

    pending<PayloadType>(data?: PayloadType | null): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(true, data ?? null, null);
    },

    appendPending<PayloadType>(previousState: AsyncResource<PayloadType>): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(true, previousState.data, previousState.error);
    },

    success<PayloadType>(data: PayloadType): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(false, data, null);
    },

    error<PayloadType>(error: Error): AsyncResource<PayloadType> {
        return _createAsyncResource<PayloadType>(false, null, error);
    },
}

/**
 * A collection of utility methods to create valid instances of {@link AsyncResource} with IDs manually
 */
export const createAsyncResourceWithId = {
    init<PayloadType, IdType>(id: IdType): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(id, false, null, null);
    },

    pending<PayloadType, IdType>(id: IdType, data?: PayloadType | null): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(id, true, data ?? null, null);
    },

    appendPending<PayloadType, IdType>(previousState: AsyncResourceWithId<PayloadType, IdType>): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(previousState.id, true, previousState.data, previousState.error);
    },

    success<PayloadType, IdType>(id: IdType, data: PayloadType): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(id, false, data, null);
    },

    error<PayloadType, IdType>(id: IdType, error: Error): AsyncResourceWithId<PayloadType, IdType> {
        return _createAsyncResourceWithId<PayloadType, IdType>(id, false, null, error);
    },
}