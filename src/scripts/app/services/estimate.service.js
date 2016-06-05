'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('EstimateService', function($resource) {

    var baseUrl = environment.API_BASE;

    return $resource(baseUrl + "/estimates/:id", {}, {
        get: {
            method: 'GET',
            params: {}
        },
        update: {
            method: 'PUT',
            params: {id: '@id'}
        },
        delete: {
            method: 'DELETE',
            params: {id: '@estimate.id'}
        }
    });
});
