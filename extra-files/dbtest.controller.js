(function() {
angular.module('Raskladka')
.controller('dbController', dbController);

	dbController.$inject = ['NewTripService', '$http'];
	function dbController(NewTripService, $http) {
		var dbCtrl = this;			
		dbCtrl.tripInfo = NewTripService.tripInfo;
		dbCtrl.breakfasts = NewTripService.breakfasts;
		dbCtrl.lunches = NewTripService.lunches;
		dbCtrl.dinners = NewTripService.dinners;
		dbCtrl.train = NewTripService.train;
		dbCtrl.measures = NewTripService.measures;
		dbCtrl.members = NewTripService.membersInfo;
		dbCtrl.measWeights = NewTripService.measWeights;
		dbCtrl.equipment = NewTripService.equipment;


	}	
})();