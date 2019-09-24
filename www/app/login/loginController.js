(function () {
	angular.module("LogligApp.controllers")
		.controller("loginCtrl", ["appService", "$scope", "$translate", "$http", "$ionicPopup", "$timeout", "$state", "userManagmentService", "$cordovaFacebook", "$filter", "pushRegistrationService", 'appUtilsService',
			function (appService, $scope, $translate, $http, $ionicPopup, $timeout, $state, userManagmentService, $cordovaFacebook, $filter, pushRegistrationService, utils) {

				$translate('title_login').then(function (value) {
					$scope.title = value;
				});

				$translate('validation_title_login').then(function (value) {
					$scope.validationTitle = value;
				});

				$scope.user = {
					username: '',
					password: ''
				};

				$scope.login = function (fbid) {

					var userName = "";
					var password = "";

					if (!fbid && !$scope.validationOk()) {
						return;
					}

					if (fbid) {
						userName = fbid;
						password = null;
					}
					else {
						userName = $scope.user.username;
						password = $scope.user.password;
					}

					appService.wait(true);
					userManagmentService.login(userName, password).then(
						function (res) {
							userManagmentService.setUserInfo().then(function () {
								appService.wait(false);

								// register device for push
								pushRegistrationService.registration();

								utils.refreshUser();

								$state.go('app.fan');
							});
						},
						function (res) {
							console.log('LOGIN ERROR:',JSON.stringify(res));
							appService.wait(false);
							appService.alertPopup($scope.validationTitle, res.data.error_description, null);
						});
				};

				$scope.validationOk = function () {
					if ($scope.user.username == null || $scope.user.username == "") {
						$translate('validation_missing_username').then(function (value) {
							appService.alertPopup($scope.validationTitle, value, null);
						});
						return false;
					}
					if ($scope.user.password == null || $scope.user.password == "") {
						$translate('validation_missing_password').then(function (value) {
							appService.alertPopup($scope.validationTitle, value, null);
						});
						return false;
					}

					return true;
				}

				$scope.facebookLogin = function () {
					$cordovaFacebook.login(["public_profile", "email", "user_friends"])
						.then(function (success) {
//							console.log('success: ' + JSON.stringify(success));
							$scope.userId = success.authResponse.userID;
							userManagmentService.fbAccountExist($scope.userId)
								.then(function (response) {
//										console.log('Exist: ' + JSON.stringify(response));
										if (response.data.Exists) {
											//FBId exists --> Login
											$scope.login($scope.userId);
										} else {
											console.log('registration');
											//FBId does not exists --> Register
											$cordovaFacebook.api('me?fields=id,name,email,picture', ["public_profile", "email"])
												.then(function (result) {
													console.log('success: ' + JSON.stringify(result));
														$scope.imageFileFB = "https://graph.facebook.com/" + $scope.userId + "/picture?type=large";
														$state.go("app.fbSignUpConfirm", {
															fbid: result.id,
															userName: result.name,
															fullName: result.name,
															email: result.email,
															thumbnail: result.picture.data.url,
															picture: $scope.imageFileFB
														});
													}, function (error) {
													console.log('error: ' + JSON.stringify(error));
												});
										}
									}
									, function (response) {
										//Error
										console.log('error: ' + JSON.stringify(response));
										appService.alertPopup("", "Error");
									});

							//$('.facebookImage').prepend('<img src="https://graph.facebook.com/1613116932286806/picture?type=large" />');
							//https://graph.facebook.com/1613116932286806/picture?type=large
						}, function (error) {
							console.log('error: ' + JSON.stringify(error));
							// closed dialog eror handling
							if (typeof(error) === 'object' && error.errorMessage && error.errorMessage.indexOf("cancelled dialog") == -1) {
							  appService.alertPopup("", error.errorMessage);
							} else if(typeof(error) === 'string'){
							  appService.alertPopup("", error);
							}
						})
				};

				/*Snike*/
				$scope.userpass = {
					username: ""
				};
				// Triggered on a button click, or some other target
				$scope.showPopup = function (error) {
					var templateUsername = '<i class="ion-close" ng-click="closeForgot(\'forgot\')"></i><input type="text" ng-model="userpass.userEmail" class="forgot-password-input"><span class="error-username">{{popUpError}}</span>';
					if (error == "error") {
						$translate('dialog_box_forgot_wrong_username').then(function (value) {
							$scope.popUpError = value;
						});
					} else {
						$scope.userpass.userEmail = "";
					}
					// An elaborate, custom popup

					$translate(['dialog_box_forgot_title', 'dialog_box_forgot_subtitle', 'dialog_box_forgot_btn_cancel', 'dialog_box_forgot_btn_positive', 'validation_invalid_email'])
						.then(function (translations) {
							$scope.myPopup = $ionicPopup.show({
								template: templateUsername,
								title: translations.dialog_box_forgot_title,
								subTitle: translations.dialog_box_forgot_subtitle,
								cssClass: $translate.use() == 'iw' ? 'dialog-box-forgot rtl' : 'dialog-box-forgot is-eng',
								scope: $scope,
								buttons: [
									{text: translations.dialog_box_forgot_btn_cancel},
									{
										text: translations.dialog_box_forgot_btn_positive,
										type: 'button-positive',
										onTap: function (e) {
											e.preventDefault();
											if ($scope.validationEmail($scope.userpass.userEmail)) {
												return $scope.submitForgotPassword();
											} else {
												$scope.popUpError = translations.validation_invalid_email;
											}
										}
									}
								]
							});
						});

				};
				
				$scope.$watch('userpass.userEmail', function(){
					$scope.popUpError = '';
				});
				
				// Triggered on a button click, or some other target
				$scope.showPopupAlert = function (titleText, templateText) {
					var templateText = '<i class="ion-close" ng-click="closeForgot(\'alert\')"></i><span>' + templateText + '</span>';

					// An elaborate, custom popup
					$scope.alertPopupForgot = $ionicPopup.show({
						template: templateText,
						title: titleText,
						cssClass: "alert-forgot dialog-box-forgot",
						//template: textError,
						scope: $scope,
						buttons: [
							{text: $filter('translate')('dialog_box_forgot_close')}

						]
					});

				};
				$scope.closeForgot = function (event) {
					if ($scope.myPopup) {
						$scope.myPopup.close();
					} 
					if ($scope.alertPopupForgot){
						$scope.alertPopupForgot.close();
					}
				};

				$scope.submitForgotPassword = function () {
					$scope.closeForgot();
					var res = userManagmentService.forgotPassword($scope.userpass.userEmail).then(function (response) {
						$scope.showPopupAlert($filter('translate')('dialog_box_forgot_title'), $filter('translate')('dialog_box_forgot_has_sent'));
					}, function (data) {
						$scope.showPopup("error");
					});
				}
				$scope.validationOkUsername = function () {
					if ($scope.userpass.userEmail == null || $scope.userpass.userEmail == "") {
						$translate('validation_missing_username').then(function (value) {
							appService.alertPopup($scope.validationTitle, value, null);
						});
						return false;
					}
					return true;
				}
				
				$scope.validationEmail = function (value) {
					var regExp = /^[a-zA-Z0-9_\-\.\+\^!#\$%&*+\/\=\?\`\|\{\}~\']+@(.+)$/;
					return regExp.test(value);
				}
				
			}]);


})();