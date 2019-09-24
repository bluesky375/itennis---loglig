(function () {
	angular.module("LogligApp.controllers")
		.controller("leaguesCtrl", ["appService", "$scope", "leaguesService", "$timeout",
			function (appService, $scope, leaguesService, $timeout) {

				appService.wait(true);

				leaguesService.getLeagues().then(function (res) {

					$scope.leagues = res.data;
					appService.wait(false);
				}, function (err) {
                	console.log(err);
                	appService.wait(false);
            	});
			}]);
})();