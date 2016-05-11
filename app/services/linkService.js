'use strict';

angular.module('myApp.services.linkService', []).
factory('linkService', ['httpService',
    function (httpService) {

        var service = {};
        var users = [];

        /**
         * Get user-submitted link for specific grade. In the background all links for the user are
         * downloaded to reduce the amount of requests as many links are always required together.
         */
        service.getLinkByGradeAndUser = function (grade, student, callback) {
            if (users[student.id] && !Array.isArray(users[student.id])) {
                for (var i = 0; i < users[student.id].links.length; i++) {
                    if (users[student.id].links[i].grade.id === grade.id) {
                        var response = {
                            data: users[student.id].links[i]
                        };
                        callback(response);
                    }
                }
            } else {
                if (!users[student.id]) {
                    getLinks(student);
                }

                saveCallback(student, grade, callback);
            }
        };

        service.add = function (url, grade, successCallback, errorCallback) {
            var link = {
                url: url,
                grade: {
                    id: grade.id
                }
            };

            httpService.makePost('/sis-api/links', link, function (response) {
                if (response.data) {
                    users[response.data.user.id].links.push(response.data);
                    successCallback(response);
                } else {
                    errorCallback(response);
                }
            }, errorCallback);
        };

        service.remove = function (url, grade, successCallback, errorCallback) {
            var user;
            var linkIndex;

            for (var i = 0; i < users.length && !linkIndex; i++) {
                if (!users[i]) {
                    continue;
                }

                for (var j = 0; j < users[i].links.length; j++) {
                    if (users[i].links[j].url === url && users[i].links[j].grade.id === grade.id) {
                        user = users[i];
                        linkIndex = j;
                        break;
                    }
                }
            }

            httpService.makeDelete('/sis-api/links/' + user.links[linkIndex].id, {}, function (response) {
                user.links.splice(linkIndex, 1);
                successCallback(response);
            }, errorCallback);
        };

        function saveCallback(student, grade, callback) {
            var callbackData = {
                grade: grade,
                callback: callback
            };

            if (users[student.id] && Array.isArray(users[student.id])) {
                users[student.id].push(callbackData);
            } else {
                users[student.id] = [callbackData];
            }
        }

        function getLinks(student) {
            var params = {
                username: student.username
            };

            httpService.makeGet('sis-api/links', params, function(response) {
                var callbackDatas = users[student.id];

                users[student.id] = angular.copy(student);
                users[student.id].links = response.data;

                callbackDatas.forEach(function(callbackData) {
                    for (var i = 0; i < users[student.id].links.length; i++) {
                        if (users[student.id].links[i].grade.id === callbackData.grade.id) {
                            var response = {
                                data: users[student.id].links[i]
                            };
                            callbackData.callback(response);
                        }
                    }
                });
            }, getLinkFailed);
        }

        function getLinkFailed() {
            console.error('Failed to get link');
        }

        return service;

    }]);
