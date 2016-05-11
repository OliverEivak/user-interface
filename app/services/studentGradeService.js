'use strict';

angular.module('myApp.services.studentGradeService', [])
    .factory('studentGradeService', ['httpService',
        function (httpService) {

            var service = {};

            service.save = function (studentGrades, successCallback, errorCallback) {
                httpService.makePost('/sis-api/studentGrades', studentGrades, function (response) {
                    if (response.data) {
                        successCallback(response);
                    } else {
                        errorCallback(response);
                    }
                }, errorCallback);
            };

            return service;

        }]);
