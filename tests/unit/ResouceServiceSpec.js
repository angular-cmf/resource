describe('ResourceService', function() {
    'use strict';

    var service, Resource, $q, $rootscope, promise, deferred;

    beforeEach(module('symfony-cmf-resource'));

    beforeEach(function () {
        module(function ($provide) {
            Resource = {
                post: function () {},
                put: function () {},
                getList: function () {},
                one: function () {
                    return {
                        get: function () {}
                    };
                }
            };

            $provide.value('Resource', Resource);
            $provide.value('Restangular', {});
        });

        inject(function ($injector, _$q_, _$rootScope_) {
            $q = _$q_;
            $rootscope = _$rootScope_;
            service = $injector.get("ResourceService");
        });
    });

    it('should not be null', function () {
        expect(service).not.to.be.null();
    });

    describe("find single resource", function () {
        beforeEach(function () {
            deferred = $q.defer();

            // mock the answers of Resource.one().get()
            sinon.stub(Resource, 'one').returns({
                get: function () {
                    return deferred.promise;
                }

            });

            promise = service.find(null, '/some/id');
        });

        it('should serve the resolved data', function () {
            promise.then(function (value) {
                expect(value.id).to.equal('some/id');
            });

            deferred.resolve({id: 'some/id'});
            $rootscope.$digest();
        });

        it('should add an entry in the cached list of resources', function () {
            promise.then(function (value) {
                _.values(service.ResourcesList).length.should.to.be.equal(1);
                service.ResourcesList['some/id'].should.not.equal(null);
            });

            deferred.resolve({id: 'some/id'});
            $rootscope.$digest();
        });

        it('should use the cached version, when exists', function () {

            service.ResourcesList['some/id'] = {id: 'some/id', name: 'Some name'};
            promise.then(function (resource) {
                resource.name.should.equal('Some name');
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

            sinon.stub(Resource, 'getList').returns(deferred.promise);
        });

        it('should increase the number of cached resources by the amount of entries in the list', function () {
            service.getAll().then(function () {
                _.values(service.ResourcesList).length.should.be.equal(resourcesList.length);
            });

            deferred.resolve(resourcesList);
            $rootscope.$digest();
        });

        it('should return promise with the current list of resources', function () {
            service.getAll().then(function (list) {
                list.should.be.equal(service.ResourcesList);
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

            service.getAll().then(function (list) {
                _.values(service.ResourcesList).length.should.equal(2);
                service.ResourcesList['some/id'].name.should.equal('Some resource');
            });

            deferred.resolve(resourcesList);
            $rootscope.$digest();
        });
    });
});
