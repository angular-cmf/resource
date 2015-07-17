/// <reference path='../_all.ts' />

module angularCmf.resource {
    'use strict';

    interface ICacheList {
        registerResource(resource);
        getAll();
        updateResource(resource);
        isRegistered(id: string);
        get(id: string);
        getChangedResources(): Array<IResource>;
        getRemovedResources(): Array<IResource>;
        unregisterResource(resource: IResource): void;
        removeResource(resource: IResource): boolean;
    }

    export class LocalCacheList implements ICacheList {

        /**
         * the list of all registered resources
         */
        private list: _.Dictionary<angularCmf.resource.IResource> = {};

        /**
         * Registers a resource by its id or its pending uuid.
         *
         * @param resource
         */
        registerResource(resource) {
            if (_.isString(resource.id)) {
                if (!this.isRegistered(resource.id)) {
                    this.list[resource.id] = resource;

                    return true;
                }

                throw  new Error('Problems while registering ' + resource.id + '. It is still registered with its id.');
            } else if (null !== resource.pendingUuid) {
                if (!this.isRegistered(resource.pendingUuid)) {
                    this.list[resource.pendingUuid] = resource;
                    return true;
                }

                throw  new Error('Problems while registering ' + resource.pendingUuid + '. It is still registered with its pending uuid.');
            }

            throw  new Error('Problems while registering resource. Id nor uuid is set.');
        }

        /**
         * Returns the complete list of registered resources.
         *
         * @returns {any[]}
         */
        getAll() {
            return this.list;
        }

        /**
         * Return all changed resources
         *
         * @returns {TResult[]}
         */
        getChangedResources():Array<IResource>  {
            return this.getResourcesBy('changed', true);
        }

        getRemovedResources():Array<IResource> {
            return this.getResourcesBy('removed', true);
        }

        /**
         * Fetch a resource by a property and its value.
         *
         * @param property
         * @param value
         * @returns {Array}
         */
        private getResourcesBy(property: string, value: any): Array<IResource> {
            var resources = [];

            _.forEach(this.list, function (resource) {
                if (resource[property] === value) {
                    resources.push(resource);
                }
            });

            return resources;
        }

        /**
         * Checks whether the resource is registered. The registration can done by its id or an uuid.
         * @param id
         *
         * @returns {boolean}
         */
        isRegistered(id: string) {
            return !_.isUndefined(this.list[id]);
        }

        /**
         * @param id
         *
         * @returns {*}
         */
        get(id: string) {
            if (this.isRegistered(id)) {
                return this.list[id];
            }

            return null;
        }

        /**
         * Updates an existing resource.
         *
         * Those resources can be found by its pending uuid or its id.
         * When a resource with a pending uuid should be updated and has a id now, it will be registered with
         * its id then.
         *
         * @param resource
         * @returns {boolean}
         */
        updateResource(resource) {
            if (null !== resource.pendingUuid && null !== resource.id) {
                if (this.isRegistered(resource.pendingUuid)) {
                    this.list[resource.id] = resource;
                    delete this.list[resource.pendingUuid];

                    return true;
                }
            } else if (null !== resource.id) {
                if (this.isRegistered(resource.id)) {
                    _.assign(this.list[resource.id], resource);

                    return true;
                }
            } else if (null !== resource.pendingUuid) {
                if (this.isRegistered(resource.pendingUuid)) {
                    _.assign(this.list[resource.pendingUuid], resource);

                    return true;
                }
            }

            throw  new Error('Problems while updating resource.');
        }

        /**
         * To remove a resource from the current list.
         *
         * @param resource
         */
        unregisterResource(resource:IResource): void {
            resource.removed = true;
            this.updateResource(resource);
        }

        /**
         * Removes a resource from the list of resources.
         *
         * @param resouce
         * @returns {boolean}
         */
        removeResource(resouce: IResource): boolean {
            if (this.isRegistered(resouce.id)) {
                delete this.list[resouce.id];

                return true;
            } else if (this.isRegistered(resouce.pendingUuid)) {
                delete this.list[resouce.pendingUuid];

                return true;
            }

            return false;
        }
    }

    angular.module('angularCmf').service('LocalCacheList', LocalCacheList);
}

