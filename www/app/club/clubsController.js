(function () {
	angular.module("LogligApp.controllers")
		.controller("clubsCtrl", ["$state","$scope", "appService", "$http", "$ionicPopup", "$location", "unionService", "$ionicPlatform", "$ionicLoading", "$filter", "appUtilsService",
			function ($state,$scope, appService, $http, $ionicPopup, $location, unionService, $ionicPlatform, $ionicLoading, $filter, appUtilsService) {
				var $trans = $filter('translate');
        appService.wait(true);
        $scope.util = appUtilsService;
        $scope.areaStr = $state.params.areaStr;
        console.log($scope.areaStr+"checkmeareastr");
        if($scope.areaStr == "area1"){
          unionService.getClubs(2).then(function (res) {
            $scope.clubs = res.data;
            $scope.prefix = "";
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        }
        else if($scope.areaStr == "area2"){
          unionService.getClubs(5).then(function (res) {
            $scope.clubs = res.data;
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        }
        else if($scope.areaStr == "area3"){
          unionService.getClubs(3).then(function (res) {
            $scope.clubs = res.data;
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        }
        else if($scope.areaStr == "area4"){
          unionService.getClubs(4).then(function (res) {
            $scope.clubs = res.data;
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        }
        else if($scope.areaStr == "area5"){
          unionService.getClubs(1).then(function (res) {
            $scope.clubs = res.data;
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        }
        else{
          appService.wait(false);
        }
			}]);
})();
