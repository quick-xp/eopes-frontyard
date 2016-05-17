'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader');

mCtrls
    .controller('EstimateShowCtrl', ['$scope', '$stateParams', 'EstimateService',
        function($scope, $stateParams, EstimateService) {
            $scope.id = $stateParams.id;

            EstimateService.get({
                id: $scope.id
            }, function(response) {
                $scope.estimate = response.estimate;
                $scope.blueprint = response.estimate.estimate_blueprint;
                $scope.product = response.estimate.estimate_blueprint.product;
                $scope.jobCost = response.estimate.estimate_job_cost;
                $scope.materials = response.estimate.estimate_materials;
                $scope.skill = {};
                $scope.skill.skill_3380 = 5;
                $scope.skill.skill_3388 = 5;

            });

        }
    ]);
