'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('NewEstimateJobCostService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/estimate_job_costs/new.json", {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });
});
