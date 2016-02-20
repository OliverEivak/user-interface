'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ui.materialize',
    'myApp.services',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'myApp.modalLogin',
    'myApp.register',
    'myApp.header'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]);
