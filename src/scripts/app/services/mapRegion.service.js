'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('MapRegionService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/map_regions.json", {}, {
        query: {
            method: 'GET',
            params: {},
            isArray: true
        }
    });
});
