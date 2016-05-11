'use strict';

angular.module('myApp.services.logoutService', [])
    .factory('logoutService', ['$location', 'httpService', 'authenticationService',
        function ($location, httpService, authenticationService) {

            var service = {};

            service.logout = function () {
                httpService.makePost('sis-api/logout', {}, logoutDone, logoutDone);
            };

            function logoutDone() {
                authenticationService.removeAuthentication();
                $location.url('/');
            }

            return service;

        }]);
