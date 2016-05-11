'use strict';

angular.module('myApp.services', [
        'myApp.services.authenticationService',
        'myApp.services.httpService',
        'myApp.services.studentService',
        'myApp.services.loginService',
        'myApp.services.logoutService',
        'myApp.services.studentGradeService',
        'myApp.services.linkService'
    ])

    .value('services', '0.1');
