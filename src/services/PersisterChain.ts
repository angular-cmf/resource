/// <reference path='../_all.ts' />

module angularCmf.resource {
    export class persisterChain implements ng.IServiceProvider {
        'use strict';

        private list: Array<TypeAwarePersisterInterface> = [];

        public addPersister(persister: TypeAwarePersisterInterface) {
            this.list.push(persister);
        }

        public $get(): PersisterInterface {
            return {
                get: (id: string, type: string) => {
                    var result = _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                       return persister.supports(type);
                    });
                    var persister = result.shift();

                    return persister.get(id, type);
                },
                save: (resource: IResource) => {
                    var result = _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                        return persister.supports(resource.type);
                    });
                    var persister = result.shift();

                    return persister.save(resource);
                },
                remove:  (resource: IResource) => {
                    var result = _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                        return persister.supports(resource.type);
                    });
                    var persister = result.shift();

                    return persister.remove(resource);
                },
                getAll:  (type: string) => {
                    var result = _.each(this.list, (persister: TypeAwarePersisterInterface) => {
                        return persister.supports(type);
                    });
                    var persister = result.shift();

                    return persister.getAll(type);
                }
            };
        }
    }

    angular.module('angularCmf').provider('persisterChain', persisterChain);
}
