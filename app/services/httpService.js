'use strict';

angular.module('myApp.services.httpService', []).

    factory('httpService', ["services", "$http", "$location", "authenticationService",
        function (services, $http, $location, authenticationService) {

            /**
             * TODO:
             * The real back-end will probably send nested objects not just IDs,
             * so the application will need some tweaking.
             */

            // Method to return test data
            function makeCall(url, method, params, successCallback, errorCallback) {
                switch (url) {
                    case "rest/students":
                        if (method === 'GET')
                            successCallback(getStudents());
                        break;
                    case "rest/gradeGroups":
                        if (method === 'GET')
                            successCallback(getGradeGroups());
                        break;
                    case "rest/grades":
                        if (method === 'GET')
                            successCallback(getAllStudentGrades());
                        break;
                    case "rest/users/1/grades":
                        // TODO: change to rest/grades?user=:user
                        if (method === 'GET')
                            successCallback(getStudentGrades(1));
                        break;
                    case "rest/links":
                        if (method === 'GET')
                            successCallback(getLink(params));
                        else if (method === 'PUT')
                            successCallback(putLink(params));
                        else if (method === 'DELETE')
                            successCallback(deleteLink(params));
                        break;
                    default:
                        errorCallback('Not found', '404');
                        break;
                }
            }

            function getStudents() {
                var users = JSON.parse(localStorage.getItem("users"));
                for (var i = 0; i < users.length; i++) {
                    if (users[i].role !== 'STUDENT') {
                        users.splice(i, 1);
                    }
                }
                return users;
            }

            function getStudentGrades(userID) {
                var grades = getAllStudentGrades();
                var result = [];
                for (var i = 0; i < grades.length; i++) {
                    if (grades[i].user === userID) {
                        result.push(grades[i]);
                    }
                }
                return result;
            }

            function getAllStudentGrades() {
                var studentGrades = [{
                    id: 1,
                    user: 1,
                    value: 1,
                    grade: 1,
                    comment: 'Lorem ipsum dolor sit amet.'
                },{
                    id: 2,
                    user: 1,
                    value: 0,
                    grade: 2,
                    comment: 'Not bad. '
                },{
                    id: 3,
                    user: 1,
                    value: 1,
                    grade: 3,
                    comment: 'Lorem ipsum dolor sit amet.'
                },{
                    id: 4,
                    user: 1,
                    value: 1,
                    grade: 4,
                    comment: 'Lorem ipsum dolor sit amet.'
                },{
                    id: 17,
                    user: 1,
                    value: 2,
                    grade: 17,
                    comment: 'Lorem ipsum dolor sit amet.'
                },{
                    id: 18,
                    user: 1,
                    value: 0,
                    grade: 18,
                    comment: 'Lorem ipsum dolor sit amet.'
                },{
                    id: 19,
                    user: 1,
                    value: 2,
                    grade: 19,
                    comment: ''
                }];

                return studentGrades;
            }


            function getGradeGroups() {
                var gradeGroups = [{
                    id: 1,
                    name: 'Weekly grades',
                    description: 'Solve a technical problem that involves building user interfaces every week. ',
                    grades: [] // will be generated
                },{
                    id: 2,
                    name: 'Prototype 1',
                    description: 'Build an user interface prototype using HTML/CSS and javascript. Practise designing an' +
                    ' user interface and using CSS and javascript.',
                    grades: [{
                        id: 17,
                        name: 'Submitted',
                        minValue: 0,
                        maxValue: 15
                    },{
                        id: 18,
                        name: 'Impression',
                        minValue: 0,
                        maxValue: 2
                    }, {
                        id: 19,
                        name: 'Beauty',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 20,
                        name: 'Convenience',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 21,
                        name: 'Frustration',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 22,
                        name: 'Conveying information',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 23,
                        name: 'Navigation',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 24,
                        name: 'Grading view',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 25,
                        name: 'Mobile view',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 26,
                        name: 'Refinement',
                        minValue: 0,
                        maxValue: 1
                    },{
                        id: 27,
                        name: 'Cool/surprising',
                        minValue: 0,
                        maxValue: 1
                    },{
                        id: 28,
                        name: 'Plus/minus',
                        minValue: -5,
                        maxValue: 5
                    },{
                        id: 29,
                        name: 'Late',
                        minValue: -15,
                        maxValue: 0
                    }]
                },{
                    id: 3,
                    name: 'Prototype 2',
                    description: 'Refine the previous prototype into a complete and usable application. Build a back-end' +
                    ' and communicate with it using AJAX calls. ',
                    grades: [{
                        id: 30,
                        name: 'Bonus from first',
                        minValue: 0,
                        maxValue: 16
                    },{
                        id: 31,
                        name: 'Login',
                        minValue: 0,
                        maxValue: 2
                    }, {
                        id: 32,
                        name: 'Students & grades (teacher)',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 33,
                        name: "Student's views",
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 34,
                        name: 'Grading / groups / modification',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 35,
                        name: 'Ajax',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 36,
                        name: 'Error messages',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 37,
                        name: 'Searching / filtering',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 38,
                        name: 'Refinement',
                        minValue: 0,
                        maxValue: 2
                    },{
                        id: 39,
                        name: 'Plus/minus',
                        minValue: -5,
                        maxValue: 5
                    },{
                        id: 40,
                        name: 'Late',
                        minValue: -15,
                        maxValue: 0
                    }]
                },{
                    id: 4,
                    name: 'Final test',
                    description: 'A test with 4 questions, all give 10 points each for a total of 40 points. ',
                    grades:[{
                        id: 41,
                        name: 'Question 1',
                        minValue: 0,
                        maxValue: 10
                    },{
                        id: 42,
                        name: 'Question 2',
                        minValue: 0,
                        maxValue: 10
                    },{
                        id: 43,
                        name: 'Question 3',
                        minValue: 0,
                        maxValue: 10
                    },{
                        id: 44,
                        name: 'Question 4',
                        minValue: 0,
                        maxValue: 10
                    }]
                }];

                // Generate week grades
                for (var i = 1; i <= 16; i++) {
                    var grade = {
                        id: i,
                        name: 'Week ' + i,
                        minValue: 0,
                        maxValue: 1
                    };
                    gradeGroups[0].grades.push(grade);
                }

                return gradeGroups;
            }

            var links = [{
                id: 1,
                url: 'https://www.eesti.ee',
                grade: 1,
                user: 1
            },{
                id: 2,
                url: 'https://www.neti.ee',
                grade: 2,
                user: 1
            },{
                id: 3,
                url: 'https://www.example.com',
                grade: 17,
                user: 1
            }];

            // GET /rest/links?user=:user&grade=:grade
            function getLink(params) {
                for (var i = 0; i < links.length; i++) {
                    if (links[i].grade === params.grade && links[i].user === params.user) {
                        return links[i];
                    }
                }

                return '';
            }

            // PUT /rest/links
            function putLink(data) {
                if (data && data.url && data.grade) {
                    var link = {
                        id: getNextID(links),
                        url: data.url,
                        grade: data.grade,
                        user: authenticationService.getUser().id
                    };
                    console.log('saving link');
                    console.log(link);
                    links.push(link);
                    return link;
                }
            }

            // DELETE /rest/links?user=:user&grade=:grade
            function deleteLink(params) {
                for (var i = 0; i < links.length; i++) {
                    if (links[i].grade === params.grade && links[i].user === authenticationService.getUser().id) {
                        console.log('removed link ' + links[i].url);
                        links.splice(i, 1);
                        return;
                    }
                }

                return '';
            }

            function getNextID(objects) {
                var maxID = 1;
                for (var i = 0; i < objects.length; i++) {
                    if (objects[i].id && objects[i].id > maxID) {
                        maxID = objects[i].id;
                    }
                }
                return maxID;
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