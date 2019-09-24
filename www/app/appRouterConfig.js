(function () {
  "use strict";

  angular.module("LogligApp").config(
    function ($urlRouterProvider, $stateProvider) {

      function onEnter() {
        if (typeof analytics !== 'undefined') {
          analytics.trackView(this.name);
        }
      };

      $stateProvider

        .state("app", {
          onEnter: onEnter,
          url: "/app",
          abstract: true,
          templateUrl: "app/layout/app.html",
          controller: "AppController"
        })
        .state("app.splash", {
          onEnter: onEnter,
          url: "/splash",
          views: {
            'appContent': {
              templateUrl: "app/splash/view-splash.html",
              controller: "splashCtrl"
            }
          }
        })
        .state("app.login", {//DONE
          onEnter: onEnter,
          url: "/login",
          views: {
            'appContent': {
              templateUrl: "app/login/view-login.html",
              controller: "loginCtrl"
            }
          }
        })
        .state("app.loginWorker", {//DONE
          onEnter: onEnter,
          url: "/loginWorker",
          views: {
            'appContent': {
              templateUrl: "app/login/view-login-worker.html",
              controller: "userLoginCtrl"
            }
          }
        })
        .state("app.forgotPassword", {//DONE
          onEnter: onEnter,
          url: "/forgotPassword",
          views: {
            'appContent': {
              templateUrl: "app/login/view-forgot-password.html",
              controller: "forgotPasswordCtrl"
            }
          }
        })
        .state("app.roleChooser", {//DONE
          onEnter: onEnter,
          url: "/roleChooser",
          views: {
            'appContent': {
              templateUrl: "app/login/view-role-chooser.html",
              controller: "roleChooserCtrl"
            }
          }
        })
        .state("app.signupFan", {//DONE
          onEnter: onEnter,
          url: "/signupFan",
          views: {
            'appContent': {
              templateUrl: "app/signup/view-signup-fan.html",
              controller: "signupCtrl"
            }
          }
        })
        .state("app.fbSignUpConfirm", {
          onEnter: onEnter,
          url: "/fbSignUpConfirm/:fbid?userName&fullName&email&thumbnail&picture",
          cache: false,
          views: {
            'appContent': {
              templateUrl: "app/signup/view-fb-signup-confirm.html",
              controller: "fbSignupConfirmCtrl"
            }
          }
        })
        .state("app.onboarding", {// ???
          onEnter: onEnter,
          url: "/onboarding",
          views: {
            'appContent': {
              templateUrl: "app/onboarding/view-onboarding.html",
              controller: "onboardingCtrl"
            }
          }
        })
        .state("app.fan", {// Need Translations
          onEnter: onEnter,
          url: "/fan",
          authorize: true,
          cache: false,
          views: {
            'appContent': {
              templateUrl: "app/fan/view-fan-home.html",
              controller: "fanHomeCtrl"
            }
          }
        })

        .state("app.fanPage", {
          onEnter: onEnter,
          url: "/fanpage/:fanId",
          views: {
            'appContent': {
              templateUrl: "app/fan/view-fan-page.html",
              controller: "fanPageCtrl"
            }
          }
        })
        .state("app.fanFriends", {
          onEnter: onEnter,
          url: "/fan/friends",
          authorize: true,
          views: {
            'appContent': {
              templateUrl: "app/fan/view-fan-friends-fans.html",
              controller: "fanFriendsFansCtrl"
            }
          }
        })
        .state("app.fanEdit", {//DONE
          onEnter: onEnter,
          url: "/fan/edit",
          authorize: true,
          views: {
            'appContent': {
              templateUrl: "app/fan/view-fan-edit.html",
              controller: "fanEditCtrl"
            }
          }
        })
        .state("app.msgs", {
          onEnter: onEnter,
          url: "/msgs",
          authorize: true,
          views: {
            'appContent': {
              templateUrl: "app/notifications/view-msgs.html",
              controller: "msgsCtrl"
            }
          }
        })
        .state("app.teamsList", {// Need Translations
          onEnter: onEnter,
          url: "/teamsList",
          views: {
            'appContent': {
              templateUrl: "app/teams/view-teams-list.html",
              controller: "teamsCtrl"
            }
          }
        })
        .state("app.team", {
          onEnter: onEnter,
          url: "/team/:teamId/:leagueId",
          views: {
            'appContent': {
              templateUrl: "app/teams/view-league-team.html",
              controller: "leagueTeamCtrl"
            }
          }
        })

        .state("app.clubteam", {
          onEnter: onEnter,
          url: "/clubteam/:teamId/:clubId",
          views: {
            'appContent': {
              templateUrl: "app/teams/view-club-team.html",
              controller: "clubTeamCtrl"
            }
          }
        })

        .state("app.trainingteam", {
          onEnter: onEnter,
          url: "/trainingteam/:teamId/:clubId",
          views: {
            'appContent': {
              templateUrl: "app/teams/view-training-team.html",
              controller: "trainingTeamCtrl"
            }
          }
        })

        .state("app.leagueteam", {
          onEnter: onEnter,
          url: "/leagueteam/:teamId/:leagueId",
          views: {
            'appContent': {
              templateUrl: "app/teams/view-league-team.html",
              controller: "leagueTeamCtrl"
            }
          }
        })
        .state("app.categorylist", {
          onEnter: onEnter,
          url: "/categorylist/:competitionId/:areaStr",
          views: {
            'appContent': {
              templateUrl: "app/competition/view-category-list.html",
              controller: "competitionsCtrl"
            }
          }
        })
        .state("app.multimedia", {// ???
          onEnter: onEnter,
          url: "/multimedia",
          views: {
            'appContent': {
              templateUrl: "app/multimedia/view-multimedia.html",
              controller: "multimediaCtrl"
            }
          }
        })
        .state("app.leaguesList", {// DONE
          onEnter: onEnter,
          url: "/leaguesList",
          views: {
            'appContent': {
              templateUrl: "app/leagues/view-leagues-list.html",
              controller: "leaguesCtrl"
            }
          }
        })

        .state("app.competitionsList", {// DONE
          onEnter: onEnter,
          url: "/competitionsList",
          views: {
            'appContent': {
              templateUrl: "app/competition/view-competitions-list.html",
              controller: "competitionsCtrl"
            }
          }
        })
        .state("app.eventsList", {// DONE
          onEnter: onEnter,
          url: "/events",
          views: {
            'appContent': {
              templateUrl: "app/events/view-event-list.html",
              controller: "eventsCtrl"
            }
          }
        })
        .state("app.event", {// DONE
          onEnter: onEnter,
          url: "/event/event/:eventId",
          views: {
            'appContent': {
              templateUrl: "app/event/view-event.html",
              controller: "eventCtrl"
            }
          }
        })
        .state("app.competitionsDetailList", {// DONE
          onEnter: onEnter,
          url: "/competitionsDetailList/area/:areaStr",
          views: {
            'appContent': {
              templateUrl: "app/competition/view-competition-details-list.html",
              controller: "competitionsCtrl"
            }
          }
        })
        .state("app.rankings", {// DONE
          onEnter: onEnter,
          views: {
            'appContent': {
              templateUrl: "app/rankings/view-ranks-list.html",
              controller: "rankingsCtrl"
            }
          }
        })

        .state("app.activitiesList", {// DONE
          onEnter: onEnter,
          url: "/unions",
          views: {
            'appContent': {
              templateUrl: "app/union/view-activities-list.html",
              controller: "unionHomeCtrl"
            }
          }
        })
        .state("app.league", {
          onEnter: onEnter,
          url: "/league/:leagueId",
          url: "/league/:leagueId/team/:teamId/",
          views: {
            'appContent': {
              templateUrl: "app/leagues/view-league.html",
              controller: "leagueCtrl"
            }
          }
        })
        .state("app.game", {// DONE
          onEnter: onEnter,
          url: "/game/:gameId/type/:gameType/",
          views: {
            'appContent': {
              templateUrl: "app/game/game-view.html",
              controller: "gameCtrl"
            }
          }
        })
        .state("app.player", {// DONE
          onEnter: onEnter,
          url: "/player/:playerId/league/:leagueId/Height/:Height/",
          views: {
            'appContent': {
              templateUrl: "app/player/player-view.html",
              controller: "playerCtrl"
            }
          }
        })
        .state("app.history", {// DONE
          onEnter: onEnter,
          url: "/history/:gameId",
          views: {
            'appContent': {
              templateUrl: "app/game/history-view.html",
              controller: "historyCtrl"
            }
          }
        })
        .state("app.notifications", {// DONE
          onEnter: onEnter,
          url: "/notifications",
          views: {
            'appContent': {
              templateUrl: "app/notifications/notifications-view.html",
              controller: "notificationsCtrl"
            }
          }
        })
        .state("app.termsOfUse", {// ???
          onEnter: onEnter,
          url: "/termsOfUse",
          views: {
            'appContent': {
              templateUrl: "app/login/view-terms-of-use.html",
              controller: "termsOfUseCtrl"
            }
          }
        })
        .state("app.eilatTournament", {
          onEnter: onEnter,
          url: "/eilat-tournament",
          views: {
            'appContent': {
              templateUrl: "app/eilat-tournament/eilat-tournament.html",
              controller: "eilatTournamentCtrl"
            }
          }
        })
        .state("app.training", {
          url: "/training",
          views: {
            'appContent': {
              templateUrl: "app/training/training.html"
              // controller: "trainingCtrl"
            }
          }
        })
        .state("app.rules", {
          url: "/rules",
          views: {
            'appContent': {
              templateUrl: "app/rules/rules.html",
              controller: "rulesCtrl"
            }
          }
        })
        .state("app.faq", {
          url: "/faq",
          views: {
            'appContent': {
              templateUrl: "app/faq/faq.html"
            }
          }
        })
        .state("app.referee", {
          url: "/referee",
          views: {
            'appContent': {
              templateUrl: "app/referee/view-referee-home.html",
              controller: "refereeHomeCtrl"
            }
          }
        })
        .state("app.gameResults", {
          url: "/referee/gameResults/:gameId",
          views: {
            'appContent': {
              templateUrl: "app/referee/view-referee-game-results.html",
              controller: "refereeUpdateGameResultsCtrl"
            }
          }
        })
        .state("app.union", {
          url: "/union",
          views: {
            'appContent': {
              templateUrl: "app/union/union-home-view.html",
              controller: "unionHomeCtrl"
            }
          }
        })

        .state("app.clubs", {
          url: "/club",
          views: {
            'appContent': {
              templateUrl: "app/club/clubs.html",
              controller: "clubsCtrl"
            }
          }
        })
        .state("app.clubDetailList", {
          url: "/club/area/:areaStr",
          views: {
            'appContent': {
              templateUrl: "app/club/clubs-details-list.html",
              controller: "clubsCtrl"
            }
          }
        })
        .state("app.club", {
          onEnter: onEnter,
          url: "/club/:clubId",
          views: {
            'appContent': {
              templateUrl: "app/club/club-home-view.html",
              controller: "clubHomeCtrl"
            }
          }
        })

        .state("app.sendmsgs", {
          onEnter: onEnter,
          url: "/sendmsgs/:receiverId",
          authorize: true,
          views: {
            'appContent': {
              templateUrl: "app/notifications/view-send-msgs.html",
              controller: "msgsSendCtrl"
            }
          }
        })

        .state("app.fwdmsgs", {
          onEnter: onEnter,
          url: "/fwdmsgs/:messageId",
          authorize: true,
          views: {
            'appContent': {
              templateUrl: "app/notifications/modal-friends-list.html",
              controller: "msgsCtrl"
            }
          }
        })

        .state("app.sendreply", {
          onEnter: onEnter,
          url: "/sendreply/:messageId",
          authorize: true,
          views: {
            'appContent': {
              templateUrl: "app/notifications/view-send-reply.html",
              controller: "replySendCtrl"
            }
          }
        })

        ;

      $urlRouterProvider.otherwise("/app/splash");

    });
})();
