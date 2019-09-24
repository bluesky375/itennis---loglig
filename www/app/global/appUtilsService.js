(function() {
  "use strict";
  angular.module("LogligApp.services").service("appUtilsService", ["$state", "authService", "$rootScope",
    function($state, authService, $rootScope) {

      this.User = authService.getUser();

      this.refreshUser = function() {
        this.User = authService.getUser();
      };

      this.getCurrentUser = function() {
        this.refreshUser();
        return this.User;
      };

      this.teamImage = function(imageName) {
        if (imageName)
          return ASSETS_URL + "teams/" + imageName;
        else
          return TEAM_DEFAULT_IMAGE;
      };

      this.fanImage = function(imageName) {
        if (imageName) {
          if (imageName.substr(0, 4) === 'http' || imageName.substr(0, 4) === 'file' || imageName === FAN_DEFAULT_IMAGE) {
            return imageName;
          }
          else {
            return ASSETS_URL + "players/" + imageName;
          }
        } else {
          return FAN_DEFAULT_IMAGE;
        }
      };

      this.unionImage = function(imageName) {
        if (imageName)
          return ASSETS_URL.replace(':8080', '') + "union/" + imageName;
        else
          return '';
      };

      this.leagueImage = function(imageName) {
        if (imageName)
          return ASSETS_URL + "league/" + imageName;
        else
          return LEAGUE_DEFAULT_IMAGE;
      };
      this.eventImage = function(imageName) {
        if (imageName)
          return CMS_URL + "/assets/events/" + imageName;
        else
          return 'images/event-default.png';
      };

      this.clubImage = function(imageName) {
        if (imageName)
          return ASSETS_URL + "Clubs/" + imageName;
        else
          return LEAGUE_DEFAULT_IMAGE;
      };

      this.clubDetailImage = function(imageName) {
        if (imageName)
          return ASSETS_URL + "Clubs/" + imageName;
        else
          return "";
      };

      this.competitionImage = function(imageName) {
        if (imageName)
          return ASSETS_URL + "league/" + imageName;
        else
          return LEAGUE_DEFAULT_IMAGE;
      };

      this.bannerImage = function(imageName) {
        return ASSETS_URL + "banners/" + imageName;
      };

      this.isLoggedIn = function() {

        return authService.isValid();
      };

      this.clearViewsHistory = function() {

      };

      this.isReferee = function() {
        var userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
        if (userInfo && userInfo.Role && userInfo.Role == 'workers') {
          if (userInfo.UserJobs[0] && userInfo.UserJobs[0].JobRoleName == 'referee') {
            return true;
          }
        }
        return false;
      };

      this.isPlayer = function() {
        var userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
        if (userInfo && userInfo.Role && userInfo.Role == 'players') {
            return true;
        }
        return false;
      };

      this.isUnionMgr = function() {
        var userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
        if( userInfo&&!userInfo.UserJobs){
          return false
        }
        if (userInfo && userInfo.Role && (userInfo.Role == 'workers' || userInfo.Role == 'players')) {
          if (userInfo.UserJobs[0] && userInfo.UserJobs[0].JobRoleName == 'unionmgr') {
            return true;
          }
        }
        return false;
      };

      this.isClubMgr = function() {
        var userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
        if (userInfo && userInfo.Role && userInfo.Role == 'workers') {
          if (userInfo.UserJobs[0] && userInfo.UserJobs[0].JobRoleName == 'clubmgr') {
            return true;
          }
        }
        return false;
      };

      this.gotoClubMgr = function(user) {
          var len = user.UserJobs.length;
          var bFlag = false;
          for(var i = 0; i < len; i ++) {
            if(user.UserJobs[i].ClubId > 0 ) {
              $state.go('app.club', {clubId: user.UserJobs[i].ClubId } ); 
              bFlag = true;
              break;
            }
          }
          if( !bFlag )
            $state.go('app.union');        
      }
      
      this.isTeamMgr = function() {
        var userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
        if (userInfo && userInfo.Role && userInfo.Role == 'workers') {
          if (userInfo.UserJobs[0] && userInfo.UserJobs[0].JobRoleName == 'teammgr') {
            return true;
          }
        }
        return false;
      };

      this.gotoTeamMgr = function(user) {
        var len = user.UserJobs.length;
        var bFlag = false;
        for(var i = 0; i < len; i ++) {
          if(user.Teams[i].TeamId > 0 && user.Teams[i].LeagueId > 0) {
            $state.go('app.leagueteam', {teamId: user.Teams[i].TeamId, leagueId: user.Teams[i].LeagueId  } ); 
            bFlag = true;
            break;
          }
          if(user.Teams[i].TeamId > 0 && user.Teams[i].ClubId > 0) {
            if( user.Teams[i].IsTrainingTeam )
              $state.go('app.trainingteam', {teamId: user.Teams[i].TeamId, clubId: user.Teams[i].ClubId  } ); 
            else
              $state.go('app.clubteam', {teamId: user.Teams[i].TeamId, clubId: user.Teams[i].ClubId  } ); 
            bFlag = true;
            break;
          }

        }
        if( !bFlag )
          $state.go('app.union');              
      }
      this.isLeagueMgr = function() {
        var userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
        if (userInfo && userInfo.Role && userInfo.Role == 'workers') {
          if (userInfo.UserJobs[0] && userInfo.UserJobs[0].JobRoleName == 'leaguemgr') {
            return true;
          }
        }
        return false;
      };

      this.userImage = function(user) {
        return this.fanImage(user.Image)
      };

      this.showUser = function(user) {

        if (user.UserRole == 'fans') {
          $state.go('app.fanPage', {fanId: user.Id});
        }
        else {
          $state.go('app.player', {playerId: user.Id/*, leagueId: leagueId*/});
        }
      };

      this.openWaze = function(address) {
        if(address != undefined) {
          var httpUrl = "https://waze.com/ul?q=" + address;
          window.open(httpUrl, '_system');
        }
      };

      this.openActivityForm = function(activityId) {
        var url = CMS_URL + "/Activity/Form/" + activityId;
        window.open(url, '_system');
      };

      this.getPagedList = function(itemsList, itemsNum) {
        var resultsArr = [];

        if (itemsList) {

          // var itemsNum = 5;
          var itemsPages = Math.ceil(itemsList.length / itemsNum);

          for (var i = 0; i < itemsPages; i++) {

            var start = itemsNum * i;
            var end = start + itemsNum;
            resultsArr[itemsPages - i - 1] = itemsList.slice(start, end);
          }
        }

        return resultsArr;
      };

      this.isDev = function() {
        return BASE_API_URL === BASE_API_URL_DEV;
      };

      this.uploadMedia = function(filePath) {
          if (filePath == null || filePath == undefined || filePath.length == 0)
            return;
          filePath = filePath.replace('"', '');
          filePath = filePath.replace('"', '');
          return ASSETS_URL + "uploads/" + filePath;
      };

    }]);
})();
