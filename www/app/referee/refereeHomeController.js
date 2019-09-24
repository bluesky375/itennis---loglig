(function () {
  angular.module("LogligApp.controllers")
    .controller("refereeHomeCtrl", ["appService", "$scope", "$location", "appUtilsService", "$ionicScrollDelegate", "refereeServices", '$timeout',
      function (appService, $scope, $location , appUtilsService,  $ionicScrollDelegate, refereeServices, $timeout) {

        appUtilsService.refreshUser();

        $scope.user = appUtilsService.User;

        refereeServices.getGames(appUtilsService.User.Id).then( function (result, error) {
          
          $scope.refereeGames = result.data;

          if (!$scope.refereeGames.LiveGame && $scope.refereeGames.NextGames && $scope.refereeGames.NextGames.length) {
            $scope.refereeGames.LiveGame = $scope.refereeGames.NextGames.shift();
          }
          if (!($scope.refereeGames.CloseGame instanceof Array) && $scope.refereeGames.CloseGame) {
            $scope.refereeGames.CloseGame = [$scope.refereeGames.CloseGame];
          }

          appService.wait(false);

          // scroll to live game
          // $timeout(function() {
            $location.hash('nextGameRow');
            var handler = $ionicScrollDelegate.$getByHandle('refereePageDelegate');
            handler.anchorScroll(true);
          // }, 100);

        });

      }]);
})();
