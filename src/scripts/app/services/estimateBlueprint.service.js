'use strict';

var mServices = require('./_mServices');
var environment = require('../../data/environment.json');

mServices.factory('EstimateBlueprintService', function($resource) {

    var baseUrl = environment.API_BASE;

    this.new_estimate = function(typeId) {
        var blueprint = $resource(baseUrl + "/estimate_blueprints/new.json");
        var result = "";
        blueprint.get({
            type_id: typeId
        },function(response){
            result = response;
        });
        return result;
    };

    return this;

});
