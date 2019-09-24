(function () {
  angular.module("LogligApp.controllers")
    .controller("clubHomeCtrl", ["$scope", "$state", "appService", "appUtilsService", "eilatTournamentService", "unionService", "$filter",
      function ($scope, $state, appService, appUtilsService, eilatTournamentService, unionService, $filter) {

        $scope.navIndex = 0;
        $scope.fansCount = 'מחשב..';
        $scope.util = appUtilsService;
        $scope.isDepartment = false;
        var clubId = $state.params.clubId;
        $scope.showSlide = function(num) {
            $scope.navIndex = num;

            if(num == 3) { // get players
              if( $scope.playersList != undefined )
                return;
              appService.wait(true);
              unionService.getPlayersForClub(clubId).then(function (res) {
                $scope.playersList = res.data.players;
                $scope.jobsList = res.data.teamJobs;
                appService.wait(false);

              }, function (error) {
                console.log(error)
                appService.wait(false);
              });                      
            }
            else if(num == 2) {
              if( $scope.fansList != undefined )
                return;
              appService.wait(true);
              unionService.getFansForClub(clubId).then(function (res) {
                $scope.fansList = res.data;
                appService.wait(false);

              }, function (error) {
                console.log(error)
                appService.wait(false);
              });                      
            }
        };

        $scope.gotoTeam = function(team) {
            if(team.isschoolteam || team.isleagueteam) {
                if(team.parentid != undefined) {
                    $state.go('app.leagueteam', {teamId: team.id, leagueId: team.parentid});
                }
            }
            else if(team.istrainingteam){
              $state.go('app.trainingteam', {teamId: team.id, clubId: team.parentid});
            }
            else {
              $state.go('app.clubteam', {teamId: team.id, clubId: team.parentid});
            }
        }

        appService.wait(true);
        unionService.getClub(clubId).then(function (res) {
          $scope.club = res.data;
          $scope.playersCount = $scope.club.main.players;
          appService.wait(false);

        }, function (error) {
          console.log(error)
          appService.wait(false);
        });        
        

        //Section collapse
        $scope.toggleSection = function (section) {
          if ($scope.isSectionShown(section)) {
            //Collapse
            $scope.showSection = null;
          } else {
            //Expande
            $scope.showSection = section;
          }
        };

        $scope.isSectionShown = function (section) {
          return $scope.showSection === section;
        };
        
      }]);
})();