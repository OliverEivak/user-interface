'use strict';

angular.module('myApp.modalGradeGroup', [])

    .directive('modalGradeGroup', [
        function() {
            return {
                scope: {
                    user: '=',
                    gradeGroup: '=',
                    isOpen: '=',
                    accessor: '='
                },
                templateUrl: 'components/modalGradeGroup/modalGradeGroup.html',
                controller: function($scope) {

                    $scope.rangeValues = [];
                    $scope.currentValue = 0;
                    $scope.maxValue = 0;

                    $scope.$watch('user', function(newValue, oldValue) {
                        if ($scope.selectedGradeGroup) {
                            $scope.reset();
                        } else {
                            $scope.selectedUser = angular.copy($scope.user);
                        }
                    }, true);

                    $scope.$watch('gradeGroup', function(newValue, oldValue) {
                        $scope.selectedGradeGroup = newValue;

                        if (newValue) {
                            $scope.reset();
                        }
                    });

                    $scope.reset = $scope.accessor.reset = function () {
                        $scope.selectedUser = angular.copy($scope.user);

                        prefillRangeValues();
                        calculateMaxGradeGroupValue();
                    };

                    function prefillRangeValues() {
                        $scope.rangeValues = [];

                        if (!$scope.selectedUser)
                            return;

                        // Fill with existing values or zeroes
                        $scope.selectedGradeGroup.grades.forEach(function(grade) {
                            var studentGrade = $scope.getStudentGradeByGradeGroupGrade($scope.selectedUser, grade);

                            // Create the grade if it does not exist yet
                            if (!studentGrade) {
                                console.log('creating grade');
                                studentGrade = {
                                    user: $scope.selectedUser.id,
                                    value: 0,
                                    grade: grade.id,
                                    comment: ''
                                };
                                $scope.selectedUser.grades.push(studentGrade);
                            }

                            $scope.rangeValues[grade.id] = studentGrade.value;
                        });
                    }

                    function calculateMaxGradeGroupValue() {
                        $scope.maxValue = 0;
                        $scope.selectedGradeGroup.grades.forEach(function(grade) {
                            $scope.maxValue += grade.maxValue;
                        });
                    }

                    $scope.getStudentGradeByGradeGroupGrade = function(student, gradeGroupGrade) {
                        for (var i = 0; i < student.grades.length; i++) {
                            if (student.grades[i].grade === gradeGroupGrade.id) {
                                return student.grades[i];
                            }
                        }
                    };

                    $scope.$watchCollection('rangeValues', function(newValue, oldValue) {
                        $scope.currentValue = 0;

                        $scope.rangeValues.forEach(function(value, index) {
                            value = parseInt(value);

                            // Find the grade
                            var foundGrade;
                            $scope.selectedUser.grades.forEach(function(studentGrade) {
                                if (studentGrade.grade === index) {
                                    foundGrade = studentGrade;
                                }
                            });

                            // Update existing grade
                            if (foundGrade) {
                                foundGrade.value = value;
                            } else {
                                console.error('Did not find grade.');
                            }

                            // Calculate current total grade
                            $scope.currentValue += value;
                        });


                    });

                    $scope.save = function() {
                        // Send data back
                        $scope.user = $scope.selectedUser;

                        //$scope.isOpen = false;
                        angular.element('#grade-group-modal').closeModal();
                    };

                    $scope.cancel = function() {
                        //Reset
                        $scope.reset();

                        //$scope.isOpen = false;
                        angular.element('#grade-group-modal').closeModal();
                    };

                }
            }
        }]);
