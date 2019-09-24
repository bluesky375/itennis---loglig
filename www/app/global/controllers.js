(function () {
	angular.module("LogligApp.controllers", ['ionic', 'ion-gallery'])
		.controller("appCtrl", ["$scope", function ($scope) {
		}])
		.controller("errorCtrl", ["$scope", "appService", function ($scope, appService) {
			//public properties that define the error message and if an error is present
			$scope.error = "";
			$scope.activeError = false;

			//function to dismiss an active error
			$scope.dismissError = function () {
				$scope.activeError = false;
			};

			//broadcast event to catch an error and display it in the error section
			$scope.$on("error", function (evt, val) {
				//set the error message and mark activeError to true
				$scope.error = val;
				$scope.activeError = true;

				//stop any waiting indicators (including scroll refreshes)
				appService.wait(false);
				$scope.$broadcast("scroll.refreshComplete");

				//manually apply given the way this might bubble up async
				$scope.$apply();
			});
		}]);
})();



