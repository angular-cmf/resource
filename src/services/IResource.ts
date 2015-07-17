/// <reference path='../_all.ts' />

module angularCmf.resource {
    export interface IResource {
        changed: boolean;
        id: string;
        pendingUuid: string;
        removed: boolean;
    }
}
