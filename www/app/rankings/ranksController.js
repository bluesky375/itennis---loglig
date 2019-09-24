(function () {
  angular.module("LogligApp.controllers")
    .controller("rankingsCtrl", ["$scope", "appService", "$http", "$ionicPopup", "$location", "unionService", "$ionicPlatform", "$ionicLoading", "$filter", "$ionicPopover", "appUtilsService", "leaguesService", 
      function ($scope, appService, $http, $ionicPopup, $location, unionService, $ionicPlatform, $ionicLoading, $filter, $ionicPopover, appUtilsService, leaguesService ) {
        var $trans = $filter('translate');

        $scope.util = appUtilsService;
        $scope.categoryNameList = [];

        appService.wait(true);
        unionService.getCompetitionAgeList().then(function (res) {
          $scope.categoryNameList = res.data;
          $scope.selectedCategory = $scope.categoryNameList[0];
          $scope.categoryChanged();
        }, function (res) {
          appService.wait(false);
        });

        $ionicPopover.fromTemplateUrl('dropdown.html', {
          scope: $scope
        }).then(function(popover) {
          $scope.popover = popover;
        });

        $scope.openCategoryPopover = function($event) {
          $scope.selListFlag = 1;
          $scope.nameList = $scope.categoryNameList;
          $scope.popover.show($event);
        };  

        $scope.categorySelect = function (item) {
          $scope.selectedCategory = item;
          $scope.categoryChanged();
        }

        $scope.categoryChanged = function () {
          appService.wait(true);
          unionService.getUnionRanks($scope.selectedCategory.id).then(function (res) {
            $scope.unionRanks = res.data;
            appService.wait(false);
          },function (error) {
            appService.wait(false);
          });
        }

      }]);
})();
