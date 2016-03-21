'use strict';

angular.module('myApp.sidebar', [])

    .directive('sidebar', ['$timeout', '$location', '$routeParams', 'httpService',
        function($timeout, $location, $routeParams, httpService) {
            return {
                scope: true,
                templateUrl: 'components/sidebar/sidebar.html',
                controller: function($scope) {

                    $scope.data = {};

                    httpService.makeGet('rest/gradeGroups', {}, getGradeGroupsSuccess, getGradeGroupsFail);

                    function getGradeGroupsSuccess(data) {
                        $scope.data.gradeGroups = data;
                    }

                    function getGradeGroupsFail() {

                    }

                    $scope.isGradeGroupPage = function(gradeGroup) {
                        if ($routeParams.gradeGroup === String(gradeGroup.id)) {
                            return true;
                        }
                    };

                }
            }
        }]);

