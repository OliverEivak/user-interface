'use strict';

angular.module('myApp.comment', [])

    .directive('comment', ['$rootScope', '$timeout', '$interval',
        function($rootScope, $timeout, $interval) {
            return {
                scope: {
                    text: '='
                },
                templateUrl: 'components/comment/comment.html',
                controller: function($scope) {

                    $scope.data = {
                        text: $scope.text
                    };

                    var doNotClose = false;

                    toggleShowHide();

                    $scope.show = function() {
                        $scope.showInput = true;
                        doNotClose = true;
                    };

                    function toggleShowHide() {
                        $scope.showInput = !(!$scope.data.text || $scope.data.text.length === 0);
                    }

                    $scope.$watch('text', function() {
                        $scope.data.text = $scope.text;
                        doNotClose = false;
                    });

                    $scope.$watch('data.text', function(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            $scope.text = $scope.data.text;
                        }
                    });

                    $interval(function() {
                        if (!doNotClose)
                            toggleShowHide();
                    }, 3000);

                    $rootScope.$on('gradeGroupOpen', function() {
                        toggleShowHide();
                        doNotClose = false;
                    });

                }
            }
        }]);

