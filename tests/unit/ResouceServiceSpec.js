describe('ResourceService', function() {
    var ResourceService = {}, Restangular = {}, Resource = {};

    beforeEach(module('symfony-cmf-resource', function ($provide) {
        Restangular = {
            service: function(value) {
                return 'something';
            }
        };

        $provide.value('Restangular', Restangular);
        $provide.value('Resource', Resource);
    }));


    beforeEach(inject(function(_ResourceService_) {
        ResourceService = _ResourceService_;
    }));

    it('should be defined', function () {
        expect(ResourceService).not.toBeNull();
    });
});
