(function () {
  "use strict";

  angular.module("LogligApp")
    .directive('refereeUserHeader', ['$state', '$ionicPopover', 'appUtilsService', 'authService', 'fanManageService', 'notificationsService', 'leaguesService', 'userManagmentService',
    function ($state, $ionicPopover, appUtilsService, authService, fanManageService, notificationsService, leaguesService, userManagmentService) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'app/partial/referee_header.html',
        controller: ['$scope', '$state', 'appUtilsService', 'userManagmentService', function DirectiveController($scope, $state, utils, userManagmentService) {

          $scope.goToMyProfile = function() {
            if ( utils.isReferee() ) {
              $state.go('app.referee');
            } 
            else if ( utils.isTeamMgr() ) { // Team Manager
              utils.gotoTeamMgr(user);
            } 
            else if ( utils.isClubMgr() ) { // Club Manager
              utils.gotoClubMgr(user);
            } 
            else if ( utils.isUnionMgr() ) { // association manager
              $state.go('app.union');
            } 
            else if ( utils.isLeagueMgr() && userManagmentService.userInfo.UserJobs[0] && userManagmentService.userInfo.UserJobs[0].LeagueId > 0 ) { // league manager
              $state.go('app.league', {leagueId: userManagmentService.userInfo.UserJobs[0].LeagueId } );
            } 
            else {
              $state.go('app.fan');
            }
          };

        }],
        link: function ($scope, element, attrs) {

          if ($state.current.name == 'app.fanFriends') {
            $scope.fpage = true;
          }
          if ($state.current.name == 'app.msgs') {
            $scope.mpage = true;
          }

          if ($state.current.name == 'app.notifications') {
            $scope.npage = true;
          }


          $scope.newMessages = 0;

          $scope.newNotes = 0;

          checkNewNotifications();


          $scope.$on('newPushNotification', function () {
            checkNewNotifications()
          });

          function checkNewNotifications() {
            notificationsService.getNotifications().then(function (res) {
              $scope.newNotes = _.where(res.data, {IsRead: false}).length;
            });
          }

          $scope.user = authService.getUser();
          $scope.$watch('user', function (newvalue) {
            if (typeof(newvalue) !== 'undefined') {
              $scope.userTeams = $scope.user.Teams;
              angular.forEach($scope.userTeams, function (value, key) {

                if (value.LeagueId !== null && value.LeagueId > 0) {
                  
                  leaguesService.getGeague(value.LeagueId).then(function (res) {
                    if (res.data != null) {
                      $scope.userTeams[key].LeagueTitle = res.data.LeagueInfo.Title
                    }
                  });
                }
              
              });
              if ($scope.user.Role == "players" || $scope.user.Role == "workers" ) {
                $scope.displayName = $scope.user.FullName;
                $scope.userImage = appUtilsService.fanImage($scope.user.Image);
              }
              else {
                $scope.displayName = $scope.user.UserName;
                $scope.userImage = appUtilsService.fanImage($scope.user.Image);
              }
              console.log($scope.userImage);

            }
          }, true);
          userManagmentService.registerObserverCallback(function () {
            $scope.user = authService.getUser();
          });

        }
      }
    }]);
})();