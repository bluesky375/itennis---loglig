(function () {
  angular.module("LogligApp.controllers")
    .controller("userLoginCtrl", ["apiService","appService", "$scope", "$translate", "$filter", "$ionicPopup", "$state", "userManagmentService", "pushRegistrationService", 'appUtilsService', '$ionicHistory',
      function (apiService,appService, $scope, $translate, $filter, $ionicPopup, $state, userManagmentService, pushRegistrationService, utils, $ionicHistory) {

        var $trans = $filter('translate');

        $translate('title_login').then(function (value) {
					$scope.title = value;
				});
        $scope.validationTitle = $trans('validation_title_login');
        

        $scope.user = {};
        $scope.user.termsOfUse = false;

        $scope.setLanguageInner = function (lang) {
          $scope.setLanguage(lang);
          $scope.title = $trans('title_login');
        }
        $scope.login = function () {

          if (angular.isUndefined($scope.user.userid)) {

            appService.alertPopup($scope.validationTitle, $trans('validation_invalid_id'), null);
            return false;
          }

          if (angular.isUndefined($scope.user.password)) {

            appService.alertPopup($scope.validationTitle, $trans('validation_missing_password'), null);
            return false;
          }

          if ($scope.user.termsOfUse != true) {
            appService.alertPopup($scope.validationTitle, $trans('validation_terms_of_service'), null);
            return false;
          }

          appService.wait(true);

          userManagmentService.userLogin($scope.user.userid, $scope.user.password).then(
            function (res) {
              localStorage.setItem(TOKEN_KEY, JSON.stringify(res.data));

              // register device for push
              pushRegistrationService.registration();

              utils.refreshUser();

            userManagmentService.setUserInfo().then(function () {
              $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true,
                disableAnimate: true
              });

              // $ionicHistory.clearCache();
              $ionicHistory.clearHistory();

                if (userManagmentService.userInfo.Role == "players") {
                    $state.go('app.fan');
                }
                else if (userManagmentService.userInfo.Role == 'workers') {
                  if ( utils.isReferee() ) {
										$state.go('app.referee');
									}
                  else if ( utils.isTeamMgr() ) { // Team Manager
                    utils.gotoTeamMgr(userManagmentService.userInfo);
                  }
                  else if ( utils.isUnionMgr() ) { // association manager
                    $state.go('app.union');
                  }
                  else if ( utils.isLeagueMgr() && userManagmentService.userInfo.UserJobs[0] && userManagmentService.userInfo.UserJobs[0].LeagueId > 0 ) { // league manager
                    $state.go('app.league', {leagueId: userManagmentService.userInfo.UserJobs[0].LeagueId } );
                  }
                  else if (utils.isClubMgr()) {
                    utils.gotoClubMgr(userManagmentService.userInfo);
                  }
                  else {
										//$state.go('app.fan');
                     $state.go('app.union');
									}

								}
							});

						},
						function (res) {

              appService.wait(false);
              //appService.alertPopup($trans('text_error'), $trans('login_fail_password'), null);
              $scope.incorrectUserPassword();
            });
        };
        $scope.gotoITennis = function()
        {
          apiService.getByUrl(API_GET_CUR_ACTIVITYID).then(
            res=>{
              window.open(CMS_URL+'/Activity/Form/'+res.data, '_system'); // if platorm is android 
            }
          ).catch(
            err=>{console.log(err);}
          );
          //window.open($trans('txt_itennis_url_ios'), '_system'); // if platorm is ios 
        };

        $scope.incorrectUserPassword = function(){
            var templateText = '<center><div><p>'; templateText += $trans('login_fail_password'); templateText += '</p></div>';
            templateText += '<div><p>'; 
            if( $scope.getCurrentLanguage() === 'en' ) {
              templateText += $trans('txt_yet_register_tennis'); templateText += ' <span ng-click=gotoITennis()><u style="color:#009edb"> ITennis</u></span><span>?</span>';
            }
            else {
              templateText += '<span>?</span>';
              templateText += $trans('txt_yet_register_tennis'); templateText += ' <span ng-click=gotoITennis()><u style="color:#009edb">איטניס</u></span>';
            }
            templateText += '</p></div>'
            
            templateText += '<div><p>'; templateText += $trans('txt_assitant_register_tennis'); templateText += '</p></div></center>'; 
            $scope.newPlayerData = {}
            // An elaborate, custom popup
            $scope.alertPopupForgot = $ionicPopup.show({
                template: templateText,
                     title: $trans('text_error'),
                     scope: $scope,
                     buttons: [
                       { 
                          text: 'OK',
                          type: 'button-positive',
                       },
                     ]
                });

        };        
      }]);

})();
