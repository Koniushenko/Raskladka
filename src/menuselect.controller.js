
(function() {
angular.module('Raskladka')
.controller('MenuController', MenuController)
.directive('showDaysMenu', ShowDaysMenu);

MenuController.$inject = ['NewTripService'];
function MenuController(NewTripService) {
	var menuCtrl = this;

	menuCtrl.breakfasts = NewTripService.getMenu('breakfast');
	menuCtrl.lunches = NewTripService.getMenu('lunch');
	menuCtrl.dinners = NewTripService.getMenu('dinner');
	menuCtrl.train = NewTripService.getMenu('train');
	menuCtrl.measures = NewTripService.measures;

	

	
	menuCtrl.arrangeMenu = function() {
		menuCtrl.tripDays = [];
		menuCtrl.tripBreakfasts = [];
		menuCtrl.tripLunches = [];
		menuCtrl.tripDinners = [];
		NewTripService.arrangeMenu(menuCtrl);
	}

	
	menuCtrl.arrangeMenu();

	

	
	menuCtrl.addMeal = function(menu, number) {		
		menu[number-1].meals.push({name: '', maleNorm: 0, femaleNorm: 0, measure: 'г'});
		menu[number-1].toDelete.push(false);
	}

	menuCtrl.deleteMeals = function(menu, number) {
		for (var i=0; i<menu[number-1].meals.length; i++) {
			if (menu[number-1].toDelete[i]) {
				menu[number-1].meals.splice(i, 1);
				menu[number-1].toDelete.splice(i, 1);
				i--;
			}
		}
		if (!menu[number-1].meals.length ) {
			if (menu.length > 1) menuCtrl.deleteMenu( menu, number);
			else {
				menuCtrl.addMeal(menu, 1)
			}
		} 
	}

	menuCtrl.addMenu = function(menu) {
		var lastMenu = menu.length - 1;
		if (!menu[lastMenu].meals.length ) return;
		menu.push(
			{number: lastMenu +2,
			 times: 0,
			 meals: [{name: '', maleNorm: 0, femaleNorm: 0, measure: 'г'}],
			 toDelete: [false]
		})
		menuCtrl.arrangeMenu();
	}

	menuCtrl.deleteMenu = function(menu, number) {
		menu.splice(number-1, 1);
		for (var i=number-1; i<menu.length; i++) {
			menu[i].number-=1;
		}
		menuCtrl.arrangeMenu();
	}

	menuCtrl.isDoubleName = function(menu, number) {
		var mealsNames = [];
		for (var key in menu[number-1].meals) mealsNames.push(menu[number-1].meals[key].name);
		while (mealsNames.length > 0) {
			var nextMeal = mealsNames.pop();
			if (nextMeal && ~mealsNames.indexOf(nextMeal)) return true;
		}
		return false;
	}

	menuCtrl.differentMeasures = function() {
		var productMeasure = {};
		result = '';
		menuCtrl.breakfasts.some(function(breakfast, number) {
			return breakfast.meals.some(function(product, index){
				if (product.name in productMeasure) {
					if (productMeasure[product.name] != product.measure) {
						result = 'Завтрак' + (number+1) + product.name + 'поз'+ index;
						return true;
					}
				}
				else productMeasure[product.name] = product.measure;
			})			
		})
		if (result) return result;
		menuCtrl.lunches.some(function(lunch, number) {
			return lunch.meals.some(function(product, index){
				if (product.name in productMeasure) {
					if (productMeasure[product.name] != product.measure) {
						result = 'Перекус' + (number+1) + product.name + 'поз'+ index;
						return true;
					}
				}
				else productMeasure[product.name] = product.measure;
			})
		})
		if (result) return result;
		menuCtrl.dinners.some(function(dinner, number) {
			return dinner.meals.some(function(product, index){
				if (product.name in productMeasure) {
					if (productMeasure[product.name] != product.measure) {
						result = 'Ужин' + (number+1) + product.name + 'поз'+ index;
						return true;
					}
				}
				else productMeasure[product.name] = product.measure;
			})
		})
	return result;
	}

	menuCtrl.save = function() {
		NewTripService.saveMenu(menuCtrl);
	}

	menuCtrl.isTimeOut = function() {
		return NewTripService.timeOut;
	}

	
}

function ShowDaysMenu() {
	var ddo = {
		restrict: 'E',
		scope: {
			days: '<',
			breakfasts: '<',
			lunches: '<',
			dinners: '<'
		},
		templateUrl: 'templates/showdaysmenu.html',		
		
	};
	return ddo;
};

})();