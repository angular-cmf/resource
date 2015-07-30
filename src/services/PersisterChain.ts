/// <reference path='../_all.ts' />

module angularCmf.resource {
    export class persisterChain implements ng.IServiceProvider {
        'use strict';

        private listIds: Array <string> = [];
        private list: Array<TypeAwarePersisterInterface> = [];
        private injector;

        public $inject = ['$provide'];

        constructor ($injector) {
            this.injector = $injector;
        }

        public addPersisterById(persisterId) {
            this.listIds.push(persisterId);
        }

        public $get(): PersisterInterface {
            _.each(this.listIds, (id) => {
                this.list.push(this.injector.get(id));
            });

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
