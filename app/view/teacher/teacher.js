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

            $scope.pagination = {
                page: 1,
                pageSize: 20
            };

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
                resetPagination();

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
                    user.gradeGroupTotal = 0;

                    // create gradeGroupSummaries
                    $scope.gradeGroups.forEach(function(gradeGroup) {
                        var gradeGroupTotal = 0;
                        if (sortedGrades[gradeGroup.id]) {
                            sortedGrades[gradeGroup.id].forEach(function (grade) {
                                gradeGroupTotal += grade.value;
                            });

                            user.gradeGroupTotal += gradeGroupTotal;
                        }

                        user.gradeGroupSummaries[gradeGroup.id] = gradeGroupTotal || '-';
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
            }, true);

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
                                if ($scope.students[j].studentGroup === student.studentGroup) {

                                    // find a next student from another group and swap with them
                                    for (var k = index + 1; k < $scope.students.length; k++) {
                                        if ($scope.students[k].studentGroup !== student.studentGroup) {

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

            // filter
            $scope.$watch('data.searchQuery', function() {
                var query = $scope.data.searchQuery;
                if (!query || query.trim().length === 0) {
                    resetPagination();
                    return;
                }
                query = query.toLowerCase();

                $scope.matchingStudents = [];

                var matchingGroupIDs = [];

                $scope.students.forEach(function(student, index) {
                    var queryInFirstName = student.firstName.toLowerCase().indexOf(query) !== -1;
                    var queryInLastName = student.lastName.toLowerCase().indexOf(query) !== -1;
                    var queryInFullName = (student.firstName.toLowerCase() + ' ' + student.lastName.toLowerCase()).indexOf(query) !== -1;
                    var hasStudentGroup = student.studentGroup > 0;
                    var groupHasBeenMatched = hasStudentGroup && matchingGroupIDs.indexOf(student.studentGroup) !== -1;

                    if (queryInFirstName || queryInLastName || queryInFullName || groupHasBeenMatched) {
                        $scope.matchingStudents.push(student);

                        if (hasStudentGroup && !groupHasBeenMatched) {
                            matchingGroupIDs.push(student.studentGroup);

                            // find previous students from the same group
                            var i = index;
                            while (i && $scope.students[i - 1].studentGroup &&
                                $scope.students[i - 1].studentGroup === student.studentGroup) {
                                $scope.matchingStudents.push($scope.students[i - 1]);
                                i--;
                            }
                        }
                    }
                });

                $scope.visibleStudents = $scope.matchingStudents.slice(0, Math.min($scope.pagination.pageSize, $scope.matchingStudents.length));
                $scope.pagination.page = 1;
            });

            /**
             * Will be called when the user clicks on a page number.
             */
            $scope.changePage = function(page) {
                console.log('change to page ' + page);

                var start = (page - 1) * $scope.pagination.pageSize;
                var end = start + $scope.pagination.pageSize;
                $scope.visibleStudents = $scope.matchingStudents.slice(start, end);
            };

            function resetPagination() {
                $scope.matchingStudents = $scope.students;
                $scope.visibleStudents = $scope.students.slice(0, Math.min($scope.pagination.pageSize, $scope.students.length));
            }

        }]);
