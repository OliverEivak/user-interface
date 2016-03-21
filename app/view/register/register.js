'use strict';

angular.module('myApp.register', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'view/register/register.html',
            controller: 'RegisterCtrl'
        });
    }])

    .controller('RegisterCtrl', ['$scope', '$timeout', '$location', 'authenticationService',
        function($scope, $timeout, $location, authenticationService) {

            $scope.registerForm = {};

            $timeout(function() {
                angular.element('#register-username').focus();
            });

            $scope.submitForm = function() {
                $timeout(function() {
                    angular.element('#button-register').triggerHandler('click');
                });
            };

            $scope.register = function() {
                if (isFormValid() && $scope.formRegister.$valid) {
                    console.log('valid=' + $scope.formRegister.$valid);

                    var user = {
                        id: 1,
                        username: $scope.registerForm.username,
                        firstName: $scope.registerForm.firstName,
                        lastName: $scope.registerForm.lastName,
                        password: $scope.registerForm.password,
                        role: 'STUDENT'
                    };

                    // Register
                    var users = JSON.parse(localStorage.getItem("users"));
                    if (!users) {
                        users = [];
                    } else {
                        user.id = getNextID(users);
                    }
                    users.push(user);
                    localStorage.setItem("users", JSON.stringify(users));

                    // Log in
                    var authenticatedUser = {
                        'user': user
                    };
                    authenticationService.setAuthentication(authenticatedUser);

                    $location.url('/');
                }
            };

            function getNextID(objects) {
                var maxID = 1;
                for (var i = 0; i < objects.length; i++) {
                    if (objects[i].id && objects[i].id > maxID) {
                        maxID = objects[i].id;
                    }
                }
                return maxID;
            }

            $scope.cancel = function() {
                $scope.registerForm = {};
            };

            function isFormValid() {
                if ($scope.registerForm.password !== $scope.registerForm.passwordRepeated) {
                    $timeout(function() {
                        angular.element('#label-for-register-password-repeated').attr('data-error', 'Passwords do not match');
                        angular.element('#register-password-repeated').addClass('invalid');
                    });
                    return false;
                }

                if ($scope.registerForm.username.length > 32 || $scope.registerForm.firstName.length > 64 ||
                    $scope.registerForm.lastName.length > 64) {
                    // TODO: use data-error here too?
                    return false;
                }

                return true;
            }

        }]);
