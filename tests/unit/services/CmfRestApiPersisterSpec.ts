/// <reference path='../../_test_all.ts' />

describe('PhpcrRestApiPersister with restangular', function () {
    'use strict';

    var persister, resource, $q, $rootscope, restangular;

    beforeEach(function () {
        resource = jasmine.createSpyObj('PhpcrRepoResource', ['one', 'getList', 'post', 'put', 'remove']);
        restangular = jasmine.createSpyObj('Restangular', ['clone', 'service']);

        persister = new angularCmf.resource.PhpcrRestApiPersister(resource, restangular);

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
        var promise, deferred, resourceToPersist;

        beforeEach(function () {
            deferred = $q.defer();
        });

        describe('post it (pending uuid exists id not)', function () {
            beforeEach(function () {
                resource.post.and.returnValue(deferred.promise);

                resourceToPersist = {pendingUuid: 'some uuid', name: 'some name'};
                promise = persister.save(resourceToPersist);
            });

            it('should post the resource', function () {
                expect(resource.post).toHaveBeenCalledWith(resourceToPersist);
            });
        });

        describe('put it (id exists so the resource too)', function () {
            beforeEach(function () {
                resourceToPersist = jasmine.createSpyObj('ResourceObject', ['put']);
                resourceToPersist['id'] = 'some/id';
                resourceToPersist['name'] = 'some name';
                resourceToPersist.put.and.returnValue(deferred.promise);

                promise = persister.save(resourceToPersist);
            });

            it('should put the resource', function () {
                expect(resourceToPersist.put).toHaveBeenCalled();
            });
        });
    });

    describe('remove a single resource', function () {
        var promise, deferred, resourceToRemove;

        beforeEach(function () {
            deferred = $q.defer();
        });

        describe('remove it (pending uuid exists id not', function () {
            beforeEach(function () {
                resource.remove.and.returnValue(deferred.promise);

                resourceToRemove = {pendingUuid: 'some uuid', name: 'some name', id: null};
            });

            it('should throw an exception - cause the resource is only local', function () {
                expect(function () {
                    persister.remove(resourceToRemove);
                }).toThrowError(/does not exists/);
            });
        });

        describe('remove it (id exists pending uuid not', function () {
            beforeEach(function () {
                resourceToRemove = jasmine.createSpyObj('PhpcrRepoResource', ['remove']);
                resourceToRemove.remove.and.returnValue(deferred.promise);
                resourceToRemove['pendingUuid'] = null;
                resourceToRemove['name'] = 'some name';
                resourceToRemove['id'] = 'some/id';

                promise = persister.remove(resourceToRemove);
            });

            it('should remove the resource at the api', function () {
                expect(resourceToRemove.remove).toHaveBeenCalled();
            });
        });
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

