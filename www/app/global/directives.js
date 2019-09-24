(function () {
  angular.module("LogligApp").directive('appFilereader', ["$q", function ($q) {
    var slice = Array.prototype.slice;
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel)
          return;

        ngModel.$render = function () {
        };

        element.bind('change', function (e) {
          var element = e.target;

          $q.all(slice.call(element.files, 0).map(readFile))
            .then(function (values) {
              var data = [];
              angular.forEach(values, function (value, key) {
                data[key] = element.files[key];
                data[key].content = value;
              });
              if (element.multiple)
                ngModel.$setViewValue(data);
              else
                ngModel.$setViewValue(data.length ? data[0] : null);
            });

          function readFile(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
              deferred.resolve(e.target.result);
            };
            reader.onerror = function (e) {
              deferred.reject(e);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
          }
        });
      }
    };
  }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appNextGame', ['$state', '$ionicPopup', '$ionicSlideBoxDelegate', '$timeout', 'appUtilsService', 'fanManageService', 'appService', 'refereeServices',
    function ($state, $ionicPopup, $ionicSlideBoxDelegate, $timeout, appUtilsService, fanManageService, appService, refereeServices) {

      var uniqueId = 1;

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/partial/next-game.html?4',
        scope: {
          game: '=info',
          isScroll: '=isScroll'
        },
        link: function (scope, element, attrs) {

          scope.uniqueId = 'appitem' + uniqueId++;

          scope.util = appUtilsService;
          scope.util.refreshUser();

          scope.setGoing = function (gameType) {

            if (!appUtilsService.isLoggedIn()) {
              appService.notloggedPupup();
            }
            else {
              if(scope.game.IsGoing == 1){
                scope.game.IsGoing = 0;
              }
              else
              {
                scope.game.IsGoing = 1;
              }
              fanManageService.sendIsGoing(scope.game.GameId, scope.game.IsGoing, gameType).then(function(res) {
                scope.game.IsGoingFlag = scope.game.IsGoing;
              });
            }
          };

          // scope.$watch('game.IsGoing',function(newvalue, oldvalue){
          //   if(typeof(newvalue)!== 'undefined' && typeof(oldvalue) !== 'undefined' && newvalue !== oldvalue && scope.team != undefined){
          //     scope.teamChanged(scope.team);
          //   }
          // });

          scope.showTeam = function (id, leagueId) {
            $state.go('app.team', {teamId: id, leagueId: leagueId});
          };

          scope.showPlayer = function (id, leagueId) {
            $state.go('app.player', {playerId: id, leagueId: leagueId});
          };

          scope.showDetail = function(id, leagueId, type) {
            if( type > 0 ) // Competition : showPlayer
              $state.go('app.player', {playerId: id, leagueId: leagueId});
            else
              $state.go('app.team', {teamId: id, leagueId: leagueId});
          };

          scope.$watch("game.TimeLeft", function handleFooChange(newValue, oldValue) {

            if (newValue) {
              var clock = $('#' + scope.uniqueId + ' .Timer').FlipClock(newValue, {
                countdown: true,
                callbacks: {
                  stop: function () {
                    scope.$apply(function () {
                      scope.game.Status = "live";
                    });
                  }
                }
              });
            }
          });

          scope.$watch("game.FansList", function handleFooChange(newValue, oldValue) {
            if (newValue) {
              scope.game.FansList = newValue;
              scope.fansArr = appUtilsService.getPagedList(newValue, 5);
              scope.startPage = scope.fansArr.length - 1;
            }
          });
          scope.$watch("game", function handleFooChange(newValue, oldValue) {
            if (newValue) {
              scope.game = newValue;
            }
          });
        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appNextGameEdit', ['$state', '$ionicPopup', '$ionicSlideBoxDelegate', '$timeout', 'appUtilsService', 'fanManageService', 'appService', 'refereeServices',
    function ($state, $ionicPopup, $ionicSlideBoxDelegate, $timeout, appUtilsService, fanManageService, appService, refereeServices) {

      var uniqueId = 1;

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/partial/next-game-edit.html?4',
        scope: {
          game: '=info',
          isScroll: '=isScroll'
        },
        link: function (scope, element, attrs) {

          scope.uniqueId = 'appitem' + uniqueId++;

          scope.util = appUtilsService;

          scope.showTeam = function (id, leagueId) {
            $state.go('app.team', {teamId: id, leagueId: leagueId});
          };

          scope.showPlayer = function (id, leagueId) {
            $state.go('app.plaer', {playerId: id, leagueId: leagueId});
          };

          scope.setScoreForGame = function (game) {
            $state.go('app.gameResults', {gameId: game.GameId});
          };

          scope.$watch("game.TimeLeft", function handleFooChange(newValue, oldValue) {

            if (newValue) {
              var clock = $('#' + scope.uniqueId + ' .Timer').FlipClock(newValue, {
                countdown: true,
                callbacks: {
                  stop: function () {
                    scope.$apply(function () {
                      scope.game.Status = "live";
                    });
                  }
                }
              });
            }
          });
        }
      }
    }]);
})();


