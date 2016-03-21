'use strict';

angular.module('myApp.teacher', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/teacher', {
            templateUrl: 'view/teacher/teacher.html',
            controller: 'TeacherCtrl'
        });
    }])

    .controller('TeacherCtrl', ['$scope', '$location', '$timeout', 'authenticationService', 'httpService',
        function($scope, $location, $timeout, authenticationService, httpService) {

            $scope.isAuthenticated = authenticationService.isAuthenticated;

            // Get grade groups
            httpService.makeGet('rest/gradeGroups', {}, getGradeGroupsSuccess, getGradeGroupsFail);

            function getGradeGroupsSuccess(data) {
                $scope.gradeGroups = data;

                if ($scope.studentGrades) {
                    calculateGradeGroupSums();
                }
            }

            function getGradeGroupsFail() {
                console.log('Failed to get grade groups.');
            }

            // Get students
            httpService.makeGet('rest/students', {}, getStudentsSuccess, getStudentsFail);

            function getStudentsSuccess(data) {
                $scope.students = data;

                calculateStudentGroupColors();

                // Get all grades
                httpService.makeGet('rest/grades', {}, getStudentGradesSuccess, getStudentGradesFail);
            }

            function getStudentsFail() {
                console.log('Failed to get students.');
            }

            // Add grades to student objects
            function getStudentGradesSuccess(data) {
                if (data && data.length > 0) {
                    $scope.studentGrades = data;

                    // Collect grades by user
                    var studentGrades = [];
                    data.forEach(function(grade) {
                        if (!studentGrades[grade.user]) {
                            studentGrades[grade.user] = [grade];
                        } else {
                            studentGrades[grade.user].push(grade);
                        }
                    });

                    // Add collections to users
                    $scope.students.forEach(function(user) {
                        user.grades = studentGrades[user.id] || [];
                    });

                    if ($scope.gradeGroups) {
                        calculateGradeGroupSums();
                    }
                }
            }

            function getStudentGradesFail() {
                console.log('Failed to get all student grades.');
            }

            function findUserByID(users, userID) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id === userID) {
                        return users[i];
                    }
                }
            }

            function calculateGradeGroupSums() {
                $scope.students.forEach(function(user) {
                    var sortedGrades = [];
                    user.grades.forEach(function(studentGrade) {
                        // Get gradeGroup from studentGrade (studentGrade <-- grade <-- gradeGroup)
                        var gradeGroup = getGradeGroupByGrade(studentGrade.grade);
                        if (gradeGroup) {
                            if (!sortedGrades[gradeGroup.id]) {
                                sortedGrades[gradeGroup.id] = [studentGrade];
                            } else {
                                sortedGrades[gradeGroup.id].push(studentGrade);
                            }
                        }
                    });

                    user.gradeGroupSummaries = [];
                    var total = 0;
                    sortedGrades.forEach(function(grades, index) {
                        var gradeGroupTotal = 0;
                        grades.forEach(function(grade) {
                            gradeGroupTotal += grade.value;
                        });
                        total += gradeGroupTotal;

                        user.gradeGroupSummaries.push({
                            gradeGroup: index,
                            total: gradeGroupTotal
                        });
                    });
                    user.gradeGroupTotal = total;

                    // Sort the totals by gradeGroup index
                    user.gradeGroupSummaries.sort(function(a, b) {
                       return a.index - b.index;
                    });
                });
            }

            function getGradeGroupByGrade(grade) {
                for (var i = 0; i < $scope.gradeGroups.length; i++) {
                    for (var j = 0; j < $scope.gradeGroups[i].grades.length; j++) {
                        if ($scope.gradeGroups[i].grades[j].id === grade) {
                            return $scope.gradeGroups[i];
                        }
                    }
                }
            }

            $scope.modalAccessor = {};

            $scope.setModalData = function(gradeGroup, student) {
                $scope.selectedUser = student;
                $scope.selectedGradeGroup = gradeGroup;
            };

            $scope.$watch('selectedUser', function(newValue, oldValue) {
                if (newValue && oldValue) {
                    var changed = false;

                    $scope.students.forEach(function(student, index) {
                        if (student.id === newValue.id) {
                            console.log('updated user in teacher view');
                            $scope.students[index] = newValue;
                            changed = true;
                        }
                    });

                    if (changed) {
                        calculateGradeGroupSums();
                    }
                }
            });

            $scope.getStudentsGradeGroupSum = function(user, gradeGroup) {
                for (var i = 0; i < user.gradeGroupSummaries.length; i++) {
                    if (user.gradeGroupSummaries[i].gradeGroup === gradeGroup.id) {
                        return user.gradeGroupSummaries[i].total;
                    }
                }

                return '-';
            };

            function calculateStudentGroupColors() {
                var last;
                $scope.students.forEach(function(student, index) {
                    if (student.studentGroup) {
                        if (!last) {
                            student.studentGroupColor = 1;
                            last = 1;
                        } else {
                            if (student.studentGroup === $scope.students[index - 1].studentGroup) {
                                student.studentGroupColor = last;
                            } else {
                                if (last === 1)
                                    student.studentGroupColor = 2;
                                else if (last === 2)
                                    student.studentGroupColor = 1;

                                last = student.studentGroupColor;
                            }
                        }
                    } else {
                        student.studentGroupColor = 0;
                    }
                });
            }

            $scope.joinStudents = function() {
                var groupID = getNextGroupID();
                var students = getSelectedStudents();

                if (students.length < 2)
                    return;

                students.forEach(function(student) {
                    student.studentGroup = groupID;
                });

                deleteSingleStudentGroups();
                sortStudentsByGroups();
                calculateStudentGroupColors();
                clearStudentSelection();
            };

            $scope.splitStudents = function() {
                var students = getSelectedStudents();

                students.forEach(function(student) {
                    student.studentGroup = null;
                });

                deleteSingleStudentGroups();
                calculateStudentGroupColors();
                clearStudentSelection();
            };

            function getSelectedStudents() {
                var selectedStudents = [];

                $scope.students.forEach(function(student) {
                    if (student.isSelected) {
                        selectedStudents.push(student);
                    }
                });

                return selectedStudents;
            }

            function getNextGroupID() {
                var max = 1;

                $scope.students.forEach(function(student) {
                    if (student.studentGroup && student.studentGroup > max)
                        max = student.studentGroup;
                });

                return max + 1;
            }

            function clearStudentSelection() {
                var selectedStudents = getSelectedStudents();
                selectedStudents.forEach(function(student) {
                    student.isSelected = false;
                });
            }

            /**
             * Sorts students so that all members of a group are next to each other.
             * It aims to move students around as little as possible when creating new groups.
             */
            function sortStudentsByGroups() {
                $scope.students.forEach(function(student, index) {
                    if (student.studentGroup) {
                        // for the first student and all those whose are the 1st of their group
                        if (index === 0 || student.studentGroup !== $scope.students[index - 1].studentGroup) {

                            // find all next students from the same group
                            for (var j = index + 1; j < $scope.students.length; j++) {
                                if (j < $scope.students.length &&
                                    $scope.students[j].studentGroup === student.studentGroup) {

                                    // find a next student from another group and swap with them
                                    for (var k = index + 1; k < $scope.students.length; k++) {
                                        if (k < $scope.students.length &&
                                            $scope.students[k].studentGroup !== student.studentGroup) {

                                            // swap
                                            var temp = $scope.students[k];
                                            $scope.students[k] = $scope.students[j];
                                            $scope.students[j] = temp;

                                            break;
                                        }
                                    }

                                }
                            }
                        }
                    }
                });
            }

            function deleteSingleStudentGroups() {
                var groups = [];

                $scope.students.forEach(function (student) {
                    if (student.studentGroup) {
                        if (!groups[student.studentGroup]) {
                            groups[student.studentGroup] = [student];
                        } else {
                            groups[student.studentGroup].push(student);
                        }
                    }
                });

                groups.forEach(function(group) {
                    if (group && group.length === 1) {
                        group[0].studentGroup = null;
                    }
                });
            }

            $scope.data = {
                searchQuery: ''
            };

        }]);
