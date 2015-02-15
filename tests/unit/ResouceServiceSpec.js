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
    });
});
