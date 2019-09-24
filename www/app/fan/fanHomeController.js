(function () {
	angular.module("LogligApp.controllers")
		.controller("fanHomeCtrl", ["$scope", "appService", "$state", "authService", "fanManageService", "playerService", "notificationsService", "$http",
			function ($scope, appService, $state, authService, fanManageService, playerService, notificationsService, $http) {

				var user = authService.getUser();
				$scope.user = user;
				$scope.game = null;
				$scope.myName = localStorage.getItem('userInfo');
				$scope.myName = JSON.parse($scope.myName).UserName;
				$scope.isloading = true;
				$scope.isfirst = true;
				for (var i in user.Teams) {
					notificationsService.getGameSchedule(user.Teams[i].TeamId, user.Teams[i].LeagueId)
						.then(function(res){
							for (var ii in res.data) {
								var txReminder = "Tomorrow between " + res.data[ii].HomeTeam + " and " + res.data[ii].GuestTeam + " game starts.";
								notificationsService.setReminder(res.data[ii].CycleId, res.data[ii].StartDate, txReminder);
							}
						})
				}

				$scope.currTeamId = 0;
				$scope.teamChanged = function (team) {
					appService.wait(true);
					$scope.currTeamId = team.TeamId;
					var leagueId = team.LeagueId;
					if(leagueId == undefined) leagueId = 0;
					$state.params.leagueId = leagueId;

					var clubTeam = team;

					if( team.ClubId == 0) {
						for (var i in user.Teams) {
							if(user.Teams[i].ClubId > 0) {
								clubTeam = user.Teams[i];
								break;
							}
						}
					}
					// fanManageService.getClubInfo(clubTeam).then(function (res) {
					// 	if(res.data.id > 0)
					// 		$scope.clubInfos = res.data;
					// 		console.log("checkme"+ JSON.stringify(user));
					// 		console.log("checkmeclubteam"+ JSON.stringify(res.data));
					// });
					fanManageService.getClubInfoByUserId(user.Id).then(function (res) {
							if(res.data.length> 0)
							$scope.clubInfos = res.data;
					});

					$scope.team = team;
					if(team.IsTrainingTeam == true)
					{
						$scope.isloading = true;
					}
					else if(team.IsTrainingTeam == false)
					{
						$scope.isloading = false;
					}
					if($scope.isloading == true)
					{
						fanManageService.getGameDataTennis(team).then(function (res) {
							if (res.data != null) {
								appService.wait(true);
								$scope.game = res.data.NextGame;
								$scope.lastGame = res.data.LastGame;
											var lastgame = res.data.LastGames;
											var nextgame = res.data.NextGames;
											$http({
												method: 'GET',
												url: BASE_API_URL + '/v2/get-last-event.aspx?leagueid=' + leagueId
											}).then(function successCallback(response) {appService.wait(true);
												appService.wait(false);
												//Event GAME LIST MERGE
												var arrLast = [];
												if (lastgame != null) {
																					// insert game list
													for (var i = 0; i < lastgame.length; i++) {
															//lastgame[i].gameType = $scope.game.gameType;
															var obj_game = { id: i, type: 'game', trueID: lastgame[i].GameId, dateOrder: lastgame[i].StartDate, item: lastgame[i] };
															arrLast.push(obj_game);
													}
												}
												if (response.data != null) {
													var obj = response.data;
	
													//insert event list
													for (var i = 0; i < obj.length; i++) {
															var obj_event = {
																id: (i + obj.length),
																type: 'event',
																trueID: obj[i].id,
																dateOrder: obj[i].date ,
																title: obj[i].title,
																place: obj[i].place,
															};
													arrLast.push(obj_event);
													}
												}
												$scope.lastGames = arrLast;
											}, function errorCallback(response) {
											});		
											//start get next event
											$http({
												method: 'GET',
												url: BASE_API_URL + '/v2/get-next-event.aspx?leagueid=' + leagueId
											}).then(function successCallback(response) {
												var arr = [];
													//Event GAME LIST MERGE
													if (nextgame != null) {
																					// insert game list
														for (var i = 0; i < nextgame.length; i++)
														{
																//nextgame[i].gameType = $scope.game.gameType;
																var obj_game = { id: i, type: 'game', trueID: nextgame[i].GameId, dateOrder: nextgame[i].StartDate, item: nextgame[i] };
																arr.push(obj_game);
														}
													}
	
	
													if (response.data != null) {
														var obj = response.data;
	
														//insert event list
														for (var i = 0; i < obj.length; i++) {
															var obj_event = {
																id: (i + obj.length),
																type: 'event',
																trueID: obj[i].id,
																dateOrder: obj[i].date ,
																title: obj[i].title,
																place: obj[i].place,
															};
															arr.push(obj_event);
														}
	
													}
													$scope.nextGames = arr;
													if($scope.nextGames&& $scope.nextGames.length>0){
														$scope.gamesTab = 0;
													}
													else{
														$scope.gamesTab = 1
													}
												}, function errorCallback(response) {
												});
											// end get next event
	
	
											gameCycles = res.data.GameCycles;
											if (gameCycles) {
												$scope.arrLenCecles = gameCycles.length;
												var cycleNum = gameCycles[gameCycles.length - 1];
												$scope.cycleNumber = $scope.game!=null?$scope.game.CycleNumber:0;
												currCycle = gameCycles.indexOf(cycleNum);
												$scope.indexPossition = currCycle;
											}
											$scope.gamesTab = 0;
								
							}
							if(user.Role != "players")
								appService.wait(false);
						}, function (err) {
							if(user.Role != "players")
								appService.wait(false);
										console.log(err);
								});
					}
					else{
						fanManageService.getGameData(team).then(function (res) {
							if (res.data != null) {
								appService.wait(true);
								$scope.game = res.data.NextGame;
								console.log("checkmegametype"+$scope.game);
								$scope.lastGame = res.data.LastGame;
											var lastgame = res.data.LastGames;
											var nextgame = res.data.NextGames;
											$http({
												method: 'GET',
												url: BASE_API_URL + '/v2/get-last-event.aspx?leagueid=' + leagueId
											}).then(function successCallback(response) {appService.wait(true);
												appService.wait(false);
												//Event GAME LIST MERGE
												var arrLast = [];
												if (lastgame != null) {
																					// insert game list
													for (var i = 0; i < lastgame.length; i++) {
															//lastgame[i].gameType = $scope.game.gameType;
															var obj_game = { id: i, type: 'game', trueID: lastgame[i].GameId, dateOrder: lastgame[i].StartDate, item: lastgame[i] };
															arrLast.push(obj_game);
													}
												}
												if (response.data != null) {
													var obj = response.data;
	
													//insert event list
													for (var i = 0; i < obj.length; i++) {
															var obj_event = {
																id: (i + obj.length),
																type: 'event',
																trueID: obj[i].id,
																dateOrder: obj[i].date ,
																title: obj[i].title,
																place: obj[i].place,
															};
													arrLast.push(obj_event);
													}
												}
												$scope.lastGames = arrLast;
											}, function errorCallback(response) {
											});		
											//start get next event
											$http({
												method: 'GET',
												url: BASE_API_URL + '/v2/get-next-event.aspx?leagueid=' + leagueId
											}).then(function successCallback(response) {
												var arr = [];
													//Event GAME LIST MERGE
													if (nextgame != null) {
																					// insert game list
														for (var i = 0; i < nextgame.length; i++)
														{
																//nextgame[i].gameType = $scope.game.gameType;
																var obj_game = { id: i, type: 'game', trueID: nextgame[i].GameId, dateOrder: nextgame[i].StartDate, item: nextgame[i] };
																arr.push(obj_game);
														}
													}
	
	
													if (response.data != null) {
														var obj = response.data;
	
														//insert event list
														for (var i = 0; i < obj.length; i++) {
															var obj_event = {
																id: (i + obj.length),
																type: 'event',
																trueID: obj[i].id,
																dateOrder: obj[i].date ,
																title: obj[i].title,
																place: obj[i].place,
															};
															arr.push(obj_event);
														}
	
													}
													$scope.nextGames = arr;
													if($scope.nextGames&& $scope.nextGames.length>0){
														$scope.gamesTab = 0;
													}
													else{
														$scope.gamesTab = 1
													}
												}, function errorCallback(response) {
												});
											// end get next event
	
	
											gameCycles = res.data.GameCycles;
											if (gameCycles) {
												$scope.arrLenCecles = gameCycles.length;
												var cycleNum = gameCycles[gameCycles.length - 1];
												$scope.cycleNumber = $scope.game!=null?$scope.game.CycleNumber:0;
												currCycle = gameCycles.indexOf(cycleNum);
												$scope.indexPossition = currCycle;
											}
											$scope.gamesTab = 0;
								
							}
							if(user.Role != "players")
								appService.wait(false);
						}, function (err) {
							if(user.Role != "players")
								appService.wait(false);
										console.log(err);
								});
					}
					$scope.isloading = false;
					$scope.isfirst = false;
					/** remove Cheng Li. no need
					if (user.Role == "players") {
						if( team.LeagueId > 0) {
							playerService.getRankedTeams(team.LeagueId, team.TeamId).then(function (res) {
								$scope.rankedTeams = res.data;
							}, function (err) {
					          console.log(err);
		  					  appService.wait(false);
					        });
						}
					*/
					// get archievements for player
					if (user.Role == "players") {
						//if( $scope.playerArchievements == null ) 
						{
							appService.wait(true);
							fanManageService.getArchievements(team).then(function (res) {
								$scope.playerArchievements = res.data;
								$scope.playerRankPoint = null;
								$scope.tennisLeagueGameModel = null;

								if( $scope.playerArchievements != null && $scope.playerArchievements.tennisRankModel != null) {
									$scope.playerRankPoints = $scope.playerArchievements.tennisRankModel;
								}
								if( $scope.playerArchievements != null && $scope.playerArchievements.tennisLeagueGameModel != null) {
									$scope.tennisLeagueGameModel = $scope.playerArchievements.tennisLeagueGameModel;
								}
							  appService.wait(false);

							}, function (err) {
					          console.log(err);
          					  appService.wait(false);
					        });
						}
					}
				}
				
				$scope.$watch('game.IsGoing',function(newvalue, oldvalue){
					if(typeof(newvalue)!== 'undefined' && typeof(oldvalue) !== 'undefined' && newvalue !== oldvalue && $scope.team != undefined){
						$scope.teamChanged($scope.team);
					}
				});
				
				notificationsService.getNotifications().then(function (res) {
					if (res.data != null) {
						if (res.data.lenth > 0) {
							var msg = res.data[0].Message;
							$scope.messageFirst = res.data[0];
							if (!msg.IsRead) {
								$scope.message = msg;
							}
						}
					}
				});
				//fanManageService.getLastMessage().then(function (res) {
				//    if (res.data != null) {
				//        if (!fanManageService.isMessageRead(res.data.id)) {
				//            $scope.message = res.data;
				//        }
				//    }
				//});

				$scope.hideMessages = function () {
					notificationsService.setNotificationRead($scope.messageFirst);
					//fanManageService.setMessageRead($scope.message.id);
					$scope.message = null;
				}
			
				appService.wait(false);
			}]);

})();