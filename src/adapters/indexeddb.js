(function (global, Q) {
    'use strict';
    var indexedDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB;

    var Store = function (name, onMigrate, onSuccess) {
        var that = this;
        var request = indexedDB.open('flight-mode');
        this.storeName = name;

        request.onsuccess = function (e) {
            that.db = e.target.result;

            onSuccess();
        };

        request.onupgradeneeded = function (e) {
            var db = e.target.result;

            var store = db.createObjectStore(name, { keyPath: '__id__', autoIncrement: true });

            if (onMigrate) {
                onMigrate(store);
            }
        };
    };

    Store.prototype.destroy = function() {
        this.db.close();
    };

    Store.prototype.add = function(obj) {
        var transaction = this.db.transaction(this.storeName, 'readwrite');
        var store = transaction.objectStore(this.storeName);

        var d = Q.defer();
        store.add(obj).onsuccess = function (e) {
            d.resolve(e.target.result);
        };
        return d.promise;
    };

    Store.prototype.remove = function(id) {
        var transaction = this.db.transaction(this.storeName, 'readwrite');
        var store = transaction.objectStore(this.storeName);

        var d = Q.defer();
        store.delete(id).onsuccess = function (e) {
            d.resolve(e.target.result);
        };
        return d.promise;
    };

    Store.prototype.get = function(id) {
        var transaction = this.db.transaction(this.storeName);
        var store = transaction.objectStore(this.storeName);

        var d = Q.defer();
        store.get(id).onsuccess = function (e) {
            var obj = e.target.result;
            if (obj) {
                d.resolve(obj);
            } else {
                d.reject('No item matching id "' + id + '" was found');
            }

        };
        return d.promise;
    };

    Store.prototype.getAll = function() {
        var transaction = this.db.transaction(this.storeName);
        var store = transaction.objectStore(this.storeName);

        var d = Q.defer();
        var items = [];
        store.openCursor().onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor['continue']();
            }
        };
        transaction.oncomplete = function () {
            d.resolve(items);
        };
        return d.promise;
    };

    Store.prototype.getBy = function(property, value) {
        var transaction = this.db.transaction(this.storeName);
        var store = transaction.objectStore(this.storeName);

        var d = Q.defer();
        var items = [];

        var index = index = store.index(property);

        index.openCursor().onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor['continue']();
            }
        };
        transaction.oncomplete = function () {
            d.resolve(items);
        };
        return d.promise;
    };

    global.FlightMode.adapters['indexedDB'] = {
        init: function (storeName, success, migrate) {
            var store = new Store(storeName, migrate, function () {
                success(store);
            });
            return store;
        }
    };
})(window, window.Q);