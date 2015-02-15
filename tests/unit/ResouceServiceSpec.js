"use strict";

describe('ResourceService', function() {
    var service, http;

    beforeEach(function() {
        module('symfony-cmf-resource');

        inject(function(_ResourceService_, $httpBackend) {
            service = _ResourceService_;
            http = $httpBackend;
        });
    });

    it('should be defined', function () {
        expect(service).not.toBeNull();
    });

    describe('Find resource', function() {

        beforeEach(function() {
            http.whenGET('api/phpcr_repo/foo').respond(200, truthy_content);
            http.whenGET('api/phpcr_repo/fo').respond(404, {"message":"Oops something went wrong."});
        });

        afterEach(function() {
            http.flush();
        });

        it('should pass the complete resource on success callback', function() {
            var testResource = function(resource) {
                expect(resource.payload.title).toBe('Article 1');
                expect(resource.payload.body).toBe('This is my article');
            };

            var failTest = function(error) {
                expect(error).toBeUndefined();
            };

            service.find(null, '/foo')
                .then(testResource)
                .catch(failTest);
        });

        it('should increase the count of the available resources by one (when no list was there)', function() {
            var testResourcesList = function() {
                expect(service.ResoucesList.length).toBe(1);
            };

            var failTest = function(error) {
                expect(error).toBeUndefined();
            };

            service
                .find(null, '/foo')
                .then(testResourcesList)
                .catch(failTest);
        });

        it('should give an error when the resource does not exists', function() {
            var testResourcesList = function(resource) {
                expect(resource).toBeUndefined();
            };

            var failTest = function(error) {
                expect(error.data.message).toBe("Oops something went wrong.");
            };

            service
                .find(null, '/fo')
                .then(testResourcesList)
                .catch(failTest);
        });
    });
});
