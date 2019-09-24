(function () {
	"use strict";
	angular.module("LogligApp.services").service("teamsService", ["$q", "apiService",
		function ($q, apiService) {

			this.getTeamData = function (teamId, leagueId) {
				return apiService.getByUrl(API_TEAM_PAGE + "/" + teamId + "/league/" + leagueId);
			};

			this.getClubTeamData = function (teamId, clubId) {
				return apiService.getByUrl(API_TEAM_PAGE + "/" + teamId + "/club/" + clubId);
			};

            this.getLeagueTeamData = function (teamId, leagueId) {
                return apiService.getByUrl(API_TEAM_PAGE + "/" + teamId + "/league/" + leagueId);
            };

            this.getTeamImageGallery = function (teamId) {
                return apiService.getByUrl(API_TEAM_PAGE + "/ImageGallery/" + teamId);
            };
		}]);
})();