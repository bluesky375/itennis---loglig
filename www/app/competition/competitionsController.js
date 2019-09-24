(function () {
  angular.module("LogligApp.controllers")
    .controller("competitionsCtrl", ["$state","$scope", "appService", "$http", "$ionicPopup", "$location", "unionService", "$ionicPlatform", "$ionicLoading", "$filter", "$ionicPopover", "appUtilsService", "competitionService",
      function ($state,$scope, appService, $http, $ionicPopup, $location, unionService, $ionicPlatform, $ionicLoading, $filter, $ionicPopover, appUtilsService, competitionService ) {
        var $trans = $filter('translate');
        $scope.area = $state.params.areaStr;
        $scope.competitionId = $state.params.competitionId;
        appService.wait(true);
        $scope.util = appUtilsService;
        var disciplineId = 0;
        if($scope.area == "Youth"){
          competitionService.getCompetitonDisciplinesYouth(disciplineId).then(function (res) {
            $scope.competitions = res.data;
            if($scope.competitionId && $scope.area){
              console.log(JSON.stringify($scope.competitions[$scope.competitionId].categoriLIstItem) + JSON.stringify($scope.competitionId));
              $scope.categoris = $scope.competitions[$scope.competitionId].categoriLIstItem;
            }
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        }
        else if($scope.area == "Daily"){
          competitionService.getCompetitonDisciplinesDaily(disciplineId).then(function (res) {
            $scope.competitions = res.data;
            if($scope.competitionId && $scope.area){
              $scope.categoris = $scope.competitions[$scope.competitionId].categoriLIstItem;
            }
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        }
        else if($scope.area == "Senior"){
          competitionService.getCompetitonDisciplinesSenior(disciplineId).then(function (res) {
            $scope.competitions = res.data;
            if($scope.competitionId && $scope.area){
              $scope.categoris = $scope.competitions[$scope.competitionId].categoriLIstItem;
            }
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
