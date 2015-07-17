/// <reference path='../_all.ts' />

module angularCmf.resource {
    'use strict';

    export class CmfRestApiPersister implements PersisterInterface
    {
        /**
         * @var angularCmf.resource.Resource
         */
        private Resource;

        /**
         * @var restangular.IElement
         */
        private Restangular;

        static $inject = ['Resource', 'Restangular'];

        constructor(resource: Resource, restangular: restangular.IElement) {
            this.Resource = resource;
            this.Restangular = restangular;
        }

        get(id: string) {
            return this.Resource.one(id).get();
        }

        save(resource) {
            if (!_.isUndefined(resource.id)) {
                return resource.put();
            } else {
                return this.Resource.post(resource);
            }
        }

        getAll() {
            return this.Resource.getList();
        }

        remove(resource) {
            if (null === resource.id && null !== resource.pendingUuid) {
                throw new Error('Can\'t remove the resource at the api - does not exists. (pending uuid set)');
            }

            return resource.remove();
        }
    }

    angular.module('angularCmf').service('CmfRestApiPersister', CmfRestApiPersister)
}
