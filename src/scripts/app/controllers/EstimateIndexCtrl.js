'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader');

mCtrls
    .controller('EstimateIndexCtrl', ['$scope', '$stateParams',

        function($scope, $stateParams) {
            console.log('test');

            $scope.estimateResults = [{
                id: 1,
                product_type_id: 34
            }];
        }
    ]);
