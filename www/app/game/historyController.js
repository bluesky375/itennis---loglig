(function () {
	angular.module("LogligApp.controllers")
		.controller("historyCtrl", ["appService", "$scope", "$state", "leaguesService",
			function (appService, $scope, $state, leaguesService) {
				appService.wait(true);
				leaguesService.getGame($state.params.gameId, $state.params.gameType).then(function (res) {
					$scope.History = res.data.History;
					appService.wait(false);
				}, function (err) {
		            console.log(err);
		            appService.wait(false);
		        });
			}]);
})();