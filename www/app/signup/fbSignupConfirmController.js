(function () {
	angular.module("LogligApp.controllers")
		.controller("fbSignupConfirmCtrl", ["appService", "$scope", "$translate", "$http", "$ionicPopup", "$location", "$state", "userManagmentService", "leaguesService", "$ionicModal", "$cordovaToast", "multimediaService", "$ionicPopover",
			function (appService, $scope, $translate, $http, $ionicPopup, $location, $state, userManagmentService, leaguesService, $ionicModal, $cordovaToast, multimediaService, $ionicPopover) {

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

				$scope.user = {
					type: USER_TYPE_GUEST,
					id: '',
					personalId: '',
					username: '',
					fullName: '',
					email: '', // + '@test.com',
					password: '', //'test123',
					passwordConfirmation: '', //'test123',
					imageFile: '',
					imageFileFB: '',
					termsOfUse: false, //true,
					teams: []
				};

				//"/fbSignUpConfirm/:fbid?userName&fullName&email&thumbnail&picture",
				$scope.user.id = $state.params.fbid;
				$scope.user.username = $state.params.userName;
				$scope.user.fullName = $state.params.fullName;
				$scope.user.email = $state.params.email;
				$scope.user.imageFile = $state.params.picture;

				/** */
				$scope.registerWorker = function () {
					$scope.user.type = USER_TYPE_WORKER;

					if (!$scope.validationOk(USER_TYPE_WORKER)) {
						return;
					}

					appService.wait(true);
					userManagmentService.registerWorker($scope.user.fullName, $scope.user.personalId, $scope.user.password, $scope.user.email)
						.then(function (response) {
								//Success
								appService.wait(false);
								appService.alertPopup("", "Success", null);
								//$location.path('/app/fan');
							},
							function (res) {
								appService.wait(false);
								appService.alertPopup($scope.errorTitle, res.data.error_description);
							});
				};

				$scope.validationOk = function (userType) {

					if (!$scope.user.teams || $scope.user.teams.length < 1) {
						$translate('validation_teams_checked').then(function (value) {
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

				$scope.facebookLogin = function () {
					$cordovaFacebook.login(["public_profile", "email", "user_friends"])
						.then(function (success) {
							$scope.userId = success.authResponse.userID;
							$scope.imageFileFB = "https://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large";
							$location.path('/app/fbSignupConfirm');
							//alert('' + $scope.userId);
							//$('.facebookImage').prepend('<img src="https://graph.facebook.com/1613116932286806/picture?type=large" />');
							//https://graph.facebook.com/1613116932286806/picture?type=large
						}, function (error) {
							$scope.error = error;
							appService.alertPopup("", error.errorMessage);
						})
				}


				/** */
				$scope.registerFanFB = function () {
					$scope.user.type = USER_TYPE_FAN;

					if (!$scope.validationOk(USER_TYPE_FAN)) {
						return;
					}

					appService.wait(true);
					userManagmentService.registerFanFB($scope.user.username, $scope.user.fullName, $scope.user.email, $scope.user.id, $scope.user.teams, $scope.user.imageFile)
						.then(function (response) {
								userManagmentService.login($scope.user.id, $scope.user.password)
									.then(function (response) {
											userManagmentService.setUserInfo().then(function () {
												appService.wait(false);
												$state.go('app.fan');
											});
										}
										, function (res) {
											$state.go("app.loginWorker");
										});
							},
							function (res) {
								appService.wait(false);
								appService.alertPopup($scope.errorTitle, res.data.Message);
							});
				};


			}]);
})();