(function () {
  "use strict";
  angular.module("LogligApp.services").service("refereeServices", ["apiService",
    function (apiService) {

      this.currentGameEdit = {};

      this.getGames = function (refereeId) {
        return apiService.getByUrl(API_REFEREE_PAGE + refereeId + '?UnionId=' + UNION_ID);

      };

      this.endGame = function (gameId) {
          return apiService.makeRequest({
            url: API_GAME_PAGE + '/' + gameId + API_END_GAME_SUFFIX,
            method: 'POST',
          });
      };

      this.technicalWin = function (gameId, teamId) {
        return apiService.makeRequest({
          url: API_GAME_PAGE + '/' + gameId + '/' + teamId + API_TECHNICAL_WIN_SUFFIX,
          method: 'POST',
        });
      };

      this.saveGameSet = function (gameset) {

        if (gameset.GameSetId > 0) {
          // - EXIST game set - update with PUT
          return apiService.makeRequest({
            method: "PUT",
            url: API_GAMESETS + gameset.GameSetId,
            data: JSON.stringify({
              GameCycleId: gameset.GameCycleId,
              HomeTeamScore: gameset.inEditHomeTeamScore,
              GameSetId: gameset.GameSetId,
              setNumber:gameset.setNumber,
              GuestTeamScore: gameset.inEditGuestTeamScore,
              IsGoldenSet: gameset.inEditIsGoldenSet
            })
          })
        } else {
          // - NEW game set - save with POST
          return apiService.makeRequest({
            url: API_GAMESETS,
            method: 'POST',
            data: JSON.stringify({
              GameCycleId: gameset.GameCycleId,
              HomeTeamScore: gameset.inEditHomeTeamScore,
              GuestTeamScore: gameset.inEditGuestTeamScore,
              IsGoldenSet: gameset.inEditIsGoldenSet
            })
          })
        }
      }

    }
  ]);
})();
