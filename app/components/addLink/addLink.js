'use strict';

angular.module('myApp.addLink', [])

    .directive('addLink', ['$timeout', 'httpService', 'authenticationService',
        function($timeout, httpService, authenticationService) {
            return {
                scope: {
                    grade: '=',
                    hasLink: '='
                },
                templateUrl: 'components/addLink/addLink.html',
                controller: function($scope) {

                    $scope.addLinkForm = {
                        isVisible: true
                    };

                    $scope.data = {};

                    init();

                    function init() {
                        var params = {
                            user: authenticationService.getUser().id,
                            grade: $scope.grade.id
                        };
                        httpService.makeGet('rest/links', params, getLinkSuccess, getLinkFail);
                    }

                    function getLinkSuccess(data) {
                        if (data && data.url) {
                            console.log('got link ' + data.url);
                            $scope.addLinkForm.isVisible = false;
                            $scope.data.url = data.url;
                            $scope.hasLink = true;
                        } else {
                            getLinkFail();
                        }
                    }

                    function getLinkFail() {
                        console.log('Failed to get link.')
                    }

                    // Add link
                    $scope.addLink = function() {
                        var data = {
                            url: $scope.addLinkForm.link,
                            grade: $scope.grade.id
                        };

                        httpService.makePut('rest/links', data, addLinkSuccess, addLinkFail);
                    };

                    $scope.toggleAddLinkForm = function() {
                        $scope.addLinkForm.isVisible = !$scope.addLinkForm.isVisible;
                        if ($scope.addLinkForm.isVisible) {
                            $timeout(function () {
                                angular.element('#add-url').focus();
                            });
                        }
                    };

                    function addLinkSuccess(data) {
                        if (data) {
                            $scope.data.url = $scope.addLinkForm.link;
                            $scope.addLinkForm.link = null;
                            $scope.toggleAddLinkForm();
                            $scope.hasLink = true;
                        }
                    }

                    function addLinkFail() {
                        console.log('Failed to add link');
                    }

                    // Remove link
                    $scope.removeLink = function() {
                        var data = {
                            url: $scope.data.url,
                            grade: $scope.grade.id
                        };

                        httpService.makeDelete('rest/links', data, removeLinkSuccess, removeLinkFail);
                    };

                    function removeLinkSuccess() {
                        $scope.data.url = null;
                        $scope.toggleAddLinkForm();
                        $scope.hasLink = false;
                    }

                    function removeLinkFail() {
                        console.log('Failed to remove link');
                    }


                }
            }
        }]);

