(function () {
	angular.module("LogligApp.controllers")
		.controller("playerCtrl", ["$scope", "$state", "$ionicPopover","authService", "$ionicSlideBoxDelegate", "$timeout", "appService", "playerService", "$translate", "unionService","appUtilsService",
			function ($scope, $state, $ionicPopover,authService, $ionicSlideBoxDelegate, $timeout, appService, playerService, $translate, unionService,util) {


				appService.wait(true);
				$scope.user = authService.getUser();
				var playerId = $state.params.playerId;//this is userid
				var teamId = 0;
				var ishebrew = $scope.isCurrentLangIsHebrew();
				console.log("checkmeishebrew"+ishebrew);
				var leagueId = $state.params.leagueId;
				$scope.openbanner = function (banner) {
					unionService.increaseBannerVisit(banner.BannerId);
					window.open(banner.LinkUrl, '_system');
				};

				// var bannersHandler = $ionicSlideBoxDelegate.$getByHandle('banners-viewer');

				playerService.getPlayerByIdBoth(playerId, leagueId).then(function (res) {
					$scope.player = res.data;
					$scope.fansArr = $scope.util.getPagedList(res.data.Friends, 5);
					$scope.startPage = $scope.fansArr.length - 1;

					if (res.data.Teams.length > 0) {
						$scope.selectedTeam = res.data.Teams[0];
						$scope.setGames();

					}

					$scope.popover = $ionicPopover.fromTemplateUrl('teams-popover.html', {
						scope: $scope
					}).then(function (popover) {
						$scope.popover = popover;
						$scope.openPopover = function ($event) {
							$scope.popover.show($event);
						};
					});

					unionService.getBanners().then(function (result, error) {
						$scope.banners = result.data;
						if ($scope.banners.length > 0)
							$scope.banner = $scope.banners[0];
						// if (bannersHandler._instances.length) {
						//   bannersHandler.update();
						// }
						appService.wait(false);
					});
				}, function (err) {
					console.log(err);
					appService.wait(false);
				});

				appService.wait(true);
				playerService.getTennisGamesHistoryForPlayer(playerId,teamId,ishebrew).then(function (res) {
					$scope.playerArchievements = res.data;
					$scope.tennisLeagueGameModel = null;

					if ($scope.playerArchievements != null && $scope.playerArchievements.tennisLeagueGameModel != null) {
						$scope.tennisLeagueGameModel = $scope.playerArchievements.tennisLeagueGameModel;
					}
					if( $scope.playerArchievements != null && $scope.playerArchievements.tennisRankModel != null) {
						if($scope.playerArchievements.tennisRankModel.length>0){
							$scope.playerRankPoints = $scope.playerArchievements.tennisRankModel;
						}
					}
					appService.wait(false);
				}, function (err) {
					console.log(err);
					appService.wait(false);
				});

				$scope.slideHasChanged = function (num) {

					$scope.currGameType = num;
				}

				$scope.showSlide = function (dir) {

					if (dir == 'next') {
						$scope.currGameType--;
					}
					else {
						$scope.currGameType++;
					}
				}

				$scope.setGames = function () {
					playerService.getPlayerGames($scope.selectedTeam.TeamId).then(function (res) {
						var gamesArr = [];
						var gamesTypes = [];
						$scope.currGameType = 0;

						if (res.data[0]) {
							$translate('games_next').then(function (val) {
								gamesTypes.push(val);
								gamesArr.push(res.data[0]);
							})
						}

						if (res.data[1]) {
							$translate('games_last').then(function (val) {
								gamesTypes.push(val);
								gamesArr.push(res.data[1]);
							})
						}

						if (res.data[2]) {
							$translate('games_first').then(function (val) {
								gamesTypes.push(val);
								gamesArr.push(res.data[2]);
							})
						}

						$scope.games = gamesArr.reverse();
						$scope.gamesTypes = gamesTypes;	

						$ionicSlideBoxDelegate.update(function () {
							console.log("dd");
						});

						$timeout(function () {
							if (gamesArr.length > 2) {
								$scope.currGameType = 1;
							}
							else {
								$scope.currGameType = gamesArr.length - 1;
							}
						}, 10);

					});
				}


				$scope.teamSelect = function (team) {
					$scope.selectedTeam = team;
					//$scope.setGames();
				}

			}]);

})();
