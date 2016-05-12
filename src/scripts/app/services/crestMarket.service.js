'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('CrestMarketService', function($http) {

    var sellOrders = function(regionId, typeId) {
        var url = 'https://crest-tq.eveonline.com' +
            '/market/' + regionId + '/orders/sell/?type=https://public-crest.eveonline.com/types/' + typeId + '/'

        return $http.get(url, {}).then(function(response) {
            return response;
        });
    };

    var buyOrders = function(regionId, typeId) {
        var url = 'https://crest-tq.eveonline.com' +
            '/market/' + regionId + '/orders/buy/?type=https://public-crest.eveonline.com/types/' + typeId + '/'

        return $http.get(url, {}).then(function(response) {
            return response;
        });
    };

    return {
        sellOrders: sellOrders,
        buyOrders: buyOrders
    };
});
