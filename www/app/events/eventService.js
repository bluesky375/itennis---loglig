(function () {
	"use strict";
	angular.module("LogligApp.services").service("eventService", ["$q", "apiService", "$rootScope", 
		function ($q, apiService, $rootScope) {
			this.getevents = function () {
				return apiService.getByUrl(API_EVENTS + UNION_ID);
			};
			this.getevent = function (eventId = 0) {
				return apiService.getByUrl(API_EVENT + eventId);
			};
		}]);
})();
