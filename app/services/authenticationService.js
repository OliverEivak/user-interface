'use strict';

angular.module('myApp.services.authenticationService', []).
factory('authenticationService', [
    function () {

        var authenticationCallbacks = [];

        var instance = {
            setAuthentication: function (authentication) {
                localStorage.setItem("authentication", JSON.stringify(authentication));

                for (var i = 0; i < authenticationCallbacks.length; i++) {
                    authenticationCallbacks[i]();
                }
            },

            removeAuthentication: function () {
                localStorage.removeItem("authentication");
            },

            isAuthenticated: function () {
                if (JSON.parse(localStorage.getItem("authentication"))) {
                    return true;
                }

                return false;
            },

            getUser: function () {
                var authentication = JSON.parse(localStorage.getItem("authentication"));
                if (authentication) {
                    return authentication.user;
                }

                return null;
            },

            getToken: function () {
                var authentication = JSON.parse(localStorage.getItem("authentication"));
                if (authentication) {
                    return authentication.token;
                }

                return null;
            },

            addAuthenticationCallback: function(callback) {
                authenticationCallbacks.push(callback);
            }
        };

        return instance;

    }]);
