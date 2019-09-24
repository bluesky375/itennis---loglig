(function () {
	"use strict";

	angular.module("LogligApp", ["ionic.native","ionic", "ngSanitize", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.poster", "LogligApp.controllers", "LogligApp.services", "pascalprecht.translate", "ngCordova"])
		.run(function ($ionicPlatform, $rootScope, authService, notificationsService,$cordovaDeeplinks,$timeout,$state) {

			$ionicPlatform.ready(function () {
				//define deep links
				console.log("checkmestart")
				$cordovaDeeplinks.route({
					'/event/event/:eventId': {
						target: 'app.event',
						parent: 'app.eventsList'
					},
					'/login': {
						target: 'app.login',
						parent: 'app.splash'
					},
					'/roleChooser': {
						target: 'app.roleChooser',
						parent: 'app.splash'
					}
				}).subscribe(function(match) {
					console.log("matchcheckme" + JSON.stringify(match.$args));
					$state.go(match.$route.target, match.$args);
				}, function(nomatch) {
					console.warn('No match', nomatch);
				});
				console.log("checkmeend")
				var isWebView = ionic.Platform.isWebView();

				if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				}
				if (window.cordova != undefined && window.cordova.plugins != undefined)
					window.cordova.plugins.notification.local.on('trigger', function (notification) {
						notificationsService.addReminderToNotification(notification.text);
					}, this);
			});

			$rootScope.$on('$stateChangeStart', function (event, next, current) {

				if (next.authorize) {
					if (!authService.isValid()) {
						authService.goToLogin();
						event.preventDefault();
					}
				}
			});

		})

		.config(function (ionGalleryConfigProvider, $translateProvider, $ionicConfigProvider) {

			// enable native scrolling
			//if (ionic.Platform.isAndroid()) {
			//    $ionicConfigProvider.scrolling.jsScrolling(false);
			//}
			
			ionGalleryConfigProvider.setGalleryConfig({
				action_label: 'בוצע',
				toggle: true,
				row_size: 3,
				fixed_row_size: true
			});

			//Initializing Angular Translate
			initLocalization($translateProvider);
			//routerConfig($urlRouterProvider, $stateProvider);

		});

})();
