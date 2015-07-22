/// <reference path='../../_test_all.ts' />

describe('PersisterChainSpec', function () {
    'use strict';

    var chain;

    beforeEach(module('angularCmf'));

    beforeEach(function() {
        inject(function ($injector) {
            chain = $injector.get('PersisterChain');
        });
    });

    it('should be defined', function () {
        expect(chain).not.toBeNull();
    });
});
