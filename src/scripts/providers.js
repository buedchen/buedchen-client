window.onkeydown = window.onkeyup = function(e) { if (e.keyCode == 27) { e.preventDefault(); } };

var baseURL = 'http://localhost:8080';
channelsApp.controller("providerController", function($scope, $http, $log, $timeout, $route) {

    $scope.init = function() {
        chrome.storage.local.get('serverUrl', function (result) {
                baseURL = result.serverUrl;

        $http.get(baseURL + '/api/v1/providers')
            .success(function(data) {
                $scope.projects = data;
                $timeout(function(){
                    $('.collapsible').collapsible({});
                },200);
            }).catch(function(info) {
                console.log("Error in getting providers : error");
                Materialize.toast("Error in getting providers",3000);
            });
        });
    };

    $scope.init();
    $scope.dashboardStatus = "";
    $scope.getProjectContent = function(projectId) {
        var path = baseURL + '/api/v1/providers/' + projectId + '/dashboards';
        $http.get(path)
        .success(function(data) {
            $scope.projectContents = data;
        })
        .catch(function(info) {
            console.log('Error in getting project content : error');
            Materialize.toast("Error in getting project content",3000);
        });
    };

    $scope.addDashboard = function(projectId) {
        $scope.currentProject = projectId;
        $('#newDashboardModal').openModal();
    };

    $scope.createDashboard = function() {
        $('#newDashboardModal').closeModal();
        var dashboardURL = $scope.newDashboardUrl;
        var dashboardDescription = $scope.newDashboardDescription;
        var dashboardTitle = $scope.newDashboardTitle;
        var jsonObj = {
            "url" : dashboardURL,
            "description" : dashboardDescription,
            "title" : dashboardTitle
        };

        var jsonStr = angular.toJson(jsonObj,true);
        var path = baseURL + '/api/v1/providers/'+$scope.currentProject + '/dashboards';
        $http({
            url: path,
            method: "POST",
            data: jsonStr
        }).success(function(data) {
             $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Dashboard could not be added : error');
            Materialize.toast("Dashboard could not be added",3000);
        });
    };

    $scope.deleteProject = function(projectId) {
        var path = baseURL + '/api/v1/providers/'+projectId;
        $http({
            url: path,
            method: "DELETE"
        }).success(function(data, status, headers, config) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Project could not be deleted : error');
            Materialize.toast("Project could not be deleted",3000);
        });
    };

    $scope.deleteProjectDashboard = function(projectId, content) {
        var encodedUrl = encodeURIComponent(content.url);
        var path = baseURL + '/api/v1/providers/'+ projectId + '/dashboards/' + encodedUrl;
        $http({
            url: path,
            method: "DELETE"
        }).success(function(data) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log("Could not remove the dashboard : error");
            Materialize.toast("Could not remove the dashboard",3000);
        });
    };

    $scope.editProjectDashboard = function(content, projectId) {
        $scope.currentContent = content;
        $scope.currentProject = projectId;
        $('#editDashboardModal').openModal();
    };

    $scope.updateDashboard = function() {
        $('#editDashboardModal').closeModal();

        var contentUrl = $scope.currentContent.url;
        var contentDescription = $scope.currentContent.description;
        var contentTitle = $scope.currentContent.title;

        var jsonObj = {
            "url" : contentUrl,
            "description" : contentDescription,
            "title" : contentTitle
        };

        var encodedUrl = encodeURIComponent(contentUrl);
        var jsonStr = angular.toJson(jsonObj,true);
        var path = baseURL + '/api/v1/providers/'+ $scope.currentProject + '/dashboards/' + encodedUrl;
        $http({
            url: path,
            method: "PUT",
            data: jsonStr
        }).success(function(data) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Dashboard could not be updated : error');
            Materialize.toast("Dashboard could not be updated",3000);
        });
        $scope.currentProject = '';
        $scope.currentContent = '';
    };


    $scope.openProjectModal = function() {
        $('#projectModal').openModal();
    };

    $scope.createProject = function() {
        $('#projectModal').closeModal();

        var jsonObj = {
            "project_id" : $scope.newProjectId,
            "project_description" : $scope.newProjectDescription
        };
        var jsonStr = angular.toJson(jsonObj,true);
        var path = baseURL + '/api/v1/providers/';
        $http({
            url: path,
            method: "POST",
            data: jsonStr
        }).success(function(data) {
            $route.reload();
        }).error(function(data, status, headers, config) {
            console.log('Could not create project : error');
            Materialize.toast("Could not create project",3000);
        });
    };

    $scope.browser = function() {
        chrome.runtime.reload();
    };
});
