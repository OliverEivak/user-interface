'use strict';

angular.module('myApp.services.loginService', []).
factory('loginService', ['$location', '$timeout', 'httpService', 'authenticationService',
    function ($location, $timeout, httpService, authenticationService) {

        var service = {};

        service.login = function (username, password, errorCallback) {
            var params = {
                username: username,
                password: password
            };

            httpService.makePost('/sis-api/login', params, function (response) {
                if (response.data) {
                    authenticationService.setAuthentication(response.data);
                    redirect(response.data);
                } else {
                    errorCallback(response);
                }
            }, errorCallback);
        };

        /**
         * Save given authentication and redirect to correct page.
         * @param authentication
         */
        service.loginWithAuthentication = function (authentication) {
            authenticationService.setAuthentication(authentication);
            redirect(authentication);
        };

        function redirect(data) {
            $timeout(function () {
                if (data.user.role === 'STUDENT') {
                    $location.url('/student/gradeGroups/1');
                } else if (data.user.role === 'TEACHER') {
                    $location.url('/teacher');
                }
            }, 300);
        }

        return service;

    }]);
