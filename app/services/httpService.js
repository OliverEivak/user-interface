'use strict';

angular.module('myApp.services.httpService', []).
factory('httpService', ["services", "$http", "$location", "authenticationService",
    function (services, $http, $location, authenticationService) {

        function makeCall(url, method, params, successCallback, errorCallback) {
            var headers = {};

            if (authenticationService.isAuthenticated()) {
                var user = authenticationService.getUser();
                headers['Auth-Token'] = authenticationService.getToken();
                headers['Username'] = user.username;
            }

            var config = {
                method: method,
                url: url,
                headers: headers
            };

            if (method === 'POST' || method === 'PUT') {
                config.data = params;
            } else {
                config.params = params;
            }

            $http(config).then(successCallback, function (response) {
                if (response.status == '401') {
                    authenticationService.removeAuthentication();
                    $location.url('/');
                } else {
                    if (errorCallback) {
                        errorCallback(response);
                    } else {
                        console.log('HTTP ' + method + ' ' + url + ' failed.');
                    }
                }
            });
        }

        var instance = {
            makePost: function(url, data, successCallback, errorCallback) {
                makeCall(url, 'POST', data, successCallback, errorCallback);
            },

            makeGet: function(url, params, successCallback, errorCallback) {
                makeCall(url, 'GET', params, successCallback, errorCallback);
            },

            makePut: function(url, data, successCallback, errorCallback) {
                makeCall(url, 'PUT', data, successCallback, errorCallback);
            },

            makeDelete: function(url, data, successCallback, errorCallback) {
                makeCall(url, 'DELETE', data, successCallback, errorCallback);
            }
        };

        return instance;

    }]);
