'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'view/home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', ['$scope', '$location', '$timeout', 'authenticationService', 'httpService',
        function($scope, $location, $timeout, authenticationService, httpService) {

            $scope.isAuthenticated = authenticationService.isAuthenticated;

            // Redirect to other pages if logged in
            if ($scope.isAuthenticated()) {
                var user = authenticationService.getUser();
                if (user.role === 'STUDENT') {
                    $location.url('/student/gradeGroups');
                } else if (user.role === 'TEACHER') {
                    $location.url('/teacher');
                }
            }

        }]);
