(function () {
	angular.module("LogligApp.controllers")
    .controller("teamCtrl", ["$scope", "$state", "$ionicScrollDelegate", "$ionicSlideBoxDelegate", "$timeout", "appService", "teamsService", "leaguesService", "$location", "$ionicPopover", "authService", "$http", "multimediaService", "$q", "$cordovaFileTransfer", "unionService", "$translate",
      function ($scope, $state, $ionicScrollDelegate, $ionicSlideBoxDelegate, $timeout, appService, teamsService, leaguesService, $location, $ionicPopover, authService, $http, multimediaService, $q, $cordovaFileTransfer, unionService, $translate) {

				var leagueId = $state.params.leagueId;
				$scope.lId = leagueId;
				var teamId = $state.params.teamId;

				var gameCycles = [];
				var currCycle = 0;
				var currGroupIndex = 0;
				var gamesIndex = -1;

				var teamsHandler = $ionicSlideBoxDelegate.$getByHandle('games-viewer');
				var fansHandler = $ionicSlideBoxDelegate.$getByHandle('fans-viewer');
				var galleryHandler = $ionicSlideBoxDelegate.$getByHandle('gallery-viewer');
				$scope.navIndex = 0;
				$scope.gamesTab = 0;
				$scope.user = authService.getUser();
				$scope.uploadableToGallery = false;

				$scope.galleryItems = [];

				switch ($scope.user.Role) {
				  case "fans":
				  case "players":
				      for (var i in $scope.user.Teams) {
				          if (teamId == $scope.user.Teams[i].TeamId) {
				              $scope.uploadableToGallery = true;
				              break;
				          }
				      }
				      break;
				}

				if ($scope.util.isTeamMgr()) {
				  for (var i in $scope.user.Teams) {
				      if (teamId == $scope.user.Teams[i].TeamId) {
				          $scope.uploadableToGallery = true;
				          break;
				      }
				  }
				}

				$scope.isUplaodableToGallery = false;

				$scope.myName = localStorage.getItem('userInfo');
				if ($scope.myName != null) {
					$scope.myName = JSON.parse($scope.myName).UserName;
				}
				$scope.setLastGames = function () {
					$scope.gamesTab = 1;
				}

				$scope.setNextGames = function () {
					$scope.gamesTab = 0;
				}

				$scope.showSlide = function (num) {

					$scope.navIndex = num;
					$ionicScrollDelegate.scrollTop();

		            if (fansHandler._instances.length) {
		                fansHandler.update();
		            }

		            if (galleryHandler._instances.length) {
		                galleryHandler.update();
		            }

					if (num == 2 && teamsHandler._instances.length) {

						teamsHandler.update();

						if (gamesIndex > -1) {
							$timeout(function () {
								teamsHandler.slide(gamesIndex);
							}, 300);
						}
					}
				};

        $scope.openbanner = function(banner) {
          unionService.increaseBannerVisit(banner.BannerId);
          window.open(banner.LinkUrl, '_system');
        };
        // var bannersHandler = $ionicSlideBoxDelegate.$getByHandle('banners-viewer');

				$scope.gamesSlideChanged = function (num) {
					var game = $scope.allGames[num];

					$scope.cycleNumber = game.CycleNumber;

					leaguesService.getGameFans(game.GameId).then(function (res) {
						console.log('Game Fans:'+JSON.stringify(res,null,2));
						$scope.fansCount = res.data.length;
						$scope.fansArr = $scope.util.getPagedList(res.data, 5);
						$scope.startPage = $scope.fansArr.length - 1;

						if (fansHandler._instances.length) {
							fansHandler.update();
						}
					});
				};

				$scope.showCycle = function (dir) {

					if (dir == 'next') {
						teamsHandler.previous();
						$scope.indexPossition++;
					}
					else {
						teamsHandler.next();
						$scope.indexPossition--;
					}
				};

				$scope.getImageGallery = function(teamId) {
          teamsService.getTeamImageGallery(teamId).then(function (res) {
            $scope.galleryItems = [];
            for (var iii in res.data) {
              res.data[iii].src = $scope.util.teamImage(res.data[iii].url);
              res.data[iii].type = "team";
              res.data[iii].ParentId = teamId;
              res.data[iii].ParentName = $scope.team.Title;
              res.data[iii].sub = res.data[iii].User.Name + '  ' + new Date(res.data[iii].Created).toLocaleString('en-US');
              res.data[iii].deletable = res.data[iii].url.indexOf($scope.user.Id + "__") !== -1 ? true : false;
              var item = {};
              item = Object.assign({}, res.data[iii]);
              $scope.galleryItems.push(item);
            }
            $scope.imageGallery = $scope.util.getPagedList(res.data, 3);

            if (galleryHandler._instances.length) {
                galleryHandler.update();
              $ionicSlideBoxDelegate.slide(0)
            }

          }, function (res) {
              // appService.alertPopup("Err during get image gallery data.");
          });
        };

        $scope.refreshCallback = function () {
          $scope.getImageGallery(teamId);
        };

				$scope.bindTeamData = function () {
					appService.wait(true);
					console.log('BIND TEAM');
					teamsService.getTeamData(teamId, leagueId).then(function (res) {
						if (res.data != null) {
							$scope.team = res.data.TeamInfo;
							$scope.leagues = {
								options: res.data.Leagues,
								leagueDefault: {Id: $scope.team.LeagueId, Title: $scope.team.League}
							};
							$scope.playersList = res.data.Players;
							$scope.jobsList = res.data.Jobs;
							$scope.allGames = res.data.LastGames
								.concat(res.data.NextGames);
							$scope.nextGames = res.data.NextGames;
							$scope.lastGames = res.data.LastGames;

							console.log('all games:' + JSON.stringify($scope.allGames,null,2));
							// start get last event
							var lastgame = res.data.LastGames;
							var nextgame = res.data.NextGames;
							$http({
							  method: 'GET',
							  url: BASE_API_URL + '/v2/get-last-event.aspx?leagueid=' + leagueId
							}).then(function successCallback(response) {
								var arrLast = [];
							    //Event GAME LIST MERGE
							    if (lastgame != null) {
                                    // insert game list
								    for (var i = 0; i < lastgame.length; i++)
								    {
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
							// end get last event
							//start get next event
							$http({
							  method: 'GET',
							  url: BASE_API_URL + '/v2/get-next-event.aspx?leagueid=' + leagueId
							}).then(function successCallback(response) {
								arr = [];
							    //Event GAME LIST MERGE
							    if (nextgame != null) {
	                                // insert game list
								    for (var i = 0; i < nextgame.length; i++)
								    {
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
							  }, function errorCallback(response) {
							  });
							// end get next event
							angular.forEach($scope.allGames, function (game, index) {
								if(game.LeagueId == 0){
									game.LeagueId = $scope.team.LeagueId;
								}
							});
							gameCycles = res.data.GameCycles;
							if (gameCycles) {
								$scope.arrLenCecles = gameCycles.length;
							}
							if (res.data.Fans) {
								$scope.teamFans = res.data.Fans;
								runFansSwitch(0);
							}

							if (res.data.Players) {
								$scope.players = res.data.Players;
								runPlayersSwitch(0);
							}

							if (res.data.NextGame) {

								$scope.game = res.data.NextGame;

								var cycleNum = $scope.game.CycleNumber;

								$scope.cycleNumber = cycleNum;
								currCycle = gameCycles.indexOf(cycleNum);
								$scope.indexPossition = currCycle;
								setGamesPosition(currCycle);
							}
							$scope.results = res.data.LeagueTableStages;
							$scope.leagueTableStages = res.data.LeagueTableStages;
				            if (res.data.LeagueTableStages) {
				              // get last stage
				              var len = res.data.LeagueTableStages.length;
				              var stage = res.data.LeagueTableStages[len - 1];

				              // get groups
				              if (res.data.LeagueTableStages.length > 0) {
				                $scope.topGroups = stage.Groups.reverse();
				                $scope.currGroupIndex = stage.Groups.length - 1;

				                $scope.currGroup = stage.Groups[$scope.currGroupIndex];
				              }
				            }		
						}

            $scope.getImageGallery(teamId);

            unionService.getBanners().then(function (result, error) {
              $scope.banner = result.data[0];
              // if (bannersHandler._instances.length) {
              //   bannersHandler.update();
              // }
              appService.wait(false);
            });

					}, function (res) {
						appService.wait(false);
						appService.alertPopup("הודעת מערכת", "לא נמצאו נתונים");
					});
				};

				$scope.onChangeLigue = function (Id) {
					$state.go('app.team', {teamId: $scope.team.TeamId, leagueId: Id});
				};
				//// init page view
				$scope.bindTeamData();

				$scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
					$scope.bindTeamData();
				});

				function setGamesPosition(cycleNum) {
					angular.forEach($scope.allGames, function (game, index) {
						if ((game.CycleNumber) == cycleNum) {
							gamesIndex = index;
							return;
						}
					});
				}

				function runPlayersSwitch(index) {

					var len = $scope.players.length;
					$scope.topPlayer = $scope.players[index];

					if (len < 2) {
						return
					}

					index = (index < len - 1) ? index + 1 : 0;

					$timeout(function () {
						runPlayersSwitch(index);
					}, 4000);
				}

				function runFansSwitch(index) {

					var len = $scope.teamFans.length;
					$scope.topFan = $scope.teamFans[index];

					if (len < 2) {
						return
					}

					index = (index < len - 1) ? index + 1 : 0;

					$timeout(function () {
						runFansSwitch(index);
					}, 4000);
				}

				// $scope.popover = $ionicPopover.fromTemplateUrl('league-popover.html', {
				// 	scope: $scope
				// }).then(function (popover) {
				// 	$scope.popover = popover;
				// 	$scope.openPopover = function ($event) {
				// 		$scope.popover.show($event);
				// 	};
				// });

        $ionicPopover.fromTemplateUrl('dropdown.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.camerapopover = popover;
        });

        $scope.openCameraPopover = function($event) {
            $scope.camerapopover.show($event);
				};

        $scope.openGallery = function () {
          $scope.camerapopover.hide();
          multimediaService.getImageFromGallery()
            .then(function (imageURI) {
              appService.alertConfirmationPopup($translate.instant("upload_gallery_title"), $translate.instant("upload_gallery_message"), function (approve) {
                if (approve) {
                  $scope.uploadImage(imageURI);
                }
              });
            }, function (err) {
              // alert('err=' + JSON.stringify(err));
            });
        };

        $scope.openCamera = function () {
          $scope.camerapopover.hide();
          multimediaService.openCamera()
            .then(function (imageURI) {
              appService.alertConfirmationPopup($translate.instant("upload_gallery_title"), $translate.instant("upload_gallery_message"), function (approve) {
                if (approve) {
                  $scope.uploadImage(imageURI);
                }
              });
            }, function (err) {
              // appService.alertPopup('Error', err.message, null);
            });
        };

        $scope.uploadImage = function(imageURI) {
          var deffered = $q.defer();
          var token = JSON.parse(localStorage.getItem(TOKEN_KEY));
          var options = {
            fileKey: "avatar",
            fileName: imageURI.substr(imageURI.lastIndexOf('/')+1),
            chunkedMode: false,
            mimeType: 'image/jpeg',
            headers: {
                Authorization: token.token_type + ' ' + token.access_token
            }
          };
          console.log('options:'+options);
          $cordovaFileTransfer.upload(API_UPLOAD_IMAGE_GALLERY + "team/" + $scope.team.TeamId, imageURI, options)
            .then(function (result) {
              appService.alertPopup($translate.instant("photo_upload_successful"));
              $scope.getImageGallery(teamId);
              appService.wait(false);
              deffered.resolve(result);
            }, function (error) {
              $scope.mdaType = 0;
              console.log('err:'+error);
              appService.wait(false);
              deffered.reject(error);
            }, function (progress) {
            });
        };


		$scope.$watch('game.IsGoing',function(newvalue, oldvalue) {
			if(typeof(newvalue)!== 'undefined' && typeof(oldvalue) !== 'undefined' && newvalue !== oldvalue){
				$scope.bindTeamData();
			}
		});

	}]);
})();
