describe('Resource', function() {
    var Resource = {}, Restangular = {};

    beforeEach(module('symfony-cmf-resource', function ($provide) {
        Restangular = {
            service: function(value) {
                return 'something';
            }
        };

        $provide.value('Restangular', Restangular);
    }));


    beforeEach(inject(function(_Resource_) {
        Resource = _Resource_;
    }));

    it('should be defined', function () {
        expect(Resource).not.toBeNull();
    });
});
