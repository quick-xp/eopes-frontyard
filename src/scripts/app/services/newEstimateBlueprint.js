'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('NewEstimateBlueprintService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/estimate_blueprints/new.json", {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });
});
