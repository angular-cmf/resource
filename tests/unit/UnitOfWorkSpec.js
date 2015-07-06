describe('UnitOfWork', function() {
    'use strict';

    var service, Resource, $q, $rootscope, promise, deferred;

    beforeEach(module('angularCmf'));

    beforeEach(function () {
        module(function ($provide) {
            Resource = jasmine.createSpyObj('Resource', ['get', 'post', 'put', 'getList', 'one']);

            $provide.value('Resource', Resource);
            $provide.value('Restangular', {});
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

            Resource.one.and.returnValue({
                get: function () {
                    return deferred.promise;
                }

            });

            promise = service.find('/some/id');
        });

        it('should serve the resolved data', function () {
            promise.then(function (value) {
                expect(value.id).toBe('some/id');
            });

            deferred.resolve({id: 'some/id'});
            $rootscope.$digest();
        });

        it('should add an entry in the cached list of resources', function () {
            promise.then(function (value) {
                expect(_.values(service.ResourcesList).length).toBe(1);
                expect(service.ResourcesList['some/id']).not.toBe(null);
            });

            deferred.resolve({id: 'some/id'});
            $rootscope.$digest();
        });

        it('should use the cached version, when exists', function () {

            service.ResourcesList['some/id'] = {id: 'some/id', name: 'Some name'};
            promise.then(function (resource) {
                expect(resource.name).toBe('Some name');
            });

            deferred.resolve({id: 'some/id'});
            $rootscope.$digest();
        });
    });

    describe("get a list of resources", function () {
        var resourcesList;

        beforeEach(function () {
            deferred = $q.defer();
            resourcesList = [
                {id: 'some/id'},
                {id: 'some-other/id'}
            ];
            Resource.getList.and.returnValue(deferred.promise);
        });

        it('should increase the number of cached resources by the amount of entries in the list', function () {
            service.findAll().then(function () {
                expect(_.values(service.ResourcesList).length).toEqual(resourcesList.length);
            });

            deferred.resolve(resourcesList);
            $rootscope.$digest();
        });

        it('should return promise with the current list of resources', function () {
            service.findAll().then(function (list) {
                expect(list).toEqual(service.ResourcesList);
            });

            deferred.resolve(resourcesList);
            $rootscope.$digest();
        });

        it('should change existing entries in cached list', function () {
            service.ResourcesList['some/id'] = {id: 'some/id'};
            resourcesList = [
                {id: 'some/id', name: 'Some resource'},
                {id: 'some-other/id'}
            ];

            service.findAll().then(function (list) {
                expect(_.values(service.ResourcesList).length).toEqual(2);
                expect(service.ResourcesList['some/id'].name).toEqual('Some resource');
            });

            deferred.resolve(resourcesList);
            $rootscope.$digest();
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
                    expect(_.size(service.ResourcesList)).toBe(1);
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
                service.ResourcesList = {'some/id': 'test name'};
                promise = service.persist({id: 'some/id', name: 'some name'});
            });

            it('should have the changes', function () {
                promise.then(function (data) {
                    expect(data.name).toBe('some name');
                });

                $rootscope.$digest();
            });

            it('should set the changed flag to true', function () {
                promise.then(function (data) {
                    expect(data.changed).toBe(true);
                });
                $rootscope.$digest();
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
