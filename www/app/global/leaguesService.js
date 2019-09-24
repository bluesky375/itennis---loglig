(function () {
	"use strict";
	angular.module("LogligApp.services").service("leaguesService", ["apiService",
		function (apiService) {

			this.getGeague = function (leagueId) {
				console.log("checkmehere");
				return apiService.getByUrl(API_LEAGUE_PAGE + "/Tennis/" + leagueId + "?ln=" + localStorage.getItem('userLang'));//"/Tennis/"
			};

			this.getCompetitionForTennis = function (leagueId, teamId) {
				console.log("checkme"+teamId);
				return apiService.getByUrl(API_LEAGUE_PAGE + "/CompetitionForTennis/" + leagueId + "/" + teamId + "?ln=" + localStorage.getItem('userLang'));
			};
			this.getGameBracketUrl = function (leagueId, teamId) {

				return apiService.getByUrl(API_LEAGUE_PAGE + "/GetGameBracketUrl/" + leagueId + "/" + teamId + "?ln=" + localStorage.getItem('userLang'));
			};

			this.getTeams = function () {

				return apiService.getByUrl(API_CLUB_TEAMS + "/" + UNION_ID);
			};

			this.getLeagues = function () {

				return apiService.getByUrl(API_UNION_LEAGUES + "/" + UNION_ID);
			};

			this.getGame = function (id, type) {
				if( type != undefined && type > 0)
				{
					console.log("checkme"+id);
					return apiService.getByUrl(API_GAME_PAGE_TENNIS + "/" + id);
				}
				else
					return apiService.getByUrl(API_GAME_PAGE + "/" + id);
			};

			this.getGameFans = function (id) {
				// console.log("checkmecalledgetgamefans");
				return apiService.getByUrl(API_GAME_FANS + "/" + id);
			};

            this.getTeamImageGallery = function (leagueId) {
                return apiService.getByUrl(API_LEAGUE_PAGE + "/ImageGallery/" + leagueId);
            };

            // Pedro : add : get CompetitionRegistration(or rank) from route id
            this.getCompetitionRegistrations = function (leagueId, routeName, rankName) {
                return apiService.getByUrl(API_LEAGUE_PAGE + "/CompetitionRegistration/" + leagueId + "/" + routeName + "/" + rankName );
            };

            // Pedro : add : get RankNameList
            this.getCategoryNameList = function (leagueId) {
                return apiService.getByUrl(API_LEAGUE_PAGE + "/GetTennisCategoryNameList/" + leagueId);
            };
             // Pedro : add : get tennis league rank
            this.getRankTennisCompetition = function (leagueId, categoryId) {
                return apiService.getByUrl(API_LEAGUE_PAGE + "/GetRankTennisCompetition/" + leagueId + "/" + categoryId);
			};
			this.getRankTennisCompetitionnew = function (leagueId, categoryId) {
                return apiService.getByUrl(API_LEAGUE_PAGE + "/GetRankTennisCompetitionNew/" + leagueId + "/" + categoryId);
            };
		}]);
})();
