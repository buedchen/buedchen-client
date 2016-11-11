"use strict";

window.onkeydown = window.onkeyup = function(e) { if (e.keyCode == 27) { e.preventDefault(); } };

var subscriptionApp = angular.module('subscriptionModule',[]);

var baseURL = 'http://localhost:8080';
var clientId = 0;

subscriptionApp.controller("subscriptionController", function($scope, $http, $log) {

    $scope.channelId = 'Unassigned';

    $scope.init = function() {

        chrome.storage.local.get(['serverUrl','deviceid'], function (result) {
            baseURL = result.serverUrl;
            clientId = result.deviceid;
            $http.get(baseURL + '/api/v1/channels')
                    .success(function(data) {
                        $scope.channels = data;
                    }).catch(function(info) {
                        console.log("Error getting channels",info);
                        Materialize.toast("Error in getting channels",3000);
                    });
        });
    };
    $scope.init();

    $scope.subscribeChannel = function() {

        var jsonObj = {
            "client_id" : clientId,
            "channel_id" : $scope.channelId
        };

        var jsonStr = angular.toJson(jsonObj,true);
        var path = baseURL + '/api/v1/clients/'+ clientId ;
        $http({
            url: path,
            method: "PUT",
            data: jsonStr
        }).success(function(data) {
            Materialize.toast("Subscribed to " + $scope.channelId,3000);
        }).error(function(data, status, headers, config) {
            console.log('Could not subscribe to selected channel : error');
            Materialize.toast("Could not subscribe to selected channel",3000);
        });
    }

    $scope.browser = function() {
        chrome.runtime.reload();
    };
});
