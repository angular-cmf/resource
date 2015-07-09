/// <reference path='../../_test_all.ts' />

describe('LocalCacheList', function () {
    'use strict';

    var list;

    beforeEach(function () {
        list = new angularCmf.resource.LocalCacheList();
    });

    it('should not be null', function () {
        expect(list).not.toBeNull();
    });

    describe('registering a resource', function () {
        describe('by an id', function () {
            var resource;

            beforeEach(function () {
                resource = {id: 'some/id', pendingUuid: null};
            });

            it('should return true for successful registration', function () {
                expect(list.registerResource(resource)).toBe(true);
            });

            it('should be possible to get the newly created resource by its id', function () {
                list.registerResource(resource);

                expect(list.get('some/id').id).toBe('some/id');
            });

            it('should throw an exception, when resource still exists', function () {
                list.registerResource(resource);

                // second registrations
                expect(function () {list.registerResource(resource);}).toThrowError(/some\/id/)
            });
        });

        describe('by an pending uuid', function () {
            var resource;

            beforeEach(function () {
                resource = {id: null, pendingUuid: 'some-uuid'};
            });

            it('should return true for successful registration', function () {
                expect(list.registerResource(resource)).toBe(true);
            });

            it('should be possible to get the newly created resource by its uuid', function () {
                list.registerResource(resource);

                expect(list.get('some-uuid').pendingUuid).toBe('some-uuid');
            })


            it('should throw an exception, when resource still exists', function () {
                list.registerResource(resource);

                // second registrations
                expect(function () {list.registerResource(resource);}).toThrowError(/some-uuid/)
            });
        });
    });

    describe('update an existing resource', function () {
        var originResource, destinationResource;

        describe('by an id', function () {
            beforeEach(function () {
                originResource = {id: 'some/id', pendingUuid: null};
                list.registerResource(originResource);

                destinationResource = _.clone(originResource);
                destinationResource.name = 'new name';
            });

            it('should change the resource values', function () {
                list.updateResource(destinationResource);
                expect(list.get('some/id').name).toBe('new name');
            });

            it('should return true', function () {
                expect(list.updateResource(destinationResource)).toBe(true);
            });

            it('should throw an exception for non existing resource', function () {
               var func = function () {
                   list.updateResource({id: 'some-other/id'});
               };

                expect(func).toThrowError('Problems while updating resource.');
            });
        });

        describe('by an uuid', function () {
            beforeEach(function () {
                originResource = {id: null, pendingUuid: 'some-id'};
                destinationResource = _.clone(originResource);
                destinationResource.name = 'new name';
                list.registerResource(originResource);
            });

            it('should change the resource values', function () {
                list.updateResource(destinationResource);
                expect(list.get('some-id').name).toBe('new name');
            });

            it('should throw an exception for non existing resource', function () {
                var func = function () {
                    list.updateResource({id: 'some-other-uuid'});
                };

                expect(func).toThrowError('Problems while updating resource.');
            });
        });
    });
});
