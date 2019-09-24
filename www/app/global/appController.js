(function () {
	angular.module("LogligApp.controllers")
		.controller("AppController", ['$rootScope', "$scope", "$ionicHistory", "$state", "$timeout", "$ionicSideMenuDelegate", "appService", "pushRegistrationService", "$translate", 'appUtilsService', '$cordovaPushV5', 'notificationsService', 'authService', 'appUtilsService',
			function ($rootScope, $scope, $ionicHistory, $state, $timeout, $ionicSideMenuDelegate, appService, pushRegistrationService, $translate, util, $cordovaPushV5, notificationsService, authService, appUtilsService) {

				$rootScope.util = util;

				$scope.logOut = function () {

					appService.wait(true);

					$ionicSideMenuDelegate.toggleRight();

					pushRegistrationService.unregisterDevice().then(function (res) {

						localStorage.clear();

						$ionicHistory.nextViewOptions({
							disableBack: true,
							historyRoot: true,
							disableAnimate: true
						});

						$ionicHistory.clearCache();
						$ionicHistory.clearHistory();

						appService.wait(false);
						$state.go('app.loginWorker', {}, {reload: true});

					});
				};

				$scope.toggleMenu = function () {
					if($ionicSideMenuDelegate.isOpenRight()) {
			            $ionicSideMenuDelegate.toggleRight(false);
			        } else {
			            $ionicSideMenuDelegate.toggleRight(true);
			        }
				};

				$scope.getCurrentLanguage = function(){
					return $translate.use()
				};
				$scope.isCurrentLangIsHebrew = function(){
					return $scope.getCurrentLanguage() === 'iw'
				};
				$scope.isCurrentLangIsEnglish = function(){
					return $scope.getCurrentLanguage() === 'en'
				};
				$scope.setLanguage = function(lang){
					$translate.use(lang);
					localStorage.setItem('userLang', lang);
				}

				$scope.isSearchVisible = false;

				$scope.toggleSearchBar = function(){
					$scope.isSearchVisible = !$scope.isSearchVisible;
					if ($('#team-content') != undefined) {
						if ($scope.isSearchVisible)
							$('#team-content').css({top: '140px'});
						else
							$('#team-content').css({top: '105px'});
					}
				}
				
				$scope.$on('$ionicView.beforeLeave', function(){
				    if ($ionicHistory.backView() == undefined)
						$scope.backEnable = false;
					else
						$scope.backEnable = true;
				});

				$scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
					$scope.isSearchVisible = false;
				});

				$scope.showMyProfile = function() {
					$ionicSideMenuDelegate.toggleRight();
					var user = util.getCurrentUser();

					if ( util.isLoggedIn() && util.isTeamMgr()  ) {
						util.gotoTeamMgr(user);
                    }
                    else if ( util.isLoggedIn() && util.isClubMgr() ) {
                    	util.gotoClubMgr(user);
                    }
					else if ( util.isLoggedIn() && util.isReferee() ) {
						$state.go('app.referee');
					}
					else if ( util.isLoggedIn() && util.isUnionMgr() ) {
						$state.go('app.union');
					}
					else if ( util.isLoggedIn() && util.isLeagueMgr() && angular.isDefined(user) ) {
						$state.go('app.league', {leagueId: user.UserJobs[0].LeagueId} );
					}
					else if ( util.isLoggedIn() && !util.isReferee() ) {
						$state.go('app.fan');
					}
				}

				// Notification Received
      			$rootScope.$on('$cordovaPushV5:notificationReceived', function ( event, data ) {

					pushRegistrationService.handleNotification(data);

				});

				// triggered every time error occurs
				$rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
					// e.message
					console.log(e);
				});

				$scope.newMessages = 0;
				$scope.newNotes = 0;
				checkNewNotifications();
				$scope.$on('newPushNotification', function () {
					checkNewNotifications()
				});
				function checkNewNotifications() {
					notificationsService.getNotifications().then(function (res) {
					  $scope.newNotes = _.where(res.data, {IsRead: false}).length;
					});
				}
				$scope.user = authService.getUser();
				$scope.$watch('user', function (newvalue) {
					if (typeof(newvalue) !== 'undefined' && $scope.user !== null && $scope.user.Role != null) {				  	
						if ($scope.user.Role == "players" || $scope.user.Role == "workers" ) {					    
							$scope.userImage = appUtilsService.fanImage($scope.user.Image);
						}
						else {
							$scope.userImage = appUtilsService.fanImage($scope.user.Image);
						}
					}
				}, true);

			}]);
})();
