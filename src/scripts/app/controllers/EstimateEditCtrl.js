'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader'),
    environment = require('../../data/environment.json');

mCtrls
    .controller('EstimateEditCtrl', ['$scope',
        '$state',
        '$stateParams',
        'EstimateNewService',
        'MapRegionService',
        'MapSolarSystemService',
        '$location',
        'SharedObjectService',
        function($scope,
            $state,
            $stateParams,
            EstimateNewService,
            MapRegionService,
            MapSolarSystemService,
            $location,
            SharedObjectService) {

            // 定義
            $scope.mapRegion = {};
            $scope.mapSolarSystem = {};

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

                        // Region初期化
                        MapRegionService.query({}, function(response) {
                            $scope.mapRegions = response;
                            $scope.changeRegion();
                        });

                    });
                }
            };

            initialize();

            // ###########################################//
            // ##################EVENT####################//
            // ###########################################//

            // ME
            $scope.changeMe = function() {
                $scope.setRequireMaterial();
                $scope.setMaterialTotalPrice();
            };

            // RUNS
            $scope.changeRuns = function() {
                $scope.setJobInstallCost();
                $scope.setRequireMaterial();
                $scope.setMaterialTotalPrice();
            };

            // Region
            $scope.changeRegion = function() {
                if ($scope.mapRegion.selected != null) {
                    $scope.jobCost.region_id = $scope.mapRegion.selected.regionID;
                };
                // SolarSystem初期化
                MapSolarSystemService.query({
                    region_id: $scope.jobCost.region_id
                }, function(response) {
                    $scope.mapSolarSystems = response;
                });

                // system_cost_indexの取得

                // region変更時はSolarSystemのプルダウンを初期化する
                $scope.mapSolarSystem.selected = null;
            };

            // Material price
            $scope.changeMaterialPrice = function() {
                $scope.setMaterialTotalPrice();
            }


            // ###########################################//
            // #################VIEW-LOGIC################//
            // ###########################################//

            // material 必要数再設定
            $scope.setRequireMaterial = function() {
                for (var i = 0; i < $scope.materials.length; i++) {
                    $scope.materials[i].require_count =
                        $scope.requireMaterial(
                            $scope.materials[i].base_quantity,
                            $scope.blueprint.runs,
                            $scope.blueprint.me);
                }
            };

            // material total price 再設定
            $scope.setMaterialTotalPrice = function() {
                for (var i = 0; i < $scope.materials.length; i++) {
                    $scope.materials[i].total_price =
                        $scope.materials[i].require_count * $scope.materials[i].price;
                }
            }

            // job cost 再設定
            $scope.setJobInstallCost = function() {
                var tax_rate = 10;

                $scope.jobCost.base_job_cost =
                    $scope.calcBaseJobCost($scope.materials, $scope.blueprint.runs);

                $scope.jobCost.job_fee =
                    $scope.calcJobFee($scope.jobCost.system_cost_index, $scope.jobCost.base_job_cost);

                $scope.jobCost.facility_cost =
                    $scope.calcFacilityCost($scope.jobCost.job_fee, tax_rate);

                $scope.jobCost.total_job_cost =
                    $scope.calcTotalJobCost($scope.jobCost.job_fee, $scope.jobCost.facility_cost);
            };

            // ###########################################//
            // ##################LOGIC####################//
            // ###########################################//

            // material 必要数算出
            $scope.requireMaterial = function(base_quantity, runs, me) {
                var result = 0.0;
                var facility_modifier = 1.0;
                result = Math.ceil(runs * base_quantity * facility_modifier * (1.0 - me * 0.01));

                // 計算の結果よりRunsのほうが大きい場合はRunsを必要量とする
                if (result < runs) {
                    result = runs;
                }
                return result;
            };

            // base job cost 算出
            $scope.calcBaseJobCost = function(materials, runs) {
                var result = 0.0;
                for (var i = 0; i < materials.length; i++) {
                    result += materials[i].base_quantity * materials[i].adjusted_price;
                }
                result = result * runs;
                return result;
            };

            // job fee 算出
            $scope.calcJobFee = function(system_cost_index, base_job_cost) {
                return system_cost_index * base_job_cost;
            };

            // facility cost 算出
            $scope.calcFacilityCost = function(job_fee, tax_rate) {
                return job_fee * tax_rate / 100;
            };

            // total job cost 算出
            $scope.calcTotalJobCost = function(job_fee, facility_cost) {
                return job_fee + facility_cost;
            };

        }
    ]);
