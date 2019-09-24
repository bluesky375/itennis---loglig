(function(){
	'use strict';

	function EilatTournamentCtrl(appService, $scope, eilatTournamentService){
		this._appService = appService;
		this._$scope = $scope;
		this._eilatTournamentService = eilatTournamentService;

		this._init();
	}

	EilatTournamentCtrl.$inject = [
		'appService',
		'$scope',
		'eilatTournamentService'
	];

	EilatTournamentCtrl.prototype._init = function(){
		this._appService.wait(true);

		this._eilatTournamentService.getEilatTournamentList().then(function(res){
			this._$scope.eilatTornamentList = res.data;
		}.bind(this));

		this._eilatTournamentService.getPdfFiles().then(function(res) {
			this._$scope.pdfFiles = res.data;
		}.bind(this));

		this._appService.wait(false);
	};

	angular
		.module('LogligApp.controllers')
		.controller('eilatTournamentCtrl', EilatTournamentCtrl)
}());