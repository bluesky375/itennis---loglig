(function () {
	angular.module("LogligApp.controllers")
		.controller("teamsCtrl", ["$scope", "$http", "$ionicPopup", "$location", "leaguesService", "$ionicPlatform", "$ionicLoading", "$filter",
			function ($scope, $http, $ionicPopup, $location, leaguesService, $ionicPlatform, $ionicLoading, $filter) {

				var $trans = $filter('translate');

				//Show loading
				$ionicLoading.show({
					template: 'Loading...'
				});

				$ionicPlatform.ready(function () {
					leaguesService.getTeams()
						.then(function (response) {
								$scope.allTeams = response.data;
								$scope.progress = false;
								$ionicLoading.hide();
							}
							, function (response) {
							});
				});

				$scope.totalChecked = 0;
				$scope.progress = true;

				$scope.select = function (team) {
					if (team.checked && $scope.totalChecked >= MAX_TEAM_SELECTION) {
						team.checked = false;
						appService.alertPopup($trans('text_error'), $trans('validation_teams_limit'), null);
					} else if (!team.checked) {
						$scope.totalChecked--;
					} else {
						$scope.totalChecked++;
					}
				}
			}]);
})();