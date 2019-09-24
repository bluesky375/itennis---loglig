/* global angular */

(function(){
	'use strict';

	function OpenURL($scope, $element, $window){
		this._$scope = $scope;
		this._$element = $element;
		this._$window = $window;

		this._listen();
	}

	OpenURL.$inject = [
		'$scope',
		'$element',
		'$window'
	];

	OpenURL.factory = function(){
		return {
			restrict: 'A',
			controller: OpenURL,
			scope: {
				openurl: '@openurl'
			}
		}
	};

	OpenURL.prototype._listen = function(){
		this._$element.on('click', this._open.bind(this));
	};

	OpenURL.prototype._open = function(){
		this._$window.open(this._$scope.openurl, '_system', 'location=yes');
	};

	angular
		.module('LogligApp')
		.directive('openurl', OpenURL.factory);
}());