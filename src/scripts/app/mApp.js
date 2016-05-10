'use strict';

var angular = require('angular'),
    ngTouch = require('angular-touch'),
    ngSanitize = require('angular-sanitize'),
    ngResource = require('angular-resource'),
    uiRouter = require('angular-ui-router'),
    mAnimations = require('./animations/_loader'),
    mCtrls = require('./controllers/_loader'),
    mDirectives = require('./directives/_loader'),
    mServices = require('./services/_loader');

require('ui-select');
require('select2');
require('ng-currency');

var dependencies = [
    ngTouch,
    ngSanitize,
    ngResource,
    uiRouter,
    mAnimations,
    mCtrls,
    mDirectives,
    mServices,
    'ui.select',
    'ng-currency'
];

/**
 * Register main angular app
 */
angular.module('mApp', dependencies)
    .config(function($stateProvider, $locationProvider, $urlRouterProvider) {
        'ngInject';

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'tpls/views/home.html',
                controller: 'MyCtrl'
            })
            .state('estimate', {
                url: '/estimates',
                templateUrl: 'tpls/views/estimate_index.html',
                controller: 'EstimateIndexCtrl'
            })
            .state('estimate_select', {
                url: '/estimate_select',
                templateUrl: 'tpls/views/estimate_select.html',
                controller: 'EstimateSelectCtrl'
            })
            .state('estimate_new', {
                url: '/estimate/new',
                templateUrl: 'tpls/views/estimate_edit.html',
                controller: 'EstimateEditCtrl'
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    });
