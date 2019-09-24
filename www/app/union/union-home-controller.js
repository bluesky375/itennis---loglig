(function () {
  angular.module("LogligApp.controllers")
    .controller("unionHomeCtrl", ["$scope", "appService", "unionService", "appUtilsService", "leaguesService", 'fanManageService',"$ionicSlideBoxDelegate",
      function ($scope, appService, unionService, appUtilsService, leaguesService, fanManageService, $ionicSlideBoxDelegate) {

        $scope.openbanner = function(banner) {
          unionService.increaseBannerVisit(banner.BannerId);
          window.open(banner.LinkUrl, '_system');
        };

        // var bannersHandler = $ionicSlideBoxDelegate.$getByHandle('banners-viewer');

        appService.wait(true);

        $scope.fansCount = 'מחשב..';
        $scope.util = appUtilsService;

        // Pedro : Update : get total fans.
        unionService.getClubs().then(function (result) {
            var totalFans = 0;
            for (var index = 0; index < result.data.length; index++) {
              var club = result.data[index];
              totalFans += club.totalFans;
            }     
            $scope.fansCount = totalFans; 
        }, function (err) {
          console.log(err);
          appService.wait(false);
        });

        unionService.getUnion().then(function (result, error) {

          $scope.union = result.data;
          $scope.displayName = result.data.Name;
          $scope.unionImage = ASSETS_URL + "union/" + result.data.Logo;

          unionService.getBanners().then(function (result, error) {
            $scope.banner = result.data[0];
            // if (bannersHandler._instances.length) {
            //   bannersHandler.update();
            // }
            appService.wait(false);
          }, function (err) {
            console.log(err);
            appService.wait(false);
          });
        });

        unionService.getActivities().then(function (res) {
          $scope.activities = res.data;
        });


        $scope.emailTo = function (email) {
          cordova.plugins.email.open({
            to:          email, // email addresses for TO field
            subject:    "Feedback", // subject of the email
            isHtml:    false, // indicats if the body is HTML or plain text
          }, function (result, error) {
          }, scope);
          console.log(email);
        };

      }]);
})();
