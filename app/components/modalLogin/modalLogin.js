'use strict';

angular.module('myApp.modalLogin', [])

    .directive('modalLogin', ['$timeout', '$location', 'authenticatedUserService',
        function($timeout, $location, authenticatedUserService) {
            return {
                scope: true,
                templateUrl: 'components/modalLogin/modalLogin.html',
                controller: function($scope) {
                    $scope.loginForm = {};

                    $scope.submitForm = function() {
                        $timeout(function () {
                            angular.element('#button-login').triggerHandler('click');
                        });
                    };

                    $scope.login = function() {
                        $scope.loginFailed = false;
                        var user = findUserByUsernameAndPassword($scope.loginForm.username, $scope.loginForm.password);

                        if (user) {
                            var authenticatedUser = {
                                'user': user
                            };
                            authenticatedUserService.setAuthenticatedUser(authenticatedUser);

                            $scope.loginForm = {};

                            angular.element('#modalLogin').closeModal();
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

