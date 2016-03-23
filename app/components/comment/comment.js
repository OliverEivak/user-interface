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

                    hideIfEmpty();

                    $scope.show = function() {
                        $scope.showInput = true;
                    };

                    function hideIfEmpty() {
                        $scope.showInput = !(!$scope.grade || !$scope.grade.comment || $scope.grade.comment.length === 0);
                    }

                    $scope.$watch('grade', function(newValue, oldValue) {
                        if (newValue && oldValue && (newValue.user !== oldValue.user || newValue.grade !== oldValue.grade)) {
                            hideIfEmpty();
                        }
                    });

                }
            }
        }]);

