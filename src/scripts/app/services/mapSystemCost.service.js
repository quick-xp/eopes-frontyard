'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('MapSystemCostService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/map_system_costs.json", {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });
});
