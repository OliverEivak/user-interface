'use strict';

angular.module('myApp.sidebar', [])

    .directive('sidebar', ['$timeout', '$location', '$routeParams', 'serverCallService',
        function($timeout, $location, $routeParams, serverCallService) {
            return {
                scope: true,
                templateUrl: 'components/sidebar/sidebar.html',
                controller: function($scope) {

                    $scope.data = {};

                    serverCallService.makeGet('rest/courses', {}, getCoursesSuccess, getCoursesFail);

                    function getCoursesSuccess(data) {
                        $scope.data.courses = data;
                    }

                    function getCoursesFail() {

                    }

                    $scope.isCoursePage = function(course) {
                        if ($routeParams.courseCode === course.code) {
                            return true;
                        }
                    };

                    $scope.isNotCoursePage = function() {
                        if (!$routeParams.courseCode) {
                            return true;
                        }
                    };

                }
            }
        }]);

