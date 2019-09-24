(function () {
  angular.module("LogligApp.controllers")
    .controller("leagueCtrl", ["$ionicPlatform", "appService", "$http", "$scope", "$filter", "$state", "$ionicPopover", "$ionicScrollDelegate", "$timeout", "$ionicSlideBoxDelegate", "leaguesService", "multimediaService", "$cordovaFileTransfer", "unionService", "$q", "$translate", "appUtilsService", "fanManageService",
      function ($ionicPlatform, appService, $http, $scope, $filter, $state, $ionicPopover, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, leaguesService, multimediaService, $cordovaFileTransfer, unionService, $q, $translate, appUtilsService, fanManageService) {
        $scope.navIndex = 0;

        var leagueId = $state.params.leagueId;
        var teamId = $state.params.teamId;
        var gameCycles = [];
        var currCycle = 0;
        var currGroupIndex = 0;
        $scope.uploadableToGallery = false;
        $scope.galleryItems = [];

        $scope.aboutLabel = "About";
        $scope.structureLabel = "Structure";

        // Pedro add
        $scope.competitionRegistration = [];
        $scope.categoryNameList = [];
        // --Pedro

        var galleryHandler = $ionicSlideBoxDelegate.$getByHandle('gallery-viewer');

        if ($scope.util.isLoggedIn()) {
          $scope.user = JSON.parse(localStorage.getItem('userInfo'));
          $scope.myName = $scope.user.UserName;

          if ($scope.util.isLeagueMgr()) {
            if (leagueId == $scope.user.UserJobs[0].LeagueId) {
              $scope.uploadableToGallery = true;
            }
          }
          if ($scope.util.isUnionMgr()) {
            $scope.uploadableToGallery = true;
          }
        }

        $scope.openbanner = function (banner) {
          unionService.increaseBannerVisit(banner.BannerId);
          window.open(banner.LinkUrl, '_system');
        };

        // var bannersHandler = $ionicSlideBoxDelegate.$getByHandle('banners-viewer');

        $scope.getImageGallery = function (leagueId) {
          leaguesService.getTeamImageGallery(leagueId).then(function (res) {
            $scope.galleryItems = [];
            for (var iii in res.data) {
              res.data[iii].src = $scope.util.leagueImage(res.data[iii].url);
              res.data[iii].type = "league";
              res.data[iii].ParentId = leagueId;
              res.data[iii].ParentName = $scope.league.Title;
              res.data[iii].sub = res.data[iii].User.Name + '  ' + new Date(res.data[iii].Created).toLocaleString('en-US');
              res.data[iii].deletable = res.data[iii].url.indexOf($scope.user.Id + "__") !== -1 ? true : false;
              var item = {};
              item = Object.assign({}, res.data[iii]);
              $scope.galleryItems.push(item);
            }

            $scope.imageGallery = $scope.util.getPagedList(res.data, 3);

            if (galleryHandler._instances.length) {
              galleryHandler.update();
              $ionicSlideBoxDelegate.slide(0)
            }
          }, function (res) {
            // appService.alertPopup("Err during get image gallery data.");
          });
        };

        $scope.gamesTab = 0;

        $scope.showSlide = function (num) {

          $scope.navIndex = num;
          $ionicScrollDelegate.scrollTop();

          var fansHandler = $ionicSlideBoxDelegate.$getByHandle('fans-viewer');
          if (fansHandler._instances.length) {
            fansHandler.update();
          }

          // Pedro: add : get competitionRegistration
          if ($scope.navIndex == 4 && $scope.competitionRegistration.length == 0) { // Rank Table
            appService.wait(true);
            leaguesService.getCategoryNameList(leagueId).then(function (res) {
              $scope.categoryNameList = res.data;
              $scope.selectedCategory = $scope.categoryNameList[0];
              $scope.categoryChanged();
              appService.wait(false);
            }, function (res) {
              appService.wait(false);
            });
          } // --Pedro      
          else if ($scope.navIndex == 3) {

          }
        }

        $scope.showTennisSlide = function () {
          var num = 2;
          if ($scope.league.Type > 0)
            num = 4;
          else
            num = 2;
          $scope.showSlide(num);
        }
        $scope.openTeam = function (id) {
          $state.go('app.team', { teamId: id, leagueId: leagueId });
        }

        $scope.showCycle = function (dir) {
          var arrLen = gameCycles.length;
          if (dir == 'next') {
            if (currCycle < arrLen - 1) {
              currCycle++;
              $scope.indexPossition = currCycle;
            }
          }
          else {
            if (currCycle > 0) {
              currCycle--;
              $scope.indexPossition = currCycle;
            }
          }

          $scope.cycleNumber = gameCycles[currCycle];
        }

        $scope.showGroup = function (dir) {
          if (dir == 'next')
            $ionicSlideBoxDelegate.next();
          else
            $ionicSlideBoxDelegate.previous();
        }

        $scope.slideHasChanged = function (index) {
          $scope.currGroup = $scope.topGroups[index];
        }
        $scope.bindLeagueData = function () {

          appService.wait(true);
          if (teamId != undefined && teamId != "") { // tennis competition 
            leaguesService.getCompetitionForTennis(leagueId, teamId).then(function (res) {
              parsingLeagueData(res);
            }, function (err) {
              console.log(err);
              appService.wait(false);
            });
          }
          else {
            console.log("checkmecall competitions not");
            leaguesService.getGeague(leagueId).then(function (res) {
              parsingLeagueData(res);
            }, function (err) {
              console.log(err);
              appService.wait(false);
            });
          }
        };
        $ionicPopover.fromTemplateUrl('dropdown.html', {
          scope: $scope
        }).then(function (popover) {
          $scope.camerapopover = popover;
        });

        $scope.openCameraPopover = function ($event) {
          $scope.camerapopover.show($event);
        };

        $scope.openGallery = function () {
          $scope.camerapopover.hide();
          multimediaService.getImageFromGallery()
            .then(function (imageURI) {
              appService.alertConfirmationPopup($translate.instant("upload_gallery_title"), $translate.instant("upload_gallery_message"), function (approve) {
                if (approve) {
                  $scope.uploadImage(imageURI);
                }
              });
            }, function (err) {
              // alert('err=' + JSON.stringify(err));
            });
        };

        $scope.openCamera = function () {
          $scope.camerapopover.hide();
          multimediaService.openCamera()
            .then(function (imageURI) {
              appService.alertConfirmationPopup($translate.instant("upload_gallery_title"), $translate.instant("upload_gallery_message"), function (approve) {
                if (approve) {
                  $scope.uploadImage(imageURI);
                }
              });
            }, function (err) {
              // appService.alertPopup('Error', err.message, null);
            });
        };

        $scope.uploadImage = function (imageURI) {
          var deffered = $q.defer();
          var token = JSON.parse(localStorage.getItem(TOKEN_KEY));
          var options = {
            fileKey: "avatar",
            fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: 'image/jpeg',
            headers: {
              Authorization: token.token_type + ' ' + token.access_token
            }
          };
          console.log('options:' + options);
          $cordovaFileTransfer.upload(API_UPLOAD_IMAGE_GALLERY + "league/" + leagueId, imageURI, options)
            .then(function (result) {
              appService.alertPopup($translate.instant("photo_upload_successful"));
              $scope.getImageGallery(leagueId);
              appService.wait(false);
              deffered.resolve(result);
            }, function (error) {
              $scope.mdaType = 0;
              console.log('err:' + error);
              appService.wait(false);
              deffered.reject(error);
            }, function (progress) {
            });
        };
        $scope.$watch('game', function (newvalue, oldvalue) {
          console.log('$scope.$watch(game.IsGoing)');
          console.log('newvalue: ', newvalue);
          console.log('oldvalue: ', oldvalue);
          if (typeof (newvalue) !== 'undefined' && typeof (oldvalue) !== 'undefined' && newvalue.IsGoing !== oldvalue.IsGoing) {
            console.log('bindLeagueData');
            $scope.bindLeagueData();
          }
        }, true);

        $scope.refreshCallback = function () {
          $scope.getImageGallery(leagueId);
        };

        // Pedro : add for rank table for tennis league

        $scope.categorySelect = function (item) {
          $scope.selectedCategory = item;
          $scope.categoryChanged();
        }

        $scope.categoryChanged = function () {
          if ($scope.navIndex == 4) {
            appService.wait(true);
            leaguesService.getRankTennisCompetitionnew(leagueId, teamId).then(function (res) {
              $scope.competitionRegistration = res.data;
              appService.wait(false);
            }, function (error) {
              appService.wait(false);
            });
          }
          else {
            appService.wait(true);
            leaguesService.getRankTennisCompetitionnew(leagueId, $scope.selectedCategory.Id).then(function (res) {
              $scope.competitionRegistration = res.data;
              appService.wait(false);
            }, function (error) {
              appService.wait(false);
            });
          }
        }

        // Pedro : do't need for karate

        $ionicPopover.fromTemplateUrl('dropdown.html', {
          scope: $scope
        }).then(function (popover) {
          $scope.popover = popover;
        });

        $scope.openCategoryPopover = function ($event) {
          $scope.selListFlag = 1;
          $scope.nameList = $scope.categoryNameList;
          $scope.popover.show($event);
        };

        $scope.toggleSelect = function (index) {
          $scope.categorySelIndex = index;
        }
        $scope.isCompetition = function (index) {
          return $scope.league.Type == 1
        }

        function parsingLeagueData(res) {
          appService.wait(false);
          if (res.data != null) {
            $scope.league = res.data.LeagueInfo;
            console.log($scope.league.RegistrationLink + "checkmelink");
            $scope.levelDateSetting = res.data.LevelDateSetting;
            $scope.fansTeam = res.data.TeamWithMostFans;
            $scope.results = res.data.LeagueTableStages;
            $scope.team = res.data.Team;

            // Pedro set about & struction label
            if ($scope.league.Type == 0) {
              $scope.aboutLabel = $translate.instant("about_league");
              $scope.structureLabel = $translate.instant("structure_league");
            }
            else {
              $scope.aboutLabel = $translate.instant("about_competition");
              $scope.structureLabel = $translate.instant("structure_competition");
              $scope.playersList = res.data.Team.Players;
              $scope.jobsList = res.data.Team.Jobs;
            }

            // start get last event
            var lastgame = res.data.LastGames;
            var nextgame = res.data.NextGames;
            if (nextgame&&nextgame.length < 1) {
              $scope.gamesTab = 1;
            }
            $http({
              method: 'GET',
              url: BASE_API_URL + '/v2/get-last-event.aspx?leagueid=' + leagueId
            }).then(function successCallback(response) {
              //Event GAME LIST MERGE
              var arrLast = [];
              if (lastgame != null) {
                // insert game list
                for (var i = 0; i < lastgame.length; i++) {
                  lastgame[i].gameType = $scope.league.Type;
                  lastgame[i].LeagueId = leagueId;
                  var obj_game = { id: i, type: 'game', trueID: lastgame[i].GameId, dateOrder: lastgame[i].StartDate, item: lastgame[i] };
                  arrLast.push(obj_game);
                }
              }

              if (response.data != null) {
                var obj = response.data;

                //insert event list
                for (var i = 0; i < obj.length; i++) {
                  var obj_event = {
                    id: (i + obj.length),
                    type: 'event',
                    trueID: obj[i].id,
                    dateOrder: obj[i].date,
                    title: obj[i].title,
                    place: obj[i].place,
                  };
                  arrLast.push(obj_event);
                }


              }
              $scope.lastGames = arrLast;
            }, function errorCallback(response) {
              console.log("checkme" + JSON.stringify(response));
            });
            // end get last event
            //start get next event
            $http({
              method: 'GET',
              url: BASE_API_URL + '/v2/get-next-event.aspx?leagueid=' + leagueId
            }).then(function successCallback(response) {
              var arr = [];
              //Event GAME LIST MERGE
              if (nextgame != null) {
                // insert game list
                for (var i = 0; i < nextgame.length; i++) {
                  nextgame[i].gameType = $scope.league.Type;
                  nextgame[i].LeagueId = leagueId;
                  var obj_game = { id: i, type: 'game', trueID: nextgame[i].GameId, dateOrder: nextgame[i].StartDate, item: nextgame[i] };
                  arr.push(obj_game);
                }
              }


              if (response.data != null) {
                var obj = response.data;

                //insert event list
                for (var i = 0; i < obj.length; i++) {
                  var obj_event = {
                    id: (i + obj.length),
                    type: 'event',
                    trueID: obj[i].id,
                    dateOrder: obj[i].date,
                    title: obj[i].title,
                    place: obj[i].place,
                  };
                  arr.push(obj_event);
                }

              }
              $scope.nextGames = arr;
              console.log("checkmenextgames" + JSON.stringify(arr));
            }, function errorCallback(response) {
              console.log("checkme" + JSON.stringify(response));
            });
            // end get next event
            $scope.leagueTableStages = res.data.LeagueTableStages;
            gameCycles = res.data.GameCycles;
            if (gameCycles) {
              $scope.arrLenCecles = gameCycles.length;
              var cycleNum = gameCycles[gameCycles.length - 1];
              $scope.cycleNumber = cycleNum;
              currCycle = gameCycles.indexOf(cycleNum);
              $scope.indexPossition = currCycle;
            }
            if (res.data.NextGame) {

              $scope.game = res.data.NextGame;
              console.log("checkme$scope.game" + JSON.stringify(res.data.NextGame));
              $scope.game.gameType = $scope.league.Type;
              $scope.game.LeagueId = leagueId;
              console.log($scope.game);
              var cycleNum = $scope.game.CycleNumber;

              $scope.cycleNumber = cycleNum;
              currCycle = gameCycles.indexOf(cycleNum);
              $scope.indexPossition = currCycle;
            }

            if (res.data.LeagueTableStages) {
              // get last stage
              var len = res.data.LeagueTableStages.length;
              var stage = res.data.LeagueTableStages[len - 1];

              // get groups
              if (res.data.LeagueTableStages.length > 0) {
                $scope.topGroups = stage.Groups.reverse();
                $scope.currGroupIndex = stage.Groups.length - 1;

                $scope.currGroup = stage.Groups[$scope.currGroupIndex];
              }
            }
          }

          $scope.getImageGallery(leagueId);

          unionService.getBanners().then(function (result, error) {
            $scope.banner = result.data[0];
            // if (bannersHandler._instances.length) {
            //   bannersHandler.update();
            // }
            appService.wait(false);
          });

          $timeout(function () {
            appService.wait(false);
          }, 600);
        }
        $scope.setGoing = function () {
          console.log('SetGoing directve');
          if (!appUtilsService.isLoggedIn()) {
            appService.notloggedPupup();
            return;
          }
          if ($scope.game != null) {
            if ($scope.game.IsGoing == 1)
              $scope.game.IsGoing = 0;
            else
              $scope.game.IsGoing = 1;
            fanManageService.sendIsGoing($scope.game.GameId, $scope.game.IsGoing, $scope.game.gameType);
          }
        }
        $scope.setRegister = function () {
          window.open($scope.league.RegistrationLink, '_system');
        }
        $scope.setGameBracket = function () {
          leaguesService.getGameBracketUrl(leagueId, teamId).then(res => {
            if (res != null) {
              window.open(res.data, '_system');
            }
          })
        }
        // init page view
        $scope.bindLeagueData();
      }])
    .directive('teamsimageOnload', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var docWidth = $(document).width();
          var picSize = docWidth / 3 - 30;
          $(element).width(picSize).height(picSize);
        }
      };
    });
})();
