'use strict';

angular.module('myApp.services.studentService', []).
factory('studentService', ['httpService',
    function (httpService) {

        var service = {};

        service.join = function (students, successCallback, errorCallback) {
            httpService.makePost('/sis-api/students/join', students, function (response) {
                if (response.data) {
                    successCallback(response);
                } else {
                    errorCallback(response);
                }
            }, errorCallback);
        };

        service.split = function (students, successCallback, errorCallback) {
            httpService.makePost('/sis-api/students/split', students, function (response) {
                if (response.data) {
                    successCallback(response);
                } else {
                    errorCallback(response);
                }
            }, errorCallback);
        };

        return service;

    }]);
