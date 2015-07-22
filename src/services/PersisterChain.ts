/// <reference path='../_all.ts' />

module angularCmf.resource {
    export class PersisterChain {
        'use strict';

        list: Array<TypeAwarePersisterInterface>;

        addPersister(persister: TypeAwarePersisterInterface) {
            this.list.push(persister);
        }

        $get(): PersisterInterface {
            return {
                get: (id: string, type: string) => {
                    _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                        if (persister.supports(type)) {
                          return persister.get(id, type);
                        }
                    });

                    return null;
                },
                save: (resource: IResource) => {
                    _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                        if (persister.supports(resource.type)) {
                            return persister.save(resource);
                        }
                    });

                    return null;
                },
                remove:  (resource: IResource) => {
                    _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                        if (persister.supports(resource.type)) {
                            return persister.remove(resource);
                        }
                    });

                    return null;
                },
                getAll:  (type: string) => {
                    _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                        if (persister.supports(type)) {
                            return persister.getAll(type);
                        }
                    });

                    return null;
                }
            };
        }
    }

    angular.module('angularCmf').provider('PersisterChain', PersisterChain);
}
