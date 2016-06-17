import Viking from '../../../../src/viking';

(function () {
    module("Viking.model::extend");

    // setting attributes on a model coerces relations
    test("::extend acts like normal Backbone.Model", function() {
        var Model = Viking.Model.extend('model', {key: 'value'}, {key: 'value'});
        
        equal(Model.key, 'value');
        equal((new Model()).key, 'value');
    });
    
    test("::extend with modelName", function() {
        var Model = Viking.Model.extend('model');
    
        propEqual(_.omit(Model.modelName, 'model'), {
            name: 'Model',
            element: 'model',
            human: 'Model',
            paramKey: 'model',
            plural: 'models',
            routeKey: 'models',
            singular: 'model',
            collection: 'models',
            collectionName: 'ModelCollection'
        });
        propEqual(_.omit((new Model()).modelName, 'model'), {
            name: 'Model',
            element: 'model',
            human: 'Model',
            paramKey: 'model',
            plural: 'models',
            routeKey: 'models',
            singular: 'model',
            collection: 'models',
            collectionName: 'ModelCollection'
        });
    });
    
    test("::extend initalizes the assocations", function() {
        var Model = Viking.Model.extend('model');
        
        deepEqual(Model.associations, {});
    });
    
    test("::extend adds hasMany relationships to associations", function() {
        let Ship = Viking.Model.extend('ship', { hasMany: ['ships'] });
        
        equal(Ship.associations['ships'].name, 'ships');
        equal(Ship.associations['ships'].macro, 'hasMany');
        deepEqual(Ship.associations['ships'].options, {});
        equal(Ship.associations['ships'].collectionName, 'ShipCollection');
    });
    
    test("::extend adds hasMany relationships with options to associations", function() {
        let Ship = Viking.Model.extend('ship', { hasMany: [['ships', {collectionName: 'MyCollection'}]] });
        
        equal(Ship.associations['ships'].name, 'ships');
        equal(Ship.associations['ships'].macro, 'hasMany');
        deepEqual(Ship.associations['ships'].options, {collectionName: 'MyCollection'});
        equal(Ship.associations['ships'].collectionName, 'MyCollection');
    });
    
    test("::extend adds belongsTo relationships to associations", function() {
        let Ship = Viking.Model.extend('ship', { belongsTo: ['ship'] });
        
        equal(Ship.associations['ship'].name, 'ship');
        equal(Ship.associations['ship'].macro, 'belongsTo');
        deepEqual(Ship.associations['ship'].options, {});
        propEqual(_.omit(Ship.associations['ship'].modelName, 'model'), {
            name: 'Ship',
            element: 'ship',
            human: 'Ship',
            paramKey: 'ship',
            plural: 'ships',
            routeKey: 'ships',
            singular: 'ship',
            collection: 'ships',
            collectionName: 'ShipCollection'
        });
    });
    
    test("::extend adds belongsTo relationships with options to associations", function() {
        let Ship = Viking.Model.extend('ship', { belongsTo: [['ship', {modelName: 'Carrier'}]] });
        
        equal(Ship.associations['ship'].name, 'ship');
        equal(Ship.associations['ship'].macro, 'belongsTo');
        deepEqual(Ship.associations['ship'].options, {modelName: 'Carrier'});
        propEqual(Ship.associations['ship'].modelName, new Viking.Model.Name('carrier'));
    });
    
    // STI
    // ========================================================================
    
    test("::extend a Viking.Model unions the hasMany relationships", function () {
        let Key = Viking.Model.extend('key');
        let Comment = Viking.Model.extend('comment');
        let Account = Viking.Model.extend('account', { hasMany: ['comments'] });
        let Agent   = Account.extend('agent', { hasMany: ['keys'] });
        
        deepEqual(['comments'], _.map(Account.associations, function(a) { return a.name; }));
        deepEqual(['comments', 'keys'], _.map(Agent.associations, function(a) { return a.name; }).sort());
    });
    
    test("::extend a Viking.Model unions the belongsTo relationships", function () {
        let State = Viking.Model.extend('state');
        let Region = Viking.Model.extend('region');
        let Account = Viking.Model.extend('account', { belongsTo: ['state'] });
        let Agent   = Account.extend('agent', { belongsTo: ['region'] });
        
        deepEqual(['state'], _.map(Account.associations, function(a) { return a.name; }));
        deepEqual(['region', 'state'], _.map(Agent.associations, function(a) { return a.name; }).sort());
    });
    
    test("::extend a Viking.Model unions the schema", function () {
        window.Account = Viking.Model.extend('account', { schema: {
            created_at: {type: 'date'}
        }});
        
        window.Agent   = Account.extend('agent', { schema: {
            name: {type: 'string'}
        }});
        
        deepEqual(Account.prototype.schema, {
            created_at: {type: 'date'}
        });
        deepEqual(Agent.prototype.schema, {
            created_at: {type: 'date'},
            name: {type: 'string'}
        });
        
        delete window.Account;
        delete window.Agent;
    });
    
    test("::extend a Viking.Model adds itself to the descendants", function () {
        window.Account = Viking.Model.extend('account');
        window.Agent   = Account.extend('agent');

        deepEqual(Account.descendants, [Agent]);
        deepEqual(Agent.descendants, []);
        
        delete window.Account;
        delete window.Agent;
    });
    
}());