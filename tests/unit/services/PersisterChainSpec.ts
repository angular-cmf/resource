/// <reference path='../../_test_all.ts' />

describe('PersisterChainSpec', function () {
    'use strict';

    var chainProvider, chain, persisterTrue, persisterFalse, injector;

    beforeEach(module('angularCmf'));

    beforeEach(function() {
        persisterTrue = jasmine.createSpyObj('PersisterTrue', ['get', 'save', 'remove', 'getAll', 'supports']);
        persisterFalse = jasmine.createSpyObj('PersisterFalse', ['get', 'save', 'remove', 'getAll', 'supports']);
        injector = jasmine.createSpyObj('injector', ['get']);
        persisterFalse.supports.and.returnValue(false);
        persisterTrue.supports.and.returnValue(true);

        chainProvider = new angularCmf.resource.persisterChain(injector);

        chainProvider.addPersisterById('PersisterTrue');
        chainProvider.addPersisterById('PersisterFalse');

        injector.get.and.callFake(function (id) {
           return  id === 'PersisterFalse' ? persisterFalse : persisterTrue;
        });

        chain = chainProvider.$get();
    });

    it('should be defined', function () {
        expect(chainProvider).not.toBeNull();
    });

    it('should return non null result for $get', function () {
        expect(chain).not.toBeNull();
    });

    _.each(['get', 'save', 'remove', 'getAll'], (method: string) => {
        describe(method.toUpperCase() + ' a resource', function () {
            var result, resource;
            beforeEach(function () {
                persisterTrue[method].and.returnValue('value');
                if ('get' === method) {
                    result = chain[method]('some-id', 'some_type');
                } else if('save' === method || 'remove' === method) {
                    resource = {type: 'some_type'};
                    result = chain[method](resource);
                } else if ('getAll' === method) {
                    result = chain[method]('some_type');
                }
            });

            it('should return the persister value', function () {
                expect(result).toBe('value');
            });

            it('should call the supports method for both', function () {
                expect(persisterFalse.supports).toHaveBeenCalledWith('some_type');
                expect(persisterTrue.supports).toHaveBeenCalledWith('some_type');
            });
        });
    });
});
