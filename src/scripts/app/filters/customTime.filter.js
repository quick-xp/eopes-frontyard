'use strict';

var mFilters = require('./_mFilters');

mFilters.filter('customTime', function() {
    return function(input) {
        var day = 0;
        var hour = 0;
        var minute = 0;
        var second = 0;
        var t = 0.0;
        if (input != null) {
            t = input;
        };

        // day
        if (t > 60 * 60 * 24) {
            day = Math.floor(t / (60 * 60 * 24));
            t = t - 60 * 60 * 24 * day;
        }

        // hour
        if (t > 60 * 60) {
            hour = Math.floor(t / (60 * 60));
            t = t - 60 * 60 * hour;
        }

        // minute
        if (t > 60) {
            minute = Math.floor(t / 60);
            t = t - 60 * minute;
        }

        second = Math.ceil(t);

        return day + "d " + hour + "h " + minute + "m " + second + "s";
    };
});
