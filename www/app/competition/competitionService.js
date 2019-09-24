(function () {
	"use strict";
	angular.module("LogligApp.services").service("competitionService", ["$q", "apiService", "$rootScope", 
		function ($q, apiService, $rootScope) {
			this.getCompetitonDisciplines = function (disciplineId) {
				return apiService.getByUrl(API_COMPETITION_DISCIPLINES + UNION_ID);
			};
			this.getCompetitonDisciplinesYouth = function (disciplineId) {
				return apiService.getByUrl(API_COMPETITION_DISCIPLINESYOUTH + UNION_ID);
			};
			this.getCompetitonDisciplinesDaily = function (disciplineId) {
				return apiService.getByUrl(API_COMPETITION_DISCIPLINESDAILY + UNION_ID);
			};
			this.getCompetitonDisciplinesSenior = function (disciplineId) {
				return apiService.getByUrl(API_COMPETITION_DISCIPLINESSENIOR + UNION_ID);
			};

		}]);
})();
