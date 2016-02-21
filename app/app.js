'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ui.materialize',
    'myApp.services',
    'myApp.home',
    'myApp.version',
    'myApp.login',
    'myApp.register',
    'myApp.header',
    'myApp.courses',
    'myApp.sidebar'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);
