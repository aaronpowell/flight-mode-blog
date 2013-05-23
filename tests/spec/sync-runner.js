var syncTestRunner = function (fixtureName, adapter) {
    describe(fixtureName, function () {
        'use strict';
        beforeEach(function () {
            this.store = new FlightMode(adapter + 'AdapterTests', adapter);
        });

        afterEach(function () {
            this.store.destroy();
        });

        it('should allow creation of a new item', function () {
            var id = this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            });

            expect(id).toBeDefined();
        });

        it('should allow removing of an existing item', function () {
            var id = this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            });

            this.store.remove(id);

            expect(true).toBeTruthy();
        });

        it('should raise an error trying to find a removed item', function () {
            var id = this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            });

            this.store.remove(id);

            expect(function () {
                this.store.get(id);
            }).toThrow();
        });

        it('should get an item that was added', function () {
            var id = this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            });

            var item = this.store.get(id);

            expect(item.firstName).toEqual('Aaron');
            expect(item.lastName).toEqual('Powell');
        });

        it('should return the correct number of items that have been added', function () {
            var id = this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            });

            var items = this.store.getAll();

            expect(items.length).toEqual(1);
        });

        it('should return the same item from get and getAll', function () {
            var id = this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            });

            var item = this.store.get(id);
            var items = this.store.getAll();

            expect(items[0]).toEqual(item);
        });

        it('should allow getting by a specific property value', function () {
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Powell'
            });
            this.store.add({
                firstName: 'Aaron',
                lastName: 'Smith'
            });
            this.store.add({
                firstName: 'John',
                lastName: 'Smith'
            });

            var items = this.store.getBy('firstName', 'Aaron');

            expect(items.length).toEqual(2);
        });
    });
};