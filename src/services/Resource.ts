/// <reference path='../_all.ts' />

module angularCmf.resource {
    export class Resource {
        public Restangular;

        static $inject = ['Restangular'];

        constructor (Restangular) {
            this.Restangular = Restangular;
        }

        static instance(Restangular) {
            let instance;

            instance = Restangular.service('phpcr_repo');
            instance['$get'] = angular.noop;
            instance['changed'] = false;
            instance['pendingUuid'] = null;

            return instance;
        }
    }

    angular.module('angularCmf').factory('Resource', Resource.instance);
}
