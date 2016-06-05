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
        'EstimateService',
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
            EstimateService,
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
            $scope.skill = {};
            // market の Region
            $scope.mapSellRegion = {};
            $scope.mapSellRegion.selected = {
                regionID: "10000002",
                regionName: "The Forge"
            };
            // 画面パラメータ
            $scope.id = $stateParams.id;

            // 登録
            $scope.REGISTRABLE_ATTRIBUTES = ['type_id', 'sell_price', 'sell_count', 'product_type_id',
                'total_cost', 'material_total_cost', 'profit', 'total_volume', 'production_time', 'sell_total_price'
            ];
            $scope.BLUEPRINT_REGISTRABLE_ATTRIBUTES = ['id', 'type_id', 'me', 'te', 'runs'];
            $scope.MATERIAL_REGISTRABLE_ATTRIBUTES = ['id', 'type_id', 'require_count', 'base_quantity', 'price', 'adjusted_price',
                'total_price', 'jita_total_price', 'jita_average_price', 'universe_total_price',
                'universe_average_price', 'volume', 'total_volume'
            ];
            $scope.JOB_COST_REGISTABLE_ATTRIBUTES = ['id', 'region_id', 'solar_system_id', 'system_cost_index', 'base_job_cost',
                'job_fee', 'facility_cost', 'total_job_cost'
            ];

            // 初期化
            var initialize = function() {
                $scope.loading = true; //setEstimateにて解除
                $scope.estimateTypeId = SharedObjectService.estimateTypeId;
                $scope.estimateTypeName = SharedObjectService.estimateTypeName;

                // 見積もり対象未設定の場合は選択画面に遷移
                if ($scope.estimateTypeId == null && $scope.id == null) {
                    $state.go('estimate_select');
                }
                if ($scope.id != null) {
                    // 見積もり更新
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

                        $scope.initialize_location_and_market();
                    });

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
                        $scope.skill.skill_3380 = 5;
                        $scope.skill.skill_3388 = 5;

                        $scope.initialize_location_and_market();
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

            // TE
            $scope.changeTe = function() {
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

            // Sell price
            $scope.changeSellPrice = function() {
                $scope.setEstimate();
            };

            // User skill
            $scope.changeUserSkill = function() {
                $scope.setEstimate();
            };

            // Save (Create)
            $scope.saveEstimate = function() {
                var pEstimate = $scope.getPostEstimate();
                pEstimate.estimate.user_id = 1;
                pEstimate.$save(function(response) {
                    var r = response.result;
                    if (r = "success") {
                        $state.go('estimate_show', {
                            id: response.estimate_form.id
                        });
                    } else {
                        $scope.errorMsg = "error";
                    };
                });
            };

            // Save (Update)
            $scope.updateEstimate = function() {
                var pEstimate = $scope.getPostEstimate();
                pEstimate.estimate.user_id = 1;
                pEstimate.id = $scope.id;
                pEstimate.$update(function(response) {
                    var r = response.result;
                    if (r = "success") {
                        $state.go('estimate_show', {
                            id: response.estimate_form.id
                        });
                    } else {
                        $scope.errorMsg = "error";
                    };
                });
            };

            // ###########################################//
            // #################VIEW-LOGIC################//
            // ###########################################//

            // 初期設定
            $scope.initialize_location_and_market = function() {
                // Region初期化
                MapRegionService.query({}, function(response) {
                    $scope.mapRegions = response;
                    $scope.mapSellRegions = response;

                    var region_id = $scope.jobCost.region_id;
                    var solar_system_id = $scope.jobCost.solar_system_id;
                    var region_name = "All Region";
                    var solar_system_name = "All SolarSystem";
                    if (region_id != null) {
                        region_name = $scope.jobCost.region.regionName;
                    };
                    if (solar_system_id != null) {
                        solar_system_name = $scope.jobCost.solar_system.solarSystemName;
                    };

                    if (region_id == null) {
                        $scope.changeRegion();
                    } else {
                        $scope.mapRegion.selected = {
                            regionID: region_id,
                            regionName: region_name
                        };
                        $scope.initSolarSystem(region_id, solar_system_id, solar_system_name);
                    };

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

                // Event登録
                $scope.$watch('skill.skill_3380', function() {
                    $scope.changeUserSkill();
                });
                $scope.$watch('skill.skill_3388', function() {
                    $scope.changeUserSkill();
                });
            };

            $scope.initSolarSystem = function(region_id, solar_system_id, solar_system_name) {
                // SolarSystem初期化
                MapSolarSystemService.query({
                    region_id: region_id
                }, function(response) {
                    $scope.mapSolarSystems = response;
                    $scope.mapSolarSystem.selected = {
                        solarSystemID: solar_system_id,
                        solarSystemName: solar_system_name
                    };

                    // system_cost_indexの取得
                    MapSystemCostService.query({
                        region_id: region_id,
                        solar_system_id: solar_system_id
                    }, function(response) {
                        $scope.jobCost.system_cost_index = response.production_system_cost_index;
                        $scope.setJobInstallCost();
                        $scope.setEstimate();
                    });

                });
            };

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

                $scope.estimate.production_time = 0.0;

                $scope.estimate.sell_count =
                    $scope.blueprint.manufacture_product_quantity * $scope.blueprint.runs;

                $scope.estimate.sell_total_price =
                    $scope.estimate.sell_count * $scope.estimate.sell_price;

                $scope.estimate.total_cost =
                    $scope.estimate.material_total_cost + $scope.jobCost.total_job_cost;

                $scope.estimate.profit =
                    $scope.estimate.sell_total_price - $scope.estimate.total_cost;

                $scope.estimate.production_time = $scope.calcProductionTime(
                    $scope.blueprint.manufacture_product_time,
                    $scope.blueprint.runs,
                    $scope.blueprint.te,
                    $scope.skill.skill_3380,
                    $scope.skill.skill_3388);
                $scope.loading = false;
            };

            $scope.getPostEstimate = function() {
                var pEstimate = new EstimateService;

                pEstimate.estimate = {};
                pEstimate.estimate.estimate_blueprint_attributes = {};
                pEstimate.estimate.estimate_job_cost_attributes = {};
                pEstimate.estimate.estimate_materials_attributes = {};

                // estimate
                for (var i = 0; i < $scope.REGISTRABLE_ATTRIBUTES.length; i++) {
                    var valueName = $scope.REGISTRABLE_ATTRIBUTES[i];
                    pEstimate.estimate[valueName] = $scope.estimate[valueName];
                };
                // estimate blueprint
                for (var i = 0; i < $scope.BLUEPRINT_REGISTRABLE_ATTRIBUTES.length; i++) {
                    var valueName = $scope.BLUEPRINT_REGISTRABLE_ATTRIBUTES[i];
                    pEstimate.estimate.estimate_blueprint_attributes[valueName] = $scope.blueprint[valueName];
                };
                // estimate job cost
                for (var i = 0; i < $scope.JOB_COST_REGISTABLE_ATTRIBUTES.length; i++) {
                    var valueName = $scope.JOB_COST_REGISTABLE_ATTRIBUTES[i];
                    pEstimate.estimate.estimate_job_cost_attributes[valueName] = $scope.jobCost[valueName];
                };
                // estimate materials
                for (var i = 0; i < $scope.materials.length; i++) {
                    pEstimate.estimate.estimate_materials_attributes[i] = {};
                    for (var j = 0; j < $scope.MATERIAL_REGISTRABLE_ATTRIBUTES.length; j++) {
                        var valueName = $scope.MATERIAL_REGISTRABLE_ATTRIBUTES[j];
                        pEstimate.estimate.estimate_materials_attributes[i][valueName] = $scope.materials[i][valueName];
                    };
                };

                // 不足情報の追加
                pEstimate.estimate.product_type_id = $scope.product.typeID;
                return pEstimate;
            }

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

            // production time 算出
            $scope.calcProductionTime = function(base_time, runs, te, skill_3380, skill_3388) {
                var time_modifier = $scope.calcTimeModifier(te, 0);
                var skill_modifier = $scope.calcSkillModifier(skill_3380, skill_3388);
                var production_time = base_time * time_modifier * skill_modifier * runs;
                return production_time;
            };

            // timer_modifier 算出
            $scope.calcTimeModifier = function(te, pos_flag) {
                var time_modifier = 0.0;
                if (pos_flag) {
                    time_modifier = (0.75 - (te * 0.01));
                } else {
                    time_modifier = (1.0 - (te * 0.01));
                }
                return time_modifier;
            };

            // skill_modifier 算出
            $scope.calcSkillModifier = function(skill_3380, skill_3388) {
                var skill_modifier = (1 - (0.04 * skill_3380)) * (1 - (0.03 * skill_3388))
                return skill_modifier;
            };

        }
    ]);
