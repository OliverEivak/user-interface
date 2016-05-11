'use strict';

angular.module('myApp.sidebar', [])

    .directive('sidebar', ['$routeParams', 'httpService',
        function($routeParams, httpService) {
            return {
                scope: true,
                templateUrl: 'components/sidebar/sidebar.html',
                controller: function($scope) {

                    $scope.data = {};

                    httpService.makeGet('sis-api/gradeGroups', {}, getGradeGroupsSuccess, getGradeGroupsFail);

                    function getGradeGroupsSuccess(response) {
                        $scope.data.gradeGroups = response.data;
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

