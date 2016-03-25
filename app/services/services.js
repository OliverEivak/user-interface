'use strict';

angular.module('myApp.services', [
    'myApp.services.authenticationService',
    'myApp.services.httpService',
    'myApp.services.studentService'
])

    .value('services', '0.1');
