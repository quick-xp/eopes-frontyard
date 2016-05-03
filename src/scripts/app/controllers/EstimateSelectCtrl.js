'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader'),
    environment = require('../../data/environment.json');

mCtrls.controller('EstimateSelectCtrl', ['$scope', '$stateParams', 'ManufactureAvailableService',
    function($scope, $stateParams, ManufactureAvailableService) {

        // 製造可能なプロダクト一覧
        //ManufactureAvailableService.query({}, function(response) {
        //    $scope.manufactureAvailables = response.manufacture_availables;
        //});

        $scope.manufactureAvailables = [];
        $scope.searchBlueprint = function($select) {
            return ManufactureAvailableService.query({
                searchWord: $select.search
            }, function(response) {
                $scope.manufactureAvailables = response.manufacture_availables;
            });
        }
    }
]);
