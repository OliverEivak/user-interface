'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'ui.materialize',
    'myApp.services',
    'myApp.home',
    'myApp.version',
    'myApp.login',
    'myApp.register',
    'myApp.header',
    'myApp.studentGradeGroup',
    'myApp.addLink',
    'myApp.teacher',
    'myApp.teacherGradeGroup',
    'myApp.comment',
    'myApp.studentTable'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

app.run(['$rootScope', 'authenticationService', '$location', function($rootScope, authenticationService, $location) {
    $rootScope.$on('$locationChangeStart', function(event, newLocation) {
        if (newLocation.indexOf('/teacher') !== -1) {
            var user = authenticationService.getUser();
            if (user && user.role === 'TEACHER') {
                return;
            } else {
                event.preventDefault();
                $location.url('/student/gradeGroups');
            }
        }

        if (newLocation.indexOf('/student') !== -1) {
            var user = authenticationService.getUser();
            if (user && user.role === 'STUDENT') {
                return;
            } else {
                event.preventDefault();
                $location.url('/teacher');
            }
        }
    });
}]);
