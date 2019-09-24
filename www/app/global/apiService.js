(function () {
	"use strict";

	angular.module("LogligApp.services").service("apiService", ["$http", "$q",
		function ($http, $q) {

			var self = this;

			this.makeRequest = function (request) {

				var token = JSON.parse(localStorage.getItem(TOKEN_KEY));

				var settings = getSettings(request);

				if (token) {
					if (settings.headers) {
						settings.headers["Authorization"] = token.token_type + ' ' + token.access_token;
					}
					else {
						settings.headers = {
							"Accept": "application/json; charset=utf-8",
							"Content-Type": "application/json",
							"Authorization": token.token_type + ' ' + token.access_token
						}
					}
				}

				/*if (settings.headers) {
					settings.headers["culture"] = "he-IL";
				}*/

				if (settings.params) {
					settings.params["uni"] = new Date().getTime();
				}
				var deffered = $q.defer();

				$http(settings)
					.then(function (response) {
						deffered.resolve(response);
					}, function (response) {
						deffered.reject(response);
					});

				return deffered.promise;
			};

			this.getByUrl = function (apiUrl) {

				var request = {
					method: 'GET', url: apiUrl
				};

				return this.makeRequest(request);
			};


			function getSettings(requestData) {
				return {
					method: requestData.method || "POST",
					url: requestData.url,
					dataType: requestData.dataType || "json",
					data: requestData.data || {},
					params: requestData.params || {},
					headers: requestData.headers || {
						"Accept": "application/json; charset=utf-8"
						, "Content-Type": "application/json"
						//, "_culture": "he-IL"
					},
					async: requestData.async || "false",
					cache: requestData.cache || "false",
					success: requestData.success || {},
					error: requestData.error || {},
					complete: requestData.complete || {},
					fail: requestData.fail || {}
				};
			}

		}]);
})();