'use strict';

angular.module('myApp.services.serverCallService', []).

    factory('serverCallService', ["services", "$http", "$location", "authenticatedUserService",
        function (services, $http, $location, authenticatedUserService) {

            // Method to return test data
            function makeCall(url, method, params, includeAuthentication, successCallback, errorCallback, finallyCallback, transformRequest) {
                switch (url) {
                    case "rest/courses":
                        if (method === 'GET') {
                            successCallback(getCourses());
                        }
                        break;
                    case "rest/courses/ITV0130/users":
                    case "rest/courses/ITV0120/users":
                    case "rest/courses/IMP0004/users":
                        if (method === 'POST') {
                            successCallback(enroll(params, url));
                        }
                        break;
                    case "rest/courses/ITV0130":
                    case "rest/courses/ITV0120":
                    case "rest/courses/IMP0004":
                        if (method === 'GET') {
                            successCallback(getCourse(url));
                        }
                        break;
                    default:
                        errorCallback('Not found', '404');
                        break;
                }
            }

            // GET rest/courses
            // get a list of courses
            function getCourses() {
                var data = [{
                    id: 1,
                    code: 'ITV0130',
                    name: 'User Interfaces',
                    description: 'The modern day principles and technology of making practical user interfaces. ' +
                    'Main focus is on Web 2.0 style, CSS and javascript applications.',
                    teachers: [{
                        id: 1,
                        name: 'Jaagup',
                        surname: 'Irve'
                    }]
                },{
                    id: 2,
                    code: 'ITV0120',
                    name: 'Network Applications II',
                    description: 'Learning to build complicated distributed information systems. Student will learn ' +
                    'the principles of distributed systems, P2P and message exchange protocols.',
                    teachers: [{
                        id: 2,
                        name: 'Tanel',
                        surname: 'Tammet'
                    }]
                },{
                    id: 3,
                    code: 'IMP0004',
                    name: 'Important Things IV',
                    description: 'Learn the basics of superblocks and courseware with methodology derived from the ' +
                    'principles of hardware and architecture. Also includes deployment of information retrieval systems ' +
                    'using multimodal and trainable applications and decoupling XML from e-commerce in boolean logic.',
                    teachers: [{
                        id: 3,
                        name: 'Juhan',
                        surname: 'Juurikas'
                    },{
                        id: 4,
                        name: 'Mati',
                        surname: 'Maasikas'
                    }]
                }];
                return data;
            }

            // GET rest/courses/{{courseCode}}
            // get a courses
            function getCourse(url) {
                var courseCode = getCourseCodeByURL(url);
                return getCourseByCode(courseCode);
            }

            // POST rest/courses/{{courseCode}}/users
            // enroll in a course
            function enroll(params, url) {
                var courseCode = getCourseCodeByURL(url);
                var course = getCourseByCode(courseCode);
                course.students = [params.user];
                return course;
            }

            function getCourseCodeByURL(url) {
                var courseCode;
                if (url.startsWith("rest/courses/ITV0130")) {
                    courseCode = 'ITV0130';
                } else if (url.startsWith("rest/courses/ITV0120")) {
                    courseCode = 'ITV0120';
                } else if (url.startsWith("rest/courses/IMP0004")) {
                    courseCode = 'IMP0004';
                }
                return courseCode;
            }

            function getCourseByCode(courseCode) {
                var courses = getCourses();
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i].code === courseCode) {
                        return courses[i];
                    }
                }
            }

            //function makeCall(url, method, params, includeAuthentication, successCallback, errorCallback, finallyCallback, transformRequest) {
            //    var headers = {};
            //
            //    if (includeAuthentication) {
            //        setAuthorization(headers);
            //    }
            //
            //    var config = {
            //        method: method,
            //        url: url,
            //        headers: headers
            //    };
            //
            //    if (method === 'POST' || method === 'PUT') {
            //        config.data = params;
            //    } else {
            //        config.params = params;
            //    }
            //
            //    if (transformRequest) {
            //        config.transformRequest = transformRequest
            //    }
            //
            //    $http(config).
            //        success(function(data) {
            //            successCallback(data);
            //        }).
            //        error(function(data, status, headers, config) {
            //            if (status == '419') {
            //                authenticatedUserService.removeAuthenticatedUser();
            //                makeCall(url, method, params, false, successCallback, errorCallback, finallyCallback, transformRequest);
            //            } else if (status == '401') {
            //                $location.url('/');
            //            } else {
            //                errorCallback(data, status);
            //            }
            //        }).finally(finallyCallback);
            //}

            function setAuthorization(headers) {
                if (authenticatedUserService.isAuthenticated()) {
                    var user = authenticatedUserService.getUser();
                    headers.Authentication = authenticatedUserService.getToken();
                    headers.Username = user.username;
                }
            }

            var instance = {
                makePost: function(url, data, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'POST', data, true, successCallback, errorCallback, finallyCallback);
                },

                makeGet: function(url, params, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'GET', params, true, successCallback, errorCallback, finallyCallback);
                },

                makePut: function(url, data, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'PUT', data, true, successCallback, errorCallback, finallyCallback);
                },
                makeDelete: function(url, data, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'DELETE', data, true, successCallback, errorCallback, finallyCallback);
                },

                makeJsonp: function(url, params, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'JSONP', params, false, successCallback, errorCallback, finallyCallback);
                }
            };

            return instance;

        }]);