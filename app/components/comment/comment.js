'use strict';

angular.module('myApp.comment', [])

    .directive('comment', [
        function() {
            return {
                scope: {
                    grade: '='
                },
                templateUrl: 'components/comment/comment.html',
                controller: function($scope) {

                    $scope.showInput = !(!$scope.grade || !$scope.grade.comment || $scope.grade.comment.length === 0);

                    $scope.show = function() {
                        $scope.showInput = true;
                    };

                }
            }
        }]);

