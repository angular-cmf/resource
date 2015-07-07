describe('UnitOfWork', function() {
    'use strict';

    var service, Resource, $q, $rootscope, promise, deferred, persister, cacheList;

    beforeEach(module('angularCmf'));

    beforeEach(function () {
        module(function ($provide) {
            persister = jasmine.createSpyObj('Persister', ['get', 'save', 'getAll', 'remove']);
            cacheList = jasmine.createSpyObj('CacheList', [
                'registerResource',
                'getAll',
                'updateResource',
                'isRegistered',
                'get'
            ]);

            $provide.value('CmfRestApiPersister', persister);
            $provide.value('LocalCacheList', cacheList);
        });

        inject(function ($injector, _$q_, _$rootScope_) {
            $q = _$q_;
            $rootscope = _$rootScope_;
            service = $injector.get('UnitOfWork');
        });
    });

    it('should not be null', function () {
        expect(service).not.toBeNull();
    });

    describe("find single resource", function () {
        beforeEach(function () {
            deferred = $q.defer();

            persister.get.and.returnValue(deferred.promise);

            promise = service.find('/some/id');
        });

        it('should add an entry in the cached list', function () {
        });

        it('should use the cached version, when exists', function () {
        });

        it('should reject for undefined ids', function () {

        })
    });

    describe("get a list of resources", function () {
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
            service.findAll().then(function () {

            });

            deferred.resolve(resourcesList);
        });

        it('should return promise with the current list of resources', function () {
            service.findAll().then(function (list) {

            });

            deferred.resolve(resourcesList);
        });

        it('should change existing entries in cached list', function () {
            //service.ResourcesList['some/id'] = {id: 'some/id'};
            resourcesList = [
                {id: 'some/id', name: 'Some resource'},
                {id: 'some-other/id'}
            ];

            service.findAll().then(function (list) {

            });

            deferred.resolve(resourcesList);
        });
    });

    describe("persist a resource", function () {
        describe('create new', function () {
            var promise;

            beforeEach(function () {
                promise = service.persist({name: 'some name'});
            });

            it('should add created resource to the cached list', function () {
                promise.then(function () {

                });
            });

            it('should create a pending uuid on the resource', function () {
                promise.then(function (data) {
                    expect(data.pendingUuid).not.toBeNull();
                });
            });

            it('should set the changed flag to true', function () {
                promise.then(function (data) {
                    expect(data.changed).toBe(true);
                });
            });
        });

        describe('change an existing resource', function () {
            var promise;

            beforeEach(function () {
                //service.ResourcesList = {'some/id': 'test name'};
                promise = service.persist({id: 'some/id', name: 'some name'});
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

    describe("flush resources", function () {
        var promise;

        beforeEach(function () {
            promise = service.flush();
        });
    })
});
