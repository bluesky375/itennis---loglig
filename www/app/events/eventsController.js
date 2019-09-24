(function () {
    angular.module("LogligApp.controllers")
        .controller("eventsCtrl", ["$state", "$scope", "appService", "$http", "$ionicPopup", "$location", "unionService", "$ionicPlatform", "$ionicLoading", "$filter", "$ionicPopover", "appUtilsService", "eventService",
            function ($state, $scope, appService, $http, $ionicPopup, $location, unionService, $ionicPlatform, $ionicLoading, $filter, $ionicPopover, appUtilsService, eventService) {
                var $trans = $filter('translate');
                appService.wait(true);
                $scope.util = appUtilsService;
                var disciplineId = 0;
                $scope.truncating = [];
                $scope.limit = 200;
                $scope.clickShowMore = function (index) {
                    // $scope.truncating[index] = !$scope.truncating[index];
                }
                eventService.getevents().then(function (res) {
                    $scope.events = res.data;
                    var index = 0;
                    $scope.events.forEach(res => {
                        $scope.truncating[index] = true;
                        index += 1;
                    });
                    appService.wait(false);
                }, function (err) {
                    console.log(err);
                    appService.wait(false);
                });

            }]);
})();
