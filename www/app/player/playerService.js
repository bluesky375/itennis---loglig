(function () {
	"use strict";
	angular.module("LogligApp.services").service("playerService", ["apiService",
		function (apiService) {

			this.getPlayerById = function (id, leagueId) {

				return apiService.getByUrl(API_PLAYER + "/" + id + '?leagueId=' + leagueId);
			};
			this.getPlayerByIdBoth = function (id, clubId ,leagueId) {
				if(clubId>0&&clubId!=undefined){
					return apiService.getByUrl(API_PLAYER + "/Players/" + id + "/clubId/" +clubId+ "/leagueId/0");
				}
				else if(leagueId>0&& leagueId!= undefined){
					return apiService.getByUrl(API_PLAYER + "/Players/" + id + "/clubId/0" + "/leagueId/" + leagueId);
				}
					return apiService.getByUrl(API_PLAYER + "/Players/" + id + "/clubId/0" + "/leagueId/0");
			};
			this.getPlayerGames = function (teamId) {

				return apiService.getByUrl(API_PLAYER_GAMES + "/" + teamId);
			};

			this.getRankedTeams = function (leagueId, teamId) {

				return apiService.getByUrl(API_PLAYER_RANKED + "/" + leagueId + "/" + teamId);
			};
			this.getTennisGamesHistoryForPlayer = function (playerId,teamId,ishebrew) {
				return apiService.getByUrl(API_PLAYER_FOR_TENNIS_GAMESHISTORY + "/Player/" + playerId+ "/Team/" + teamId + "/Union/" + UNION_ID+ "/Lang/" + ishebrew);
			};
		}]);
})();