'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('ManufactureAvailableService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/manufacture_availables.json", {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });
});
