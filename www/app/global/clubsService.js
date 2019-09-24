(function () {
	"use strict";
	angular.module("LogligApp.services").service("clubsService", ["apiService",
		function (apiService) {

			this.getTeams = function (sectionId, seasonId) {

				return apiService.getByUrl(API_CLUB_TEAMS + seasonId + '?seasonId=' + seasonId);
			};

			this.getGameFans = function (id) {
				return apiService.getByUrl(API_GAME_FANS_CLUB + "/" + id);
			};
		}]);
})();