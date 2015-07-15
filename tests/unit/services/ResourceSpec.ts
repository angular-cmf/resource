/// <reference path='../../_test_all.ts' />

describe('Resource', function() {
    'use strict';
    var Resource, Restangular;

    beforeEach(module('angularCmf'));

    beforeEach(function() {
        Restangular = jasmine.createSpyObj('Resource', ['service']);
        Restangular.service.and.returnValue({});

        inject(function ($injector) {
            Resource = $injector.get('Resource');
        });
    });

    it('should be defined', function () {
        expect(Resource).not.toBeNull();
    });

    it('should have changed property set to false', function () {
        expect(Resource.changed).toBe(false);
    });

    it('should have set the pending uuid set to null', function () {
        expect(Resource.pendingUuid).toBeNull();
    });

    it('should have set the id to null on default', function () {
       expect(Resource.id).toBeNull();
    });
});
