(function() {
angular.module('Raskladka')
.controller('LoadReadyController', LoadReadyController);

	LoadReadyController.$inject = ['NewTripService', '$scope'];
	function LoadReadyController(NewTripService, $scope) {
		var loadCtrl = this;	
               $scope.mainCtrl.seo = {
		title: 'Готовая походная раскладка | Раскладка еды в поход - скачать образец',
		description: 'Загружай готовую раскладку еды в поход, чтобы на ее основе быстро сделать свою походную раскладку. После редактирования можно сохранить свою раскладку питания в походе под новым именем и пользоваться ей всей группой онлайн'
	         }	
		NewTripService.productState = false; 
		$scope.mainCtrl.edit = false;	
		loadCtrl.checkDB = function() {
			NewTripService.checkName = loadCtrl.tripName;
			NewTripService.checkPassword = loadCtrl.tripPassword;			
		}
	}	
})();