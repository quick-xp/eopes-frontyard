'use strict';

var angular = require('angular'),
    ngTouch = require('angular-touch'),
    ngSanitize = require('angular-sanitize'),
    ngResource = require('angular-resource'),
    uiRouter = require('angular-ui-router'),
    mAnimations = require('./animations/_loader'),
    mCtrls = require('./controllers/_loader'),
    mDirectives = require('./directives/_loader'),
    mServices = require('./services/_loader'),
    mFilters = require('./filters/_loader');

require('ui-select');
require('select2');
require('ng-currency');
require('datatablesAdminLte');
require('datatablesBootstrap');
require('angularDataTables');
require('angular-cookie');
require('ng-token-auth');

var dependencies = [
    ngTouch,
    ngSanitize,
    ngResource,
    uiRouter,
    mAnimations,
    mCtrls,
    mDirectives,
    mServices,
    mFilters,
    'ui.select',
    'ng-currency',
    'datatables',
    'ng-token-auth'
];

/**
 * Register main angular app
 */
angular.module('mApp', dependencies)
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) {
        'ngInject';

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'tpls/views/home.html',
                controller: 'TopCtrl'
            })
            .state('estimate', {
                url: '/estimates',
                templateUrl: 'tpls/views/estimate_index.html',
                controller: 'EstimateIndexCtrl'
            })
            .state('estimate_new', {
                url: '/estimates/new',
                templateUrl: 'tpls/views/estimate_edit.html',
                controller: 'EstimateEditCtrl'
            })
            .state('estimate_edit', {
                url: '/estimates/:id/edit',
                templateUrl: 'tpls/views/estimate_edit.html',
                controller: 'EstimateEditCtrl'
            })
            .state('estimate_select', {
                url: '/estimate_select',
                templateUrl: 'tpls/views/estimate_select.html',
                controller: 'EstimateSelectCtrl'
            })
            .state('estimate_show', {
                url: '/estimates/:id',
                templateUrl: 'tpls/views/estimate_show.html',
                controller: 'EstimateShowCtrl'
            });

        $authProvider.configure({
            apiUrl: 'https://login.eveonline.com',
            tokenValidationPath: '/auth/validate_token',
            signOutUrl: '/auth/sign_out',
            emailRegistrationPath: '/auth',
            accountUpdatePath: '/auth',
            accountDeletePath: '/auth',
            confirmationSuccessUrl: window.location.href,
            passwordResetPath: '/auth/password',
            passwordUpdatePath: '/auth/password',
            passwordResetSuccessUrl: window.location.href,
            emailSignInPath: '/auth/sign_in',
            storage: 'cookies',
            forceValidateToken: false,
            validateOnPageLoad: true,
            proxyIf: function() {
                return false;
            },
            proxyUrl: '/proxy',
            omniauthWindowType: 'sameWindow',
            authProviderPaths: {
                EveOnline: '/oauth/authorize',
            },
            tokenFormat: {
                "access-token": "{{ token }}",
                "token-type": "Bearer",
                "client": "{{ clientId }}",
                "expiry": "{{ expiry }}",
                "uid": "{{ uid }}"
            },
            cookieOps: {
                path: "/",
                expires: 9999,
                expirationUnit: 'days',
                secure: false,
                domain: 'domain.com'
            },
            createPopup: function(url) {
                return window.open(url, '_blank', 'closebuttoncaption=Cancel');
            },
            parseExpiry: function(headers) {
                // convert from UTC ruby (seconds) to UTC js (milliseconds)
                return (parseInt(headers['expiry']) * 1000) || null;
            },
            handleLoginResponse: function(response) {
                return response.data;
            },
            handleAccountUpdateResponse: function(response) {
                return response.data;
            },
            handleTokenValidationResponse: function(response) {
                return response.data;
            }
        });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    });
