(function () {
  angular.module("LogligApp.controllers")
    .controller("refereeUpdateGameResultsCtrl", ["$scope", "$state","$translate", "refereeServices", "leaguesService", "appService",
      function ($scope, $state, $translate, refereeServices, leaguesService, appService) {

        appService.wait(true);
        $scope.gamesetInEdit = null;
        var NEW_ID = -1;

        var emptyGameQuarter = function () {
          return {
            inEditHomeTeamScore: '',
            SetNumber: 1,
            inEditGuestTeamScore: '',
            GameCycleId: $state.params.gameId,
            inEditIsGoldenSet: false,
            GameSetId: NEW_ID
          };
        };


        leaguesService.getGame($state.params.gameId, $state.params.gameType).then(function (res) {
          $scope.currentGameEdit = res.data.GameInfo;
          $scope.currentGameSetsEdit = res.data.Sets;

          $scope.currentGameSetsEdit.forEach(function (existGameset) {
            existGameset.inEditHomeTeamScore = existGameset.HomeTeamScore + "";
            existGameset.inEditGuestTeamScore = existGameset.GuestTeamScore + "";
            existGameset.inEditIsGoldenSet = existGameset.IsGoldenSet;
          });
          //Add empty quarter if there isn't any
          if (!$scope.currentGameSetsEdit.length) {
            $scope.currentGameSetsEdit.push(emptyGameQuarter());
            $scope.gamesetInEdit = $scope.currentGameSetsEdit[0];
          }
          appService.wait(false);
        });


        $scope.saveSet = function (set) {
          var newSet = set.GameSetId < 0;
          refereeServices.saveGameSet(set).then(function (res, err) {
            console.log(res);
            if (!err && res) {
              if (res.data.GameSetId) {
                res.data.inEditHomeTeamScore = res.data.HomeTeamScore;
                res.data.inEditGuestTeamScore = res.data.GuestTeamScore;
                res.data.inEditIsGoldenSet = res.data.IsGoldenSet;
                if (newSet) {
                  $scope.currentGameSetsEdit[$scope.currentGameSetsEdit.length-1] = res.data;
                } else {
                  $scope.currentGameSetsEdit.forEach(function (gameSet) {
                    if (gameSet.GameSetId == $scope.gamesetInEdit.GameSetId) {
                      var index = $scope.currentGameSetsEdit.indexOf(gameSet);
                      $scope.currentGameSetsEdit[index] = res.data;
                    }

                  })
                }
                $scope.gamesetInEdit = null;
              }

            }
          })
        };

        $scope.editSet = function (set) {
          if ($scope.gamesetInEdit) {
            alert('Please save your changes first');
          } else {
            $scope.gamesetInEdit = set;
          }

        };

        $scope.cancelChanges = function (set) {
          if ($scope.gamesetInEdit) {
            if (set.GameSetId > 0) {
              set.inEditGuestTeamScore = set.GuestTeamScore;
              set.inEditHomeTeamScore = set.HomeTeamScore;
              set.inEditIsGoldenSet = set.IsGoldenSet;

            } else {
              $scope.currentGameSetsEdit.pop();
            }

            $scope.gamesetInEdit = null;
          }
        }

        $scope.back = function () {
          $state.go('app.referee');
        };

        $scope.isInEdit = function (set) {
          if ($scope.gamesetInEdit == null) {
            return false;
          } else if ($scope.gamesetInEdit.GameSetId == set.GameSetId || set.GameSetId == NEW_ID) {
            return true;
          }
        };

        $scope.markTechnicalVictoryFor = function (team) {
          $translate('technicalVictoryConfirmAlert').then(function (technicalVictoryMessage) {
            $translate('technicalVictory').then(function (technicalVictory) {
              appService.alertConfirmationPopup(technicalVictory, technicalVictoryMessage + '<br>' + team.name, function (approve) {
                if (approve) {
                  refereeServices.technicalWin($scope.currentGameEdit.GameId, team.teamId).then(function (res, err) {
                    if (res && res.status == 200) {
                      appService.alertPopup(null, 'עודכן בהצלחה', null);
                      $scope.back();
                    }
                  })
                }
              });
            });
          })

        };

        $scope.addQuarter = function () {

          if ($scope.gamesetInEdit == null) {
            $scope.currentGameSetsEdit.push(emptyGameQuarter());
            $scope.gamesetInEdit = $scope.currentGameSetsEdit[$scope.currentGameSetsEdit.length-1];
            $scope.currentGameSetsEdit[$scope.currentGameSetsEdit.length-1].SetNumber = $scope.currentGameSetsEdit.length;
          } else {
            alert('Please save changes before adding new');
          }

        };

        $scope.endGame = function () {
          if ($scope.gamesetInEdit == null) {

            $translate('endGameMessage').then(function (endGameMessage) {
              appService.alertConfirmationPopup('', endGameMessage, function (approve) {
                if (approve) {
                  refereeServices.endGame($scope.currentGameEdit.GameId).then(function (res, err) {
                    if (res.status == 200) {
                      appService.alertPopup(null, 'עודכן בהצלחה', null);
                      $scope.back();
                    }
                  })

                }
              });
            });


          } else {
            alert('Please save changes before ending the game');
          }
        }
      }]);
})();