'use strict';

angular.module('myApp.login', [])

    .directive('login', ['loginService',
        function(loginService) {
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
                        loginService.login($scope.loginForm.username, $scope.loginForm.password, loginFail);
                    };

                    $scope.cancel = function() {
                        $scope.loginForm = {};
                    };

                    function loginFail() {
                        $scope.loginFailed = true;
                    }

                }
            }
        }]);

