'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'view/home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home/courses/:courseCode', {
            templateUrl: 'view/home/homeCourses.html',
            controller: 'HomeCoursesCtrl'
        });
    }])

    .controller('HomeCtrl', ['$scope', '$timeout', 'authenticatedUserService', 'serverCallService',
        function($scope, $timeout, authenticatedUserService, serverCallService) {

            $scope.isLoggedIn = authenticatedUserService.isAuthenticated;

            $scope.collapsibleElements = [{
                icon: 'mdi-image-filter-drama',
                title: 'Colors',
                content: 'Did you use nice colors?',
                points: 2,
                total: 2,
                amount: 50
            },{
                icon: 'mdi-maps-place',
                title: 'Usability',
                content: 'Can it be used without frustration?',
                points: 3,
                total: 4,
                amount: 75
            },{
                icon: 'mdi-social-whatshot',
                title: 'Technical',
                content: 'Did you use cool technologies?',
                points: 3,
                total: 5,
                amount: 60
            }
            ];

            $scope.linkForm = {};
            $scope.linkForm.isVisible = false;

            $scope.toggleLinkForm = function() {
                $scope.linkForm.isVisible = !$scope.linkForm.isVisible;
                if ($scope.linkForm.isVisible) {
                    $timeout(function () {
                        angular.element('#week-3-url').focus();
                    });
                }
            };

            $scope.week = {};
            $scope.week.links = [];
            $scope.addLinkForm = {};

            $scope.addLink = function() {
                var index = $scope.week.links.indexOf($scope.addLinkForm.link);
                if (index > -1) {

                } else {
                    $scope.week.links.push($scope.addLinkForm.link);
                    $scope.addLinkForm.link = null;
                    $scope.linkForm.isVisible = false;
                }
            };

            $scope.cancelAddLink = function() {
                $scope.addLinkForm.link = null;
                $scope.linkForm.isVisible = false;
            };

            $scope.removeLink = function(link) {
                var index = $scope.week.links.indexOf(link);
                if (index > -1) {
                    $scope.week.links.splice(index, 1);
                }
            };

            $scope.data = {};

            serverCallService.makeGet('rest/courses', {}, getCoursesSuccess, getCoursesFail);

            function getCoursesSuccess(data) {
                $scope.data.courses = data;
            }

            function getCoursesFail() { }

        }])

    .controller('HomeCoursesCtrl', ['$scope', '$timeout', '$routeParams', 'authenticatedUserService', 'serverCallService',
        function($scope, $timeout, $routeParams, authenticatedUserService, serverCallService) {

            $scope.isLoggedIn = authenticatedUserService.isAuthenticated;

            $scope.data = {};

            serverCallService.makeGet('rest/courses', {}, getCoursesSuccess, getCoursesFail);

            function getCoursesSuccess(data) {
                $scope.data.courses = data;
            }

            function getCoursesFail() { }

            serverCallService.makeGet('rest/courses/' + $routeParams.courseCode, {}, getCourseSuccess, getCourseFail);

            function getCourseSuccess(data) {
                $scope.data.course = data;
            }

            function getCourseFail() { }

        }]);