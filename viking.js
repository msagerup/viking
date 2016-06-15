(function (exports) {
  'use strict';

  // Calls `to_param` on all its elements and joins the result with slashes.
  // This is used by url_for in Viking Pack.
  Object.defineProperty(Array.prototype, 'toParam', {
      value: function value() {
          return this.map(function (e) {
              return e.toParam();
          }).join('/');
      },
      writable: true,
      configureable: true,
      enumerable: false
  });

  // Converts an array into a string suitable for use as a URL query string,
  // using the given key as the param name.
  Object.defineProperty(Array.prototype, 'toQuery', {
      value: function value(key) {
          var prefix = key + "[]";
          return this.map(function (value) {
              if (value === null) {
                  return escape(prefix) + '=';
              }
              return value.toQuery(prefix);
          }).join('&');
      },
      writable: true,
      configureable: true,
      enumerable: false
  });

  // Alias of to_s.
  Boolean.prototype.toParam = Boolean.prototype.toString;

  Boolean.prototype.toQuery = function (key) {
      return escape(key.toParam()) + "=" + escape(this.toParam());
  };

  // strftime relies on https://github.com/samsonjs/strftime. It supports
  // standard specifiers from C as well as some other extensions from Ruby.
  Date.prototype.strftime = function (format) {
      return strftime(format, this);
  };

  Date.fromISO = function (s) {
      return new Date(s);
  };

  // Alias of to_s.
  Date.prototype.toParam = Date.prototype.toJSON;

  Date.prototype.toQuery = function (key) {
      return escape(key.toParam()) + "=" + escape(this.toParam());
  };

  Date.prototype.today = function () {
      return new Date();
  };

  Date.prototype.isToday = function () {
      return this.getUTCFullYear() === new Date().getUTCFullYear() && this.getUTCMonth() === new Date().getUTCMonth() && this.getUTCDate() === new Date().getUTCDate();
  };

  Date.prototype.isThisMonth = function () {
      return this.getUTCFullYear() === new Date().getUTCFullYear() && this.getUTCMonth() === new Date().getUTCMonth();
  };

  Date.prototype.isThisYear = function () {
      return this.getUTCFullYear() === new Date().getUTCFullYear();
  };

  Date.prototype.past = function () {
      return this < new Date();
  };

  // ordinalize returns the ordinal string corresponding to integer:
  //
  //     (1).ordinalize()    // => '1st'
  //     (2).ordinalize()    // => '2nd'
  //     (53).ordinalize()   // => '53rd'
  //     (2009).ordinalize() // => '2009th'
  //     (-134).ordinalize() // => '-134th'
  Number.prototype.ordinalize = function () {
      var abs = Math.abs(this);

      if (abs % 100 >= 11 && abs % 100 <= 13) {
          return this + 'th';
      }

      abs = abs % 10;
      if (abs === 1) {
          return this + 'st';
      }
      if (abs === 2) {
          return this + 'nd';
      }
      if (abs === 3) {
          return this + 'rd';
      }

      return this + 'th';
  };

  // Alias of to_s.
  Number.prototype.toParam = Number.prototype.toString;

  Number.prototype.toQuery = function (key) {
      return escape(key.toParam()) + "=" + escape(this.toParam());
  };

  Number.prototype.second = function () {
      return this * 1000;
  };

  Number.prototype.seconds = Number.prototype.second;

  Number.prototype.minute = function () {
      return this * 60000;
  };

  Number.prototype.minutes = Number.prototype.minute;

  Number.prototype.hour = function () {
      return this * 3600000;
  };

  Number.prototype.hours = Number.prototype.hour;

  Number.prototype.day = function () {
      return this * 86400000;
  };

  Number.prototype.days = Number.prototype.day;

  Number.prototype.week = function () {
      return this * 7 * 86400000;
  };

  Number.prototype.weeks = Number.prototype.week;

  Number.prototype.ago = function () {
      return new Date(new Date().getTime() - this);
  };

  Number.prototype.fromNow = function () {
      return new Date(new Date().getTime() + this);
  };

  // Returns a string representation of the receiver suitable for use as a URL
  // query string:
  //
  // {name: 'David', nationality: 'Danish'}.toParam()
  // // => "name=David&nationality=Danish"
  // An optional namespace can be passed to enclose the param names:
  //
  // {name: 'David', nationality: 'Danish'}.toParam('user')
  // // => "user[name]=David&user[nationality]=Danish"
  //
  // The string pairs "key=value" that conform the query string are sorted
  // lexicographically in ascending order.
  Object.defineProperty(Object.prototype, 'toParam', {
      writable: true,
      configureable: true,
      enumerable: false,
      value: function value(namespace) {
          var _this = this;

          return Object.keys(this).map(function (key) {
              var value = _this[key];
              var namespaceWithKey = namespace ? namespace + "[" + key + "]" : key;

              if (value === null || value === undefined) {
                  return escape(namespaceWithKey);
              } else {
                  return value.toQuery(namespaceWithKey);
              }
          }).join('&');
      }
  });

  // Converts an object into a string suitable for use as a URL query string,
  // using the given key as the param name.
  //
  // Note: This method is defined as a default implementation for all Objects for
  // Object#toQuery to work.
  Object.defineProperty(Object.prototype, 'toQuery', {
      writable: true,
      configureable: true,
      enumerable: false,
      value: Object.prototype.toParam
  });

  // Converts the first character to uppercase
  String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
  };

  // Converts the first character to lowercase
  String.prototype.anticapitalize = function () {
      return this.charAt(0).toLowerCase() + this.slice(1);
  };

  // Capitalizes all the words and replaces some characters in the string to
  // create a nicer looking title. titleize is meant for creating pretty output.
  String.prototype.titleize = function () {
      return this.underscore().humanize().replace(/\b('?[a-z])/g, function (m) {
          return m.toUpperCase();
      });
  };

  // Capitalizes the first word and turns underscores into spaces and strips a
  // trailing "_id", if any. Like titleize, this is meant for creating pretty output.
  String.prototype.humanize = function () {
      var result = this.toLowerCase().replace(/_id$/, '').replace(/_/g, ' ');
      result = result.replace(/([a-z\d]*)/g, function (m) {
          return m.toLowerCase();
      });
      return result.capitalize();
  };

  // Makes an underscored, lowercase form from the expression in the string.
  //
  // Changes '.' to '/' to convert namespaces to paths.
  //
  // Examples:
  //
  //     "ActiveModel".underscore         # => "active_model"
  //     "ActiveModel.Errors".underscore # => "active_model/errors"
  //
  // As a rule of thumb you can think of underscore as the inverse of camelize,
  // though there are cases where that does not hold:
  //
  //     "SSLError".underscore().camelize() # => "SslError"
  String.prototype.underscore = function () {
      var result = this.replace('.', '/');
      result = result.replace(/([A-Z\d]+)([A-Z][a-z])/g, "$1_$2");
      result = result.replace(/([a-z\d])([A-Z])/g, "$1_$2");
      return result.replace('-', '_').toLowerCase();
  };

  // By default, #camelize converts strings to UpperCamelCase. If the argument
  // to camelize is set to `false` then #camelize produces lowerCamelCase.
  //
  // \#camelize will also convert "/" to "." which is useful for converting
  // paths to namespaces.
  //
  // Examples:
  //
  //     "active_model".camelize               // => "ActiveModel"
  //     "active_model".camelize(true)         // => "ActiveModel"
  //     "active_model".camelize(false)        // => "activeModel"
  //     "active_model/errors".camelize        // => "ActiveModel.Errors"
  //     "active_model/errors".camelize(false) // => "activeModel.Errors"
  //
  // As a rule of thumb you can think of camelize as the inverse of underscore,
  // though there are cases where that does not hold:
  //
  //     "SSLError".underscore().camelize()   // => "SslError"
  String.prototype.camelize = function (uppercase_first_letter) {
      var result = void 0;

      if (uppercase_first_letter === undefined || uppercase_first_letter) {
          result = this.capitalize();
      } else {
          result = this.anticapitalize();
      }

      result = result.replace(/(_|(\/))([a-z\d]*)/g, function (_a, _b, first, rest) {
          return (first || '') + rest.capitalize();
      });

      return result.replace('/', '.');
  };

  // Convert a string to a boolean value. If the argument to #booleanize is
  // passed if the string is not 'true' or 'false' it will return the argument.
  //
  // Examples:
  //
  //     "true".booleanize()       // => true
  //     "false".booleanize()      // => false
  //     "other".booleanize()      // => false
  //     "other".booleanize(true)  // => true
  String.prototype.booleanize = function (defaultTo) {
      if (this.toString() === 'true') {
          return true;
      }
      if (this.toString() === 'false') {
          return false;
      }

      return defaultTo === undefined ? false : defaultTo;
  };

  // Replaces underscores with dashes.
  //
  // Example:
  //
  //     "puni_puni"  // => "puni-puni"
  String.prototype.dasherize = function () {
      return this.replace('_', '-');
  };

  // Replaces special characters in a string so that it may be used as part of
  // a "pretty" URL.
  //
  // Example:
  //
  //     "Donald E. Knuth".parameterize() // => 'donald-e-knuth'
  String.prototype.parameterize = function (seperator) {
      return this.toLowerCase().replace(/[^a-z0-9\-_]+/g, seperator || '-');
  };

  // Add Underscore.inflection#pluralize function on the String object
  String.prototype.pluralize = function (count, includeNumber) {
      return _.pluralize(this, count, includeNumber);
  };

  // Add Underscore.inflection#singularize function on the String object
  String.prototype.singularize = function () {
      return _.singularize(this);
  };

  // Tries to find a variable with the name specified in context of `context`.
  // `context` defaults to the `window` variable.
  //
  // Examples:
  //     'Module'.constantize     # => Module
  //     'Test.Unit'.constantize  # => Test.Unit
  //     'Unit'.constantize(Test) # => Test.Unit
  //
  // Viking.NameError is raised when the variable is unknown.
  String.prototype.constantize = function (context) {
      if (!context) {
          context = window;
      }

      return this.split('.').reduce(function (context, name) {
          var v = context[name];
          if (!v) {
              throw new Viking.NameError("uninitialized variable " + name);
          }
          return v;
      }, context);
  };

  // Removes the module part from the expression in the string.
  //
  // Examples:
  //     'Namespaced.Module'.demodulize() # => 'Module'
  //     'Module'.demodulize() # => 'Module'
  //     ''.demodulize() # => ''
  String.prototype.demodulize = function (seperator) {
      if (!seperator) {
          seperator = '.';
      }

      var index = this.lastIndexOf(seperator);

      if (index === -1) {
          return String(this);
      } else {
          return this.slice(index + 1);
      }
  };

  // If `length` is greater than the length of the string, returns a new String
  // of length `length` with the string right justified and padded with padString;
  // otherwise, returns string
  String.prototype.rjust = function (length, padString) {
      if (!padString) {
          padString = ' ';
      }

      var padding = '';
      var paddingLength = length - this.length;

      while (padding.length < paddingLength) {
          if (paddingLength - padding.length < padString.length) {
              padding = padding + padString.slice(0, paddingLength - padding.length);
          } else {
              padding = padding + padString;
          }
      }

      return padding + this;
  };

  // If `length` is greater than the length of the string, returns a new String
  // of length `length` with the string left justified and padded with padString;
  // otherwise, returns string
  String.prototype.ljust = function (length, padString) {
      if (!padString) {
          padString = ' ';
      }

      var padding = '';
      var paddingLength = length - this.length;

      while (padding.length < paddingLength) {
          if (paddingLength - padding.length < padString.length) {
              padding = padding + padString.slice(0, paddingLength - padding.length);
          } else {
              padding = padding + padString;
          }
      }

      return this + padding;
  };

  // Alias of to_s.
  String.prototype.toParam = String.prototype.toString;

  String.prototype.toQuery = function (key) {
      return escape(key.toParam()) + "=" + escape(this.toParam());
  };

  String.prototype.downcase = String.prototype.toLowerCase;

  var Name = function Name(name) {
      var objectName = name.camelize(); // Namespaced.Name

      this.name = objectName;
      this.collectionName = objectName + 'Collection';
      this.singular = objectName.underscore().replace(/\//g, '_'); // namespaced_name
      this.plural = this.singular.pluralize(); // namespaced_names
      this.human = objectName.demodulize().humanize(); // Name
      this.collection = this.singular.pluralize(); // namespaced/names
      this.paramKey = this.singular;
      this.routeKey = this.plural;
      this.element = objectName.demodulize().underscore();

      this.model = function () {
          if (this._model) {
              return this._model;
          }

          this._model = this.name.constantize();
          return this._model;
      };
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var DateType = {

      load: function load(value) {
          if (typeof value === 'string' || typeof value === 'number') {
              return Date.fromISO(value);
          }

          if (!(value instanceof Date)) {
              throw new TypeError((typeof value === 'undefined' ? 'undefined' : _typeof(value)) + " can't be coerced into Date");
          }

          return value;
      },

      dump: function dump(value) {
          return value.toISOString();
      }

  };

  var JSONType = {

      load: function load(value, key) {
          if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
              var AnonModel = Viking.Model.extend({
                  inheritanceAttribute: false
              });
              var model = new AnonModel(value);
              model.modelName = key;
              model.baseModel = model;
              return model;
          }
          throw new TypeError((typeof value === "undefined" ? "undefined" : _typeof(value)) + " can't be coerced into JSON");
      },

      dump: function dump(value) {
          if (value instanceof Viking.Model) {
              return value.toJSON();
          }
          return value;
      }

  };

  var NumberType = {

      load: function load(value) {
          if (typeof value === 'string') {
              value = value.replace(/\,/g, '');

              if (value.trim() === '') {
                  return null;
              }
          }
          return Number(value);
      },

      dump: function dump(value) {
          return value;
      }

  };

  var StringType = {

      load: function load(value) {
          if (typeof value !== 'string' && value !== undefined && value !== null) {
              return String(value);
          }
          return value;
      },

      dump: function dump(value) {
          if (typeof value !== 'string' && value !== undefined && value !== null) {
              return String(value);
          }
          return value;
      }

  };

  var BooleanType = {

      load: function load(value) {
          if (typeof value === 'string') {
              value = value === 'true';
          }
          return !!value;
      },

      dump: function dump(value) {
          return value;
      }

  };

  var Type = {
      'registry': {}
  };

  Type.registry['date'] = Type.Date = DateType;
  Type.registry['json'] = Type.JSON = JSONType;
  Type.registry['number'] = Type.Number = NumberType;
  Type.registry['string'] = Type.String = StringType;
  Type.registry['boolean'] = Type.Boolean = BooleanType;

  // import HasOne from './reflection/hasOne';
  // import HasMany from './reflection/hasMany';
  // import BelongsTo from './reflection/belongsTo';
  // import HasAndBelongsToMany from './reflection/hasAndBelongsToMany';

  var Reflection = function Reflection() {};

  _.extend(Reflection.prototype, {

      klass: function klass() {
          if (this.macro === 'hasMany') {
              return this.collection();
          }

          return this.model();
      },

      model: function model() {
          return this.modelName.model();
      },

      collection: function collection() {
          return this.collectionName.constantize();
      }

  });

  Reflection.extend = Backbone.Model.extend;

  var BelongsTo = Reflection.extend({

      constructor: function constructor(name, options) {
          this.name = name;
          this.macro = 'belongsTo';
          this.options = _.extend({}, options);

          if (!this.options.polymorphic) {
              if (this.options.modelName) {
                  this.modelName = new Viking.Model.Name(this.options.modelName);
              } else {
                  this.modelName = new Viking.Model.Name(name);
              }
          }
      }

  });

  Reflection.BelongsTo = BelongsTo;

  var HasMany = Reflection.extend({

      constructor: function constructor(name, options) {
          this.name = name;
          this.macro = 'hasMany';
          this.options = _.extend({}, options);

          if (this.options.modelName) {
              this.modelName = new Viking.Model.Name(this.options.modelName);
          } else {
              this.modelName = new Viking.Model.Name(this.name.singularize());
          }

          if (this.options.collectionName) {
              this.collectionName = this.options.collectionName;
          } else {
              this.collectionName = this.modelName.collectionName;
          }
      }

  });

  Reflection.HasMany = HasMany;

  var HasOne = Reflection.extend({

      constructor: function constructor(name, options) {
          this.name = name;
          this.macro = 'hasOne';
          this.options = _.extend({}, options);

          if (!this.options.polymorphic) {
              if (this.options.modelName) {
                  this.modelName = new Viking.Model.Name(this.options.modelName);
              } else {
                  this.modelName = new Viking.Model.Name(name);
              }
          }
      }

  });

  Reflection.HasOne = HasOne;

  var HasAndBelongsToMany = Reflection.extend({

      constructor: function constructor(name, options) {
          this.name = name;
          this.macro = 'hasAndBelongsToMany';
          this.options = _.extend({}, options);

          if (this.options.modelName) {
              this.modelName = new Viking.Model.Name(this.options.modelName);
          } else {
              this.modelName = new Viking.Model.Name(this.name.singularize());
          }

          if (this.options.collectionName) {
              this.collectionName = this.options.CollectionName;
          } else {
              this.collectionName = this.modelName.collectionName;
          }
      }

  });

  Reflection.HasAndBelongsToMany = HasAndBelongsToMany;

  var coerceAttributes = function coerceAttributes(attrs) {

      _.each(this.associations, function (association) {
          var Type = void 0;
          var polymorphic = association.options.polymorphic;

          if (!attrs[association.name]) {
              return;
          }

          if (polymorphic && attrs[association.name] instanceof Viking.Model) {
              // TODO: remove setting the id?
              attrs[association.name + '_id'] = attrs[association.name].id;
              attrs[association.name + '_type'] = attrs[association.name].modelName.name;
          } else if (polymorphic && attrs[association.name + '_type']) {
              Type = attrs[association.name + '_type'].camelize().constantize();
              attrs[association.name] = new Type(attrs[association.name]);
          } else if (!(attrs[association.name] instanceof association.klass())) {
              Type = association.klass();
              attrs[association.name] = new Type(attrs[association.name]);
          }
      });

      _.each(this.schema, function (options, key) {
          if (attrs[key] || attrs[key] === false) {
              (function () {
                  var tmp = void 0,
                      klass = void 0;

                  klass = Viking.Model.Type.registry[options['type']];

                  if (klass) {
                      if (options['array']) {
                          tmp = [];
                          _.each(attrs[key], function (value) {
                              tmp.push(klass.load(value, key));
                          });
                          attrs[key] = tmp;
                      } else {
                          attrs[key] = klass.load(attrs[key], key);
                      }
                  } else {
                      throw new TypeError("Coercion of " + options['type'] + " unsupported");
                  }
              })();
          }
      });

      return attrs;
  };

  // Below is the same code from the Backbone.Model function
  // except where there are comments
  var constructor = function constructor(attributes, options) {
      var attrs = attributes || {};
      options || (options = {});
      this.cid = _.uniqueId('c');
      this.attributes = {};

      attrs = _.defaults({}, attrs, _.result(this, 'defaults'));

      if (this.inheritanceAttribute) {
          if (attrs[this.inheritanceAttribute] && this.constructor.modelName.name !== attrs[this.inheritanceAttribute]) {
              // OPTIMIZE:  Mutating the [[Prototype]] of an object, no matter how
              // this is accomplished, is strongly discouraged, because it is very
              // slow and unavoidably slows down subsequent execution in modern
              // JavaScript implementations
              // Ideas: Move to Model.new(...) method of initializing models
              var type = attrs[this.inheritanceAttribute].camelize().constantize();
              this.constructor = type;
              this.__proto__ = type.prototype;
          }
      }

      // Add a helper reference to get the model name from an model instance.
      this.modelName = this.constructor.modelName;
      this.baseModel = this.constructor.baseModel;

      if (this.baseModel && this.modelName && this.inheritanceAttribute) {
          if (this.baseModel === this.constructor && this.baseModel.descendants.length > 0) {
              attrs[this.inheritanceAttribute] = this.modelName.name;
          } else if (_.contains(this.baseModel.descendants, this.constructor)) {
              attrs[this.inheritanceAttribute] = this.modelName.name;
          }
      }

      // Set up associations
      this.associations = this.constructor.associations;
      this.reflectOnAssociation = this.constructor.reflectOnAssociation;
      this.reflectOnAssociations = this.constructor.reflectOnAssociations;

      // Initialize any `hasMany` relationships to empty collections
      this.reflectOnAssociations('hasMany').forEach(function (association) {
          this.attributes[association.name] = new (association.collection())();
      }, this);

      if (options.collection) {
          this.collection = options.collection;
      }
      if (options.parse) {
          attrs = this.parse(attrs, options) || {};
      }

      this.set(attrs, options);
      this.changed = {};
      this.initialize.call(this, attributes, options);
  };

  var defaults$1 = function defaults() {
      var _this = this;

      var dflts = {};

      if (typeof this.schema === 'undefined') {
          return dflts;
      }

      Object.keys(this.schema).forEach(function (key) {
          if (_this.schema[key]['default']) {
              dflts[key] = _this.schema[key]['default'];
          }
      });

      return dflts;
  };

  // TODO: testme
  var errorsOn = function errorsOn(attribute) {
      if (this.validationError) {
          return this.validationError[attribute];
      }

      return false;
  };

  // Returns string to use for params names. This is the key attributes from
  // the model will be namespaced under when saving to the server
  var paramRoot = function paramRoot() {
      return this.baseModel.modelName.paramKey;
  };

  // Overwrite Backbone.Model#save so that we can catch errors when a save
  // fails.
  var save = function save(key, val, options) {
    var attrs = void 0,
        method = void 0,
        xhr = void 0,
        attributes = this.attributes;

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (key == null || (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
      attrs = key;
      options = val;
    } else {
      (attrs = {})[key] = val;
    }

    options = _.extend({ validate: true }, options);

    // If we're not waiting and attributes exist, save acts as
    // `set(attr).save(null, opts)` with validation. Otherwise, check if
    // the model will be valid when the attributes, if any, are set.
    if (attrs && !options.wait) {
      if (!this.set(attrs, options)) {
        return false;
      }
    } else {
      if (!this._validate(attrs, options)) {
        return false;
      }
    }

    // Set temporary attributes if `{wait: true}`.
    if (attrs && options.wait) {
      this.attributes = _.extend({}, attributes, attrs);
    }

    // After a successful server-side save, the client is (optionally)
    // updated with the server-side state.
    if (options.parse === void 0) {
      options.parse = true;
    }
    var model = this;
    var success = options.success;
    options.success = function (resp) {
      // Ensure attributes are restored during synchronous saves.
      model.attributes = attributes;
      var serverAttrs = model.parse(resp, options);
      if (options.wait) {
        serverAttrs = _.extend(attrs || {}, serverAttrs);
      }
      if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
        return false;
      }
      if (success) {
        success(model, resp, options);
      }
      model.trigger('sync', model, resp, options);
    };

    // replacing #wrapError(this, options) with custom error handling to
    // catch and throw invalid events
    var error = options.error;
    options.error = function (resp) {
      if (resp.status === 400) {
        var errors = JSON.parse(resp.responseText).errors;
        if (options.invalid) {
          options.invalid(model, errors, options);
        }
        model.setErrors(errors, options);
      } else {
        if (error) {
          error(model, resp, options);
        }
        model.trigger('error', model, resp, options);
      }
    };

    method = this.isNew() ? 'create' : options.patch ? 'patch' : 'update';
    if (method === 'patch') {
      options.attrs = attrs;
    }
    xhr = this.sync(method, this, options);

    // Restore attributes.
    if (attrs && options.wait) {
      this.attributes = attributes;
    }

    return xhr;
  };

  // select(options)
  // select(value[, options])
  //
  // When the model is part of a collection and you want to select a single
  // or multiple items from a collection. If a model is selected
  // `model.selected` will be set `true`, otherwise it will be `false`.
  //
  // If you pass `true` or `false` as the first paramater to `select` it will
  // select the model if true, or unselect if it is false.
  //
  // By default any other models in the collection with be unselected. To
  // prevent other models in the collection from being unselected you can
  // pass `{multiple: true}` as an option.
  //
  // The `selected` and `unselected` events are fired when appropriate.
  var select = function select(value, options) {

      // Handle both `value[, options]` and `options` -style arguments.
      if (value === undefined || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
          options = value;
          value = true;
      }

      if (value === true) {
          if (this.collection) {
              this.collection.select(this, options);
          } else {
              this.selected = true;
          }
      } else {
          if (this.selected) {
              this.selected = false;
              this.trigger('unselected', this);
          }
      }
  };

  var set$1 = function set(key, val, options) {
      if (key === null) {
          return this;
      }

      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs = void 0;
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
          attrs = key;
          options = val;
      } else {
          (attrs = {})[key] = val;
      }

      options || (options = {});

      if (this.inheritanceAttribute && attrs[this.inheritanceAttribute] && this.constructor.modelName.name !== attrs.type) {
          // OPTIMIZE:  Mutating the [[Prototype]] of an object, no matter how
          // this is accomplished, is strongly discouraged, because it is very
          // slow and unavoidably slows down subsequent execution in modern
          // JavaScript implementations
          // Ideas: Move to Model.new(...) method of initializing models
          var type = attrs[this.inheritanceAttribute].camelize().constantize();
          this.constructor = type;
          this.__proto__ = type.prototype;
          this.modelName = type.modelName;

          // TODO: move to function, used in Model.new
          // TODO: probably move to a becomes method
          // Set up associations
          this.associations = this.constructor.associations;
          this.reflectOnAssociation = this.constructor.reflectOnAssociation;
          this.reflectOnAssociations = this.constructor.reflectOnAssociations;

          // Initialize any `hasMany` relationships to empty collections
          _.each(this.reflectOnAssociations('hasMany'), function (association) {
              if (!this.attributes[association.name]) {
                  this.attributes[association.name] = new (association.collection())();
              }
          }, this);
      }

      this.coerceAttributes(attrs);
      _.each(attrs, function (value, key) {
          var association = this.reflectOnAssociation(key);
          if (association && association.macro === 'hasMany') {
              if (!value) {
                  this.attributes[key].set([]);
              } else {
                  this.attributes[key].set(value.models);
                  _.each(value.models, function (model) {
                      model.collection = this.attributes[key];
                  }, this);
              }

              delete attrs[key];
          } else if (association && association.macro == 'belongsTo') {
              if (!value) {
                  options.unset ? delete this.attributes[key + '_id'] : this.attributes[key + '_id'] = value;
              } else {
                  this.attributes[key + '_id'] = value.id;
              }
          }
      }, this);

      return Backbone.Model.prototype.set.call(this, attrs, options);
  };

  var setErrors = function setErrors(errors, options) {
      if (_.size(errors) === 0) {
          return;
      }

      var model = this;
      this.validationError = errors;

      model.trigger('invalid', this, errors, options);
  };

  // Override [Backbone.Model#sync](http://backbonejs.org/#Model-sync).
  // [Ruby on Rails](http://rubyonrails.org/) expects the attributes to be
  // namespaced
  var sync = function sync(method, model, options) {
      options || (options = {});

      if (options.data == null && (method === 'create' || method === 'update' || method === 'patch')) {
          options.contentType = 'application/json';
          options.data = {};
          options.data[_.result(model, 'paramRoot')] = options.attrs || model.toJSON(options);
          options.data = JSON.stringify(options.data);
      }

      return Viking.sync.call(this, method, model, options);
  };

  // similar to Rails as_json method
  var toJSON = function toJSON(options) {
      var data = _.clone(this.attributes);

      if (options === undefined) {
          options = {};
      }

      if (options.include) {
          if (typeof options.include === 'string') {
              var key = options.include;
              options.include = {};
              options.include[key] = {};
          } else if (_.isArray(options.include)) {
              var array = options.include;
              options.include = {};
              _.each(array, function (key) {
                  options.include[key] = {};
              });
          }
      } else {
          options.include = {};
      }

      _.each(this.associations, function (association) {
          if (!options.include[association.name]) {
              delete data[association.name];
              if (association.macro === 'belongsTo' && data[association.name + '_id'] === undefined) {
                  delete data[association.name + '_id'];
              }
          } else if (association.macro === 'belongsTo' || association.macro === 'hasOne') {
              if (data[association.name]) {
                  data[association.name + '_attributes'] = data[association.name].toJSON(options.include[association.name]);
                  delete data[association.name];
                  delete data[association.name + '_id'];
              } else if (data[association.name] === null) {
                  data[association.name + '_attributes'] = null;
                  delete data[association.name];
                  delete data[association.name + '_id'];
              }
          } else if (association.macro === 'hasMany') {
              if (data[association.name]) {
                  data[association.name + '_attributes'] = data[association.name].toJSON(options.include[association.name]);
                  delete data[association.name];
              }
          }
      });

      _.each(this.schema, function (options, key) {
          if (data[key] || data[key] === false) {
              (function () {
                  var tmp = void 0,
                      klass = void 0;

                  klass = Viking.Model.Type.registry[options.type];

                  if (klass) {
                      if (options.array) {
                          tmp = [];
                          _.each(data[key], function (value) {
                              tmp.push(klass.dump(value, key));
                          });
                          data[key] = tmp;
                      } else {
                          data[key] = klass.dump(data[key], key);
                      }
                  } else {
                      throw new TypeError("Coercion of " + options.type + " unsupported");
                  }
              })();
          }
      });

      return data;
  };

  // Returns a string representing the object's key suitable for use in URLs,
  // or nil if `#isNew` is true.
  var toParam = function toParam() {
      return this.isNew() ? null : this.get('id');
  };

  // Saves the record with the updated_at and any attributes passed in to the
  // current time.
  //
  // The JSON response is expected to return an JSON object with the attribute
  // name and the new time. Any other attributes returned in the JSON will be
  // updated on the Model as well
  //
  // TODO:
  // Note that `#touch` must be used on a persisted object, or else an
  // Viking.Model.RecordError will be thrown.
  var touch = function touch(columns, options) {
      var now = new Date();

      var attrs = {
          updated_at: now
      };

      options = _.extend({ patch: true }, options);

      if (_.isArray(columns)) {
          _.each(columns, function (column) {
              attrs[column] = now;
          });
      } else if (columns) {
          attrs[columns] = now;
      }

      return this.save(attrs, options);
  };

  // Opposite of #select. Triggers the `unselected` event.
  var unselect = function unselect(options) {
      this.select(false, options);
  };

  // TODO: test return
  var updateAttribute = function updateAttribute(key, value, options) {
      var data = {};
      data[key] = value;

      return this.updateAttributes(data, options);
  };

  // TODO: test return
  var updateAttributes = function updateAttributes(data, options) {
      options || (options = {});
      options.patch = true;

      return this.save(data, options);
  };

  // Default URL for the model's representation on the server
  var url = function url() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();

      if (this.isNew()) return base;

      return base.replace(/([^\/])$/, '$1/') + this.toParam();
  };

  // Alias for `::urlRoot`
  var urlRoot = function urlRoot() {
      return this.constructor.urlRoot();
  };

  var abstract = true;

  // inheritanceAttribute is the attirbute used for STI
  var inheritanceAttribute = 'type';

