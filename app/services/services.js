'use strict';

angular.module('myApp.services', [
    'myApp.services.authenticatedUserService',
    'myApp.services.serverCallService'
])

    .value('services', '0.1');
