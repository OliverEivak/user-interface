'use strict';

angular.module('myApp.services.studentService', []).
factory('studentService', ['services', 'httpService',
    function (services, httpService) {

        var instance = {
            getLinkByGrade: function(grade, student, callback) {
                var params = {
                    user: student.id,
                    grade: grade.id
                };

                httpService.makeGet('rest/links', params, callback, getLinkFailed);
            }
        };

        function getLinkFailed() {
            console.log('failed to get link');
        }

        return instance;

    }]);
