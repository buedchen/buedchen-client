window.onkeydown = window.onkeyup = function(e) { if (e.keyCode == 27) { e.preventDefault(); } };

var baseURL = 'http://localhost:8080';
channelsApp.controller("channelController", function($scope, $http, $log, $timeout, $route) {

    $scope.init = function() {
        chrome.storage.local.get('serverUrl', function (result) {
                baseURL = result.serverUrl;

        $http.get(baseURL + '/api/v1/channels')
                .success(function(data) {
                    $scope.channels = data;
                    $timeout(function(){
                        $('.collapsible').collapsible({});
                    },200);
                }).catch(function(info) {
                    console.log("Error getting channels",info);
                    Materialize.toast("Error in getting channels",3000);
                });
        });
    };
    $scope.init();

    $scope.getChannelContent = function(channelId) {
        var path = baseURL + '/api/v1/channels/' + channelId + '/contents';
        $http.get(path)
        .success(function(data) {
            $scope.channelContents = data;
        })
        .catch(function(info) {
            console.log("Error in getting channel contents : error", info);
            Materialize.toast("Error in getting channel contents",3000);
        });
    };

    $scope.browser = function() {
        chrome.runtime.reload();
    };

    $scope.updateChannelContent = function(content, channelId) {
        var updateData = angular.toJson(content)
        var encodedUrl = encodeURIComponent(content.url);
        var path = baseURL + '/api/v1/channels/'+ channelId + '/contents/' + encodedUrl ;
        $http({
            url: path,
            method: "PUT",
            data: updateData
        }).success(function(data) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Could not update channel content : error');
            Materialize.toast("Could not update channel content",3000);
        });
    };

    $scope.deleteChannelContent = function(channelId, content) {
        var encodedUrl = encodeURIComponent(content.url);
        var path = baseURL + '/api/v1/channels/'+ channelId + '/contents/' + encodedUrl;
        $http({
            url: path,
            method: "DELETE"
        }).success(function(data) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Channel Content Could not be deleted : error');
            Materialize.toast("Channel Content Could not be deleted",3000);
        });
    };

    $scope.deleteChannel = function(channelId) {
        var path = baseURL + '/api/v1/channels/'+channelId;
        $http({
            url: path,
            method: "DELETE"
        }).success(function(data, status, headers, config) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Channel could not be deleted : error');
            Materialize.toast("Channel could not be deleted",3000);
        });
    };

    $scope.openDashboardModal = function(channelId) {
        $scope.currentChannel = channelId;
        $('#dashboardModal').openModal();
    };

    $scope.openChannelModal = function(channelId) {
        $('#channelModal').openModal();
    };

    $scope.createChannelContent = function() {
        $('#channelModal').closeModal();
        var channelId = $scope.newChannelId;
        var description = $scope.newChannelDescription;

        var jsonObj = {
            "channel_id" : channelId,
            "channel_description" : description
        };

        var jsonStr = angular.toJson(jsonObj,true);
        var path = baseURL + '/api/v1/channels/';
        $http({
            url: path,
            method: "POST",
            data: jsonStr
        }).success(function(data) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Channel could not be created : error');
            Materialize.toast("Channel could not be created",3000);
        });
    };

    $scope.showtime = [];
    $scope.addDashboardToChannel = function(channelId, content, index) {
        var path = baseURL + '/api/v1/channels/' + channelId + '/contents';
        var showtime  = $scope.showtime[index];
        var title = content.title;
        var jsonObj = {
            "url" : content.url,
            "showtime" : showtime,
            "title" : title
        };

        var jsonStr = angular.toJson(jsonObj,true);
        $http({
            url: path,
            method: "POST",
            data: jsonStr
        }).success(function(data) {
            $('#dashboardModal').closeModal();
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Could not add dashboard to channel : error');
            Materialize.toast("Could not add dashboard to channel",3000);
        });
    }
});