'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'ui.materialize',
    'myApp.services',
    'myApp.home',
    'myApp.version',
    'myApp.login',
    'myApp.register',
    'myApp.header',
    'myApp.sidebar',
    'myApp.studentGradeGroup',
    'myApp.addLink',
    'myApp.teacher',
    'myApp.modalGradeGroup',
    'myApp.comment'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.run(function () {
    createUsers();
});

app.run(['$rootScope', 'authenticationService', '$location', function($rootScope, authenticationService, $location) {
    $rootScope.$on('$locationChangeStart', function(event, newLocation) {
        if (newLocation.indexOf('/teacher') !== -1) {
            var user = authenticationService.getUser();
            if (user && user.role === 'TEACHER') {
                return;
            } else {
                event.preventDefault();
                $location.url('/student/gradeGroups/1');
            }
        }

        if (newLocation.indexOf('/student') !== -1) {
            var user = authenticationService.getUser();
            if (user && user.role === 'STUDENT') {
                return;
            } else {
                event.preventDefault();
                $location.url('/teacher');
            }
        }
    });
}]);

function createUsers() {
    if (!localStorage.getItem("users")) {
        var users = [{
            id: 1,
            username: 'student',
            firstName: 'Example',
            lastName: 'Student',
            password: 'asd',
            role: 'STUDENT'
        }, {
            id: 2,
            username: 'teacher',
            firstName: 'Example',
            lastName: 'Teacher',
            password: 'asdasd',
            role: 'TEACHER'
        }];

        var firstNames = ['Steven', 'Mary', 'Michelle', 'Willie', 'Jerry', 'Carolyn', 'Kathy', 'Billy', 'Dorothy',
            'Helen', 'Kathleen', 'Paul', 'Beverly', 'Betty', 'Joshua', 'Henry', 'Annie', 'Joan', 'Patricia', 'James',
            'Irene', 'Bruce', 'Gerald', 'Russell', 'Jose', 'Eric', 'Julia', 'James', 'Brandon', 'Beverly', 'Donald',
            'Debra', 'Karen', 'Roger', 'Nicholas', 'Louis'];
        var lastNames = ['Hill', 'Torres', 'Scott', 'Allen', 'Evans', 'Washington', 'Nelson', 'Campell', 'Smith',
            'Gonzales', 'Flores', 'King', 'Bailey', 'Patterson', 'Davis', 'Phillips', 'Bryant', 'Sanders', 'Howard',
            'Perez', 'Hernandez', 'Nelson', 'Martinez', 'Wright', 'Bennet', 'Roberts', 'Baker', 'Cooper', 'Barnes',
            'Simmons', 'Cooper', 'Patterson', 'Alexander', 'Lee', 'Coleman'];

        for (var i = 3; i <= 100; i++) {
            var firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

            var user = {
                id: i,
                username: firstName + lastName + i,
                firstName: firstName,
                lastName: lastName,
                password: 'asd' + i,
                role: 'STUDENT'
            };
            users.push(user);
        }

        users[3].studentGroup = 1;
        users[4].studentGroup = 1;

        users[5].studentGroup = 2;
        users[6].studentGroup = 2;

        users[7].studentGroup = 3;
        users[8].studentGroup = 3;

        localStorage.setItem("users", JSON.stringify(users));
    }
}