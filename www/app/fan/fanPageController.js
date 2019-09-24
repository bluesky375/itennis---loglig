(function () {
	angular.module("LogligApp.controllers")
		.controller("fanPageCtrl", ["appService", "$scope", "$state", "$ionicSlideBoxDelegate", "fanManageService", "unionService",
			function (appService, $scope, $state, $ionicSlideBoxDelegate, fanManageService, unionService) {

				var fanId = $state.params.fanId;
				$scope.myName = localStorage.getItem('userInfo');
				$scope.myName = JSON.parse($scope.myName).UserName;

        $scope.openbanner = function(banner) {
          unionService.increaseBannerVisit(banner.BannerId);
          window.open(banner.LinkUrl, '_system');
        };

        // var bannersHandler = $ionicSlideBoxDelegate.$getByHandle('banners-viewer');

				$scope.initPageData = function () {
					appService.wait(true);

					fanManageService.getFanById(fanId).then(function (res) {

						$scope.fan = res.data;
						$scope.activeSlide = res.data.Teams.length - 1;
						$scope.currentTeam = res.data.Teams[$scope.activeSlide];

						if (res.data.Friends) {

							$scope.fansArr = $scope.util.getPagedList(res.data.Friends, 5);
							$scope.startPage = $scope.fansArr.length - 1;
							console.log($scope.fansArr);
							$ionicSlideBoxDelegate.update();
						}

            unionService.getBanners().then(function (result, error) {
              $scope.banner = result.data[0];
              // if (bannersHandler._instances.length) {
              //   bannersHandler.update();
              // }
              appService.wait(false);
            });
					});
				}

				$scope.slideNext = function () {
					$ionicSlideBoxDelegate.next();
				};

				$scope.slidePrev = function () {
					$ionicSlideBoxDelegate.previous();
				}

				$scope.slideHasChanged = function (num) {
					$scope.currentTeam = $scope.fan.Teams[num];
				}

				// init
				$scope.initPageData();


			}]);
})();
