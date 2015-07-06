/// <reference path='../_all.ts' />

interface ICacheList {
    registerResource(resource);
    getAll(): any[];
    updateResource(resource);
    isRegistered(id: string);
    get(id: string);
}

module angularCmf.resource {
    'use strict';

    export class LocalCacheList implements ICacheList {

        /**
         * the list of all registered resources
         */
        private list: any[];

        /**
         * Registers a resource by its id or its pending uuid.
         *
         * @param resource
         */
        registerResource(resource) {
            if (_.isUndefined(resource.id)) {
                this.list[resource.pendingUuid] = resource;
            } else {
                this.list[resource.id] = resource;
            }
        }

        /**
         * Returns the complete list of registered resources.
         *
         * @returns {any[]}
         */
        getAll() {
            return this.list;
        }

        isRegistered(id: string) {

        }

        get(id: string) {

        }

        updateResource(resource) {
            if (_.isUndefined(this.list[resource.id])) {
                throw new Error('Resource is not registered');
            }

            _.assign(this.list[resource.id], resource);
        }
    }

    angular.module('angularCmf').service('LocalCacheList', LocalCacheList);
}

