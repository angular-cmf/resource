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
            let cleanId = this.removeTrailingSlash(id);
            let deferred = this.$q.defer();

            if (_.isUndefined(cleanId)) {
                deferred.reject(new Error('id must not be undefined.'));
            } else if (this.CacheList.isRegistered(cleanId)) {
                deferred.resolve(this.CacheList.get(id));
            } else {
                this.Persister.get(id).then((resource) => {
                    this.CacheList.registerResource(resource);
                });
            }

            return deferred.promise
        }

        persist(resource) {
            let deferred = this.$q.defer();

            // a newly created resource should be added to the local list only
            if (this.CacheList.isRegistered(resource.id)) {
                this.CacheList.registerResource(resource);
            } else {
                this.CacheList.updateResource(resource);
            }

            deferred.resolve(resource);

            return deferred.promise;
        }

        remove(resource) {
            let deferred = this.$q.defer();

            return deferred.promise;
        }

        flush() {
            let deferred = this.$q.defer();

            return deferred.promise;
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
    }

    angular.module('angularCmf').service('UnitOfWork', UnitOfWork);
}
