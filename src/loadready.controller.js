(function() {
angular.module('Raskladka')
.controller('LoadReadyController', LoadReadyController);

	LoadReadyController.$inject = ['NewTripService', '$scope'];
	function LoadReadyController(NewTripService, $scope) {
		var loadCtrl = this;	
		NewTripService.productState = false; 
		$scope.mainCtrl.edit = false;	
		loadCtrl.checkDB = function() {
			NewTripService.checkName = loadCtrl.tripName;
			NewTripService.checkPassword = loadCtrl.tripPassword;			
		}
	}	
})();