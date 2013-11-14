(function () {
    module("Viking.Model#toJSON", {
        setup: function () {
            Ship = Viking.Model.extend({
                hasMany: ['ships'],
                belongsTo: ['ship'],
                coercions: {date: 'Date'}
            });
            ShipCollection = Viking.Collection.extend({
                model: Ship
            });

            this.ship = new Ship({
                foo: 'bar',

                ship: {bat: 'baz', ship: {bing: 'bong', ships: []}},
                ships: [{ping: 'pong', ship: {bing: 'bong'}}, {ships: []}],

                date: "2013-04-10T21:24:28.000Z"
            });
        },
        teardown: function () {
            delete Ship;
            delete ShipCollection;
        }
    });

    test("#toJSON", function() {
        deepEqual(this.ship.toJSON(), {
            foo: 'bar',
            date: "2013-04-10T21:24:28.000Z"
        });
    });

    test('#toJSON include belongsTo', function() {
        deepEqual(this.ship.toJSON({include: 'ship'}), {
            foo: 'bar',
            date: "2013-04-10T21:24:28.000Z",
            ship_attributes: {bat: 'baz'}
        });
    });

    test('#toJSON include belongsTo includes belongsTo', function () {
        deepEqual(this.ship.toJSON({include: {
            ship: {include: 'ship'}
        }}), {
            foo: 'bar',
            date: "2013-04-10T21:24:28.000Z",
            ship_attributes: {
                bat: 'baz',
                ship_attributes: {bing: 'bong'}
            }
        });
    });

    test('#toJSON include belongsTo includes hasMany', function () {
        deepEqual(this.ship.toJSON({include: {
            ship: {include: 'ships'}
        }}), {
            foo: 'bar',
            date: "2013-04-10T21:24:28.000Z",
            ship_attributes: {
                bat: 'baz',
                ships_attributes: []
            }
        });
    });

    test('#toJSON include hasMany', function() {
        deepEqual(this.ship.toJSON({include: 'ships'}), {
            foo: 'bar',
            date: "2013-04-10T21:24:28.000Z",
            ships_attributes: [{ping: 'pong'}, {}]
        });
    });

    test('#toJSON include hasMany includes belongsTo', function () {
        deepEqual(this.ship.toJSON({include: {
            ships: {include: 'ship'}
        }}), {
            foo: 'bar',
            date: "2013-04-10T21:24:28.000Z",
            ships_attributes: [{ping: 'pong', ship_attributes: {bing: 'bong'}}, {}]
        });
    });

    test('#toJSON include hasMany includes hasMany', function () {
        deepEqual(this.ship.toJSON({include: {
            ships: {include: 'ships'}
        }}), {
            foo: 'bar',
            date: "2013-04-10T21:24:28.000Z",
            ships_attributes: [{ping: 'pong', ships_attributes: []}, {ships_attributes: []}]
        });
    });

}());