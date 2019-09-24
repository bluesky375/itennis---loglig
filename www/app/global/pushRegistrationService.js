(function () {
	"use strict";
	angular.module("LogligApp.services")
		.service("pushRegistrationService", ["$q", "$timeout", "$ionicPopup", "$state", "$rootScope", "apiService", "appService", '$cordovaPushV5', "authService","notificationsService", '$translate',
			function ($q, $timeout, $ionicPopup, $state, $rootScope, apiService, appService, $cordovaPushV5, authService, notificationsService, $translate) {

				var service = {
					registration: registration,
					registerTokenToServer: registerTokenToServer,
					handleNotification: handleNotification,
					registerDevice: registerDevice,
					unregisterDevice: unregisterDevice
				};

				return service;

				function registration () {

					document.addEventListener("deviceready", function() {

						var options = {
							android: {
								senderID: PUSH_NUMBER
							},
							ios: {
								alert: "true",
								badge: "true",
								sound: "true"
							},
							windows: {}
						};

						$cordovaPushV5.initialize(options).then(function(res) {
							$cordovaPushV5.onNotification();
							$cordovaPushV5.onError();

							// register to get registrationId
							$cordovaPushV5.register().then(function(data) {
								console.log(data);
								$rootScope.pushRegistrationId = data;

								// if (authService.isValid()) {
								registerDevice(data);
								// }
							});
						});

					}, false);

				}

				function registerTokenToServer (data) {

					if (data == null || data == "") {
						return;
					}

					// var registerUrl = PUSH_TOKEN_REGISTER_URL + "?token=" + data.registrationId + "&bundleid=" + (ionic.Platform.isIOS() ? PUSH_APNS_BUNDLEID : PUSH_GCM_BUNDLEID);

					// apiService.makeRequest({url: registerUrl}).then(function (res) {

					// 	//alert(angular.toJson(res.data));
					// });
				};

				function handleNotification (data) {
					var message = data.message;
					var user = authService.getUser();

					var extradata = data.additionalData.extradata;


					msgData = message.replace(/\+/g, '%20');
					var msgData = decodeURIComponent(msgData);

					var noteType = data.additionalData.link;

					if (message.indexOf('Game details has been updated') != -1) // B notification
					{
						if (user.IsStartAlert != false) {
							for (var i in user.Teams) {
								notificationsService.getGameSchedule(user.Teams[i].TeamId, user.Teams[i].LeagueId)
									.then(function (res) {
										for (var ii in res.data) {
											var txReminder = "Tomorrow between " + res.data[ii].HomeTeam + " and " + res.data[ii].GuestTeam + " game starts.";
											notificationsService.setReminder(res.data[ii].CycleId, res.data[ii].StartDate, txReminder);
										}
									})
							}
						}

						if (user.IsTimeChange == false)
							return;
					} else if (message.indexOf('קיבלת בקשת חברות') != -1) // Friendly request
					{
						if (user.IsFriendRequest == false)
							return;
					} else if (noteType != "notifications" || $rootScope.DisableNoteAlert) { // E
						if (user.IsGameScores == false)
							return;
					} else {
						if (user.IsMessage == false)
							return;
					}

					if (noteType == "notifications" && !$rootScope.DisableNoteAlert) {
						showNoteAlert(msgData);
					}

					$rootScope.NoteType = data.additionalData.link;
					$rootScope.IsNotification = true;

					$rootScope.$broadcast('newPushNotification');
				};

				function registerDevice(registrationId) {

					var request = {
						url: API_NOTIFICATIONS_SAVE_TOKEN,
						data: {
							Token: registrationId,
							IsIOS: ionic.Platform.isIOS(),
							Section: SPORT_TYPE
						}
					};

					apiService.makeRequest(request);
				};

				function unregisterDevice() {

					var deffered = $q.defer();

					if ($rootScope.pushRegistrationId) {

						var request = {
							url: API_NOTIFICATIONS_DEL_TOKEN,
							data: {
								token: $rootScope.pushRegistrationId,
								isIOS: false
							}
						};

						apiService.makeRequest(request).then(function (response) {
							deffered.resolve(response);
						}, function (response) {
							deffered.reject(response);
						});
					}
					else {
						deffered.resolve();
					}

					return deffered.promise;
				};

				function showNoteAlert(message) {

					$ionicPopup.confirm({
						title: $translate.instant("text_new_alert"),
						template: message,
						cssClass: 'signin-alert',
						buttons: [{
							text: $translate.instant("text_view"),
							type: 'button-positive',
							onTap: function (e) {
								$state.go("app.notifications");
							}
						}, {text: $translate.instant("dialog_box_forgot_close")},]
					});
				}

			}]);
})();