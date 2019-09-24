(function () {
	angular.module("LogligApp.controllers")
		.controller("signupCtrl", ["appService", "$scope", "$translate", "$state", "userManagmentService", "multimediaService", "$ionicPopover", "$ionicModal", "$cordovaFacebook","pushRegistrationService",
			function (appService, $scope, $translate, $state, userManagmentService, multimediaService, $ionicPopover, $ionicModal, $cordovaFacebook, pushRegistrationService) {

				$ionicModal.fromTemplateUrl('terms.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function (modal) {
					$scope.modal = modal;
				});

				//$scope.title = $translate('title_registration');
				$translate('title_registration').then(function (value) {
					$scope.title = value;
				});

				$translate('validation_title_signup').then(function (value) {
					$scope.validationTitle = value;
				});

				$translate('text_error').then(function (value) {
					$scope.errorTitle = value;
				});

				//Setting up popover (not in use / modal is used instead)
				$scope.popover = $ionicPopover.fromTemplateUrl('app/signup/popover-teams-list.html', {
					scope: $scope
				}).then(function (popover) {
					$scope.popover = popover;
				});

				var testUser = ''; //'test124';
				$scope.user = {
					type: USER_TYPE_GUEST,
					id: '',
					personalId: '',
					username: testUser,
					fullName: '',
					email: testUser, // + '@test.com',
					password: '', //'test123',
					passwordConfirmation: '', //'test123',
					imageFile: '',
					imageFileFB: '',
					termsOfUse: false, //true,
					teams: []
				};

				/** */
				$scope.registerFan = function () {
					$scope.user.type = USER_TYPE_FAN;

					if (!$scope.validationOk(USER_TYPE_FAN)) {
						return;
					}

					appService.wait(true);

					userManagmentService.registerFan($scope.user.username, $scope.user.password, $scope.user.email, $scope.user.teams, $scope.user.imageFile)
						.then(function (response) {
								//Success
								userManagmentService.login($scope.user.username, $scope.user.password)
									.then(function (response) {
										pushRegistrationService.registration();
										userManagmentService.setUserInfo().then(function () {
											appService.wait(false);
											$state.go('app.fan');
										});
									});
							},
							function (res) {
								appService.wait(false);
								appService.alertPopup($scope.errorTitle, res.data.Message);
							});
				};

				$scope.validationOk = function (userType) {
					if (userType == USER_TYPE_WORKER) {
						//Worker validation
						if ($scope.user.fullname == null || $scope.user.fullname == "") {
							$translate('validation_missing_fullname').then(function (value) {
								appService.alertPopup($scope.validationTitle, value, null);
							});
							return false;
						}
						if ($scope.user.id == null || $scope.user.id == "") {
							$translate('validation_missing_id').then(function (value) {
								appService.alertPopup($scope.validationTitle, value, null);
							});
							return false;
						}
						if (!$scope.user.id.match(REGEX_VALIDATION_ID)) {
							$translate('validation_invalid_id').then(function (value) {
								appService.alertPopup($scope.validationTitle, value, null);
							});
							return false;
						}
					} else {
						//Fan validation
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
						if ($scope.user.password.length < 6 || $scope.user.password.length > 100) {
							$translate('validation_length_password').then(function (value) {
								appService.alertPopup($scope.validationTitle, value, null);
							});
							return false;
						}
						if ($scope.user.password != $scope.user.passwordConfirmation) {
							$translate('validation_passwords_dont_match').then(function (value) {
								appService.alertPopup($scope.validationTitle, value, null);
							});
							return false;
						}
						if (!$scope.user.teams || $scope.user.teams.length < 1) {
							$translate('validation_teams_checked').then(function (value) {
								appService.alertPopup($scope.validationTitle, value, null);
							});
							return false;
						}
					}

					//Common validation

					if ($scope.user.email == null || $scope.user.email == "") {
						$translate('validation_invalid_email').then(function (value) {
							appService.alertPopup($scope.validationTitle, value, null);
						});
						return false;
					}
					if (!$scope.user.termsOfUse) {
						$translate('validation_terms_of_service').then(function (value) {
							appService.alertPopup($scope.validationTitle, value, null);
						});
						return false;
					}

					return true;
				}

				/** */
				$scope.openCamera = function () {
					multimediaService.openCamera()
						.then(function (imageURI) {
							$scope.user.imageFile = imageURI;
						}, function (err) {
							//alert('err=' + err);
						});
				};


				$scope.openPopover = function ($event) {
					$scope.popover.show($event);
				};
				$scope.closePopover = function () {
					$scope.popover.hide();
				};

				$scope.facebookRegistration = function () {
					$cordovaFacebook.login(["public_profile", "email"])
						.then(function (success) {
							$cordovaFacebook.api(success.authResponse.userID + "/?fields=id,name,email,picture{url}", [])
								.then(function (result) {
									$scope.imageFileFB = "https://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large";
									$state.go("app.fbSignUpConfirm", {
										fbid: result.id,
										userName: result.name,
										fullName: result.name,
										email: result.email,
										thumbnail: result.picture.data.url,
										picture: $scope.imageFileFB
									});
								});
						}, function (error) {
							// closed dialog eror handling
							if (error.errorMessage.indexOf("cancelled dialog") == -1) {
								appService.alertPopup("", error.errorMessage);
							}
						})
				};
			}]);
})();