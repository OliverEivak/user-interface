'use strict';

angular.module('myApp.addLink', [])

    .directive('addLink', ['$timeout', 'httpService', 'authenticationService', 'linkService',
        function($timeout, httpService, authenticationService, linkService) {
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
                        linkService.getLinkByGradeAndUser($scope.grade, authenticationService.getUser(), getLinkSuccess);
                    }

                    function getLinkSuccess(response) {
                        var data = response.data;
                        if (data.url) {
                            console.log('got link ' + data.url);
                            $scope.addLinkForm.isVisible = false;
                            $scope.data.url = data.url;
                            $scope.data.linkID = data.id;
                            $scope.hasLink = true;
                        }
                    }

                    // Add link
                    $scope.addLink = function() {
                        linkService.add($scope.addLinkForm.link, $scope.grade, addLinkSuccess, addLinkFail);
                    };

                    $scope.toggleAddLinkForm = function() {
                        $scope.addLinkForm.isVisible = !$scope.addLinkForm.isVisible;
                        if ($scope.addLinkForm.isVisible) {
                            $timeout(function () {
                                angular.element('#add-url').focus();
                            });
                        }
                    };

                    function addLinkSuccess(response) {
                        if (response.data) {
                            $scope.data.url = $scope.addLinkForm.link;
                            $scope.addLinkForm.link = null;
                            $scope.toggleAddLinkForm();
                            $scope.hasLink = true;
                        }
                    }

                    function addLinkFail() {
                        console.error('Failed to add link');
                    }

                    // Remove link
                    $scope.removeLink = function() {
                        linkService.remove($scope.data.url, $scope.grade, removeLinkSuccess, removeLinkFail);
                    };

                    function removeLinkSuccess() {
                        $scope.data.url = null;
                        $scope.toggleAddLinkForm();
                        $scope.hasLink = false;
                    }

                    function removeLinkFail() {
                        console.error('Failed to remove link');
                    }


                }
            }
        }]);

