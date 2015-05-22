describe('ResourceService', function() {
    'use strict';

    describe("Use mocked Services", function () {
        var service, Resource, $q, $rootscope;

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
            var promise, deferred;

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
                    service.ResoucesList.length.should.to.be.equal(1, "ResoucesList should be of length 1 now.");
                    service.ResoucesList[0].id.should.be.equal('some/id');
                });

                deferred.resolve({id: 'some/id'});
                $rootscope.$digest();
            });
        });
    });
});
