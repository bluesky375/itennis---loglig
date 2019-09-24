(function () {
	angular.module("LogligApp.controllers")
		.controller("splashCtrl", ["appService", "$state", "authService", "$timeout", "$rootScope", "$ionicHistory", 'appUtilsService', "pushRegistrationService",
			function (appService, $state, authService, $timeout, $rootScope, $ionicHistory, util, pushRegistrationService) {
				$rootScope.DisableNoteAlert = true;

				$timeout(function () {

					$rootScope.DisableNoteAlert = false;
					$ionicHistory.nextViewOptions({
						disableBack: true,
						historyRoot: true,
						disableAnimate: true
					});

					if ($rootScope.IsNotification) {

						$rootScope.IsNotification = false;
						if ($rootScope.NoteType == "notifications") {
							$state.go("app.notifications");
						}
						else {
							$state.go('app.fan');
						}
					}
					else {
						pushRegistrationService.registration();
						var user = authService.getUser();
						if (authService.isValid()) {

							if ( user.Role == 'fans' || user.Role == 'players') {
								$state.go('app.fan');
							}
							else if (util.isTeamMgr()) {
								util.gotoTeamMgr(user);
			              	}
							else if (util.isClubMgr()) {
								util.gotoClubMgr(user);
			              	}			              	
							else if ( util.isReferee() ) {
								$state.go('app.referee');
							}
							else if ( util.isUnionMgr() ) {
								$state.go('app.union');
							}
							else if ( util.isLeagueMgr() && user.UserJobs[0] && user.UserJobs[0].LeagueId > 0 ) {
								$state.go('app.league', {leagueId: user.UserJobs[0].LeagueId});
							}
							else {
								$state.go('app.referee');
							}

						}
						else {
							// Cheng Li. remove fan for tennid : Assaf
							//$state.go('app.roleChooser');
							$state.go('app.loginWorker');
						}
					}

				}, 7000);

			}]);
})();