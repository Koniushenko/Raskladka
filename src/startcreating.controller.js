(function() {
angular.module('Raskladka')
.controller('StartCreatingController', StartCreatingController);

StartCreatingController.$inject = ['NewTripService', '$interval', '$scope'];
function StartCreatingController(NewTripService, $interval, $scope) {
	var startCtrl = this;

	$scope.mainCtrl.edit = true;
	$scope.mainCtrl.seo = {
		title: 'Что взять впоход | Туристический поход | Походы ПВД | Горный поход ',
		description: 'Чтоб узнать, что взять впоход - вводим исходные данные про ваш туристический поход. Маршрут, количество дней и туристов. Даже если это ПВД (поход выходного дня) – ему нужен план. А горный поход – тем более. Хорошие походы начинаются с точного планирования '
	};
	NewTripService.productState = false; 	

	startCtrl.checkDateTime = function(strDate, strTime) {
		startCtrl.firstInfo = NewTripService.getFirstInfo();
		if (!strTime) strTime = '23:59';
		if (!strDate) strDate = new Date().toISOString().slice(0,10);
		startCtrl.firstInfo.tripDate = new Date(strDate + 'T' + strTime + ':00Z');
		var nowDate = NewTripService.getActualDate(false); 
		if (nowDate >= startCtrl.firstInfo.tripDate) {
			NewTripService.timeOut = true;
			return false;			
		}
		NewTripService.timeOut = false;
		return true;
	}

	// startCtrl.submit = function() {
	// 	if (!startCtrl.firstInfo.tripName) startCtrl.firstInfo.tripName = 'Безымянный поход';
	// 	if (!startCtrl.firstInfo.tripDescription) startCtrl.firstInfo.tripDescription = 'Тут могло быть описание похода';
		
	// 	if (!startCtrl.firstInfo.stringDate) startCtrl.firstInfo.stringDate = new Date().toISOString().slice(0,10);
	// 	if (!startCtrl.firstInfo.stringTime) startCtrl.firstInfo.stringTime = '23:59';	
	// 	if (!startCtrl.firstInfo.tripDate) startCtrl.firstInfo.tripDate = new Date(startCtrl.firstInfo.stringDate
	// 	 + 'T' + startCtrl.firstInfo.stringTime + ':00Z');	
	// 	if (!startCtrl.firstInfo.tripMembers) startCtrl.firstInfo.tripMembers = 2;
	// 	if (!startCtrl.firstInfo.tripNights) startCtrl.firstInfo.tripNights = 1;	
	// 	if (!startCtrl.firstInfo.tripPassword) startCtrl.firstInfo.tripPassword = '';	
	// 	NewTripService.saveFirstInfo(startCtrl.firstInfo);
	// }

}
	
})();