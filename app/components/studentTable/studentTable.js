'use strict';

angular.module('myApp.studentTable', [])

    .directive('studentTable', [
        function() {
            return {
                scope: {
                    gradeGroups: '=',
                    students: '=',
                    accessor: '='
                },
                templateUrl: 'components/studentTable/studentTable.html',
                controller: function($scope) {



                }
            }
        }]);

