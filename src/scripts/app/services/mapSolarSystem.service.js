'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('MapSolarSystemService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/map_solar_systems.json", {}, {
        query: {
            method: 'GET',
            params: {},
            isArray: true
        }
    });
});
