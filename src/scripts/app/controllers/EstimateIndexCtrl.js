'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader');

mCtrls
    .controller('EstimateIndexCtrl', ['$scope', '$stateParams', 'EstimateService',
        function($scope, $stateParams, EstimateService) {

            EstimateService.get({}, function(response) {
                $scope.estimates = response.estimates;
            });

        }
    ]);
