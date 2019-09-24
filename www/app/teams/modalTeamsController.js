(function () {
	angular.module("LogligApp.controllers")
		.controller("modalTeamsCtrl", ["appService", "$scope", "$http", "$ionicPopup", "$location", "userManagmentService", "leaguesService", "$ionicModal", "$cordovaToast", "multimediaService", "$ionicPopover", "$filter",
			function (appService, $scope, $http, $ionicPopup, $location, userManagmentService, leaguesService, $ionicModal, $cordovaToast, multimediaService, $ionicPopover, $filter) {

				var $trans = $filter('translate');

				$scope.title = $trans('title_registration');

				$scope.leageFilter = "Select a leage...";
				$scope.totalChecked = 0;
				$scope.allTeams = [];
				$scope.allLeagues = [];

				//Setting up modal view
				$ionicModal.fromTemplateUrl('app/teams/modal-teams-list.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function (modal) {
					$scope.teamsModal = modal;
				});

				$scope.teamsModalVisible = false;

				/** Copy/clones leagues list and returns a new instance */
				function cloneClubsList(clubs) {
					var arr = [];
					for (var i = 0; i < clubs.length; i++) {
						arr.push({});
						arr[i].ClubId = clubs[i].Id;
						arr[i].Name = clubs[i].Title;
						arr[i].Teams = [];
						for (var j = 0; j < clubs[i].Teams.length; j++) {
							if (clubs[i].Teams && clubs[i].Teams.length > 0) {
								arr[i].Teams.push({
									TeamId: clubs[i].Teams[j].TeamId,
									Title: clubs[i].Teams[j].Title,
                  Logo: clubs[i].Teams[j].Logo,
									ClubId: clubs[i].Id
								});
							}
						}

					}
					return arr;
				}

				/**  */
				function highlightUserLeagues() {
					if ($scope.user.teams) {
						for (var i = 0; i < $scope.user.teams.length; i++) {
							highlightLeague($scope.user.teams[i]);
						}
					}
				}

				/** */
				function highlightLeague(teamInLeague) {
					appService.wait(true);
					if ($scope.allLeagues && $scope.allLeaguesAndTeams) {
						for (var i = 0; i < $scope.allLeagues.length; i++) {
							var j = getTeamIndexInLeague(teamInLeague, $scope.allLeaguesAndTeams[i]);
							if (j > -1) {
								//Team is found in league, means we need to highlight league
								if ($scope.allLeagues[i].Team) {
									$scope.allLeagues[i].Team[j].checked = true;
								}
								$scope.allLeagues[i].checked = true;
							}
						}
					}
					appService.wait(false);
				}

				/** */
				function highlightTeamsInLeagueInUserList(league) {
					if (!$scope.user.teams) return;

					appService.wait(true);
					if (league && league.Teams) {
						for (var i = 0; i < league.Teams.length; i++) {
							if (isTeamInUserList(league.Teams[i])) {
								league.Teams[i].checked = true;
							}
						}
					}
					appService.wait(false);
				}

				/** */
				function isTeamInUserList(team) {
					if (!$scope.user.teams) return false;
					for (var i = 0; i < $scope.user.teams.length; i++) {
						if ($scope.user.teams[i].TeamId == team.TeamId) {
							return true;
						}
					}
					return false;
				}

				/** */
				function getTeamIndexInLeague(team, league) {
					if (league && team && league.Teams) {
						for (var i = 0; i < league.Teams.length; i++) {
							if (league.Teams[i].TeamId == team.TeamId) {
								return i;
							}
						}
					}

					return -1;
				}

				/** */
				$scope.loadLeaguesList = function () {
					$scope.progress = true;

					leaguesService.getTeams()
						.then(function (response) {
								//$scope.allTeams = response.data;

								$scope.allLeaguesAndTeams = cloneClubsList(response.data);

								//Empty all teams and get teams list only on demand
								for (var i = 0; i < response.data.length; i++) {
									response.data[i].Teams = null;
								}

								$scope.allClubs = response.data;

								highlightUserLeagues(); //Highligh/check leagues and teams previously checked by the user

								$scope.progress = false;
								if ($scope.teamsModalVisible) {
									appService.wait(false);
								}
							}
							, function (response) {
							});
				}

				/** */
				$scope.loadTeamsList = function (club) {
					for (var i = 0; i < $scope.allClubs.length; i++) {
						if ($scope.allClubs[i].Id == club.Id) {
							$scope.allClubs[i].Teams = $scope.allLeaguesAndTeams[i].Teams;
							if (club.checked) {
								highlightTeamsInLeagueInUserList(club);
							}
						}
					}
				}

				//Group collapse
				$scope.toggleGroup = function (group) {
					if ($scope.isGroupShown(group)) {
						//Collapse
						$scope.shownGroup = null;
					} else {
						//Expande
						$scope.loadTeamsList(group);
						$scope.shownGroup = group;
					}
				};
				$scope.isGroupShown = function (group) {
					return $scope.shownGroup === group;
				};

				/** */
				$scope.selectTeam = function (team, league) {
					if($scope.user.Role != 'players'){
						team.checked = !team.checked;

						if (team.checked && $scope.totalChecked >= MAX_TEAM_SELECTION) {
							team.checked = false;
							appService.alertPopup($trans('text_error'), $trans('validation_teams_limit'), null);

						} else if (!team.checked) {
							$scope.totalChecked--;
						} else {
							$scope.totalChecked++;
						}

						if (team.checked) {
							console.log($scope.user);
							addTeamToArray($scope.user.teams, team);
						} else {
							removeTeamFromArray($scope.user.teams, team);
						}

						//Check / Uncheck league
						league.checked = false;
						for (var i = 0; i < league.Teams.length; i++) {
							if (league.Teams[i].checked) {
								league.checked = true;
								break;
							}
						}
					}
				}

				/** Removes first instance of team in array */
				function removeTeamFromArray(arr, team) {
					if (!arr) return;
					var length = arr.length;
					for (var i = 0; i < length; i++) {
						if (arr[i].TeamId == team.TeamId) {
							arr.splice(i, 1);
							return;
						}
					}
				}

				/** */
				function addTeamToArray(arr, team) {
					console.log(arr);
					removeTeamFromArray(arr, team); //To make sure we don't get duplicate values
					try {
						arr.push(team);
					}
					catch (x) {
						alert(x);
					}
				}

				/** */
				$scope.confirmTeamsSelection = function () {
					/*
					 $scope.user.teams = [];

					 var length = $scope.allLeagues.length;
					 for (var i = 0; i < length; i++) {
					 if ($scope.allLeagues[i].Teams) {
					 var length2 = $scope.allLeagues[i].Teams.length;
					 for (var j = 0; j < length2; j++) {
					 if ($scope.allLeagues[i].Teams[j].checked) {
					 $scope.allLeagues[i].Teams[j].League = $scope.allLeagues[i];
					 $scope.user.teams.push($scope.allLeagues[i].Teams[j]);
					 }
					 }
					 }
					 }
					 */

					$scope.closeTeamsModal();
				};

				/** */
				$scope.formatByName = function (arr) {
					var s = '';
					for (var i = 0; i < arr.length; i++) {
						if (s != '') s += ", ";
						s += arr[i].Title;
					}
					return s;
				};

				/** */
				$scope.openTeamsModal = function () {
					$scope.user.teams = ($scope.user.Teams|| []);
					$scope.loadLeaguesList();
					if ($scope.progress) {
						appService.wait(true);
					}
					$scope.teamsModal.show();
					$scope.teamsModalVisible = true;
				};

				/** */
				$scope.closeTeamsModal = function () {
					$scope.teamsModal.hide();
					$scope.teamsModalVisible = false;
				};

				/** */
				$scope.$on('$destroy', function () {
					try{
						$scope.teamsModal.remove();
						$scope.popover.remove();
					} catch (error) {
						console.log(error);
					}

				});

				/** */
				$scope.$on('teamsModal.hidden', function () {
					$scope.teamsModalVisible = false;
					//alert('Modal is hidden');
				});

				/** */
				$scope.$on('teamsModal.removed', function () {
					//alert('Modal is removed');
				});


				$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
					//alert("From: " + fromState.name + "\nTo: " + toState.name );
					if ($scope.teamsModalVisible) {
						$scope.closeTeamsModal();
						event.preventDefault();
						event.stopPropagation();
						//$state.go('app.signupFan');
					}
				});


			}]);
})();
