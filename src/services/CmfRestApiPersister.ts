/// <reference path='../_all.ts' />

module angularCmf.resource {
    'use strict';

    class CmfRestApiPersister implements PersisterInterface
    {
        private Resource;
        private Persister;

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

        }

        remove(resource) {

        }
    }

    angular.module('angularCmf').service('CmfRestApiPersister', CmfRestApiPersister)
}
