/// <reference path='../_all.ts' />

interface PersisterInterface {
    get(id: string);
    save(resource);
    remove(resource);
    getAll();
}
