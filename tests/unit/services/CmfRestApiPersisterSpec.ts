/// <reference path='../../_test_all.ts' />

describe('CmfRestApiPersister with restangular', function () {
    'use strict';

    var persister, resource, $q, $rootscope, restangular;

    beforeEach(function () {
        resource = jasmine.createSpyObj('Resource', ['one', 'getList']);
        restangular = jasmine.createSpyObj('Restangular', ['clone']);
        persister = new angularCmf.resource.CmfRestApiPersister(resource, restangular);

        inject(function (_$q_, _$rootScope_) {
            $q = _$q_;
            $rootscope = _$rootScope_;
        });
    });

    it('should not be null', function () {
        expect(persister).not.toBeNull();
    });

    describe('get a single resource', function () {
        var promise, deferred;

        beforeEach(function () {
            deferred = $q.defer();

            resource.one.and.returnValue({
                get: function () {
                    return deferred.promise;
                }

            });

            promise = persister.get('/some/id');
        });

        it('should serve the resolved data', function () {
            promise.then(function (value) {
                expect(value.id).toBe('some/id');
            });

            deferred.resolve({id: 'some/id'});
            $rootscope.$digest();
        });

        it('should reject with an error message', function () {
            promise.then(function () {
                expect(true).toBe(false);
            }, function (error: Error) {
                expect(error.message).toBe('some error');
            });

            deferred.reject(new Error('some error'));
            $rootscope.$digest();
        });
    });

    describe('save a single resource', function () {
        var promise, deferred, restangularResource;

        beforeEach(function () {
            deferred = $q.defer();
        });

        describe('post it (pending uuid exists id not)', function () {
            beforeEach(function () {
                restangularResource = jasmine.createSpyObj('Resource', ['post']);
                restangular.clone.and.returnValue(restangularResource);
                restangularResource.post.and.returnValue(deferred.promise);

                resource = {pendingUuid: 'some uuid', name: 'some name'};
                promise = persister.save(resource);
            });

            it('should clone the restangular, to get a new resource', function () {
                expect(restangular.clone).toHaveBeenCalled();
            });

            it('should post the resource', function () {
                expect(restangularResource.post).toHaveBeenCalledWith(resource);
            });
        });

        describe('put it (id exists so the resource too)', function () {
            beforeEach(function () {
                resource = jasmine.createSpyObj('Resource', ['put']);

                promise = persister.save(resource);
            });

            it('should put the resource', function () {
                expect(resource.put).toHaveBeenCalled();
            })
        });
    });

    describe('remove a single resource', function () {

    });

    describe('get all resources', function () {
        var promise, deferred, resourcesList;

        beforeEach(function () {
            deferred = $q.defer();

            resource.getList.and.returnValue(deferred.promise);
            resourcesList = [
                {id: 'some/id'},
                {id: 'some-other/id'}
            ];
            promise = persister.getAll();
        });

        it('should serve the resolved data', function () {
            promise.then(function (value) {
                expect(value.length).toBe(2);
                expect(value).toBe(resourcesList);
            });

            deferred.resolve(resourcesList);
            $rootscope.$digest();
        });

        it('should reject with an error message', function () {
            promise.then(function () {}, function (error: Error) {
                expect(error.message).toBe('some error');
            });

            deferred.reject(new Error('some error'));
            $rootscope.$digest();
        });
    });
});

