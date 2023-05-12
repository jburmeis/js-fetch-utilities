import { AsyncResource } from "./AsyncResource";

export enum AsyncResourceState {
    Init = "init",
    Pending = "pending",
    Success = "success",
    Error = "error",
}

export function isAsyncResourceInState(resource: AsyncResource<unknown>, state: AsyncResourceState): boolean {
    switch (state) {
        case AsyncResourceState.Init:
            return ((resource.data != null) && !resource.pending && (resource.error != null));
        case AsyncResourceState.Pending:
            return resource.pending;
        case AsyncResourceState.Success:
            return (resource.data != null);
        case AsyncResourceState.Error:
            return (resource.error != null);
    }
}