(function() {
  angular.module("LogligApp.controllers")
    .controller("gameCtrl", ["appService", "$scope", "$state", "leaguesService","$translate",
      function(appService, $scope, $state, leaguesService,$translate) {
        appService.wait(true);
        leaguesService.getGame($state.params.gameId, $state.params.gameType).then(function(res) {
          $scope.game = res.data.GameInfo;
          $scope.game.gameType = $state.params.gameType;
          $scope.sets = res.data.Sets;
          $scope.History = res.data.History;
          $scope.GoingFriends = res.data.GoingFriends;
          console.log("checkmegame"+JSON.stringify(res.data));
          if(res.data.GameInfo.TennisLeagueGamesScore != null){
            $scope.gameInfo = res.data.GameInfo.TennisLeagueGamesScore[0];
          }
          if (res.data.GoingFriends) {

            $scope.fansArr = $scope.util.getPagedList(res.data.GoingFriends, 5);
            $scope.startPage = $scope.fansArr.length - 1;
            //$ionicSlideBoxDelegate.update();
          }
          appService.wait(false);
        }, function (err) {
            console.log(err);
            appService.wait(false);
        });

        $scope.showDetail = function(id, leagueId, type) {
            if( type > 0 ) // Competition : showPlayer
              $state.go('app.player', {playerId: id, leagueId: leagueId});
            else
              $state.go('app.team', {teamId: id, leagueId: leagueId});
          };

// =======
        // $scope.isHebrew = !$scope.getCurrentLanguage() == 'en';
        // console.log('LANG:'+$scope.isHebrew);
        // leaguesService.getGame($state.params.gameId).then(function(res) {

        //   $scope.game = res.data.GameInfo;
        //   $scope.sets = res.data.Sets;


        //   $scope.History = res.data.History;
        //   $scope.GoingFriends = res.data.GoingFriends;
        //   if (res.data.GoingFriends) {

        //     $scope.fansArr = $scope.util.getPagedList(res.data.GoingFriends, 5);
        //     $scope.startPage = $scope.fansArr.length - 1;

        //     //$ionicSlideBoxDelegate.update();
        //   }

        //   appService.wait(false);
        // });


// >>>>>>> origin/develop
      }]);
})();