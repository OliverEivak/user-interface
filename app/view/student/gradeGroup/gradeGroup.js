'use strict';

angular.module('myApp.studentGradeGroup', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/student/gradeGroups/:gradeGroup', {
            templateUrl: 'view/student/gradeGroup/gradeGroup.html',
            controller: 'StudentGradeGroupCtrl'
        });
    }])

    .controller('StudentGradeGroupCtrl', ['$scope', '$timeout', '$routeParams', 'authenticationService', 'httpService',
        function($scope, $timeout, $routeParams, authenticationService, httpService) {

            $scope.isAuthenticated = authenticationService.isAuthenticated;

            var userID = authenticationService.getUser().id;

            // Get grade groups
            httpService.makeGet('rest/gradeGroups', {}, getGradeGroupsSuccess, getGradeGroupsFail);

            function getGradeGroupsSuccess(data) {
                for (var i = 0; i < data.length; i++) {
                    if (String(data[i].id) === $routeParams.gradeGroup) {
                        $scope.gradeGroup = data[i];
                    }
                }

                if ($scope.studentGrades) {
                    addStudentGradesToGradeGroup();
                }
            }

            function getGradeGroupsFail() {
                console.log('Failed to get grade group.');
            }

            // Get student's grades
            httpService.makeGet('rest/users/' + userID + '/grades', {}, getStudentGradesSuccess, getStudentGradesFail);

            function getStudentGradesSuccess(data) {
                $scope.studentGrades = data;
                if ($scope.gradeGroup) {
                    addStudentGradesToGradeGroup();
                }
            }

            function getStudentGradesFail() {
                console.log('Failed to get grades.');

                // just create empty grades
                addStudentGradesToGradeGroup();
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
                        if ($scope.studentGrades[i].grade === grade.id) {
                            return $scope.studentGrades[i];
                        }
                    }
                }
            }

        }]);
