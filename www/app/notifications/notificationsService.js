(function () {
	"use strict";
	angular.module("LogligApp.services").service("notificationsService", ["apiService",
		function (apiService) {
			this.getNotifications = function () {

				return apiService.getByUrl(API_NOTIFICATIONS_GET);
			};
			this.setNotificationRead = function (notifications) {

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
			this.setNotificationRead = function (notifications) {
				var isFound = false;
				var messages = [];
				angular.forEach(notifications, function (notification) {
					if (notification.IsRead == false) {
						messages.push(notification.MsgId);
					}
				});
				if (messages.length > 0) {
					var messagesSent = JSON.stringify(messages);
					return apiService.makeRequest({url: API_NOTIFICATIONS_READ, data: messagesSent});
				}
				return true;
			}
            this.removeNotification = function (id) {
                return apiService.makeRequest({url: API_NOTIFICATIONS_REMOVE, data: id});
            }
			this.removeAllNotifications = function (notifications) {
				var isFound = false;
				var messages = [];
				angular.forEach(notifications, function (notification) {
					messages.push(notification.MsgId);
				});
				if (messages.length > 0) {
					var messagesSent = JSON.stringify(messages);
					return apiService.makeRequest({url: API_NOTIFICATIONS_REMOVE_ALL, data: messagesSent});
				}
				return true;
			}

			this.getGameSchedule = function(teamId, leagueId) {
				return apiService.getByUrl(API_GAME_SCHEDULE + "/Team/" + teamId + "/League/" + leagueId);
			}

			this.setReminder = function(cycleId, startDate, txReminder) {
				var current = new Date().getTime();
				// var rmndDate = current + 5000;
				var rmndDate = new Date(startDate).getTime() - 86400000;
				if (current > rmndDate)
					return;

				var id = cycleId.toString();

				if (window.cordova != undefined && window.cordova.plugins != undefined) {
					window.cordova.plugins.notification.local.schedule({
						id : id,
						text: txReminder,
						at: rmndDate,
						led: "FF0000"});
				}
			}

			this.addReminderToNotification = function(msg) {
				var messagesSent = JSON.stringify(msg);
				return apiService.makeRequest({url: API_NOTIFICATIONS_ADD_REMINDER, data: messagesSent});
			};

            this.getMsgs = function () {
                return apiService.getByUrl(API_MSGS_GET);
            };
            this.getReceives = function (msgId) {
                return apiService.getByUrl(API_RECEIVES_GET + "/" + msgId);
            };
            this.sendMsg = function (postData) {
                return apiService.makeRequest({url: API_MSGS_SEND + '?UnionId=' + UNION_ID, data: postData});
            };
            
            this.sendMsgForTeam = function (postData) {
                return apiService.makeRequest({url: API_MSGS_SEND_TEAM + '?UnionId=' + UNION_ID, data: postData});
            };

            this.fwMsg = function (fwdData) {
				var values = [];
				values.push(fwdData.MsgId);
				angular.forEach(fwdData.Friends, function (friend) {
					values.push(friend.UserId);
				});
				var messagesSent = JSON.stringify(values);
				return apiService.makeRequest({url: API_MSGS_FW, data: messagesSent});
            };

            this.fwAllMsg = function (fwdMsgId) {
            	var values = [];
            	values.push(fwdMsgId);
            	var messagesSent = JSON.stringify(values);
            	return apiService.makeRequest({url: API_MSGS_FW_ALL + '?UnionId=' + UNION_ID, data: messagesSent});
            }


            this.fwMsgForTeam = function (fwdData) {
				var values = [];
				values.push(fwdData.MsgId);
				angular.forEach(fwdData.Friends, function (friend) {
					values.push(friend.UserId);
				});
				var messagesSent = JSON.stringify(values);
				return apiService.makeRequest({url: API_MSGS_FW_TEAM + '?UnionId=' + UNION_ID, data: messagesSent});
            };

            this.getChatUsers = function () {
                return apiService.getByUrl(API_MSGS_GET_FAN_USERS + '?UnionId=' + UNION_ID);
            };
		}]);
})();