import Viking from './../../../../../src/viking';

(function () {
    module("Viking.Model#coerceAttributes - hasMany");

    test("#coerceAttributes initializes hasMany relation with array of hashes", function() {
        let Ship = Viking.Model.extend('ship', { hasMany: ['ships'] });
        let ShipCollection = Viking.Collection.extend({ model: Ship });
    
        var a = new Ship();

        var result = a.coerceAttributes({ships: [{key: 'foo'},{key: 'bar'}]});
        ok(result.ships instanceof ShipCollection);
        ok(result.ships.models[0] instanceof Ship);
        ok(result.ships.models[1] instanceof Ship);
        deepEqual(result.ships.models[0].attributes.key, 'foo');
        deepEqual(result.ships.models[1].attributes.key, 'bar');
    });

    test("#coerceAttributes() initializes hasMany relation with array of models", function() {
        let Ship = Viking.Model.extend('ship', { hasMany: ['ships'] });
        let ShipCollection = Viking.Collection.extend({ model: Ship });
    
        var a = new Ship();
        var models = [new Ship({key: 'foo'}), new Ship({key: 'bar'})];
    
        var result = a.coerceAttributes({ships: models});
        ok(result.ships instanceof ShipCollection);
        ok(result.ships.models[0] === models[0]);
        ok(result.ships.models[1] === models[1]);
    });

}());