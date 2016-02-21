'use strict';

angular.module('myApp.login', [])

    .directive('login', ['$timeout', '$location', 'authenticatedUserService',
        function($timeout, $location, authenticatedUserService) {
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
                            authenticatedUserService.setAuthenticatedUser(authenticatedUser);

                            $scope.loginForm = {};

                            $location.url('/');
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

