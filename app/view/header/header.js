'use strict';

angular.module('myApp.header', [])

    .directive('header', ['$timeout', '$location', 'authenticatedUserService',
        function($timeout, $location, authenticatedUserService) {
            return {
                scope: true,
                templateUrl: 'view/header/header.html',
                controller: function($scope, $timeout, $location) {

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
                }
            }
        }]);
