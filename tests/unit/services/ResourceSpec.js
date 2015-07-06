describe('Resource', function() {
    var Resource = {}, Restangular = {};

    beforeEach(module('angularCmf', function ($provide) {
        Restangular = jasmine.createSpyObj('Resource', ['service']);

        $provide.value('Restangular', Restangular);
    }));


    beforeEach(inject(function(_Resource_) {
        Resource = _Resource_;
    }));

    it('should be defined', function () {
        expect(Resource).not.toBeNull();
    });
});
