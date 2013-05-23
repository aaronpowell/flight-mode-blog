(function (global) {
    'use strict';

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var Store = function (storeName, storage) {
        this.storeName = storeName;

        var store = storage.getItem(storeName);

        if (!store) {
            store = [];
            storage.setItem(storeName, JSON.stringify(store));
        }

        this.storage = storage;
        this.store = store;
    };

    Store.prototype.destroy = function() {
        this.store.map(this.remove.bind(this));

        this.storage.removeItem(this.storeName);
    };

    Store.prototype.add = function(obj) {
        var id = guid();

        this.storage.setItem(id, JSON.stringify(obj));
        this.store.push(id);
        this.storage.setItem(this.storeName, JSON.stringify(this.store));

        return id;
    };

    Store.prototype.remove = function(id) {
        var index = this.store.indexOf(id)
        if (!~index) {
            throw 'The id "' + id + '" was not found in the store';
        }

        this.storage.removeItem(id);
        this.store = this.store.slice(0, index).concat(this.store.slice(index + 1));
        this.storage.setItem(this.storeName, JSON.stringify(this.store));
    };

    Store.prototype.get = function(id) {
        return JSON.parse(this.storage.getItem(id));
    };

    Store.prototype.getAll = function() {
        return this.store.map(this.get.bind(this));
    };

    Store.prototype.getBy = function(property, value) {
        return this.getAll().filter(function (item) {
            return item[property] === value;
        });
    };

    var createAdapter = function (storage, adapterName) {
        global.FlightMode.adapters[adapterName] = {
            init: function (storeName) {
                return new Store(storeName, storage);
            }
        };
    };

    createAdapter(global.localStorage, 'localStorage');
    createAdapter(global.sessionStorage, 'sessionStorage');

})(window);