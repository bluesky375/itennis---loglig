(function () {
	angular.module("LogligApp.controllers")
		.controller("clubTeamCtrl", ["$scope", "$state", "$ionicScrollDelegate", "$ionicSlideBoxDelegate", "$timeout", "appService", "teamsService", "clubsService", "$location", "$ionicPopover", "authService","$http","appUtilsService", "unionService", "$translate", "multimediaService", "$q", "$cordovaFileTransfer",
			function ($scope, $state, $ionicScrollDelegate, $ionicSlideBoxDelegate, $timeout, appService, teamsService, clubsService, $location, $ionicPopover, authService, $http, util, unionService, $translate, multimediaService, $q, $cordovaFileTransfer) {

				var clubId = $state.params.clubId;
				var teamId = $state.params.teamId;	
				$scope.game = null;
				$scope.team = null;

				var gameCycles = [];
				$scope.isClubTeam = true;
				$scope.clubId = clubId;
				$scope.teamId = teamId;
                $scope.isTrainingVisible = false;

                $scope.progressTeam = false;
                $scope.progressTraining = false;

                util.refreshUser();
				var gamesIndex = -1;
				var teamsHandler = $ionicSlideBoxDelegate.$getByHandle('games-viewer');
				var fansHandler = $ionicSlideBoxDelegate.$getByHandle('fans-viewer');
				var trainfansHandler = $ionicSlideBoxDelegate.$getByHandle('trainfans-viewer');
				var galleryHandler = $ionicSlideBoxDelegate.$getByHandle('gallery-viewer');

				$scope.navIndex = 0;
				$scope.gamesTab = 0;
				$scope.trainingTab = 0;
				$scope.user = authService.getUser();
				$scope.myName = localStorage.getItem('userInfo');
				if ($scope.myName != null) {
					$scope.myName = JSON.parse($scope.myName).UserName;
				}


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
				window.open(banner.LinkUrl, '_blank');
				};

				$scope.setLastGames = function () {
					$scope.gamesTab = 1;
				};

				$scope.setNextGames = function () {
					$scope.gamesTab = 0;
				};

				$scope.setLastTrainings = function () {
					$scope.trainingTab = 1;
				};

				$scope.setNextTrainings = function () {
					$scope.trainingTab = 0;
				};

				$scope.showAttendance = function(teamId, trainingId) {
					if(util.isClubMgr() || util.isDepartmentMgr() || util.isTeamMgr()) {
						if ($scope.isTrainingVisible)
							$state.go('app.trainingattendance', {teamId: teamId, trainingId: trainingId});
					}
				};

				$scope.showSlide = function (num) {

					$scope.navIndex = num;
					$ionicScrollDelegate.scrollTop();

					if (fansHandler._instances.length) {
						fansHandler.update();
					}
					if (trainfansHandler._instances.length) {
						trainfansHandler.update();
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

				$scope.gamesSlideChanged = function (num) {
					var game = $scope.allGames[num];

					$scope.cycleNumber = game.CycleNumber;
                    clubsService.getGameFans(game.Id).then(function (res) {
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

                $scope.bindTeam = function () {
                    $scope.progressTeam = true;
                    appService.wait(true);
                    teamsService.getClubTeamData(teamId, clubId).then(function (res) {
                        if (res.data != null) {
                            $scope.team = res.data;
							$scope.playersList = res.data.Players;
                            $scope.jobsList = res.data.Jobs;
                            $scope.allGames = res.data.LastGames
                                .concat(res.data.NextGames);
							var nextgame = res.data.NextGames;
							if (nextgame&&nextgame.length < 1) {
								$scope.gamesTab = 1;
							  }
                            if (nextgame != null) {
                                $scope.nextGames = [];
                                // insert game list
                                for (var i = 0; i < nextgame.length; i++)
                                {
                                    var obj_game = { id: i, type: 'game', trueID: nextgame[i].GameId, dateOrder: nextgame[i].StartDate, item: nextgame[i] };
                                    $scope.nextGames.push(obj_game);
                                }
                            }

                            var lastGames = res.data.LastGames;
                            if (lastGames != null) {
                                $scope.lastGames = [];
                                // insert game list
                                for (var i = 0; i < lastGames.length; i++)
                                {
                                    var obj_game = { id: i, type: 'game', trueID: lastGames[i].GameId, dateOrder: lastGames[i].StartDate, item: lastGames[i] };
                                    $scope.lastGames.push(obj_game);
                                }
                            }

                            if (res.data.SectionName == "basketball")
                                $scope.standings = res.data.TeamStandings;
							else if (res.data.SectionName == "Soccer") {
								$scope.standings = res.data.TeamStandings;
							} else if (res.data.SectionName == "Tennis") {
								$scope.standings = res.data.TeamStandings;	
							}


                            // console.log('all games:' + JSON.stringify($scope.allGames,null,2));
                            // start get last event
                            $scope.lastGame = res.data.LastGames[res.data.LastGames.length - 1];

                            if (res.data.Fans) {
                                $scope.teamFans = res.data.Fans;
                                runFansSwitch(0);
                            }

                            if (res.data.Players) {
                                $scope.players = res.data.Players;
                                runPlayersSwitch(0);
                            }
                            console.log($scope.allGames);
							gameCycles = $scope.allGames;
                            if (res.data.NextGame) {
                                $scope.game = res.data.NextGame;
								var cycleNum = $scope.game.CycleNumber;
								angular.forEach($scope.allGames, function (game, index) {

									if ((game.StartDate) == res.data.NextGame.StartDate) {
										cycleNum = index;
									}
								});
								$scope.cycleNumber = cycleNum;
								$scope.indexPosition = cycleNum;
								setGamesPosition(cycleNum);
                            }
                        }

	            		$scope.getImageGallery(teamId);
				        unionService.getBanners().then(function (result, error) {
							$scope.banner = result.data[0];
							appService.wait(false);
			            });                    

                        $scope.progressTeam = false;
                        if (!$scope.progressTraining)
                            appService.wait(false);

                    }, function (res) {
                        $scope.progressTeam = false;
                        if (!$scope.progressTraining)
                            appService.wait(false);
                        appService.alertPopup("הודעת מערכת", "לא נמצאו נתונים");
                    });
                };

                $scope.bindTraining = function() {
                    if (!$scope.isTrainingVisible)
                        return;
                    $scope.progressTraining = true;
                    appService.wait(true);
                    teamsService.getTeamTrainingData($scope.teamId).then(function (res) {
                        if (res.data != null) {
                            $scope.prevTrainings = res.data.PrevTrainings;
                            $scope.nextTrainings = res.data.NextTrainings;
                            $scope.trainings = res.data;

                            if (res.data.NextTraining)
                                $scope.training = res.data.NextTraining;

							if (trainfansHandler._instances.length) {
								trainfansHandler.update();
							}
                        }

                        $scope.progressTraining = false;

                        if (!$scope.progressTeam)
                            appService.wait(false);

                    }, function (res) {
                        $scope.progressTraining = false;
                        if (!$scope.progressTeam)
                            appService.wait(false);
                    });
                };



				$scope.bindTeamData = function () {
					console.log('BIND TEAM');
                    $scope.bindTeam();
                    $scope.bindTraining();
				};

				$scope.onChangeLigue = function (Id) {
					$state.go('app.team', {teamId: $scope.team.TeamId, leagueId: Id});
				};

				//// init page view
				$scope.bindTeamData();

                $scope.$watch('game.IsGoing',function(newvalue, oldvalue){
                    if(typeof(newvalue)!== 'undefined' && typeof(oldvalue) !== 'undefined' && newvalue !== oldvalue){
                        $scope.bindTeam();
                    }
                });

				$scope.$watch('training.IsGoing',function(newvalue, oldvalue){
					if(typeof(newvalue)!== 'undefined' && typeof(oldvalue) !== 'undefined' && newvalue !== oldvalue){
						$scope.bindTraining();
					}
				});

				$scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
					$scope.bindTeamData();
				});


				function setGamesPosition(cycleNum) {
					angular.forEach($scope.allGames, function (game, index) {
						if (index == cycleNum) {
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

				$scope.test = function () {
					alert(1);
				}

				$scope.popover = $ionicPopover.fromTemplateUrl('league-popover.html', {
					scope: $scope
				}).then(function (popover) {
					$scope.popover = popover;
					$scope.openPopover = function ($event) {
						$scope.popover.show($event);
					};
				});

                $scope.openTeamfromStanding = function(standing) {
                    $state.go("app.clubteam", ({teamId:standing.Id, clubId: $scope.clubId}));
                };

				$scope.openTeam = function (id) {
					$state.go('app.clubteam', {teamId: id, leagueId: clubId});
				}
				
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
		              console.log(err);
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
		              console.log(err);
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
		                        
			}]);
})();