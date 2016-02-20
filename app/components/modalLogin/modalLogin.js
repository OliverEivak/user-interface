'use strict';

angular.module('myApp.modalLogin', [])

.directive('modalLogin', [function($timeout) {
    return {
        scope: true,
        templateUrl: 'components/modalLogin/modalLogin.html',
        controller: function($scope, $timeout) {
            $scope.loginForm = {};

            $scope.submitForm = function() {
                console.log('submitForm: click login button. user ' + $scope.loginForm.username + ' pw ' + $scope.loginForm.password);

                $timeout(function () {
                    angular.element('#button-login').triggerHandler('click');
                });
            };

            $scope.cancel = function() {
                $scope.loginForm = {};
            };
        }
    }
}]);

