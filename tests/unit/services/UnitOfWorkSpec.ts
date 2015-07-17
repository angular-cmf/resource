/// <reference path='../../_test_all.ts' />

describe('UnitOfWork', function() {
    'use strict';

    var UnitOfWork, $q, $rootscope, promise, deferred, persister, cacheList;

    beforeEach(module('angularCmf'));

    beforeEach(function () {
        module(function ($provide) {
            persister = jasmine.createSpyObj('Persister', ['get', 'save', 'getAll', 'remove']);
            cacheList = jasmine.createSpyObj('CacheList', [
                'registerResource',
                'getAll',
                'updateResource',
                'isRegistered',
                'get',
                'getChangedResources',
                'getRemovedResources',
                'unregisterResource',
                'removeResource'
            ]);

            $provide.value('PhpcrRestApiPersister', persister);
            $provide.value('LocalCacheList', cacheList);
        });

        inject(function ($injector, _$q_, _$rootScope_) {
            $q = _$q_;
            $rootscope = _$rootScope_;
            UnitOfWork = $injector.get('UnitOfWork');
        });
    });

    it('should not be null', function () {
        expect(UnitOfWork).not.toBeNull();
    });

    describe('find single resource', function ()    {
        beforeEach(function () {

        });

        it('should add an entry in the cached list, when it does not exists', function () {
            deferred = $q.defer();
            persister.get.and.returnValue(deferred.promise);
            UnitOfWork.find('/some/id').then(function (data) {
                expect(persister.get).toHaveBeenCalledWith('some/id');
                expect(cacheList.registerResource).toHaveBeenCalledWith({id: 'some/id', name: 'some name'});
            });

            deferred.resolve({id: 'some/id', name: 'some name'});
            $rootscope.$digest();
        });

        it('should use the cached version, when exists', function () {
            cacheList.isRegistered.and.returnValue(true);
            cacheList.get.and.returnValue({id: 'some/id', name: 'some name'});

            UnitOfWork.find('/some/id').then(function (data) {
                expect(data.id).toBe('some/id');
                expect(data.name).toBe('some name');
            });
            expect(cacheList.get).toHaveBeenCalledWith('some/id');
            $rootscope.$digest();
        });

        it('should reject for undefined ids', function () {
            UnitOfWork.find(null).then(function () {}, function (err) {
                expect(err.message).toBe('id must be a string.');
            });

            $rootscope.$digest();
        })
    });

    describe('get a list of resources', function () {
        var resourcesList;

        beforeEach(function () {
            deferred = $q.defer();
            resourcesList = [
                {id: 'some/id'},
                {id: 'some-other/id'}
            ];
            persister.getAll.and.returnValue(deferred.promise);
        });

        it('should increase the number of cached resources by the amount of entries in the list', function () {
            UnitOfWork.findAll().then(function () {
                expect(cacheList.getAll).toHaveBeenCalledWith(resourcesList);
                expect(cacheList.updateResource).toHaveBeenCalled();
            });

            deferred.resolve(resourcesList);
        });

        it('should return promise with the current list of resources', function () {
            cacheList.getAll.and.returnValue(resourcesList);
            UnitOfWork.findAll().then(function (list) {
                expect(list).toEqual(resourcesList);
            });

            deferred.resolve(resourcesList);
            $rootscope.$digest();
        });

        it('should change existing entries in cached list', function () {
            //service.ResourcesList['some/id'] = {id: 'some/id'};
            resourcesList = [
                {id: 'some/id', name: 'Some resource'},
                {id: 'some-other/id'}
            ];

            UnitOfWork.findAll().then(function (list) {

            });

            deferred.resolve(resourcesList);
        });
    });

    describe('persist a resource', function () {
        describe('create new', function () {
            var promise;

            beforeEach(function () {
                promise = UnitOfWork.persist({name: 'some name'});
                cacheList.isRegistered.and.returnValue(false);
            });

            it('should add created resource to the cached list', function () {
                promise.then(function () {
                    expect(cacheList.registerResource).toHaveBeenCalled();
                });

                $rootscope.$digest();
            });

            it('should create a pending uuid on the resource', function () {
                promise.then(function (data) {
                    expect(data.pendingUuid).not.toBeNull();
                });

                $rootscope.$digest();
            });

            it('should set the changed flag to true', function () {
                promise.then(function (data) {
                    expect(data.changed).toBe(true);
                });

                $rootscope.$digest();
            });
        });

        describe('change an existing resource', function () {
            var promise;

            beforeEach(function () {
                cacheList.isRegistered.and.returnValue(false);
                promise = UnitOfWork.persist({id: 'some/id', name: 'some name'});
            });

            it('should have the changes', function () {
                promise.then(function (data) {
                    expect(data.name).toBe('some name');
                });
            });

            it('should set the changed flag to true', function () {
                promise.then(function (data) {
                    expect(data.changed).toBe(true);
                });
            })
        });
    });

    describe('flush resources', function () {
        var promise, changedResources, removedResources;

        describe('for changed ones',  function () {
            beforeEach(function () {
                changedResources = [
                    {id: 'some/id', name: 'some name', changed: true}
                ];
                cacheList.getChangedResources.and.returnValue(changedResources);
                deferred = $q.defer();
                persister.save.and.returnValue(deferred.promise);

                promise = UnitOfWork.flush();
            });

            it('should ask the cache list for the changed resources', function () {
                expect(cacheList.getChangedResources).toHaveBeenCalled();
            });

            it('should pass the changed resources to the persister, to do its work', function () {
                expect(persister.save).toHaveBeenCalledWith({id: 'some/id', name: 'some name', changed: true});
            });

            it('should update the saved resource in the local cache list', function () {
                deferred.resolve({id: 'some/id', name: 'some name', info: 'some additional information'});
                $rootscope.$digest();

                expect(cacheList.updateResource).toHaveBeenCalledWith({id: 'some/id', name: 'some name', changed: false, info: 'some additional information'});
            });

            it('should return true for success', function () {
                promise.then(function (data) {
                    expect(data).toBe(true);
                });
                deferred.resolve({id: 'some/id', name: 'some name', changed: false, info: 'some additional information'})
                $rootscope.$digest();
            });
        });

        describe('for removed ones',  function () {
            beforeEach(function () {
                removedResources = [
                    {id: 'some/id', name: 'some name', removed: true}
                ];
                cacheList.getRemovedResources.and.returnValue(removedResources);
                deferred = $q.defer();
                persister.remove.and.returnValue(deferred.promise);

                promise = UnitOfWork.flush();
            });

            it('should ask the cache list for the removed resources', function () {
                expect(cacheList.getRemovedResources).toHaveBeenCalled();
            });

            it('should remove resources (call persister)', function () {
                expect(persister.remove).toHaveBeenCalledWith({id: 'some/id', name: 'some name', removed: true});
            });

            it('should remove the removed resources from the cached list', function () {
                deferred.resolve(true);
                $rootscope.$digest();

                expect(cacheList.removeResource).toHaveBeenCalledWith({id: 'some/id', name: 'some name', removed: true});
            });

            it('should return true for success', function () {
                promise.then(function (data) {
                    expect(data).toBe(true);
                });

                deferred.resolve(true);
                $rootscope.$digest();
            })
        });
    });

    describe('remove a resource', function () {
        var promise, resource;

        beforeEach(function () {
            resource = {id: 'some/id'};
            promise = UnitOfWork.remove(resource);
        });

        it('should reduce the local cache list', function () {
            promise.then(function (data) {
                expect(cacheList.unregisterResource).toHaveBeenCalledWith(resource);
            });

            $rootscope.$digest();
        });
    });
});
