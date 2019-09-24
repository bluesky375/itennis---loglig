(function(){
	'use strict';

	function EilatTournamentService(apiService){
		this._apiService = apiService;
	}

	EilatTournamentService.$inject = [
		'apiService'
	];

	EilatTournamentService.prototype.getEilatTournamentList = function(){
		return this._apiService.getByUrl(API_GET_EILAT_TOURNAMENT_LIST);
	};

	EilatTournamentService.prototype.getPdfFiles = function() {
		return this._apiService.makeRequest({
			method: "GET",
			url: API_GET_EILAT_TOURNAMENT_PDF + UNION_ID
		});
	}

	angular
		.module('LogligApp.services')
		.service('eilatTournamentService', EilatTournamentService)
}());
