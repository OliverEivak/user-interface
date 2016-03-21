'use strict';

angular.module('myApp.login', [])

    .directive('login', ['$timeout', '$location', 'authenticationService',
        function($timeout, $location, authenticationService) {
            return {
                scope: true,
                templateUrl: 'components/login/login.html',
                controller: function($scope) {
                    $scope.loginForm = {};

                    $scope.login = function() {
                        if (!$scope.formLogin.$valid) {
                            return;
                        }

                        $scope.loginFailed = false;
                        var user = findUserByUsernameAndPassword($scope.loginForm.username, $scope.loginForm.password);

                        if (user) {
                            var authenticatedUser = {
                                'user': user
                            };
                            authenticationService.setAuthentication(authenticatedUser);

                            $scope.loginForm = {};

                            if (user.role === 'STUDENT') {
                                $location.url('/student/gradeGroups/1');
                            } else if (user.role === 'TEACHER') {
                                $location.url('/teacher');
                            }

                        } else {
                            $scope.loginFailed = true;
                        }
                    };

                    $scope.cancel = function() {
                        $scope.loginForm = {};
                    };

                    function findUserByUsernameAndPassword(username, password) {
                        var users = JSON.parse(localStorage.getItem("users"));

                        if (users) {
                            for (var i = 0; i < users.length; i++) {
                                if (users[i].username === username && users[i].password === password) {
                                    return users[i];
                                }
                            }
                        }
                    }

                }
            }
        }]);

