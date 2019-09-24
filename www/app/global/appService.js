(function () {
  "use strict";

  angular.module("LogligApp.services", []).factory("appService", ["$translate", "$ionicPopup", "$state",
    function ($translate, $ionicPopup, $state) {

      var appService = {};

      /* starts and stops the application waiting indicator */
      this.wait = function (show) {
        if (show)
          $(".spinner").show();
        else
          $(".spinner").hide();
      };

      /* */
      this.alertPopup = function (title, message, callback) {
        $translate('button_ok').then(function (okLabel) {
          var popup = $ionicPopup.alert({
            cssClass: 'defaultAlertPopup',
            title: title,
            template: message,
            okText: okLabel
          });
          popup.then(callback); //What should happen when tapping ok
          /*
           popup.then(function (res) {
           //What should happen wenn tapping ok
           }); */
        });
      };

      this.alertConfirmationPopup = function (title, message, callback) {
        $translate('button_ok').then(function (okLabel) {
          $translate('cancel').then(function (cancelLabel) {
            var popup = $ionicPopup.alert({
              cssClass: 'defaultAlertPopup',
              title: title,
              template: message,
              buttons: [{
                text: okLabel,
                type: 'button-confirm button-positive',
                onTap: function () {
                  callback(true);
                }
              },
                {
                  text: cancelLabel,
                  type: 'button-assertive button-confirm',
                  onTap: function () {
                    callback(false);
                  }
                }]
            });
          });
        });
      };

      this.notloggedPupup = function () {

        var popTitle = "פעולה למשתמשים רשומים בלבד";
        var popMessage = "הרשם לאפליקציה ותוכל להוסיף חברים, לשלוח הודעות ולעדכן מי מגיע למשחק...";

        $ionicPopup.confirm({
          title: popTitle,
          template: popMessage,
          cssClass: 'signin-alert',
          buttons: [{
            text: 'הרשמה',
            type: 'button-positive',
            onTap: function (e) {
              $state.go("app.signupFan");
            }
          }, {
            text: 'כניסה',
            type: 'button-positive btn-login',
            onTap: function (e) {
              $state.go("app.loginWorker");
            }
          }, {text: 'עוד לא'},]
        });
      }

      return this;
    }]);
})();
