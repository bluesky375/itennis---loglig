(function () {
	angular.module("LogligApp.controllers")
		.controller("forgotPasswordCtrl", ["appService", "$scope", "$translate", "$location", "userManagmentService",
			function (appService, $scope, $translate, $location, userManagmentService) {

				$translate('title_forgot_password').then(function (value) {
					$scope.title = value;
				});

				$translate('validation_title_forgot_password').then(function (value) {
					$scope.validationTitle = value;
				});

				$scope.user = {
					email: '',
					userId: ''
				};

				$scope.submitEmail = function () {
					if (!$scope.validationOk()) {
						return;
					}
					var res = userManagmentService.forgotPassword($scope.user.email, $scope.user.userId).then(function () {
						appService.alertPopup($translate.instant('email_sent'), "", function () {
							$location.path('/app/loginWorker');
						});
					}, function (err) {
			            appService.alertPopup($translate.instant('incorrect_email_userid'));
			        });
				}

				$scope.validationOk = function () {
					if ($scope.user.email == null || $scope.user.email == "") {
						$translate('validation_invalid_email').then(function (value) {
							appService.alertPopup($scope.validationTitle, value, null);
						});
						return false;
					}

					if ($scope.user.userId == null || $scope.user.userId == "") {
						$translate('validation_missing_id').then(function (value) {
							appService.alertPopup($scope.validationTitle, value, null);
						});
						return false;
					}

					return true;
				}


			}]);
})();