/// <resource path='../_all.ts' />

interface UnitOfWorkInterface {
    find(id: string);
    persist(resource);
    findAll();
    remove(resouce);
    flush();
}
