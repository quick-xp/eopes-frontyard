'use strict';

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader');

mCtrls.controller('TopCtrl', function ($scope, $auth) {
    $scope.handleBtnClick = function() {
          $auth.authenticate('EveOnline')
            .then(function(resp) {
              // handle success
            })
            .catch(function(resp) {
              // handle errors
            });
        };
});
