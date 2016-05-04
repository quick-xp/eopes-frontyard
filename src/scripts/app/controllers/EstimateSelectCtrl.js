'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader'),
    environment = require('../../data/environment.json');

mCtrls
    .controller('EstimateSelectCtrl', ['$scope','$state', '$stateParams', 'ManufactureAvailableService', '$location', 'SharedObjectService',
        function($scope, $state, $stateParams, ManufactureAvailableService, $location, SharedObjectService) {
            // modelの初期化
            $scope.estimate = {};

            // 製造可能なプロダクト一覧
            $scope.manufactureAvailables = [];
            $scope.searchBlueprint = function($select) {
                return ManufactureAvailableService.query({
                    searchWord: $select.search
                }, function(response) {
                    $scope.manufactureAvailables = response.manufacture_availables;
                });
            };

            // Selectボタン
            $scope.blueprintSelect = function() {
                SharedObjectService.estimateTypeId = $scope.estimate.selected.typeID;
                $state.go('estimate_new');
            };
        }
    ]);
