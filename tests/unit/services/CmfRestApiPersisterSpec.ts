/// <reference path='../../_test_all.ts' />

describe('CmfRestApiPersister with restangular', function () {
    'use strict';

    var persister, resource, $q, $rootscope;

    beforeEach(function () {
        resource = jasmine.createSpyObj('Resource', ['one', 'getList']);
        persister = new angularCmf.resource.CmfRestApiPersister(resource);

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

    });

    describe('remove a single resouce', function () {

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
            promise.then(function () {
                expect(true).toBe(false, 'should not have bin called');
            }, function (error: Error) {
                expect(error.message).toBe('some error');
            });

            deferred.reject(new Error('some error'));
            $rootscope.$digest();
        });
    });
});

