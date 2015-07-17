/// <reference path='../_all.ts' />


module angularCmf.resource {
    export interface IResource {
        changed: boolean;
        id: string;
        pendingUuid: string;
        removed: boolean;
    }
    export class Resource {
        private Restangular;

        static $inject = ['Restangular'];

        constructor (Restangular) {
            this.Restangular = Restangular;

        }

        static instance(Restangular) {
            var instance: IResource;

            instance = Restangular.service('phpcr_repo');
            instance['$get'] = angular.noop;
            instance['changed'] = false;
            instance['pendingUuid'] = null;
            instance['id'] = null;

            return instance;
        }
    }

    angular.module('angularCmf').factory('Resource', Resource.instance);
}
