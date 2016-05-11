'use strict';

angular.module('myApp.header', [])

    .directive('header', ['$timeout', '$location', 'authenticationService', 'logoutService',
        function($timeout, $location, authenticationService, logoutService) {
            return {
                scope: true,
                templateUrl: 'view/header/header.html',
                controller: function($scope, $timeout, $location) {
                    $scope.user = {};
                    $scope.user.username = getUsername();

                    $scope.isLoggedIn = authenticationService.isAuthenticated;

                    $scope.isPage = function(page) {
                        return $location.url().startsWith(page);
                    };

                    $scope.focusLogin = function() {
                        $timeout(function() {
                            angular.element('#login-username').focus();
                        });
                    };

                    $scope.logout = function() {
                        logoutService.logout();
                    };

                    function getUsername() {
                        var user = authenticationService.getUser();
                        if (user) {
                            return user.username;
                        }
                    }

                    // TODO: no scope here
                    $scope.authenticationCallback = function() {
                        $scope.user.username = getUsername();
                    };

                    authenticationService.addAuthenticationCallback($scope.authenticationCallback);
                }
            }
        }]);
