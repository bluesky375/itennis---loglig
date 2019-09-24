(function () {
	angular.module("LogligApp.controllers")
		.controller("multimediaCtrl", ["$scope", "multimediaService",
			function ($scope, multimediaService) {

				$scope.cameraTest = function () {
					multimediaService.setImageFromCamera('myImage');
				}

				$scope.galleryTest = function () {
					multimediaService.setImageFromGallery('myImage');
				}


			}]);
})();