var instanceProperties = Object.freeze({
  	abstract: abstract,
  	inheritanceAttribute: inheritanceAttribute,
  	coerceAttributes: coerceAttributes,
  	constructor: constructor,
  	defaults: defaults$1,
  	errorsOn: errorsOn,
  	paramRoot: paramRoot,
  	save: save,
  	select: select,
  	set: set$1,
  	setErrors: setErrors,
  	sync: sync,
  	toJSON: toJSON,
  	toParam: toParam,
  	touch: touch,
  	unselect: unselect,
  	updateAttribute: updateAttribute,
  	updateAttributes: updateAttributes,
  	url: url,
  	urlRoot: urlRoot
  });

  // Create a model with +attributes+. Options are the
  // same as Viking.Model#save
  var create = function create(attributes, options) {
      var model = new this(attributes);
      model.save(null, options);
      return model;
  };

  // Find model by id. Accepts success and error callbacks in the options
  // hash, which are both passed (model, response, options) as arguments.
  //
  // Find returns the model, however it most likely won't have fetched the
  // data	from the server if you immediately try to use attributes of the
  // model.
  var find = function find(id, options) {
      var model = new this({ id: id });
      model.fetch(options);
      return model;
  };

  // Find or create model by attributes. Accepts success callbacks in the
  // options hash, which is passed (model) as arguments.
  //
  // findOrCreateBy returns the model, however it most likely won't have fetched
  // the data	from the server if you immediately try to use attributes of the
  // model.
  var findOrCreateBy = function findOrCreateBy(attributes, options) {
      var klass = this;
      klass.where(attributes).fetch({
          success: function success(modelCollection) {
              var model = modelCollection.models[0];
              if (model) {
                  if (options && options.success) options.success(model);
              } else {
                  klass.create(attributes, options);
              }
          }
      });
  };

  var reflectOnAssociation = function reflectOnAssociation(name) {
      return this.associations[name];
  };

  var reflectOnAssociations = function reflectOnAssociations(macro) {
      var associations = _.values(this.associations);
      if (macro) {
          associations = _.select(associations, function (a) {
              return a.macro === macro;
          });
      }

      return associations;
  };

  // Generates the `urlRoot` based off of the model name.
  var urlRoot$1 = function urlRoot() {
      if (this.prototype.hasOwnProperty('urlRoot')) {
          return _.result(this.prototype, 'urlRoot');
      } else if (this.baseModel.prototype.hasOwnProperty('urlRoot')) {
          return _.result(this.baseModel.prototype, 'urlRoot');
      } else {
          return "/" + this.baseModel.modelName.plural;
      }
  };

  // Returns a unfetched collection with the predicate set to the query
  var where = function where(options) {
      // TODO: Move to modelName as well?
      var Collection = (this.modelName.name + 'Collection').constantize();

      return new Collection(undefined, { predicate: options });
  };

  // Overide the default extend method to support passing in the modelName
  // and support STI
  //
  // The modelName is used for generating urls and relationships.
  //
  // If a Model is extended further is acts simlar to ActiveRecords STI.
  //
  // `name` is optional, and must be a string
  var extend = function extend(name, protoProps, staticProps) {
      var _this = this;

      if (typeof name !== 'string') {
          staticProps = protoProps;
          protoProps = name;
      }
      protoProps || (protoProps = {});

      var child = Backbone.Model.extend.call(this, protoProps, staticProps);

      if (typeof name === 'string') {
          child.modelName = new Name(name);
      }

      child.associations = {};
      child.descendants = [];
      child.inheritanceAttribute = protoProps.inheritanceAttribute === undefined ? this.prototype.inheritanceAttribute : protoProps.inheritanceAttribute;

      if (child.inheritanceAttribute === false || this.prototype.hasOwnProperty('abstract') && this.prototype.abstract) {
          child.baseModel = child;
      } else {
          child.baseModel.descendants.push(child);
      }

      ['belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany'].forEach(function (macro) {
          (protoProps[macro] || []).concat(this[macro] || []).forEach(function (name) {
              var options = void 0;

              // Handle both `type, key, options` and `type, [key, options]` style arguments
              if (Array.isArray(name)) {
                  options = name[1];
                  name = name[0];
              }

              if (!child.associations[name]) {
                  var reflectionClass = {
                      'belongsTo': Viking.Model.Reflection.Belongs,
                      'hasOne': Viking.Model.Reflection.HasOne,
                      'hasMany': Viking.Model.Reflection.HasMany,
                      'hasAndBelongsToMany': Viking.Model.Reflection.HasAndBelongsToMany
                  };
                  reflectionClass = reflectionClass[macro];

                  child.associations[name] = new reflectionClass(name, options);
              }
          });
      }, this.prototype);

      if (this.prototype.schema && protoProps.schema) {
          Object.keys(this.prototype.schema).forEach(function (key) {
              if (!child.prototype.schema[key]) {
                  child.prototype.schema[key] = _this.prototype.schema[key];
              }
          });
      }

      return child;
  };

  var associations = [];

var classProperties = Object.freeze({
  	associations: associations,
  	create: create,
  	find: find,
  	findOrCreateBy: findOrCreateBy,
  	reflectOnAssociation: reflectOnAssociation,
  	reflectOnAssociations: reflectOnAssociations,
  	urlRoot: urlRoot$1,
  	where: where,
  	extend: extend
  });

  //= require_tree ./model/instance_properties

  // Viking.Model
  // ------------
  //
  // Viking.Model is an extension of [Backbone.Model](http://backbonejs.org/#Model).
  // It adds naming, relationships, data type coercions, selection, and modifies
  // sync to work with [Ruby on Rails](http://rubyonrails.org/) out of the box.
  var Model = Backbone.Model.extend(instanceProperties, classProperties);

  Model.Name = Name;
  Model.Type = Type;
  Model.Reflection = Reflection;

  var Viking$1 = {
      Model: Model
  };

  exports.Viking = Viking$1;
  exports['default'] = Viking$1;

}((this.Viking = this.Viking || {})));

//# sourceMappingURL=viking.js.map
