'use strict';

angular.module('myApp.courses', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/courses', {
            templateUrl: 'view/courses/courses.html',
            controller: 'CoursesCtrl'
        });
    }])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/courses/:courseCode', {
            templateUrl: 'view/courses/course.html',
            controller: 'CourseCtrl'
        });
    }])

    .controller('CoursesCtrl', ['$scope', '$timeout', '$location', 'authenticatedUserService', 'serverCallService',
        function($scope, $timeout, $location, authenticatedUserService, serverCallService) {

            $scope.isLoggedIn = authenticatedUserService.isAuthenticated;

            $scope.data = {};

            serverCallService.makeGet('rest/courses', {}, getCoursesSuccess, getCoursesFail);

            function getCoursesSuccess(data) {
                $scope.data.courses = data;
            }

            function getCoursesFail() { }

            $scope.enroll = function(course) {
                var data = {
                    user: authenticatedUserService.getUser()
                };
                serverCallService.makePost('rest/courses/' + course.code + '/users', data, enrollSuccess, enrollFail);
            };

            function enrollSuccess(data) {
                $location.url('/courses/' + data.code);
            }

            function enrollFail() { }

        }])

    .controller('CourseCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'authenticatedUserService', 'serverCallService',
        function($scope, $timeout, $location, $routeParams, authenticatedUserService, serverCallService) {

            $scope.isLoggedIn = authenticatedUserService.isAuthenticated;

            $scope.data = {};

            serverCallService.makeGet('rest/courses/' + $routeParams.courseCode, {}, getCourseSuccess, getCourseFail);

            function getCourseSuccess(data) {
                $scope.data.course = data;
            }

            function getCourseFail() { }

        }]);