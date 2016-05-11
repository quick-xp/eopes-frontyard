'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('JitaMarketLowerPriceService', function($resource) {
    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/sell_orders/get_jita_lower_price.json", {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });
});
