(function(){
  'use strict';

  function TrainingCtrl(appService, $scope){
    this._appService = appService;
    this._$scope = $scope;

    this._init();
  }

  TrainingCtrl.$inject = [
    'appService',
    '$scope'
  ];

  TrainingCtrl.prototype._init = function(){


  };

  angular
    .module('LogligApp.controllers')
    .controller('trainingCtrl', TrainingCtrl)
}());