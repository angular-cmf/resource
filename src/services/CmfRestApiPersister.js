/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource_1) {
        'use strict';
        var CmfRestApiPersister = (function () {
            function CmfRestApiPersister(resource) {
                this.Resource = resource;
            }
            CmfRestApiPersister.prototype.get = function (id) {
                return this.Resource.one(id).get();
            };
            CmfRestApiPersister.prototype.save = function (resource) {
            };
            CmfRestApiPersister.prototype.getAll = function () {
                return this.Resource.getList();
            };
            CmfRestApiPersister.prototype.remove = function (resource) {
            };
            CmfRestApiPersister.$inject = ['Resource'];
            return CmfRestApiPersister;
        })();
        resource_1.CmfRestApiPersister = CmfRestApiPersister;
        angular.module('angularCmf').service('CmfRestApiPersister', CmfRestApiPersister);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));
//# sourceMappingURL=CmfRestApiPersister.js.map