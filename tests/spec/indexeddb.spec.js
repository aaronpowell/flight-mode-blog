describe('IndexedDBAdapter', function () {
    'use strict';

    it('should allow creation of a new item', function () {
        var done = false;

        runs(function () {
                this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            }).then(function (id) {
                expect(id).toBeDefined();
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        });
    });

    it('should allow removing of an existing item', function () {
        var done;
        var id
        runs(function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            }).then(function (i) {
                id = i;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Waiting to adding item');

        runs(function () {
            done = false;
            this.store.remove(id).then(function () {
                expect(true).toBeTruthy();
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting to remove item');
    });

    it('should raise an error trying to find a removed item', function () {
        var done;
        var id
        runs(function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            }).then(function (i) {
                id = i;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Waiting to adding item');

        runs(function () {
            done = false;
            this.store.remove(id).then(function () {
                expect(true).toBeTruthy();
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting to remove item');

        runs(function () {
            done = false;
            this.store.get(id).then(function () {
                expect(false).toBeTruthy('The success handler shouldn\'t be called');
            }, function () {
                expect(true).toBeTruthy();
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting for item get to fail');
    });

    it('should get an item that was added', function () {
        var done = false;
        var id;
        runs(function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            }).then(function (i) {
                id = i;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        });

        runs(function () {
            done = false;
            this.store.get(id).then(function (item) {
                expect(item.firstName).toEqual('Aaron');
                expect(item.lastName).toEqual('Powell');
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting for item get to fail');
    });

    it('should return the correct number of items that have been added', function () {
        var done = false;
        runs(function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            }).then(function (i) {
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        });

        runs(function () {
            done = false;
            this.store.getAll().then(function (items) {
                expect(items.length).toEqual(1);
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting for item get to fail');
    });

    it('should return the same item from get and getAll', function () {
        var done = false;
        var id;
        var item;
        runs(function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            }).then(function (i) {
                id = i;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        });

        runs(function () {
            done = false;
            this.store.get(id).then(function (i) {
                item = i;
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting for item get to fail');

        runs(function () {
            done = false;
            this.store.getAll().then(function (items) {
                expect(items[0]).toEqual(item);
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting for item get to fail');
    });

    it('should get an item that was added', function () {
        var done = false;
        var id;
        runs(function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            }).then(function (i) {
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        });

        runs(function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Smith'
            }).then(function (i) {
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        });

        runs(function () {
            this.store.add({
                firstName: 'John',
                lastName: 'Smith'
            }).then(function (i) {
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        });

        runs(function () {
            done = false;
            this.store.getBy('firstName', 'Aaron').then(function (items) {
                expect(items.length).toEqual(2);
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 'Waiting for item get to fail');
    });

    beforeEach(function () {
        var spec = this;
        var done;
        var dbName = 'IndexedDBAdapter-AdapterTests';
        var req = indexedDB.deleteDatabase('flight-mode');
        
        runs(function () {
            req.onsuccess = function () {
                spec.store = new FlightMode(dbName, 'indexedDB', function () {
                    done = true;
                }, function (store) {
                    store.createIndex('firstName', 'firstName');
                });
            };
            req.onerror = function (e) {
                console.error('Error deleting database', e);
            };
        });

        waitsFor(function () {
            return done;
        }, 'Failed waiting to create the store');
    });

    afterEach(function () {
        this.store.destroy()
    });
});