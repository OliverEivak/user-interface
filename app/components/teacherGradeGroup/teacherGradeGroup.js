'use strict';

angular.module('myApp.teacherGradeGroup', [])

    .directive('teacherGradeGroup', ['linkService', 'studentGradeService',
        function(linkService, studentGradeService) {
            return {
                scope: {
                    users: '=',
                    gradeGroup: '=',
                    isOpen: '=',
                    accessor: '='
                },
                templateUrl: 'components/teacherGradeGroup/teacherGradeGroup.html',
                controller: function($scope) {

                    $scope.rangeValues = [];
                    $scope.currentValue = 0;
                    $scope.maxValue = 0;

                    $scope.$watch('users', function(newValue, oldValue) {
                        if ($scope.selectedGradeGroup) {
                            $scope.reset();
                        } else {
                            $scope.selectedUsers = angular.copy($scope.users);
                        }
                    }, true);

                    $scope.$watch('gradeGroup', function(newValue, oldValue) {
                        $scope.selectedGradeGroup = newValue;

                        if (newValue) {
                            $scope.reset();
                        }
                    });

                    $scope.reset = $scope.accessor.reset = function () {
                        $scope.selectedUsers = angular.copy($scope.users);

                        prefill();
                        calculateMaxGradeGroupValue();
                    };

                    function prefill() {
                        $scope.rangeValues = [];
                        $scope.comments = [];
                        $scope.links = [];

                        if (!$scope.selectedUsers)
                            return;

                        $scope.selectedUsers.forEach(function(selectedUser) {
                            // References for quick access in the view
                            selectedUser.gradesByGradeGroupGradeID = [];

                            // Fill with existing values or zeroes
                            $scope.selectedGradeGroup.grades.forEach(function(grade) {
                                var studentGrade = getStudentGradeByGradeGroupGrade(selectedUser, grade);

                                // Create the grade if it does not exist yet
                                if (!studentGrade) {
                                    console.log('creating grade');
                                    studentGrade = {
                                        user: {
                                            id: selectedUser.id
                                        },
                                        value: 0,
                                        grade: {
                                            id: grade.id
                                        },
                                        comment: ''
                                    };
                                    selectedUser.grades.push(studentGrade);
                                }

                                // Save a reference
                                selectedUser.gradesByGradeGroupGradeID[grade.id] = studentGrade;

                                $scope.rangeValues[grade.id] = studentGrade.value;
                                $scope.comments[grade.id] = studentGrade.comment;

                                if (!$scope.links[grade.id]) {
                                    linkService.getLinkByGradeAndUser(grade, selectedUser, setLink);
                                }
                            });
                        });

                        // Keep the text areas from updating the grade comments right away
                        $scope.commentsJustPrefilled = true;
                    }

                    function setLink(response) {
                        var link = response.data;
                        if (link) {
                            $scope.links[link.grade.id] = link.url;
                        }
                    }

                    function calculateMaxGradeGroupValue() {
                        $scope.maxValue = 0;
                        $scope.selectedGradeGroup.grades.forEach(function(grade) {
                            $scope.maxValue += grade.maxValue;
                        });
                    }

                    function getStudentGradeByGradeGroupGrade(student, gradeGroupGrade) {
                        for (var i = 0; i < student.grades.length; i++) {
                            if (student.grades[i].grade.id === gradeGroupGrade.id) {
                                return student.grades[i];
                            }
                        }
                    }

                    $scope.rangeValueChanged = function(grade) {
                        if (!$scope.selectedUsers)
                            return;

                        $scope.selectedUsers.forEach(function(selectedUser) {
                            // Find the grade
                            var foundGrade;
                            selectedUser.grades.forEach(function(studentGrade) {
                                if (studentGrade.grade.id === grade.id) {
                                    foundGrade = studentGrade;
                                }
                            });

                            // Update existing grade
                            if (foundGrade) {
                                foundGrade.value = parseInt($scope.rangeValues[grade.id]);
                            } else {
                                console.error('Did not find grade to update value.');
                            }
                        });

                        calculateCurrentPoints();
                    };

                    $scope.$watchCollection('comments', function(newValue, oldValue) {
                        if ($scope.commentsJustPrefilled) {
                            $scope.commentsJustPrefilled = false;
                            return;
                        }

                        if (!$scope.selectedUsers)
                            return;

                        $scope.selectedUsers.forEach(function(selectedUser) {
                            $scope.comments.forEach(function(value, index) {
                                // Only update changed value
                                if (newValue[index] !== oldValue[index]) {
                                    // Find the grade
                                    var foundGrade;
                                    selectedUser.grades.forEach(function(studentGrade) {
                                        if (studentGrade.grade.id === index) {
                                            foundGrade = studentGrade;
                                        }
                                    });

                                    // Update existing grade
                                    if (foundGrade) {
                                        foundGrade.comment = value;
                                    } else {
                                        console.error('Did not find grade to update comment.');
                                    }
                                }
                            });
                        });
                    });

                    function calculateCurrentPoints() {
                        $scope.currentValue = 0;

                        $scope.rangeValues.forEach(function(value) {
                            if (value) {
                                $scope.currentValue += parseInt(value);
                            }
                        });
                    }

                    $scope.save = function() {
                        if (!$scope.selectedUsers || $scope.selectedUsers.length === 0)
                            return;

                        var grades = [];
                        $scope.selectedUsers.forEach(function(selectedUser) {
                            var studentGrades = angular.copy(selectedUser.grades);
                            Array.prototype.push.apply(grades, studentGrades);
                        });

                        studentGradeService.save(grades, studentGradeSaveSuccess, studentGradeSaveFail);
                    };

                    $scope.cancel = function() {
                        $scope.reset();
                        $scope.accessor.close();
                    };

                    function studentGradeSaveSuccess() {
                        $scope.users.forEach(function(user, index) {
                            user.grades = $scope.selectedUsers[index].grades;
                        });

                        $scope.accessor.close();
                    }

                    function studentGradeSaveFail() {
                        console.error('Failed to save student grades')
                    }

                }
            }
        }]);
