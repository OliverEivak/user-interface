'use strict';

angular.module('myApp.services.authenticatedUserService', []).
    factory('authenticatedUserService', ['services', '$location',
        function ($location, services) {

            return {
                setAuthenticatedUser: function (authenticatedUser) {
                    localStorage.setItem("authenticatedUser", JSON.stringify(authenticatedUser));
                },

                removeAuthenticatedUser: function () {
                    localStorage.removeItem("authenticatedUser");
                },

                isAuthenticated: function () {
                    if (JSON.parse(localStorage.getItem("authenticatedUser"))) {
                        return true;
                    }

                    return false;
                },

                getUser: function () {
                    var authenticatedUser = JSON.parse(localStorage.getItem("authenticatedUser"));
                    if (authenticatedUser) {
                        return authenticatedUser.user;
                    }

                    return null;
                },

                getToken: function () {
                    var authenticatedUser = JSON.parse(localStorage.getItem("authenticatedUser"));
                    if (authenticatedUser) {
                        return authenticatedUser.token;
                    }

                    return null;
                },
            };

        }]);
