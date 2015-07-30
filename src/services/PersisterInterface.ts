/// <reference path='../_all.ts' />

module angularCmf.resource {
    export interface TypeAwarePersisterInterface extends PersisterInterface{
        supports(type: string): boolean;
    }

    export interface PersisterInterface {
        get(id: string, type: string);
        save(resource: IResource);
        remove(resource: IResource);
        getAll(type: string);
    }
}
