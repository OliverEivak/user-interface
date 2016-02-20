'use strict';

angular.module('myApp.header', [])

.directive('header', [function($timeout) {
    return {
        scope: true,
        templateUrl: 'view/header/header.html',
        controller: function($scope, $timeout) {
        
            $scope.focusLogin = function() {
                $timeout(function () {
                    angular.element('#username').focus();
                });
            } 

        }
    }
}]);

