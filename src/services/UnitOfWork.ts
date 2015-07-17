/// <reference path='../_all.ts' />

module angularCmf.resource {
    'use strict';

    class UnitOfWork implements UnitOfWorkInterface {
        private Persister: PersisterInterface;
        private CacheList: LocalCacheList;
        private $q;

        static $inject = ['CmfRestApiPersister', 'LocalCacheList', '$q'];

        constructor(persister: PersisterInterface, cacheList: LocalCacheList, $q) {
            this.Persister = persister;
            this.CacheList = cacheList;
            this.$q = $q;
        }

        find(id: string) {
            var deferred = this.$q.defer();
            if (!_.isString(id)) {
                deferred.reject(new Error('id must be a string.'));

                return deferred.promise;
            }

            var cleanId = this.removeTrailingSlash(id);
            if (this.CacheList.isRegistered(cleanId)) {
                deferred.resolve(this.CacheList.get(cleanId));

                return deferred.promise;
            }

            // get a fresh resource from the persister
            return this.Persister.get(cleanId).then((resource) => {
                this.CacheList.registerResource(resource);

                return resource;
            });
        }

        persist(resource) {
            var deferred = this.$q.defer();
            resource.changed = true;

            // a newly created resource should be added to the local list only
            if (!this.CacheList.isRegistered(resource.id)) {
                resource.pendingUuid = this.guid();
                this.CacheList.registerResource(resource);
            } else {
                this.CacheList.updateResource(resource);
            }
            deferred.resolve(resource);

            return deferred.promise;
        }

        remove(resource) {
            var deferred = this.$q.defer();
            resource.removed = true;

            if (this.CacheList.unregisterResource(resource)) {
                deferred.resolve(resource);
            } else {
                deferred.reject(resource);
            }

            return deferred.promise;
        }

        flush() {
            var promises = [];

            _.each(this.CacheList.getChangedResources(), (resource) => {
                promises.push(this.Persister.save(resource).then((data) => {
                    resource.changed = false;
                    _.assign(resource, data);

                    return this.CacheList.updateResource(resource);
                }));
            });

            return this.$q.all(promises).then(() => {return true}, () => {return false});
        }

        findAll() {
            return this.Persister.getAll().then((resourceList) => {
                _.each(resourceList, (resource) => {
                    this.CacheList.updateResource(resource);
                });

                return this.CacheList.getAll();
            });
        }

        private removeTrailingSlash(str: string) {
            if (str.indexOf('/') === 0) {
                str = str.substring(1, str.length);
            }

            return str;
        }

        private guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }

    angular.module('angularCmf').service('UnitOfWork', UnitOfWork);
}
