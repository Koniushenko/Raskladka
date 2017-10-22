
(function() {
angular.module('Raskladka')
.controller('MenuController', MenuController)
.directive('showDaysMenu', ShowDaysMenu);

MenuController.$inject = ['NewTripService', '$scope'];
function MenuController(NewTripService, $scope) {
	var menuCtrl = this;

	$scope.mainCtrl.edit = true;
	menuCtrl.breakfasts = NewTripService.getMenu('breakfast');
	menuCtrl.lunches = NewTripService.getMenu('lunch');
	menuCtrl.dinners = NewTripService.getMenu('dinner');
	menuCtrl.train = NewTripService.getMenu('train');
	menuCtrl.measures = NewTripService.measures;
	NewTripService.productState = false; 
	var allProd = NewTripService.getProducts();

	menuCtrl.newProduct = function() {
			
		NewTripService.allBerunsDefined = ! (menuCtrl.breakfasts.some(function(breakfast) {
			if (breakfast.times == 0) return false;
			return breakfast.meals.some(function(meal) {
				return !(meal.name in allProd && allProd[meal.name].berun);					
			})
			}) || menuCtrl.lunches.some(function(lunch) {
				if (lunch.times == 0) return false;
				return lunch.meals.some(function(meal) {
					return !(meal.name in allProd && allProd[meal.name].berun);
				})
			}) || menuCtrl.dinners.some(function(dinner) {
				if (dinner.times == 0) return false;
				return dinner.meals.some(function(meal) {
					return !(meal.name in allProd && allProd[meal.name].berun);
				})
			}) || menuCtrl.train.some(function(train) {
				return train.meals.some(function(meal) {
					return !(meal.name in NewTripService.trainProducts && NewTripService.trainProducts[meal.name].berun)						
			})
		}) 
		)		
	}

	menuCtrl.resizeMenu = function(menu) {
		switch (menu.length) {
			case 1: 
				return 'col-xs-12';				
			case 2:
				return 'col-sm-6'
			case 3:
				return 'col-sm-6 col-lg-4'
			case 4:
				return 'col-sm-6'
		}
	}
	
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
		menuCtrl.resizeMenu(menu);
	}

	menuCtrl.deleteMenu = function(menu, number) {
		menu.splice(number-1, 1);
		for (var i=number-1; i<menu.length; i++) {
			menu[i].number-=1;
		}
		menuCtrl.arrangeMenu();
		menuCtrl.resizeMenu(menu);
	}

	menuCtrl.isDoubleName = function(menu, number) {
		var mealsNames = [];
		for (var key in menu[number-1].meals) mealsNames.push(menu[number-1].meals[key].name);
		while (mealsNames.length > 0) {
			var nextMeal = mealsNames.pop();
			if (nextMeal && ~mealsNames.indexOf(nextMeal)) {
				return true;
			}
		}
		return false;
	}

	menuCtrl.anyDoubleName = function() {	
		var anyDouble = false;	
		anyDouble = menuCtrl.breakfasts.some(function(breakfast) {
			if (menuCtrl.isDoubleName(menuCtrl.breakfasts, breakfast.number))
				return true;
		}) ||
		menuCtrl.lunches.some(function(lunch) {
			if (menuCtrl.isDoubleName(menuCtrl.lunches, lunch.number))
				return true;
		}) ||
		menuCtrl.dinners.some(function(dinner) {
			if (menuCtrl.isDoubleName(menuCtrl.dinners, dinner.number))
				return true;
		}) || menuCtrl.isDoubleName(menuCtrl.train, 1)
		return anyDouble;			
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
		if (result) return result;
		menuCtrl.train.some(function(train, number) {
			return train.meals.some(function(product, index){
				if (product.name in productMeasure) {
					if (productMeasure[product.name] != product.measure) {
						result = 'поезд' +  product.name + 'поз'+ index;
						return true;
					}
				}
				else productMeasure[product.name] = product.measure;
			})
		})
	return result;
	}

	// menuCtrl.save = function() {
	// 	NewTripService.saveMenu(menuCtrl);
	// }

	menuCtrl.isTimeOut = function() {
		return NewTripService.timeOut;
	}

	menuCtrl.formError = function() {

		if ($scope.breakForm.$invalid || $scope.lunchForm.$invalid|| $scope.dinnerForm.$invalid || $scope.trainForm.$invalid 
			|| menuCtrl.isTimeOut() || menuCtrl.differentMeasures() || menuCtrl.anyDoubleName())
			NewTripService.errorMenu = true;
		else NewTripService.errorMenu = false;
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