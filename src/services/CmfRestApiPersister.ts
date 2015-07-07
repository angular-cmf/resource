/// <reference path='../_all.ts' />

module angularCmf.resource {
    'use strict';

    export class CmfRestApiPersister implements PersisterInterface
    {
        private Resource;

        static $inject = ['Resource'];

        constructor(resource: Resource) {
            this.Resource = resource;
        }

        get(id: string) {
            return this.Resource.one(id).get();
        }

        save(resource) {

        }

        getAll() {
            return this.Resource.getList();
        }

        remove(resource) {

        }
    }

    angular.module('angularCmf').service('CmfRestApiPersister', CmfRestApiPersister)
}
