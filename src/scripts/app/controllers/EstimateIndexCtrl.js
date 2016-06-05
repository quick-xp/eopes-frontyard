'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader');

mCtrls
    .controller('EstimateIndexCtrl', ['$scope', '$stateParams', 'EstimateService', 'DTOptionsBuilder',
        function($scope, $stateParams, EstimateService, DTOptionsBuilder) {

            EstimateService.get({}, function(response) {
                $scope.estimates = response.estimates;
            });

            // datatable option
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withDisplayLength(25)
                .withOption('order', [8, 'desc']);

            // delete
            $scope.delete = function(estimateId) {
                var pEstimate = new EstimateService;
                pEstimate.estimate = {};
                pEstimate.estimate.id = estimateId;
                pEstimate.$delete();

            };

        }
    ]);
