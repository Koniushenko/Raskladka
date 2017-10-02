 (function() {
	angular.module('Raskladka')
	.controller('MainController', MainController)
	.directive('showTrip', ShowTrip);

MainController.$inject = ['NewTripService', '$scope'];
function MainController(NewTripService, $scope) {
	var mainCtrl = this;

	$scope.reset = function() {
		NewTripService.resetAll();
	}

	$scope.adminStatus = function() {
		NewTripService.admin = $scope.admin;
	}

	$scope.checkUser = function() {
		NewTripService.admin = $scope.admin = true;
	}


	$scope.adminExit = function() {
		NewTripService.admin = $scope.admin = false;
	}
// Добавили кнопку записи на сервер в любой момент, доступна только админу
	$scope.saveDataToServer = function() {
		if (!$scope.admin) return false;
		NewTripService.saveToServer();
	}

	$scope.eraseTrip = function() {
		if (!$scope.admin) return false;
		NewTripService.eraseTrip();
	}
};


function ShowTrip() {
	var ddo = {
		restrict: 'E',
		templateUrl: 'templates/showtrip.html',		
		controller: ShowTripController,
		bindToController: true,
		controllerAs: 'showTripCtrl'
	};
	return ddo;
};

ShowTripController.$inject = ['NewTripService', '$interval'];
function ShowTripController(NewTripService, $interval) {
	var showTripCtrl = this;
	var savedInfo = NewTripService.getFirstInfo();
	var promise;	
	for (var key in savedInfo) {
		showTripCtrl[key] = savedInfo[key];
	}	
		
	if (promise) $interval.cancel(promise);
	promise = $interval(function () {
		showTripCtrl.nowDate = NewTripService.getActualDate(true);
		var nowDate = NewTripService.getActualDate(false);
		var secsLeft = NewTripService.countSecsLeft(showTripCtrl.tripDate, nowDate);
		if (secsLeft > 0) showTripCtrl.timeLeft = NewTripService.countTimeLeft(secsLeft);	
		else {
			showTripCtrl.timeLeft = 'Времени не осталось! Вы опоздали!';
			showTripCtrl.timeOut = NewTripService.timeOut = true;
			$interval.cancel(promise);				
			}	
		}, 1000);

	showTripCtrl.refreshTotal = function () {
		NewTripService.refreshProductsTotal();
	}

};

})();
