'use strict';

angular.module('myApp.register', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'view/register/register.html',
            controller: 'RegisterCtrl'
        });
    }])

    .controller('RegisterCtrl', ['$scope', '$timeout', '$location', 'loginService', 'httpService',
        function($scope, $timeout, $location, loginService, httpService) {

            $scope.registerForm = {};

            $timeout(function() {
                angular.element('#register-username').focus();
            });

            $scope.register = function() {
                $scope.showRegisterError = false;

                if (isFormValid() && $scope.formRegister.$valid) {
                    console.log('valid=' + $scope.formRegister.$valid);

                    var user = {
                        username: $scope.registerForm.username,
                        firstName: $scope.registerForm.firstName,
                        lastName: $scope.registerForm.lastName,
                        password: $scope.registerForm.password
                    };

                    httpService.makePost('sis-api/register', user, registerSuccess, registerFail);
                }
            };

            function registerSuccess(response) {
                loginService.loginWithAuthentication(response.data);
            }

            function registerFail() {
                $scope.showRegisterError = true;
            }

            // TODO: fix this mess - use proper angular validation and ng-messages
            function isFormValid() {
                if ($scope.registerForm.password !== $scope.registerForm.passwordRepeated) {
                    $timeout(function() {
                        angular.element('#label-for-register-password-repeated').attr('data-error', 'Passwords do not match');
                        angular.element('#register-password-repeated').addClass('invalid');
                    });
                    return false;
                }

                if (($scope.registerForm.username && $scope.registerForm.username.length > 32) ||
                    ($scope.registerForm.firstName && $scope.registerForm.firstName.length > 64) ||
                    ($scope.registerForm.lastName && $scope.registerForm.lastName.length > 64)) {
                    return false;
                }

                return true;
            }

        }]);
