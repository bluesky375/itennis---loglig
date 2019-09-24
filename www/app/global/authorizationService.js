(function () {
	"use strict";
	angular.module("LogligApp.services").service("authService", ["$state", "$ionicHistory",
		function ($state, $ionicHistory) {

			var authService = {};

			authService.goToLogin = function () {
				$ionicHistory.nextViewOptions({
					disableBack: true,
					historyRoot: true,
					disableAnimate: true
				});

				$ionicHistory.clearHistory();
				$ionicHistory.clearCache();

				$state.go("app.loginWorker");
			};

			authService.isValid = function () {
				// localStorage.removeItem(TOKEN_KEY);
				var token = JSON.parse(localStorage.getItem(TOKEN_KEY));

				if (!token) {
					return false;
				}

				var expireDate = Date.parse(token[".expires"]);
				var now = Date.now();
				return expireDate >= now;
			};

			authService.getUser = function () {
				return JSON.parse(localStorage.getItem(USER_INFO_KEY));
			};

			return authService;

		}]);
})();