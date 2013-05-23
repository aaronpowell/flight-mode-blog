(function (global) {
    'use strict';

    var FlightMode = function (storeName, adapterName, complete, migrate) {
        if (!(this instanceof FlightMode)) {
            return new FlightMode(storeName);
        }

        this.storeName = storeName;

        var adapter = FlightMode.adapters[adapterName] || FlightMode.defaultAdapter;

        this.adapter = adapter.init(storeName, complete, migrate);
    };

    FlightMode.prototype.add = function(obj) {
        return this.adapter.add(obj);
    };

    FlightMode.prototype.remove = function(id) {
        return this.adapter.remove(id);
    };

    FlightMode.prototype.get = function(id) {
        return this.adapter.get(id);
    };

    FlightMode.prototype.getAll = function() {
        return this.adapter.getAll();
    };

    FlightMode.prototype.getBy = function(property, value) {
        return this.adapter.getBy(property, value);
    };

    FlightMode.prototype.destroy = function() {
        return this.adapter.destroy();
    };

    FlightMode.adapters = [];

    global.FlightMode = FlightMode;

})(window);