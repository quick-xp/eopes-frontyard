'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader'),
    environment = require('../../data/environment.json');

mCtrls
    .controller('NewEstimateCtrl', ['$scope', '$stateParams', 'EstimateBlueprintService', '$location', 'SharedObjectService',
        function($scope, $stateParams, EstimateBlueprintService, $location, SharedObjectService) {

            // 初期化
            var initialize = function() {
                var estimateTypeId = SharedObjectService.estimateTypeId;

                var hoge = EstimateBlueprintService.new_estimate(32775);
                console.log(hoge);
                //EstimateBlueprintService.new(estimateTypeId, function(response) {
                //    $scope.me = response;
                //});
            };

            initialize();
        }
    ]);
