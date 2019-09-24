(function () {
	"use strict";
	angular.module("LogligApp.services").service("fanManageService", ["$q", "apiService", "$rootScope",
		function ($q, apiService, $rootScope) {

			this.getTeamData = function (team) {
				return apiService.getByUrl(API_FAN_TEAM + "/Team/" + team.TeamId + "/League/" + team.LeagueId);
			};

			this.getGameData = function (team) {
				return apiService.getByUrl(API_FAN_GAME + "/Team/" + team.TeamId + "/League/" + team.LeagueId + "/Union/" + UNION_ID);
			};
			this.getGameDataTennis = function (team) {
				console.log("checkmeAPI_FAN_GAMETENNIS");
				return apiService.getByUrl(API_FAN_GAMETENNIS + "/Team/" + 0 + "/League/" + 0 + "/Union/" + UNION_ID);
			};
			this.getClubInfo = function (team) {
				return apiService.getByUrl(API_FAN_CLUBINFO + "/Team/" + team.TeamId);
			};
			this.getClubInfoByUserId = function (UserId) {
				return apiService.getByUrl(API_FAN_CLUBINFO + "/User/" + UserId);
			};
			this.getArchievements = function (team) {
				return apiService.getByUrl(API_FAN_ARCHIEVEMENTS + "/Team/" + team.TeamId + "/Union/" + UNION_ID);
			};

			this.getLastMessage = function () {
				return apiService.getByUrl(API_FAN_NOTE);
			};

			this.setMessageRead = function (id) {

				var arr = localStorage.getItem('messages');
				var messages = [];
				var isFound = false;

				if (arr !== null) {
					var messages = JSON.parse(arr);
					isFound = $.inArray(id, messages) > -1;
				}

				if (!isFound) {
					messages.push(id);
				}

				localStorage.messages = JSON.stringify(messages);
			};

			this.isMessageRead = function (id) {

				var arr = localStorage.getItem('messages');
				if (arr !== null) {
					var messages = JSON.parse(arr);
					return $.inArray(id, messages) > -1;
				}

				return false;
			};

			this.getLastTeam = function (id) {

				var lastTeam = localStorage.getItem('lastTeam');

				if (lastTeam != null) {
					return JSON.parse(lastTeam);
				}
				return null;
			};

			this.setLastTeam = function (item) {

				localStorage.lastTeam = JSON.stringify(item);
			};

			this.sendIsGoing = function (gameId, isGoing, gameType) {
				console.log("checkmestart" +API_GOING_FOR_TENNIS_COMPETITION+"/"+gameId+"/"+isGoing);
				if(gameType > 0)
					return apiService.makeRequest({url: API_GOING_FOR_TENNIS_COMPETITION, data: {id: gameId, isgoing: isGoing}});
				else
					return apiService.makeRequest({url: API_GOING, data: {id: gameId, isgoing: isGoing}});
			};

			this.getFriendsAndFans = function (team) {

				return apiService.getByUrl(API_FAN_TEAM + "/Team/" + team.TeamId + "/Club/" + team.ClubId);
			};

			this.unFriend = function (id) {
				$rootScope.$broadcast('unFriendUser', {friendId: id});
				return apiService.makeRequest({url: API_FAN_UNFRIEND + "/" + id});
			};

			this.requestFriendship = function (id) {

				return apiService.makeRequest({url: API_FAN_REQUEST + "/" + id});
			};

			this.cancelFriendship = function (id) {

				return apiService.makeRequest({url: API_FAN_CANCEL + "/" + id});
			};

			this.getFanById = function (id) {

				return apiService.getByUrl(API_FAN_GET + "/" + id);
			};

			this.getAccountDetails = function (id) {

				return apiService.getByUrl(API_ACCOUNT_GET_DETAILS);
			};
			this.updateDetailsFan = function (postData) {

				return apiService.makeRequest({url: API_ACCOUNT_UPDATE_DETAILS, data: postData});
			};

			this.getPendingFriendshipRequests = function(){
				return apiService.getByUrl(API_FAN_PENDING);
			};

			this.approveFriendship = function (id) {
				return apiService.makeRequest({ url: API_FAN_CONFIRM + "/" + id });
			};

			this.rejectFriendship = function (id) {
				return apiService.makeRequest({ url: API_FAN_REJECT + "/" + id });
			};

		}]);
})();
