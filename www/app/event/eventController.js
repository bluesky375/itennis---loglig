(function () {
    angular.module("LogligApp.controllers")
        .controller("eventCtrl", ["appUtilsService", "$state", "$scope", "appService", "$http", "$ionicPopup", "$location", "unionService", "$ionicPlatform", "$ionicLoading", "$filter", "$ionicPopover", "appUtilsService", "eventService",
            function (appUtilsService, $state, $scope, appService, $http, $ionicPopup, $location, unionService, $ionicPlatform, $ionicLoading, $filter, $ionicPopover, appUtilsService, eventService) {
                var $trans = $filter('translate');
                $scope.eventId = $state.params.eventId;
                $scope.truncating = true;
                $scope.limit = 300;
                appService.wait(true);
                $scope.util = appUtilsService;
                var disciplineId = 0;
                $scope.clickShowMore = function () {
                    $scope.truncating = !$scope.truncating;
                }
                eventService.getevent($scope.eventId).then(function (res) {
                    $scope.event = res.data;
                    appService.wait(false);
                }, function (err) {
                    console.log(err);
                    appService.wait(false);
                });

                var onSuccess = function (result) {
                    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                    console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                };

                var onError = function (msg) {
                    console.log("Sharing failed with message: " + msg);
                };
                $scope.goback = function(){
                    console.log("checkmegoback");
                    window.history.go(-1);
                }
                
                $scope.facebookShare = function () {
                    // Url = "http://ITennis-Loglig.com/app/event/event/"+$scope.eventId
                    Url = "http://www.ITennis-Loglig.com/event/event/"+$scope.eventId;
                    console.log($scope.eventId);
                    window.plugins.socialsharing.share($scope.event.Name,"", null,Url, sucess, error);
                }
                var sucess = function () {
                    console.log("checkmesuccessshare");
                }
                var error = function () {
                    console.log("checkmesharerror");
                }
            }]);
})();
