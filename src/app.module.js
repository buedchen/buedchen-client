"use strict";

 var channelsApp = angular.module("channelsModule",['ngRoute']);

 channelsApp.config(function($routeProvider) {
    $routeProvider
    .when('/channels',
    {
        controller : 'channelController',
        templateUrl : 'channels.html'
    })
    .when('/providers',
    {
        controller : 'providerController',
        templateUrl : 'providers.html'
    })
    .otherwise({redirectTo:'/channels'});
 });

