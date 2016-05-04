'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader'),
    environment = require('../../data/environment.json');

mCtrls
    .controller('NewEstimateCtrl', ['$scope', '$state', '$stateParams', 'NewEstimateBlueprintService', '$location', 'SharedObjectService',
        function($scope, $state, $stateParams, NewEstimateBlueprintService, $location, SharedObjectService) {

            // 初期化
            var initialize = function() {
                $scope.estimateTypeId = SharedObjectService.estimateTypeId;
                $scope.estimateTypeName = SharedObjectService.estimateTypeName;
                
                // 見積もり対象未設定の場合は選択画面に遷移
                if ($scope.estimateTypeId == null) {
                    $state.go('estimate_select');
                }

                // 設計図の初期化
                NewEstimateBlueprintService.query({
                    type_id: $scope.estimateTypeId
                }, function(response) {
                    $scope.blueprint = response;
                });
            };

            initialize();
        }
    ]);
