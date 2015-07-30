/// <reference path='../_test_all.ts' />
/// <reference path='../fakeApi/truthy-content.ts' />
describe('Module working on fake API', function () {
    var service, $http, $rootScope;
    beforeEach(function () {
        module('angularCmf');
        debugger;
        inject(function (_UnitOfWork_, $httpBackend, _$rootScope_) {
            service = _UnitOfWork_;
            $http = $httpBackend;
            $rootScope = _$rootScope_;
        });
    });
    afterEach(function () {
        try {
            $http.flush();
        }
        catch (erro) {
        }
    });
    describe('find a resource', function () {
        beforeEach(function () {
            $http.whenGET('api/phpcr_repo/foo').respond(200, angularCmf.resource.test.HttpContent.truthy_content);
            $http.whenGET('api/phpcr_repo/fo').respond(404, { "message": "Oops something went wrong." });
        });
        it('should pass the complete resource on success callback', function () {
            var testResource = function (resource) {
                expect(resource.payload.title).toEqual('Article 1');
                expect(resource.payload.body).toEqual('This is my article');
            };
            var failTest = function (error) {
                expect(error).toBe('undefined');
            };
            service.find('/foo')
                .then(testResource)
                .catch(failTest);
            $rootScope.$digest();
        });
        it('should give an error when the resource does not exists', function () {
            var testResourcesList = function (resource) {
                expect(resource).toBe('undefined');
            };
            var failTest = function (error) {
                expect(error.data.message).toBe("Oops something went wrong.");
            };
            service
                .find('/fo')
                .then(testResourcesList)
                .catch(failTest);
            $rootScope.$digest();
        });
    });
    describe('persist a resource', function () {
        it('should set the changed flag to true', function () {
            service.persist({ name: 'some name' }).then(function (data) {
                expect(data.changed).toBe(true);
            });
            $rootScope.$digest();
        });
        it('should be available under the uuid', function () {
            service.persist({ name: 'some name' }).then(function (data) {
                service.find(data.pendingUuid).then(function (persistedResource) {
                    expect(persistedResource.name).toBe('some name');
                });
            });
            $rootScope.$digest();
        });
    });
    describe('flush all changed resources', function () {
        var resource, promise;
        describe('post for a new resource', function () {
            beforeEach(function () {
                resource = { name: 'some name' };
                promise = service.persist(resource);
            });
            it('should return true in success case', function () {
                $http.whenPOST('api/phpcr_repo').respond(200, angularCmf.resource.test.HttpContent.truthy_content);
                promise.then(function () {
                    service.flush().then(function (data) {
                        expect(data).toBe(true);
                    });
                });
                $rootScope.$digest();
            });
            it('should return false in error case', function () {
                $http.whenPOST('api/phpcr_repo').respond(500, {});
                promise.then(function () {
                    service.flush().then(function (data) {
                        expect(data).toBe(false);
                    });
                });
                $rootScope.$digest();
            });
        });
        describe('put for an existing resource', function () {
            beforeEach(function () {
                $http.whenGET('api/phpcr_repo/foo').respond(200, angularCmf.resource.test.HttpContent.truthy_content);
            });
            it('should return true in success case', function () {
                $http.whenPUT('api/phpcr_repo/foo').respond(200, angularCmf.resource.test.HttpContent.truthy_content);
                service.find('foo').then(function (data) {
                    data.name = 'some other name';
                    service.persist(data).then(function (data) {
                        service.flush().then(function (data) {
                            expect(data).toBe(true);
                        });
                    });
                });
                $rootScope.$digest();
            });
            it('should return false in error case', function () {
                $http.whenPUT('api/phpcr_repo/foo').respond(500, {});
                service.find('foo').then(function (data) {
                    data.name = 'some other name';
                    service.persist(data).then(function (data) {
                        service.flush().then(function (data) {
                            expect(data).toBe(false);
                        });
                    });
                });
                $rootScope.$digest();
            });
        });
        describe('remove for removeable resources', function () {
            beforeEach(function () {
                $http.whenGET('api/phpcr_repo/foo').respond(200, angularCmf.resource.test.HttpContent.truthy_content);
            });
            it('should just do it when api likes it', function () {
                $http.whenDELETE('api/phpcr_repo/foo').respond(204);
                service.find('foo').then(function (data) {
                    service.remove(data).then(function (data) {
                        service.flush().then(function (data) {
                            expect(data).toBe(true);
                        });
                    });
                });
                $rootScope.$digest();
            });
            it('should just do it when api does not likes it', function () {
                $http.whenDELETE('api/phpcr_repo/foo').respond(404);
                service.find('foo').then(function (data) {
                    service.remove(data).then(function (data) {
                        service.flush().then(function (data) {
                            expect(data).toBe(false);
                        });
                    });
                });
                $rootScope.$digest();
            });
        });
    });
});
//# sourceMappingURL=UnitOfWorkSpec.js.map