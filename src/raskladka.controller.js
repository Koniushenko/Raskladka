 (function() {
	angular.module('Raskladka')
	.controller('MainController', MainController)
	.directive('showTrip', ShowTrip);

MainController.$inject = ['NewTripService', '$scope', '$state'];
function MainController(NewTripService, $scope, $state) {
	// var mainCtrl = this;

	$scope.mainCtrl = this;
	$scope.mainCtrl.edit = false;
	$scope.finished = NewTripService.allBerunsDefined = false;


	$scope.reset = function() {
		if ($scope.mainCtrl.edit) {
			var answer = confirm('Сбросить все данные?');
			if (!answer) return;
		}		
		$scope.mainCtrl.edit = true;
		NewTripService.resetAll();
		$state.go('createNew');				
		$scope.showTripCtrl.showInfo();
	}

	$scope.noEdit= function() {
		$scope.mainCtrl.edit = false;
	}
 
	$scope.isFinished= function() {
		$scope.finished = NewTripService.allBerunsDefined;
	}

	$scope.adminStatus = function() {
		NewTripService.admin = $scope.admin;
	}

	$scope.checkAdmin = function(login, password) {
		var promise = NewTripService.checkAdmin(login, password, true);
		promise.then(function(response) {
			if (response.data === 'Добро пожаловать! ') {				
				NewTripService.admin = $scope.admin = true;
				NewTripService.currentAdmin = login;
			}
			else NewTripService.admin = $scope.admin = false;
			alert(response.data);
			// if (NewTripService.savedAdmin != login)	{
			// 	$scope.mainCtrl.edit = false;
			// 	$scope.reset();	
			// 	NewTripService.currentAdmin = login;
			// }
		})		 
	}

	$scope.checkUser = function(login, password) {
		var promise = NewTripService.checkAdmin(login, password, false);
		promise.then(function(response) {
			if (response.data === 'Вы зарегистрировались! ') {
				NewTripService.admin = $scope.admin = true;
				NewTripService.currentAdmin = login;
				alert('Ваш логин: ' + $scope.login + '\nВаш пароль: ' + $scope.password);
			}
			else NewTripService.admin = $scope.admin = false;
			alert(response.data);
			// if (NewTripService.savedAdmin != login)	{
			// 	$scope.mainCtrl.edit = false;
			// 	$scope.reset();	
			// 	NewTripService.currentAdmin = login;
			// }			
		})
	}



	$scope.adminExit = function() {
		NewTripService.admin = $scope.admin = false;
		NewTripService.currentAdmin = undefined;
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

	$scope.goToExpenses = function() {
		if(!NewTripService.allBerunsDefined) alert('Еще не все продукты рапределены!');
		else $state.go('showReady');
	}
}


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

ShowTripController.$inject = ['NewTripService', '$interval', '$state'];
function ShowTripController(NewTripService, $interval, $state) {
	var showTripCtrl = this;

	showTripCtrl.showInfo = function() {
		var promise;					
		if (promise) $interval.cancel(promise);		
		promise = $interval(function () {
			showTripCtrl.nowDate = NewTripService.getActualDate(true);
			var nowDate = NewTripService.getActualDate(false);
			showTripCtrl.firstInfo = NewTripService.getFirstInfo();
			var secsLeft = NewTripService.countSecsLeft(showTripCtrl.firstInfo.tripDate, nowDate);
			if (secsLeft >= 0) {
				showTripCtrl.timeLeft = NewTripService.countTimeLeft(secsLeft);	
				showTripCtrl.timeOut = false;
			}
			else {
				if (!NewTripService.timeOut) alert('Исправьте день и время отправления!');
				showTripCtrl.timeLeft = 'Времени не осталось! Вы опоздали!';
				showTripCtrl.timeOut = true;				
				$state.go('createNew');
								}	
		}, 1000);
	}

	showTripCtrl.refreshTotal = function () {
		NewTripService.refreshProductsTotal();
	}

	showTripCtrl.notFirstState = function () {
		return !$state.is('createNew');
	}

	showTripCtrl.showInfo();

};

})();
