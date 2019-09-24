(function(){
	'use strict';

	function RulesService(apiService){
		this._apiService = apiService;
	}

	RulesService.$inject = [
		'apiService'
	];

	RulesService.prototype.getAppRulesFile = function(){
		return APP_RULES_FILE;
	};

	angular
		.module('LogligApp.services')
		.service('rulesService', RulesService)
}());