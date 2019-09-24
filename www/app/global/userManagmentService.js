(function () {
	"use strict";

	angular.module("LogligApp.services")
		.service("userManagmentService", ["$q", "$rootScope", "apiService", "$cordovaFileTransfer", "$cordovaFacebook", "pushRegistrationService",
			function ($q, $rootScope, apiService, $cordovaFileTransfer, $cordovaFacebook, pushRegistrationService) {

				var self = this;

				this.userInfo = null;

				this.userLogin = function (username, password) {
					var request = {
						url: API_TOKEN,
						data: 'grant_type=password' +
						'&userName=' + encodeURIComponent(username) +
						'&password=' + encodeURIComponent(password) +
						'&lang=' + encodeURIComponent(localStorage.getItem('userLang')),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							AuthenticationType: 'personalid'
						}
					};

					return apiService.makeRequest(request);
				}

				/** Login regularly with username and password.
				 Login with FB Id by providing only a FB Id (as a username)*/
				this.login = function (username, password) {
					var deffered = $q.defer();
					var request;
					if (password) {
						//Username + Password
						request = {
							url: API_TOKEN,
							data: 'grant_type=password' +
							'&userName=' + encodeURIComponent(username) +
							'&password=' + encodeURIComponent(password) +
							'&lang=' + encodeURIComponent(localStorage.getItem('userLang')),
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								AuthenticationType: 'usernamepassword'
							}
						};
					} else {
						//FB Login (No Password)
						request = {
							url: API_TOKEN,
							method:"POST",
							data: 'grant_type=password',
							headers: {
								AuthenticationType: 'facebook',
								id: username
							}
						};
					}
					apiService.makeRequest(request)
						.then(function (res) {
							localStorage.setItem(TOKEN_KEY, JSON.stringify(res.data));
							deffered.resolve(res);
						}, function (res) {
							self.clearUserInfo();
							deffered.reject(res);
						});

					return deffered.promise;
				};

				/** */
				var observerCallbacks = [];

				//register an observer
				this.registerObserverCallback = function(callback){
					observerCallbacks.push(callback);
				};

				//call this when you know 'foo' has been changed
				var notifyObservers = function(){
					angular.forEach(observerCallbacks, function(callback){
						callback();
					});
				};


				this.setUserInfo = function () {

					var deffered = $q.defer();
					var url = API_USER_INFO+ '?unionId='+UNION_ID;
					var request = {
						method: 'POST',
						url: url,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					};

					apiService.makeRequest(request).then(
						function (response) {
							self.userInfo = response.data;
							console.log("checkmeuserinfo"+JSON.stringify(self.userInfo));
							localStorage.setItem(USER_INFO_KEY, JSON.stringify(self.userInfo));

							// if ($rootScope.pushRegistrationId) {
							// 	pushRegistrationService.registerDevice($rootScope.pushRegistrationId);
							// }

							deffered.resolve(response);
							notifyObservers();
						}, function (response) {
							self.clearUserInfo();
							deffered.reject(response);
						});

					return deffered.promise;
				};

				/** */
				this.fbAccountExist = function (fbid) {
					var deffered = $q.defer();
					var request = {
						method: 'GET',
						url: API_FB_ACCOUNT_EXIST + "/" + fbid
					};
					apiService.makeRequest(request).then(
						function (response) {
							deffered.resolve(response);
						}, function (response) {
							deffered.reject(response);
						});

					return deffered.promise;

				}

				/** */
				this.clearUserInfo = function () {
					localStorage.clear();
					//localStorage.removeItem(TOKEN_KEY);
					self.userInfo = null;
					try {
						$cordovaFacebook.logout();
					} catch (e) {
					}
				}

				/** */
				this.uploadProfileImage = function (deffered, imageFile) {
					var token = JSON.parse(localStorage.getItem(TOKEN_KEY));
					var params = {};
					params.headers = {
						Authorization: token.token_type + ' ' + token.access_token
					};
					var options = {
						fileKey: "image",
						fileName: "image.jpeg",
						chunkedMode: false,
						mimeType: "image/jpeg",
						headers: {
							Authorization: token.token_type + ' ' + token.access_token
						}
					};
					console.log('USER man:'+options);
					var localPath = "loglig_profileImage.png";
					var trustHosts = true;

					if (ionic.Platform.isIOS()) {
						localPath = cordova.file.documentsDirectory + localPath;
					} else if (ionic.Platform.isAndroid()) {
						localPath = cordova.file.applicationStorageDirectory + localPath;
					}

					//Download profile image (url) locally then upload it
					$cordovaFileTransfer.download(imageFile, localPath, options, trustHosts)
						.then(function (result) {
							$cordovaFileTransfer.upload(API_UPLOAD_PROFILE_PICTURE, localPath, options)
								.then(function (result) {
									console.log("Code = ok");
									deffered.resolve(result);
								}, function (error) {
									console.log("Code = " + error);
									deffered.reject(error);
								}, function (progress) {
								});
						}, function (err) {
							deffered.reject(error);
						}, function (progress) {
						});


				};

				/** */
				this.registerFan = function (username, password, email, teams, imageFile) {
					var deffered = $q.defer();

					var request = {
						method: 'POST',
						url: API_REGISTER_FAN,
						headers: {'Content-Type': 'application/json'},
						data: {
							UserName: username,
							Password: password,
							Email: email,
							Teams: teams,
							Lang: localStorage.getItem('userLang'),
							UnionId: UNION_ID
						}
					};

					////For Testing
					//deffered.resolve("OK");
					apiService.makeRequest(request)
						.then(function (response) {
							self.login(username, password)
								.then(function (response) {
										localStorage.setItem(TOKEN_KEY, JSON.stringify(response.data));
										if (imageFile) {
											self.uploadProfileImage(deffered, imageFile);
										} else {
											deffered.resolve(response);
										}
										//deffered.resolve(response);
									},
									function (response) {
										deffered.reject(response);
									});

						}, function (response) {
							deffered.reject(response);
						});

					return deffered.promise;
				};
				/** */
				this.registerFanFB = function (username, fullname, email, fbid, teams, imageFile) {
					var deffered = $q.defer();

					var request = {
						method: 'POST',
						url: API_REGISTER_FAN_FB,
						headers: {'Content-Type': 'application/json'},
						data: {
							UserName: username,
							FullName: fullname,
							Email: email,
							FbId: fbid,
							Teams: teams,
							Lang: localStorage.getItem('userLang')
						}
					};

					////For Testing
					//deffered.resolve("OK");
					apiService.makeRequest(request)
						.then(function (response) {
							self.login(fbid, null)
								.then(function (response) {
										localStorage.setItem(TOKEN_KEY, JSON.stringify(response.data));
										//if (imageFile) {
										//    self.uploadProfileImage(deffered, imageFile);
										//} else {
										//    deffered.resolve(response);
										//}
										deffered.resolve(response);
									},
									function (response) {
										deffered.reject(response);
									});

						}, function (response) {
							deffered.reject(response);
						});

					return deffered.promise;
				};

				/** */
				this.registerWorker = function (fullName, personalId, password, email) {
					var deffered = $q.defer();
					var request = {
						method: 'POST',
						url: BASE_API_URL + '/api/Account/Register',
						data: 'FullName=' + encodeURIComponent(fullName) +
						'&PersonalId=' + encodeURIComponent(personalId) +
						'&Password=' + encodeURIComponent(password) +
						'&Email=' + encodeURIComponent(email)
					};

					//For Testing
					deffered.resolve("OK");
					//apiService.makeRequest(request)
					//    .then(function (response) {
					//        deffered.resolve(response);
					//    }, function (response) {
					//        deffered.reject(response);
					//    });
					return deffered.promise;
				};

				this.forgotPassword = function (email, userId) {
					return apiService.makeRequest({ url: API_ACCOUNT_FORGOT_PASS, method:"POST", data: { Mail: email, UserId: userId  } });
				};

		        this.reportChatMessage = function (sender, date, message, imageUrl, videoUrl) {
		          return apiService.makeRequest({ url: API_REPORT_CHAT_MESSAGE, method:"POST", data: { Sender:sender, Date:date, Message:message, ImgUrl:imageUrl, VideoUrl:videoUrl } });
		        };

			}]);
})();
