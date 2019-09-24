(function () {
	angular.module("LogligApp.controllers")
		.controller("fanEditCtrl", ["$filter","$scope", "$state", "appService", "authService", "$translate", "fanManageService", "$cordovaFileOpener2", "$cordovaFileTransfer", "$q", "multimediaService", "$ionicPopover", "userManagmentService", "appUtilsService",
			function ($filter,$scope, $state, appService, authService, $translate, fanManageService, $cordovaFileOpener2, $cordovaFileTransfer, $q, multimediaService, $ionicPopover, userManagmentService, appUtilsService) {
				// $FilePicker,fileChooser,
				// $scope.updateUserInfo();
				var $trans = $filter('translate');
				$scope.isEyeClickabe = true;
				$scope.isSelected = false;
				$scope.user = authService.getUser();
				$scope.userImage = appUtilsService.fanImage($scope.user.Image);
				$scope.user.teams = $scope.user.Teams;
				$scope.isPlayer = $scope.user.Role=="players";
				$scope.IsApproved = $scope.user.IsApproved;
				$scope.alertTitle = "Message";
				$scope.alertContent = "Data Successfully Uploaded";
				$scope.uploadfile = "empty";
				for (var index in $scope.user.teams) {
					for (var i = $scope.user.teams.length - 1; i > index; i--) {
						if ($scope.user.teams[index].TeamId == $scope.user.teams[i].TeamId) {
							$scope.user.teams.splice(i, 1);
						}
					}
				}

				$ionicPopover.fromTemplateUrl('picture-dropdown.html', {
					scope: $scope
				}).then(function (popover) {
					$scope.popover = popover;
				});
				$scope.eye_click = function () {
					// code here
					if(!$scope.isEyeClickabe)
						return;
					console.log(CMS_URL + '/assets/players/' + $scope.user.MCertificationFile + "checkme");
					if ($scope.user.MCertificationFile && $scope.user.MCertificationFile.length > 0)
						// window.open('http://52.50.14.212' + '/assets/players/' + $scope.user.MCertificationFile);
						window.open(CMS_URL + '/assets/players/' + $scope.user.MCertificationFile,'_blank');
						
				}
				$scope.upload_click = function (event) {
					chooseFile('.jpg');//.then(res => console.log(res) + "checkmefilePath").catch(err => console.log(err) + "checkmeerr");
				}
				function checkFileType(path, fileExt) {
					return path.match(new RegExp(fileExt + '$', 'i'));
				}

				var deferred = $q.defer();
				function chooseFileOk(deferred, uri, fileExt) {
					if (!checkFileType(uri, fileExt)) {
						deferred.reject('wrong_file_type');
					} else {
						deferred.resolve(uri);
					}
				}
				var chooseFile = function (fileExt) {
					// iOS (NOTE - only iOS 8 and higher): https://github.com/jcesarmobile/FilePicker-Phonegap-iOS-Plugin
					if (ionic.Platform.isIOS()) {
						FilePicker.isAvailable(function (avail) {
							if (avail) {
								FilePicker.pickFile(
									function (uri) {
										chooseFileOk(deferred, uri, fileExt);
									},
									function (error) {
										chooseFileError(deferred, 'FilePicker');
									}
								);
							}
						});
						// Android: https://github.com/don/cordova-filechooser
					} else {
						fileChooser.open({ "mime": "*/*" }, success, error);
					}
				}
				var success = function (data) {
					// do something
					window.resolveLocalFileSystemURL(data, (res) => {
						res.file((resFile) => {
							if (resFile.size > 2000000) {
								alert('choose file less than 2MB');
							}
							else {
								if (resFile.type.indexOf('pdf') !== -1 || resFile.type.indexOf('jpg') !== -1 || resFile.type.indexOf('jpeg') !== -1 || resFile.type.indexOf('png') !== -1) {
									$scope.details.MCertificationFile = data;
									if (resFile.type.indexOf('pdf') !== -1) {
										$scope.MCFileType = 'pdf';
									}
									if (resFile.type.indexOf('jpg') !== -1) {
										$scope.MCFileType = 'jpg';
									}
									if (resFile.type.indexOf('jpeg') !== -1) {
										$scope.MCFileType = 'jpeg';
									}
									if (resFile.type.indexOf('png') !== -1) {
										$scope.MCFileType = 'png';
									}
								}
								else {
									alert('select image or pdf file');
								}
							}
						})
					})
					$scope.isSelected = true;
					appService.alertPopup($trans('FILE_SELECTED'));
				};

				var error = function (msg) {
					$scope.isSelected = false;
					console.log("file not selected");
					//do something
				};
				fanManageService.getAccountDetails().then(function (res) {
					$scope.details = res.data;

					$scope.userName = $scope.details.UserName || $scope.details.FullName;
					uid = $scope.user.Id;
					//call notification role
					// $.post(BASE_API_URL + "/v2/get-notification-role.aspx", {
					// 	id: uid
					// }, function (data) {
					// 	var startgame = JSON.parse("[" + data + "]")[0].IsStartAlert;
					// 	var endgame = JSON.parse("[" + data + "]")[0].IsGameScores;
					// 	var change = JSON.parse("[" + data + "]")[0].IsTimeChange;
					// 	$scope.details.IsStartAlert = startgame;
					// 	$scope.details.IsGameScores = endgame;
					// 	$scope.details.IsTimeChange = change;
					//
					// })
				});
				$scope.user.IsStartAlert = $scope.user.IsStartAlert != undefined ? $scope.user.IsStartAlert : true;
				$scope.user.IsGameScores = $scope.user.IsGameScores != undefined ? $scope.user.IsGameScores : true;
				$scope.user.IsTimeChange = $scope.user.IsTimeChange != undefined ? $scope.user.IsTimeChange : true;
				$scope.user.IsFriendRequest = $scope.user.IsFriendRequest != undefined ? $scope.user.IsFriendRequest : true;
				$scope.user.IsMessage = $scope.user.IsMessage != undefined ? $scope.user.IsMessage : true;

				$scope.isEdit = false;

				$scope.editFan = function () {
					$scope.isEdit = true;
				};
				$scope.openPopover = function ($event) {
					$scope.popover.show($event);
				};
				$scope.openGallery = function () {
					$scope.popover.hide();
					multimediaService.getAvatarImageFromGallery()
						.then(function (imageURI) {
							$scope.details.imageFile = imageURI;
						}, function (err) {
							alert('err=' + JSON.stringify(err));
						});
				};
				$scope.openCamera = function () {
					$scope.popover.hide();
					multimediaService.openAvatarCamera()
						.then(function (imageURI) {
							$scope.details.imageFile = imageURI;
						}, function (err) {
							appService.alertPopup('Error', err.message, null);
						});
				};
				
				$scope.updateUserInfo = function () {
					userManagmentService.setUserInfo().then(function () {
						var user = authService.getUser();
						$scope.isSelected = false;
						user.IsFriendRequest = $scope.user.IsFriendRequest != undefined ? $scope.user.IsFriendRequest : true;
						user.IsStartAlert = $scope.user.IsStartAlert != undefined ? $scope.user.IsStartAlert : true;
						user.IsGameScores = $scope.user.IsGameScores != undefined ? $scope.user.IsGameScores : true;
						user.IsTimeChange = $scope.user.IsTimeChange != undefined ? $scope.user.IsTimeChange : true;
						user.IsMessage = $scope.user.IsMessage != undefined ? $scope.user.IsMessage : true;
						localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
						if (!user.IsStartAlert) {
							window.cordova.plugins.notification.local.clearAll(function (res) {
								console.log("clear All notifications" + res);
							})
						}
						$scope.userImage = appUtilsService.fanImage($scope.user.Image);
						$scope.user = authService.getUser();
						$scope.isEyeClickabe = true;
						appService.alertPopup($scope.alertTitle, $scope.alertContent, null);
					});
				};
				$scope.updateDetailsSend = function () {
					$scope.isEyeClickabe = false;
					console.log('Update details send');
					if ($scope.details.imageFile) {
						var deffered = $q.defer();
						var token = JSON.parse(localStorage.getItem(TOKEN_KEY));
						var options = {
							fileKey: "avatar",
							fileName: $scope.details.imageFile.substr($scope.details.imageFile.lastIndexOf('/') + 1),
							chunkedMode: false,
							mimeType: 'image/jpeg',
							headers: {
								Authorization: token.token_type + ' ' + token.access_token
							}
						};

						$cordovaFileTransfer.upload(API_UPLOAD_PROFILE_PICTURE, $scope.details.imageFile, options)
							.then(function (result) {

								$scope.updateUserInfo();
								console.log("uploading succeed Checkme");
								$scope.details.imageFile = undefined;
								deffered.resolve(result);
							}, function (error) {
								console.log('err:' + error);
								$scope.details.imageFile = undefined;
								$scope.updateUserInfo();
								deffered.reject(error);
							}, function (progress) {
							});
					}
					if ($scope.details.MCertificationFile) {
						var deffered = $q.defer();
						var token = JSON.parse(localStorage.getItem(TOKEN_KEY));
						var options = {
							fileKey: "MCFile",
							fileName: $scope.details.MCertificationFile.substr($scope.details.MCertificationFile.lastIndexOf('/') + 1),
							chunkedMode: false,
							mimeType: 'image/jpeg',
							headers: {
								Authorization: token.token_type + ' ' + token.access_token
							}
						};
						$cordovaFileTransfer.upload(API_UPLOAD_MCFILE, $scope.details.MCertificationFile, options)
							.then(function (result) {
								console.log('CheckmefinalRes:' + JSON.stringify(result));
								$scope.updateNewUserInfo();
								$scope.details.MCertificationFile = undefined;
								deffered.resolve(result);
							}, function (error) {
								console.log('err:' + JSON.stringify(error));
								$scope.details.MCertificationFile = undefined;
								$scope.updateNewUserInfo();
								deffered.reject(error);
							}, function (progress) {
							});
					}
					if($scope.details.imageFile||$scope.details.MCertificationFile){
						//update already called	
					}
					else{
						$scope.updateNewUserInfo();
					}
					if ($scope.user.Role === 'fans') {
						console.log('ROLE = fans');
						$scope.details.Teams = $scope.user.Teams;
					}
				};
				$scope.updateNewUserInfo = function(){
					fanManageService.updateDetailsFan($scope.details).then(function (res) {
						if (res.data == "saved" || res.status == HTTP_STATUS_OK) {
							$translate(['fan_response_from_update_details_success', 'text_message']).then(function (value) {
								// $scope.alertPopup_NewUserInfo(value.text_message, value.fan_response_from_update_details_success);
								// appService.alertPopup(value.text_message, value.fan_response_from_update_details_success, null);
								$scope.alertTitle = value.text_message;
								$scope.alertContent = value.fan_response_from_update_details_success;
							});
							$scope.details.OldPassword = "";
							$scope.details.NewPassword = "";
							$scope.details.RepeatPassword = "";
							$scope.updateUserInfo();
							return true;
						}
					}, function (res) {
						$translate('text_show_white').then(function (value) {
							$scope.updateUserInfo();
							// appService.alertPopup(value, res.data.Message, null);
						});

					});
				}
			}]);
})();
