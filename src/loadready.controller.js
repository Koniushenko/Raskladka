(function() {
angular.module('Raskladka')
.controller('LoadReadyController', LoadReadyController);

	LoadReadyController.$inject = ['NewTripService', '$http', '$q'];
	function LoadReadyController(NewTripService, $http, $q) {
		var loadCtrl = this;		
		loadCtrl.checkDB = function() {
			NewTripService.checkName = loadCtrl.tripName;
			NewTripService.checkPassword = loadCtrl.tripPassword;			
		}
	}	
})();