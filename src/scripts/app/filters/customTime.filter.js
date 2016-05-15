'use strict';

var mFilters = require('./_mFilters');

mFilters.filter('customTime', function () {
    return function(input){
        return 'hoge';
    };
});
