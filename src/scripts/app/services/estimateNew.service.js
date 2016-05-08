'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('EstimateNewService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/estimates/new.json", {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });
});
