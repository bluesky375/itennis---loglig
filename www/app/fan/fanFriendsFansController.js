(function () {
	angular.module("LogligApp.controllers")
		.controller("fanFriendsFansCtrl", ["appService", "$scope", "$state", "fanManageService", "authService",
			function (appService, $scope, $state, fanManageService, authService) {

				$scope.friendsAndFansAll = {};
				$scope.navIndex = 0;
				$scope.user = authService.getUser();
				$scope.teamChanged = function (team) {

					$scope.selectedTeam = team;
					$scope.$broadcast('scroll.refreshComplete');
					$scope.setData();
				}

				$scope.setData = function () {

					fanManageService.getFriendsAndFans($scope.selectedTeam).then(function (res) {
						$scope.friendsAndFansAll = res.data;
						$scope.teamFans = $scope.friendsAndFansAll.TeamFans.slice(0, 10);
						$scope.friends = $scope.friendsAndFansAll.Friends.slice(0, 10);
					});
				}

				$scope.showSlide = function (num) {

					$scope.navIndex = num;
					$scope.$broadcast('scroll.refreshComplete');
				};

				$scope.getNextFriends = function () {

					return $scope.friendsAndFansAll.Friends.slice($scope.friends.length, $scope.friends.length + 10);
				};

				$scope.loadMore = function () {

					if ($scope.navIndex == 0) {
						$scope.friends = $scope.friends.concat($scope.getNextFriends());
						if (!$scope.friends.length < $scope.friendsAndFansAll.Friends.length) {
							end0 = true;
						}
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				};

				$scope.getNextFans = function () {
					return $scope.friendsAndFansAll.TeamFans.slice($scope.teamFans.length, $scope.teamFans.length + 10);
				};

				$scope.loadMoreFans = function () {
					if ($scope.navIndex == 1) {
						$scope.teamFans = $scope.teamFans.concat($scope.getNextFans());
						if (!$scope.teamFans.length < $scope.friendsAndFansAll.TeamFans.length) {
							end1 = true;
						}
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				};

				appService.wait(false);

				$scope.$on('unFriendUser', function(ev, args) {					
					var selectedId = args.friendId;

					// splice selected friend from friends list
					for (var i = $scope.friends.length - 1; i >=0; i--) {
						if ($scope.friends[i].Id === selectedId) {
							$scope.friends.splice(i, 1);
						}
					}
				});

			}]);
})();