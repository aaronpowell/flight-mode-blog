(function (global, document) {
    'use strict';

    // http://www.quirksmode.org/js/cookies.html
    function createCookie(name,value,days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var CookieAdapter = function (storeName) {
        this.storeName = storeName;

        var cookie = readCookie(storeName);

        if (!cookie) {
            cookie = [];
            createCookie(storeName, JSON.stringify(cookie));
        } else {
            cookie = JSON.parse(cookie);
        }

        this.cookie = cookie;
    };

    CookieAdapter.prototype.add = function(obj) {
        var id = guid();
        createCookie(id, JSON.stringify(obj));
        this.cookie.push(id);
        createCookie(this.storeName, JSON.stringify(this.cookie));
        return id;
    };

    CookieAdapter.prototype.remove = function(id) {
        var index = this.cookie.indexOf(id)
        if (!~index) {
            throw 'The id "' + id + '" was not found in the store';
        }

        eraseCookie(id);
        this.cookie = this.cookie.slice(0, index).concat(this.cookie.slice(index + 1));
        createCookie(this.storeName, JSON.stringify(this.cookie));
    };

    CookieAdapter.prototype.get = function(id) {
        return JSON.parse(readCookie(id));
    };

    CookieAdapter.prototype.getAll = function() {
        return this.cookie.map(this.get.bind(this));
    };

    CookieAdapter.prototype.getBy = function(property, value) {
        return this.getAll().filter(function (item) {
            return item[property] === value;
        });
    };

    CookieAdapter.prototype.destroy = function() {
        this.cookie.map(eraseCookie);
        eraseCookie(this.storeName);
        this.cookie = null;
    };

    global.FlightMode.adapters['cookie'] = {
        init: function (storeName) {
            return new CookieAdapter(storeName);
        },
        name: 'cookie'
    };
})(window, document);