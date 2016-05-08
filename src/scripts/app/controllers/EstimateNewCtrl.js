'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader'),
    environment = require('../../data/environment.json');

mCtrls
    .controller('EstimateNewCtrl', ['$scope', '$state', '$stateParams', 'EstimateNewService', '$location', 'SharedObjectService',
        function($scope, $state, $stateParams, EstimateNewService, $location, SharedObjectService) {

            // 初期化
            var initialize = function() {
                $scope.estimateTypeId = SharedObjectService.estimateTypeId;
                $scope.estimateTypeName = SharedObjectService.estimateTypeName;

                // 見積もり対象未設定の場合は選択画面に遷移
                if ($scope.estimateTypeId == null) {
                    $state.go('estimate_select');
                } else {
                    // 見積もりの初期化
                    EstimateNewService.query({
                        type_id: $scope.estimateTypeId
                    }, function(response) {
                        $scope.blueprint = response.estimate.estimate_blueprint;
                        $scope.product = response.estimate.estimate_blueprint.product;
                        $scope.jobCost = response.estimate.estimate_job_cost;
                        $scope.materials = response.estimate.estimate_materials;
                    });
                }
            };

            initialize();
        }
    ]);
