'use strict';

angular.module('myApp.header', [])

    .directive('header', ['$timeout', '$location', 'authenticatedUserService',
        function($timeout, $location, authenticatedUserService) {
            return {
                scope: true,
                templateUrl: 'view/header/header.html',
                controller: function($scope, $timeout, $location) {
                    $scope.user = {};
                    $scope.user.username = getUsername();

                    $scope.isLoggedIn = authenticatedUserService.isAuthenticated;

                    $scope.isPage = function(page) {
                        return $location.url().startsWith(page);
                    };

                    $scope.focusLogin = function() {
                        $timeout(function() {
                            angular.element('#login-username').focus();
                        });
                    };

                    $scope.logout = function() {
                        authenticatedUserService.removeAuthenticatedUser();
                        $location.url('/');
                    };

                    function getUsername() {
                        var user = authenticatedUserService.getUser();
                        if (user) {
                            return user.username;
                        }
                    }

                    // TODO: no scope here
                    $scope.authenticationCallback = function() {
                        $scope.user.username = getUsername();
                    };

                    authenticatedUserService.addAuthenticationCallback($scope.authenticationCallback);
                }
            }
        }]);