(function () {
  "use strict";
  angular.module("LogligApp").directive( 'appTeamStats', ['$timeout', '$window',
    function ($timeout, $window) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/partial/team-stats.html',
        scope: {
          team: '=info'
        },
        link: function (scope, element, attrs) {

          var level = scope.team.SuccsessLevel;

          scope.$watch('team.SuccsessLevel', function (newValue, oldValue) {

            //Radial Percentage Chart
            $('style[type="text/css"]').attr('type', 'text/less');
            less.refreshStyles();

            scope.randomize = function () {
              console.log('randomize directive');
              $('.radial-progress').attr('data-progress', newValue);
            };

            $timeout(scope.randomize, 200);
//						$('.radial-progress').click(scope.randomize);
            // Read more here: https://medium.com/@andsens/radial-progress-indicator-using-css-a917b80c43f9
          });
        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive( 'appPlayerStats', ['$timeout', '$window',
    function ($timeout, $window) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/partial/player-stats.html',
        scope: {
          playerRankPoints: '=info'
        },
        link: function (scope, element, attrs) {
        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appGameBox', ['$state', 'appUtilsService', 'refereeServices',
    function ($state, appUtilsService, refereeServices) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/partial/game-box.html?1',
        scope: {
          gamesList: '=info',
          orderType: '=type',
          cycleNumber: '=cycle',
          gameStat: '=stat'
        },
        link: function (scope, element, attrs) {

          scope.util = appUtilsService;
          var leagueId = $state.params.leagueId;

          scope.setGameResultsAsReferee = function (game) {
            refereeServices.currentGameEdit = game;
            $state.go('app.gameResults');
          };

          scope.setScoreForGame = function (game) {
            $state.go('app.gameResults', {gameId: game.GameId});
          };

          scope.openTeam = function (id) {
            $state.go('app.team', {teamId: id, leagueId: leagueId});
          }
          
          scope.showDetail = function(id, leagueId, type) {
            if( type > 0 ) // Competition : showPlayer
              $state.go('app.player', {playerId: id, leagueId: leagueId});
            else
              $state.go('app.team', {teamId: id, leagueId: leagueId});
          };
        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appGameBoxEdit', ['$state', 'appUtilsService', 'refereeServices',
    function ($state, appUtilsService, refereeServices) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/partial/game-box-edit.html?1',
        scope: {
          gamesList: '=info',
          cycleNumber: '=cycle',
          gameStat: '=stat'
        },
        link: function (scope, element, attrs) {

          scope.util = appUtilsService;
          var leagueId = $state.params.leagueId;

          scope.setGameResultsAsReferee = function (game) {
            refereeServices.currentGameEdit = game;
            $state.go('app.gameResults');
          };

          scope.setScoreForGame = function (game) {
            $state.go('app.gameResults', {gameId: game.GameId});
          };

          scope.openTeam = function (id, league_id) {
            $state.go('app.team', {teamId: id, leagueId: league_id});
          }

        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appFriendClick', ['fanManageService',
    function (fanManageService) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.on('click', function (e) {

            var userId = attrs.appFriendClick;

            fanManageService.reqfriend(userId).then(function () {
              //$scope.$broadcast('frendRequestedEvent', { userId: id });
            });
          });
        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('pane',
    function () {
      return {
        restrict: 'E',
        //replace: true,
        transclude: true,
        scope: {
          some: "@",
          act: "&"
        },
        template: "<div><b ng-click='act()'>{{some}}, {{data}}</b>---- <ng-transclude></ng-transclude> ----- </div>",
        link: function (scope, element, attrs) {

          var x = 0;

          scope.$watch('some', function (newValue, oldValue) {
            alert(newValue);
          });

          x = 2;
        },
        controller: function ($scope) {
          $scope.data = "dddd";
        }
      }
    });
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appFriendButton', ['fanManageService', '$ionicPopup', 'appUtilsService', '$translate', 'appService',
    function (fanManageService, $ionicPopup, appUtilsService, $translate, appService) {
      return {
        restrict: 'A',
        scope: {
          user: '=user'
        },
        link: function (scope, element, attrs) {

          scope.$watch('user.FriendshipStatus', function (val) {

            switch (val) {
              case 'Yes':
                element.attr('class', 'm-icon-friend-on');
                break;
              case 'No':
                element.attr('class', 'm-icon-friend');
                break;
              default:
                element.attr('class', 'm-icon-friend');
            }
          });

          element.on('click', function (e) {
            if (scope.user.FriendshipStatus == null || scope.user.FriendshipStatus == 'No') {
              var userPic = appUtilsService.fanImage(scope.user.Image);
              $translate(['msg_friendship_request_sent', 'text_confirm', 'cancel', 'no_active_yet']).then(function (translations) {
                var confirmFriendshipRequest = $ionicPopup.confirm({
                  template: "<div class='f-pop'><img class='f-img' src='" + userPic + "'/><div class='f-pop-text'>" +
                  "<span class='f-name'>" + translations.msg_friendship_request_sent + "&nbsp;<b>" + (scope.user.FullName || scope.user.UserName) + "</b>&nbsp;</span></div></div>",
                  cssClass: $translate.use() == 'iw' ? 'f-pop-wrap rtl' : 'f-pop-wrap is-eng',
                  buttons: [
                    {
                      text: translations.cancel
                    },
                    {
                      text: translations.text_confirm,
                      type: 'button-positive',
                      onTap: function (e) {
                        element.attr('class', 'm-icon-friend-pending');
                        scope.user.FriendshipStatus = 'Pending';
                        var userId = scope.user.Id;
                        fanManageService.requestFriendship(userId).then(function () {
                          scope.status = 'Pending'
                        }, function(error) {
                            scope.user.FriendshipStatus = 'No';
                            var msg = translations.no_active_yet;
                            appService.alertPopup(msg);
                        });
                      }
                    }
                  ]
                });
              });

            } else {
              var userPic = appUtilsService.fanImage(scope.user.Image);
              $translate(['text_remove', 'text_from_friends', 'dialog_box_forgot_btn_cancel', 'text_confirm']).then(function (translations) {
                var confirmUnfriend = $ionicPopup.confirm({
                  template: "<div class='f-pop'><img class='f-img' src='" + userPic + "' /><div class='f-pop-txt'>"
                  + "<span class='f-name'>" + translations.text_remove + "&nbsp;<b>" + (scope.user.FullName || scope.user.UserName) + "</b>&nbsp;" + translations.text_from_friends + "</span></div></div>",
                  //cssClass: 'f-pop-wrap',
                  cssClass: $translate.use() == 'iw' ? 'f-pop-wrap rtl' : 'f-pop-wrap is-eng',
                  buttons: [{text: translations.dialog_box_forgot_btn_cancel}, {
                    text: translations.text_confirm,
                    type: 'button-positive',
                    onTap: function (e) {

                      if (scope.user.FriendshipStatus == 'Pending') {
                        fanManageService.cancelFriendship(scope.user.Id);
                      }
                      else if (scope.user.FriendshipStatus == 'Yes') {
                        fanManageService.unFriend(scope.user.Id);
                      }
                      element.attr('class', 'm-icon-friend');
                      scope.user.FriendshipStatus = 'No';
                    }
                  }]
                });
              });
            }
          });
        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appMessageButton', ['$state', 'fanManageService', '$ionicPopup', 'appUtilsService', '$translate', '$filter',
    function ($state, fanManageService, $ionicPopup, appUtilsService, $translate, $filter) {
      return {
        restrict: 'A',
        scope: {
          user: '=user'
        },
        link: function (scope, element, attrs) {

          element.on('click', function (e) {
            if (scope.user.FriendshipStatus != 'Yes') {
              var $trans = $filter('translate');
              var templateText = "<center><div>" +
                  "<p class='f-name'>" + $trans('msg_chat_request_sent1') + "</p>" + 
                  "<p class='f-name'>" + $trans('msg_chat_request_sent2') + "</p>" + "</div><center>";

            scope.alertPopupForgot = $ionicPopup.confirm({
                template: templateText,
                cssClass: 'f-pop-wrap center',
                buttons: [
                       { 
                          text: $trans('text_close'),
                          type: 'button-positive',
                       },
                     ]
                });
            } 
            else {
              $state.go('app.sendmsgs', {receiverId: scope.user.Id});
            }
          });
        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('appUserHeader', ['$state', '$ionicPopover', 'appUtilsService', 'authService', 'fanManageService', 'notificationsService', 'leaguesService', 'userManagmentService',
    function ($state, $ionicPopover, appUtilsService, authService, fanManageService, notificationsService, leaguesService, userManagmentService) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          teamChanged: '&',
          hideTeams: '='
        },
        templateUrl: 'app/partial/user_header.html',
        link: function ($scope, element, attrs) {

          if ($state.current.name == 'app.fanFriends') {
            $scope.fpage = true;
          }
          if ($state.current.name == 'app.msgs') {
            $scope.mpage = true;
          }

          if ($state.current.name == 'app.notifications') {
            $scope.npage = true;
          }


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

          $scope.$watch('user.Id', function (newvalue) {
            if (typeof(newvalue) !== 'undefined') {
              $scope.userTeams = $scope.user.Teams;
              // IsTrainingTeam
              angular.forEach($scope.userTeams, function (value, key) {
                if(value.LeagueId != undefined && value.LeagueId > 0) {
                leaguesService.getGeague(value.LeagueId).then(function (res) {
                  if (res.data != null) {
                    $scope.userTeams[key].LeagueTitle = res.data.LeagueInfo.Title
                  }
                });
                }
              });
              if ($scope.user.Role == "players" || appUtilsService.isTeamMgr()) {
                $scope.displayName = $scope.user.FullName;
                $scope.userImage = appUtilsService.fanImage($scope.user.Image);
              }
              else {
                $scope.displayName = $scope.user.UserName;
                $scope.userImage = appUtilsService.fanImage($scope.user.Image);
              }
              console.log($scope.userImage);

              if ($scope.userTeams && $scope.userTeams.length > 0) {

                var lastTeam = fanManageService.getLastTeam();
                for(var i = 0; i< $scope.userTeams.length;i++){
                  if($scope.userTeams[i] !=null&& $scope.userTeams[i].IsTrainingTeam == true){
                    lastTeam = $scope.userTeams[i];
                  }
                }
                var isSet = false;

                if (lastTeam != null) {
                  var resItem = _.find($scope.userTeams, function (o) {
                    return o.TeamId == lastTeam.TeamId;
                  });
                  isSet = !_.isUndefined(resItem);
                }

                if (lastTeam != null && isSet) {
                  $scope.teamSelect(lastTeam);
                }
                else {
                  $scope.teamSelect($scope.userTeams[0]);
                }
              }
            }
          }, true);
          userManagmentService.registerObserverCallback(function () {
            $scope.user = authService.getUser();
          });

          $scope.popover = $ionicPopover.fromTemplateUrl('teams-popover.html', {
            scope: $scope
          }).then(function (popover) {
            $scope.popover = popover;
            $scope.openPopover = function ($event) {
              $scope.popover.show($event);
            };
          });

          $scope.teamSelect = function (item) {
            $scope.selectedTeam = item;
            fanManageService.setLastTeam(item);
            $scope.teamChanged({team: item});
          }

        }
      }
    }]);
})();

(function () {
  "use strict";
  angular.module("LogligApp").directive('unionHeader', ['$state', '$ionicPopover', 'appUtilsService', 'authService', 'fanManageService', 'unionService',
    function ($state, $ionicPopover, appUtilsService, authService, fanManageService, unionService) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'app/partial/union_header.html',
        link: function ($scope, element, attrs) {

          unionService.getUnion()
            .then(function (res) {
              console.log('Union result:', res);
              $scope.displayName = res.data.Name;
              $scope.unionImage = ASSETS_URL + "union/" + res.data.Logo;
            });

        }
      }
    }]);
})();

angular.module("LogligApp").directive('actualSrc', function () {
  var directive = {
    link: postLink
  };

  return directive;

  function postLink(scope, element, attrs) {
    attrs.$observe('actualSrc', function(newVal, oldVal){
       if(newVal !== undefined){
         var img = new Image();
         img.src = attrs.actualSrc;
         angular.element(img).bind('load', function () {
            element.attr("src", attrs.actualSrc);
         });
       }
    });
  }
});
