(function () {
	angular.module("LogligApp.controllers")
		.controller("notificationsCtrl", ["appService", "$scope", "$state", "$timeout", "notificationsService", "authService", "fanManageService",
			function (appService, $scope, $state, $timeout, notificationsService, authService, fanManageService) {

				$scope.user = authService.getUser();
				$scope.init = function () {
					notificationsService.getNotifications().then(function (res) {
						$scope.notifications = res.data;
						notificationsService.setNotificationRead(res.data);

						// get pending friendship request
						fanManageService.getPendingFriendshipRequests()
							.then(function (res) {
								$scope.notifications = angular.extend($scope.notifications, res.data);
								console.log($scope.notifications);
							});
					});
				};

				$scope.init();

				$scope.remove = function (id) {
					notificationsService.removeNotification(id).then(function () {
						$scope.init();
					});
				};

				$scope.removeAll = function () {
					notificationsService.removeAllNotifications($scope.notifications).then(function () {
						$scope.init();
					});
				};

				$scope.$on('newPushNotification', function () {
					$scope.init();
				});

				$scope.friendApprove = function (friendId) {
					fanManageService.approveFriendship(friendId).then(function (res) {
						$scope.init();
					});
				};

				$scope.friendReject = function (friendId) {
					fanManageService.rejectFriendship(friendId).then(function (res) {
						$scope.init();
					});
				};

			}]);
})();