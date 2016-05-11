'use strict';

angular.module('myApp.studentGradeGroup', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/student/gradeGroups', {
            templateUrl: 'view/student/gradeGroup/gradeGroup.html',
            controller: 'StudentGradeGroupCtrl'
        });
    }])

    .controller('StudentGradeGroupCtrl', ['$scope', '$timeout', '$routeParams', 'authenticationService', 'httpService',
        function($scope, $timeout, $routeParams, authenticationService, httpService) {

            $scope.isAuthenticated = authenticationService.isAuthenticated;

            init();

            function init() {
                // Get grade groups
                httpService.makeGet('sis-api/gradeGroups', {}, getGradeGroupsSuccess, getGradeGroupsFail);

                // Get student's grades
                var params = {
                    username:  authenticationService.getUser().username
                };
                httpService.makeGet('sis-api/studentGrades', params, getStudentGradesSuccess, getStudentGradesFail);
            }

            function getGradeGroupsSuccess(response) {
                $scope.gradeGroups = response.data;

                if (response.data[0]) {
                    $scope.gradeGroup = response.data[0];
                }

                if ($scope.studentGrades) {
                    addStudentGradesToGradeGroup();
                }
            }

            function getGradeGroupsFail() {
                console.error('Failed to get grade group.');
            }

            function getStudentGradesSuccess(response) {
                $scope.studentGrades = response.data;
                if ($scope.gradeGroup) {
                    addStudentGradesToGradeGroup();
                }
            }

            function getStudentGradesFail() {
                console.error('Failed to get grades.');
            }

            // Combine both
            function addStudentGradesToGradeGroup() {
                $scope.gradeGroup.total = 0;
                $scope.gradeGroup.maxValue = 0;

                $scope.gradeGroup.grades.forEach(function(grade) {
                    var studentGrade = findStudentGradeByGradeGroupGrade(grade);
                    if (!studentGrade) {
                        studentGrade = {
                            value: 0
                        };
                    }
                    grade.studentGrade = studentGrade;

                    $scope.gradeGroup.total += studentGrade.value;
                    $scope.gradeGroup.maxValue += grade.maxValue;
                });
            }

            function findStudentGradeByGradeGroupGrade(grade) {
                if ($scope.studentGrades) {
                    for (var i = 0; i < $scope.studentGrades.length; i++) {
                        if ($scope.studentGrades[i].grade.id === grade.id) {
                            return $scope.studentGrades[i];
                        }
                    }
                }
            }

            $scope.selectGradeGroup = function(gradeGroup) {
                for (var i = 0; i < $scope.gradeGroups.length; i++) {
                    if ($scope.gradeGroups[i].id === gradeGroup.id) {
                        $scope.gradeGroup = $scope.gradeGroups[i];
                        addStudentGradesToGradeGroup();
                        break;
                    }
                }
            }

        }]);
