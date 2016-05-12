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
        'MapSystemCostService',
        'JitaMarketLowerPriceService',
        'CrestMarketService',
        '$location',
        'SharedObjectService',
        function($scope,
            $state,
            $stateParams,
            EstimateNewService,
            MapRegionService,
            MapSolarSystemService,
            MapSystemCostService,
            JitaMarketLowerPriceService,
            CrestMarketService,
            $location,
            SharedObjectService) {

            // 定義
            $scope.mapRegion = {};
            $scope.mapSolarSystem = {};
            // market の Region
            $scope.mapSellRegion = {};
            $scope.mapSellRegion.selected = {regionID: "10000002", regionName: "The Forge"};

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
                        $scope.estimate = response.estimate;
                        $scope.blueprint = response.estimate.estimate_blueprint;
                        $scope.product = response.estimate.estimate_blueprint.product;
                        $scope.jobCost = response.estimate.estimate_job_cost;
                        $scope.materials = response.estimate.estimate_materials;

                        // Region初期化
                        MapRegionService.query({}, function(response) {
                            $scope.mapRegions = response;
                            $scope.mapSellRegions = response;
                            $scope.changeRegion();

                            // 見積もり初期化(製品の最安値)
                            JitaMarketLowerPriceService.query({
                                type_id: $scope.product.typeID
                            }, function(response) {
                                $scope.estimate.sell_price = response.price;
                                $scope.setEstimate();
                            });
                        });

                        // Market情報
                        CrestMarketService
                            .sellOrders("10000002", $scope.product.typeID)
                            .then(function(response) {
                                $scope.markets = response.data.items;
                            });
                    });
                };
            };

            initialize();

            // ###########################################//
            // ##################EVENT####################//
            // ###########################################//

            // ME
            $scope.changeMe = function() {
                $scope.setRequireMaterialAndVolume();
                $scope.setMaterialTotalPrice();
                $scope.setEstimate();
            };

            // RUNS
            $scope.changeRuns = function() {
                $scope.setJobInstallCost();
                $scope.setRequireMaterialAndVolume();
                $scope.setMaterialTotalPrice();
                $scope.setEstimate();
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
                MapSystemCostService.query({
                    region_id: $scope.jobCost.region_id
                }, function(response) {
                    $scope.jobCost.system_cost_index = response.production_system_cost_index;
                    $scope.setJobInstallCost();
                    $scope.setEstimate();
                });

                // region変更時はSolarSystemのプルダウンを初期化する
                $scope.mapSolarSystem.selected = null;
            };

            // SolarSystem
            $scope.changeSolarSystem = function() {
                if ($scope.mapSolarSystem.selected != null) {
                    $scope.jobCost.region_id = $scope.mapRegion.selected.regionID;
                    $scope.jobCost.solar_system_id = $scope.mapSolarSystem.selected.solarSystemID;
                };
                // system_cost_indexの取得
                MapSystemCostService.query({
                    region_id: $scope.jobCost.region_id,
                    solar_system_id: $scope.jobCost.solar_system_id
                }, function(response) {
                    $scope.jobCost.system_cost_index = response.production_system_cost_index;
                    $scope.setJobInstallCost();
                    $scope.setEstimate();
                });
            };

            // Material price
            $scope.changeMaterialPrice = function() {
                $scope.setMaterialTotalPrice();
                $scope.setEstimate();
            };

            // Market Region
            $scope.changeMapSellRegion = function() {
                // Market情報
                CrestMarketService
                    .sellOrders($scope.mapSellRegion.selected.regionID, $scope.product.typeID)
                    .then(function(response) {
                        $scope.markets = response.data.items;
                    });
            };

            // ###########################################//
            // #################VIEW-LOGIC################//
            // ###########################################//

            // material 必要数 Volume 再設定
            $scope.setRequireMaterialAndVolume = function() {
                for (var i = 0; i < $scope.materials.length; i++) {
                    $scope.materials[i].require_count =
                        $scope.requireMaterial(
                            $scope.materials[i].base_quantity,
                            $scope.blueprint.runs,
                            $scope.blueprint.me);
                    $scope.materials[i].total_volume = $scope.materials[i].volume * $scope.materials[i].require_count;
                }
            };

            // material total price 再設定
            $scope.setMaterialTotalPrice = function() {
                for (var i = 0; i < $scope.materials.length; i++) {
                    $scope.materials[i].total_price =
                        $scope.materials[i].require_count * $scope.materials[i].price;
                }
            };

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

            // estimate 再設定
            $scope.setEstimate = function() {
                $scope.estimate.material_total_cost = 0;
                $scope.estimate.total_volume = 0;
                for (var i = 0; i < $scope.materials.length; i++) {
                    $scope.estimate.material_total_cost +=
                        $scope.materials[i].require_count * $scope.materials[i].price;
                    $scope.estimate.total_volume +=
                        $scope.materials[i].volume * $scope.materials[i].require_count;
                }

                $scope.estimate.production_time = "";

                $scope.estimate.sell_count =
                    $scope.blueprint.manufacture_product_quantity * $scope.blueprint.runs;

                $scope.estimate.sell_total_price =
                    $scope.estimate.sell_count * $scope.estimate.sell_price;

                $scope.estimate.total_cost =
                    $scope.estimate.material_total_cost + $scope.jobCost.total_job_cost;

                $scope.estimate.profit =
                    $scope.estimate.sell_total_price - $scope.estimate.total_cost;
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
