import { AsyncResource } from "./AsyncResource";
import { AsyncResourceState, isAsyncResourceInState } from "./AsyncResourceState";

/**
 * Returns if the collection of resources contains at least one in the given state
 */
export function anyResourceInState(
    state: AsyncResourceState,
    ...resources: AsyncResource<unknown>[]
): boolean {
    return Boolean(resources.some(resource => isAsyncResourceInState(resource, state)));
}

/**
 * Returns if the collection of resources are all in the given state
 */
export function allResourcesInState(
    state: AsyncResourceState,
    ...resources: AsyncResource<unknown>[]
): boolean {
    return Boolean(resources.every(resource => isAsyncResourceInState(resource, state)));
}

/**
 * Returns if the collection of resources contains none in the given state
 */
export function noResourceInState(
    state: AsyncResourceState,
    ...resources: AsyncResource<unknown>[]
): boolean {
    return (resources.filter(resource => isAsyncResourceInState(resource, state)).length !== 0);
}

/**
 * Returns the number of resources in the given state
 */
export function countResourcesInState(
    state: AsyncResourceState,
    ...resources: AsyncResource<unknown>[]
): number {
    return resources.filter(resource => isAsyncResourceInState(resource, state)).length;
}