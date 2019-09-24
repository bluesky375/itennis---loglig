/* global angular */

(function(){
	'use strict';

	function SingleClick($scope, $element){
		this._$scope = $scope;
		this._$element = $element;

		this._DELAY = 300;
		this._clicks = 0;
		this._timer = null;

		this._listen();
	}

	SingleClick.$inject = [
		'$scope',
		'$element'
	];

	SingleClick.factory = function(){
		return {
			restrict: 'A',
			controller: SingleClick,
			scope: {
				clickHandler: '&sinlgeClick',
				event: '@'
			}
		}
	};

	SingleClick.prototype._listen = function(){
		this._$element.on(this._$scope.event, this._doClick.bind(this, event));
	};

	SingleClick.prototype._doClick = function(){
		this._clicks++;

		if(this._clicks === 1) {
			this._timer = setTimeout(function() {
				this._$scope.clickHandler();
				this._clicks = 0;
			}.bind(this), this._DELAY);
		} else {
			clearTimeout(this._timer);
			this._clicks = 0;
		}
	};

	angular
		.module('LogligApp')
		.directive('sinlgeClick', SingleClick.factory);
}());