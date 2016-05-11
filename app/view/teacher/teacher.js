'use strict';

angular.module('myApp.teacher', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/teacher', {
            templateUrl: 'view/teacher/teacher.html',
            controller: 'TeacherCtrl'
        });
    }])

    .controller('TeacherCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'authenticationService', 'httpService', 'studentService',
        function($scope, $rootScope, $location, $timeout, authenticationService, httpService, studentService) {

            $scope.isAuthenticated = authenticationService.isAuthenticated;

            $scope.pagination = {
                page: 1,
                pageSize: 20
            };

            $scope.data = {
                searchQuery: ''
            };

            $scope.gradeGroupAccessor = {
                close: closeGradeGroup
            };

            $scope.studentTableAccessor = {
                openGradeGroup: openGradeGroup,
                studentSelectionChanged: studentSelectionChanged
            };

            init();

            function init() {
                // Get grade groups
                httpService.makeGet('sis-api/gradeGroups', {}, getGradeGroupsSuccess, getGradeGroupsFail);

                // Get students
                httpService.makeGet('sis-api/students', {}, getStudentsSuccess, getStudentsFail);
            }

            function getGradeGroupsSuccess(response) {
                $scope.gradeGroups = response.data;

                if ($scope.studentGrades) {
                    calculateGradeGroupSums();
                }
            }

            function getGradeGroupsFail() {
                console.log('Failed to get grade groups.');
            }

            function getStudentsSuccess(response) {
                $scope.students = response.data;
                resetPagination();

                sortStudentsByGroups();
                calculateStudentGroupColors();
                showPage($scope.pagination.page);

                // Get all grades
                httpService.makeGet('sis-api/studentGrades', {}, getStudentGradesSuccess, getStudentGradesFail);
            }

            function getStudentsFail() {
                console.log('Failed to get students.');
            }

            // Add grades to student objects
            function getStudentGradesSuccess(response) {
                var data = response.data;
                if (data && data.length > 0) {
                    $scope.studentGrades = data;

                    // Collect grades by user
                    var studentGrades = [];
                    data.forEach(function(grade) {
                        if (!studentGrades[grade.user.id]) {
                            studentGrades[grade.user.id] = [grade];
                        } else {
                            studentGrades[grade.user.id].push(grade);
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
                        if ($scope.gradeGroups[i].grades[j].id === grade.id) {
                            return $scope.gradeGroups[i];
                        }
                    }
                }
            }

            $scope.$watch('selectedUsers', function(newValue, oldValue) {
                if (newValue && oldValue) {
                    calculateGradeGroupSums();
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
                var students = getSelectedStudents();

                if (students.length < 2)
                    return;

                studentService.join(students, joinStudentsSuccess, joinStudentsFail);
            };

            function joinStudentsSuccess(response) {
                var students = getSelectedStudents();
                students.forEach(function(student) {
                    student.studentGroup = response.data[0].studentGroup;
                });

                deleteSingleStudentGroups();
                sortStudentsByGroups();
                calculateStudentGroupColors();
                clearStudentSelection();

                showPage($scope.pagination.page);
            }

            function joinStudentsFail() {
                console.error('Failed to join students into a group');
            }

            $scope.splitStudents = function() {
                var students = getSelectedStudents();
                studentService.split(students, splitStudentsSuccess, splitStudentsFail);
            };

            function splitStudentsSuccess() {
                var students = getSelectedStudents();
                students.forEach(function(student) {
                    student.studentGroup = 0;
                });

                deleteSingleStudentGroups();
                calculateStudentGroupColors();
                clearStudentSelection();
            }

            function splitStudentsFail() {
                console.error('Failed to split student group');
            }

            function getSelectedStudents() {
                var selectedStudents = [];

                $scope.students.forEach(function(student) {
                    if (student.isSelected) {
                        selectedStudents.push(student);
                    }
                });

                return selectedStudents;
            }

            function selectStudents(students) {
                students.forEach(function(student) {
                    student.isSelected = true;
                });
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
                        studentService.split([group[0]], function() {}, deleteSingleStudentGroupFail);
                    }
                });
            }

            function deleteSingleStudentGroupFail() {
                console.error('Failed to delete single student group')
            }

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
                $scope.visibleStudents2 = [];
                $scope.pagination.page = 1;
            });

            /**
             * Will be called when the user clicks on a page number.
             */
            $scope.changePage = function(page) {
                showPage(page);
                scroll("#visible-students-table", 700, 0);
            };

            function resetPagination() {
                if (!$scope.students)
                    return;

                $scope.matchingStudents = $scope.students;
                $scope.visibleStudents = $scope.students.slice(0, Math.min($scope.pagination.pageSize, $scope.students.length));
                $scope.visibleStudents2 = [];
            }

            function showPage(page) {
                var start = (page - 1) * $scope.pagination.pageSize;
                var end = start + $scope.pagination.pageSize;
                $scope.visibleStudents = $scope.matchingStudents.slice(start, end);
                $scope.visibleStudents2 = [];
            }

            function openGradeGroup(gradeGroup, student) {
                joinStudentTable(); // Might have been split previously

                $scope.selectedGradeGroup = gradeGroup;

                if (gradeGroup.solo) {
                    $scope.selectedUsers = [student];
                } else {
                    $scope.selectedUsers = student.studentGroup ? getAllByStudentGroup(student.studentGroup) : [student];
                }
                clearStudentSelection();
                selectStudents($scope.selectedUsers);

                $scope.gradeGroupVisible = true;
                $scope.lastClickedStudent = student;
                scrollToFirstStudentOfSameGroup(student);
                splitStudentTable(student);

                $timeout(function() {
                    $rootScope.$broadcast('gradeGroupOpen');
                }, 0);
            }

            function closeGradeGroup() {
                $scope.gradeGroupVisible = false;
                clearStudentSelection();
                scrollToFirstStudentOfSameGroup($scope.lastClickedStudent);
                joinStudentTable();
            }

            function scrollToFirstStudentOfSameGroup(student) {
                var indexOfStudent = $scope.visibleStudents.indexOf(student);
                if (indexOfStudent > 0) {
                    for (var i = indexOfStudent - 1; i >= 0; i--) {
                        if (!$scope.visibleStudents[i].studentGroup ||
                            $scope.visibleStudents[i].studentGroup !== student.studentGroup) {
                            scroll("#tr-student-" + ($scope.visibleStudents[i + 1].id), 1000, 0);
                            break;
                        }
                    }
                } else {
                    scroll("#tr-student-" + ($scope.visibleStudents[indexOfStudent].id), 1000, 0);
                }
            }

            /**
             * Split the student table in two right after the student
             */
            function splitStudentTable(student) {
                for (var i = $scope.visibleStudents.indexOf(student) + 1; i < $scope.visibleStudents.length; i++) {
                    if (!$scope.visibleStudents[i].studentGroup || $scope.visibleStudents[i].studentGroup !== student.studentGroup) {
                        $scope.visibleStudents2 = $scope.visibleStudents.slice(i, $scope.visibleStudents.length);
                        $scope.visibleStudents = $scope.visibleStudents.slice(0, i);
                        break;
                    }
                }
            }

            function joinStudentTable() {
                Array.prototype.push.apply($scope.visibleStudents, $scope.visibleStudents2);
                $scope.visibleStudents2 = [];
            }

            function scroll(element, period, offset) {
                $timeout(function() {
                    $('html, body').animate({
                        scrollTop: $(element).offset().top + offset
                    }, period);
                });
            }

            function getAllByStudentGroup(studentGroup) {
                var students = [];
                $scope.students.forEach(function(student) {
                    if (student.studentGroup === studentGroup) {
                        students.push(student);
                    }
                });
                return students;
            }

            /**
             * User clicked on a checkbox next to a student.
             * This adds/removes the user from the grade group edit view.
             */
            function studentSelectionChanged(student) {
                if (!$scope.selectedUsers || !$scope.gradeGroupVisible) {
                    return;
                }

                var found = false;

                for (var i = 0; i < $scope.selectedUsers.length; i++) {
                    if ($scope.selectedUsers[i].id === student.id) {
                        if (!student.isSelected) {
                            $scope.selectedUsers.splice(i, 1);
                        }
                        found = true;
                        break;
                    }
                }

                if (!found && student.isSelected) {
                    $scope.selectedUsers.push(student);
                }
            }

        }]);
