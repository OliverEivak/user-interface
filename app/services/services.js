'use strict';

angular.module('myApp.services', [
    'myApp.services.authenticationService',
    'myApp.services.httpService'
])

    .value('services', '0.1');
