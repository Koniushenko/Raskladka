(function() {

'use strict';	
angular.module('Raskladka')
.service('NewTripService', NewTripService);

NewTripService.$inject = ['$q', '$http'];
function NewTripService($q, $http) {
	var newTrip = this;
	var tripInfo, membersInfo, equipmentInfo,  breakfasts, lunches, dinners, train, allProducts, productsTotal, trainTotal,
	measWeights, readyRaskladka, memberExpenses;

	newTrip.resetAll = function() {
		var startDate = new Date();		
		tripInfo = {
		'tripName' : '',
		'tripDescription' : '',
		'tripDate' : startDate,
		'stringDate' : startDate.toISOString().slice(0,10),
		'stringTime' : '23:59',
		'tripMembers': 2,
		'tripNights': 1
		};
		membersInfo = [];
		equipmentInfo = [];
		breakfasts = [
			{ number: 1,
			  times: 0,
			  meals: [{ name:'овсянка', maleNorm: 5,  measure: 'ст/л'}, { name:'цукаты', maleNorm: 1, measure: 'ст/л'}, 
			  { name:'сгущенка', maleNorm: 3, measure: 'ст/л'}, { name:'кофе', maleNorm: 2, measure: 'ч/л'}, 
			  { name:'вафля', maleNorm: 1, measure: 'шт'}]
			},
			{ number: 2, 
			  times: 0,
			  meals: [{ name:'мивина', maleNorm: 1.5, femaleNorm: 1, measure: 'пак'}, { name:'колбаса', maleNorm: 30, measure: 'г'}, 
			  { name:'сгущенка', maleNorm: 1, measure: 'ст/л'}, { name:'кофе', maleNorm: 2, measure: 'ч/л'}, 
			  { name:'вафля', maleNorm: 1, measure: 'шт'}, {name:'перец болг.', maleNorm: 0.5, measure: 'шт'}]
		}];	

		lunches = [
			{ number: 1,
			  times: 0,
			  meals: [{ name:'сало', maleNorm: 35, measure: 'г'}, { name:'колбаса', maleNorm: 30, measure: 'г'}, 
			  { name:'лук', maleNorm: 20, measure: 'г'}, { name:'зелень', maleNorm: 10, measure: 'г'}, 
			  { name:'хлеб', maleNorm: 70, measure: 'г'}]
			},
			{ number: 2, 
			  times: 0,
			  meals: [{ name:'консерва', maleNorm: 0.5, measure: 'бан'}, { name:'сыр', maleNorm: 50, measure: 'г'}, 
			   {name:'перец болг.', maleNorm: 0.5, measure: 'шт'}, { name:'зелень', maleNorm: 10, measure: 'г'}, 
			  { name:'хлеб', maleNorm: 70, measure: 'г'}]
		}];	

		dinners = [
			{ number: 1,
			  times: 0,	
			  meals: [{ name:'крупа', maleNorm: 70, femaleNorm: 60, measure: 'г'}, { name:'тушенка', maleNorm: 100, measure: 'г'}, 
			  { name:'сгущенка', maleNorm: 1, measure: 'ст/л'}, { name:'чай', maleNorm: 2, measure: 'ч/л'}, 
			  { name:'печенье', maleNorm: 2, measure: 'шт'}, { name:'сало', maleNorm: 25, measure: 'г'}, 
			  { name:'спирт', maleNorm: 100, femaleNorm: 80, measure: 'мл'}, { name:'хлеб', maleNorm: 35, measure: 'г'}, 
			  { name:'лимон', maleNorm: 20, measure: 'г'}, { name:'зелень', maleNorm: 10, measure: 'г'}, 
			  { name:'лук', maleNorm: 15, measure: 'г'}]
			},
			{ number: 2, 
			  times: 0,
			  meals: [{ name:'макароны', maleNorm: 80, measure: 'г'}, { name:'тушенка', maleNorm: 100, measure: 'г'}, 
			  { name:'сгущенка', maleNorm: 1, measure: 'ст/л'}, { name:'чай', maleNorm: 2, measure: 'ч/л'}, 
			  { name:'печенье', maleNorm: 2, measure: 'шт'}, { name:'сало', maleNorm: 25, measure: 'г'}, 
			  { name:'спирт', maleNorm: 100, femaleNorm: 80, measure: 'мл'}, { name:'хлеб', maleNorm: 35, measure: 'г'}, 
			  { name:'лимон', maleNorm: 20, measure: 'г'}, { name:'зелень', maleNorm: 10, measure: 'г'}, 
			  { name:'лук', maleNorm: 15, measure: 'г'}]
			}];	

		train = [
			{ number: 1,
			  times: 1,
			  meals: [{name:'мясо', maleNorm: 300, femaleNorm: 200, measure: 'г'}, { name:'яйца', maleNorm: 3, femaleNorm: 2, measure: 'шт'}, 
			  { name:'картошка', maleNorm: 4, femaleNorm: 3, measure: 'шт'}, { name:'билеты', maleNorm: 2, measure: 'шт'}, 
			  { name:'огурцы сол.', maleNorm: 3, measure: 'шт'}, { name:'помидоры', maleNorm: 2, measure: 'шт'}, 
			  { name:'водка', maleNorm: 250, femaleNorm: 150, measure: 'мл'}, { name:'хлеб', maleNorm: 50, measure: 'г'}, 
			  { name:'вода мин.', maleNorm: 0.5, measure: 'л'}, { name:'зелень', maleNorm: 10, measure: 'г'}, 
			  { name:'пиво', maleNorm: 1, femaleNorm: 0.5, measure: 'л'}]
			  }];
			
		newTrip.measures = ['г', 'кг', 'шт', 'бан', 'ст/л', 'ч/л', 'пак', 'бут', 'л', 'мл'];

		measWeights = {
			'овсянка': {
				'ст/л' : 0.009, 
				'ч/л' : 0.01
			},
			'цукаты': {
				'ст/л' : 0.03, 
				'ч/л' : 0.01
			},
			'сгущенка': {
				'ст/л' : 0.02, 
				'ч/л' : 0.015
			},
			'кофе': {
				'ст/л' : 0.02, 
				'ч/л' : 0.003
			},
			'чай': {
				'ст/л' : 0.02, 
				'ч/л' : 0.002
			},
			'вафля': {
				'шт' : 0.0267, 
				'пак' : 0.08
			},
			'спирт': {
				'мл' : 0.0008
			},
			'печенье': {
				'шт' : 0.01, 
				'пак' : 0.12
			},
			'консерва': {
				'бан' : 0.260			
			},
			'редиска': {
				'шт' : 0.03, 
			},
			'мивина': {
				'пак' : 0.037			
			},
			'лук': {
				'шт' : 0.12
			},
			'перец болг.' : {
				"шт" : 0.06
			},
			'лимон' : {
				"шт" : 0.12
			}

		};
		allProducts = {};
		productsTotal = [];
		trainTotal = [];
		newTrip.trainProducts = {};
		newTrip.alcoKoeff = 1;
		newTrip.emanKoeff = 0.75;
		newTrip.timeOut = false;
		// newTrip.finished = false;
		// newTrip.saved = false;
		readyRaskladka = [];
		memberExpenses = [];
		newTrip.males = 2;
		newTrip.females = 0;
	}

	newTrip.resetAll();	


	newTrip.loadFromDB = function() {
		var deferred = $q.defer();
		var promise = $http({
				method: "POST",
				url: "src/checkdb.php",
				data: {
					'tripName': newTrip.checkName,
					'tripPassword': newTrip.checkPassword
				}
			});
		promise.then(function(response) {
			alert("Отправляю на проверку... " + response.data );
			if (response.data != 'Есть такой поход! ')
				return deferred.promise;
			
		})
		.then(function() {
			var nextPromise = $http({
				method: "GET",
				url: "src/testdb.php",
				params: {
					'tripName': newTrip.checkName
				}
			});
			nextPromise.then(function(response) {
				
				tripInfo = response.data.tripInfo;
				var date = new Date(tripInfo.tripDate);
				var hoursOffset = date.getTimezoneOffset() / 60;
				date.setHours(date.getHours() - hoursOffset);
				tripInfo.tripDate = date;
				breakfasts = response.data.breakfasts;
				dinners = response.data.dinners;
				lunches = response.data.lunches;
				train = response.data.train;
				measWeights = response.data.measWeights;
				newTrip.measures = response.data.measures;
				membersInfo = response.data.membersInfo;
				equipmentInfo = response.data.equipment;
				productsTotal = response.data.productsTotal;
				trainTotal = response.data.trainTotal;
				newTrip.alcoKoeff = +tripInfo.alcoKoeff;
				newTrip.emanKoeff = +tripInfo.emanKoeff;
				newTrip.males = +tripInfo.males;
				newTrip.females = +tripInfo.females;
				newTrip.saved = true;
				memberExpenses = [];
				membersInfo.forEach(function(member){
					var memEx = {};
					memEx.addCost = member.addCost;
					memEx.addCostNote = member.addCostNote;
					memEx.eqExpenses = {};
					equipmentInfo.forEach(function(equip) {
						if ( +equip.berun == member.number )
							memEx.eqExpenses[equip.equipName] = equip.cost;
					});
					memEx.foodExpenses = {};
					productsTotal.forEach(function(product) {
						if (+product.berun == member.number)
							memEx.foodExpenses[product.name] = product.cost;
					});
					memEx.trainExpenses = {};
					trainTotal.forEach(function(product) {
						if (+product.berun == member.number)
							memEx.trainExpenses[product.name] = product.cost;
					});
					memberExpenses.push(memEx); 
				});
				deferred.resolve(response);
			});
		})
		.catch(function(error) {
			alert(error);
		});				
		return deferred.promise;		
	}

	
	

	newTrip.checkMembersQuantity = function() {

		var memQuantity = tripInfo['tripMembers'];
		var memSavedQuantity = membersInfo.length;		
				
		if (memQuantity >= memSavedQuantity) {
			for (var i=memSavedQuantity; i < memQuantity; i++) {
				membersInfo.push({
					name: 'участник' + i,
					phone: '000-000-00-00',
					sex: 'male',
					eat: true,
					noEat: [],
					number: i,
					equipWeight: 0,
					foodWeight: 0
				})
			}
		}
		else {
			for (i = memQuantity; i < memSavedQuantity; i++)
				membersInfo.pop();
		}
	}

	newTrip.countMalesFemales = function() {
		var males, females;
			males=females=0;
			membersInfo.forEach( function(member) {
				if (member.sex == 'male') males++;
				else females++;				
			});
			newTrip.males = males;
			newTrip.females = females;
	}

	newTrip.checkAdmin = function(login, password, admin) {
		
		var promise = $http({
				method: "POST",
				data: {
					'login' : login,
					'password': password,
					'admin': admin							
				},
				url: "src/checkadmin.php"
			});
		return promise;
	}

	newTrip.eraseTrip = function() {

		var tripPassword = prompt('Введи пароль похода:');
		console.log(tripPassword);
		$http({
			method: "POST",
			data: {
				'tripName' : tripInfo.tripName,
				'tripPassword': tripPassword							
			},
			url: "src/checkdb.php"
		})	
		.then(function( response ) { 
			alert("Отправляю на проверку... " + response.data );
			if (response.data != 'Есть такой поход! ')
				return;
			else {
				$http({
					method: "POST",
					data: {
						'tripName' : tripInfo.tripName													
					},
					url: "src/erase.php"
				})
				.then (function(response) {
					alert( "Trip deleted: " + tripInfo.tripName );
				})	 
			}				
		})
		.catch(function(error) { alert(error) });
	}
	
	
	newTrip.saveToServer = function() {		
			
		newTrip.checkMembersQuantity();
		newTrip.countMalesFemales();
		tripInfo.males = newTrip.males;
		tripInfo.females = newTrip.females;
		tripInfo.alcoKoeff = newTrip.alcoKoeff;
		tripInfo.emanKoeff = newTrip.emanKoeff;	
		equipmentInfo = newTrip.getEquipment();

		newTrip.arrangeMenu({'tripDays': [], 'tripBreakfasts': [], 'tripLunches': [], 'tripDinners': []});		
		
		$http({
			method: "POST",
			data: {
				'tripInfo' : JSON.stringify(tripInfo),
				'breakfasts': JSON.stringify(breakfasts),
				'lunches': JSON.stringify(lunches),
				'dinners': JSON.stringify(dinners),
				'train': JSON.stringify(train),
				'measures': JSON.stringify(newTrip.measures),
				'measWeights': JSON.stringify(measWeights),
				'membersInfo': JSON.stringify(membersInfo),
				'equipmentInfo': JSON.stringify(equipmentInfo),
				'allProducts': JSON.stringify(allProducts),
				'readyRaskladka': JSON.stringify(readyRaskladka),
				'trainProducts' : JSON.stringify(newTrip.trainProducts)				
			},
			url: "src/transfer.php"
		})	
		.then(function( response ) { 
			alert( "Data Saved: " + response.data );
			
		})
		.catch(function(error) {alert(error)});
	}

	newTrip.saveMemberData = function(member, index) {	
		var memberExpenses = {};
		if (!member.sex) {
			var memberNumber = index;
			memberExpenses.addCost = member.addCost;
			memberExpenses.addCostNote = member.addCostNote;
			memberExpenses.food = member.food;
			memberExpenses.trainFood = member.trainFood;
			memberExpenses.equipment = member.equipment;
			member = membersInfo[memberNumber];
		}
		$http({
			method: "POST",
			data: {
				'tripName' : tripInfo.tripName,				
				'member': JSON.stringify(member),
				'memberExpenses': JSON.stringify(memberExpenses)							
			},
			url: "src/transferOneMember.php"
		})
		.then(function(response) {alert('Data Saved: ' + response.data )})
		.catch(function(error) {alert(error)});		
	}

	
	newTrip.saveFirstInfo = function(firstInfo) {
		tripInfo = firstInfo;
		// for (var key in tripInfo) tripInfo[key] = firstInfo[key];
		tripInfo.stringDate = (new Date(tripInfo.stringDate)).toISOString().slice(0,10);
		newTrip.timeOut = false;
	}
	

	newTrip.getFirstInfo = function() {
		return tripInfo;
	}

	

	newTrip.saveMembersInfo = function(memInfo) {
		membersInfo = memInfo;
	}

	newTrip.getMembersInfo = function() {		
		return membersInfo;
	}

	newTrip.saveEquipment = function(equipInfo) {
		equipmentInfo = equipInfo;
		membersInfo.forEach(function(member) {member.equipWeight = 0;})
		equipmentInfo.forEach(function(equip) {
			var memberNumber = +equip.nesun;
			membersInfo[memberNumber].equipWeight+=equip.equipWeight;
		});
		// if (toServer) newTrip.saveToServer();

	}


	newTrip.getEquipment = function(){
		
		var memberNumbers =[];
		for (var i = 0; i < membersInfo.length;  i++) {
			memberNumbers.push(membersInfo[i].number.toString()); // кажись можно тупо і пушить
		};
		for (i = 0; i < equipmentInfo.length; i++) {
			if (memberNumbers.indexOf(equipmentInfo[i].berun) == -1) {
				equipmentInfo[i].berun = memberNumbers[0];
			}
			if (memberNumbers.indexOf(equipmentInfo[i].nesun) == -1) {
				equipmentInfo[i].nesun = memberNumbers[0];
			}
		};
		return equipmentInfo;
	}

	newTrip.getMenu = function(menuName) {
		
		switch (menuName) {
			case 'breakfast': 
				for (var i=0; i<breakfasts.length; i++) {
					breakfasts[i].toDelete = [];
					for (var j=0; j<breakfasts[i].meals.length; j++) {
						breakfasts[i].toDelete.push(false);
						if (!breakfasts[i].meals[j].femaleNorm) breakfasts[i].meals[j].femaleNorm = breakfasts[i].meals[j].maleNorm;
					}
		
				}
				return breakfasts;
			case 'lunch': 
				for (var i=0; i<lunches.length; i++) {
					lunches[i].toDelete = [];
					for (var j=0; j<lunches[i].meals.length; j++) {
						lunches[i].toDelete.push(false);
						if (!lunches[i].meals[j].femaleNorm) lunches[i].meals[j].femaleNorm = lunches[i].meals[j].maleNorm;
					}		
				}
				return lunches;
			case 'dinner': 
				for (var i=0; i<dinners.length; i++) {
					dinners[i].toDelete = [];
					for (var j=0; j<dinners[i].meals.length; j++) {
						dinners[i].toDelete.push(false);
						if (!dinners[i].meals[j].femaleNorm) dinners[i].meals[j].femaleNorm = dinners[i].meals[j].maleNorm;
					}		
				}
				return dinners;
			case 'train':
				train[0].toDelete = [];
				for (var j=0; j<train[0].meals.length; j++) {
					train[0].toDelete.push(false);
					if (!train[0].meals[j].femaleNorm) train[0].meals[j].femaleNorm = train[0].meals[j].maleNorm;
				}						
				return train;
		}		
	}

	newTrip.saveMenu = function(menuData) {		

		breakfasts = menuData.breakfasts;
		lunches = menuData.lunches;
		dinners = menuData.dinners;
		train = menuData.train;

	}

	
	newTrip.arrangeMenu = function(menuData) {	

		var numDate = +tripInfo.tripDate;	
		var breakfastsNumber = breakfasts.length;
		var lunchesNumber = lunches.length;
		var dinnersNumber = dinners.length;

		breakfasts.forEach(function(value) {value.times = 0;});
		lunches.forEach(function(value) {value.times = 0;});
		dinners.forEach(function(value) {value.times = 0;});

		for (var i=0; i <=tripInfo.tripNights; i++) {
			numDate+= 24*60*60*1000;
			menuData.tripDays.push((new Date(numDate)).toDateString());
			
			switch (i) {
				case 0:
					menuData.tripBreakfasts.push('Поезд');
					menuData.tripLunches.push('Остатки из поезда');
					menuData.tripDinners.push('Ужин ' + ( i % dinnersNumber +1));
					dinners[i].times = 1;
					break;
				case tripInfo.tripNights:
					menuData.tripBreakfasts.push('Завтрак ' + ( (i-1) % breakfastsNumber + 1));
					var number = +menuData.tripBreakfasts.slice(-1).toString().slice(-1);
					breakfasts[number-1].times++;
					menuData.tripLunches.push('Подножный корм');
					menuData.tripDinners.push('Поезд');	
					break;
				default:
					menuData.tripBreakfasts.push('Завтрак ' + ( (i-1) % breakfastsNumber + 1));
					number = +menuData.tripBreakfasts.slice(-1).toString().slice(-1);
					breakfasts[number-1].times++;
					menuData.tripLunches.push('Перекус ' + ( (i-1) % lunchesNumber + 1));
					var number = +menuData.tripLunches.slice(-1).toString().slice(-1);
					lunches[number-1].times++;
					menuData.tripDinners.push('Ужин ' + ( i % dinnersNumber +1));
					number = +menuData.tripDinners.slice(-1).toString().slice(-1);
					dinners[number-1].times++;			
			}
		}		
	}

	newTrip.getProductNames = function() {
		var productNames = [];
		breakfasts.forEach(getNames);
		lunches.forEach(getNames);
		dinners.forEach(getNames);
		train.forEach(getNames);
		return productNames;

		function getNames(menu) {
			if (menu.times) {
				menu.meals.forEach( function(product) {
					if (productNames.indexOf(product.name) == -1) 
						productNames.push(product.name);
				});
			}
		}

	}

	newTrip.getProducts = function() {
		
		newTrip.countMalesFemales();
		var males = newTrip.males;
		var females = newTrip.females;
		var noEatProducts = {};
		membersInfo.forEach(function(member) {
			member.noEat.forEach(function(product) {
				noEatProducts[product] = noEatProducts[product] || {males: 0, females: 0};
				if (member.sex == 'male') noEatProducts[product].males +=  1;
				else noEatProducts[product].females += 1;				
			})						
		});

		allProducts = {};
		newTrip.trainProducts = {};			 
		breakfasts.forEach(calculateProducts);
		lunches.forEach(calculateProducts);
		dinners.forEach(calculateProducts);
		calcProducts(train);
		if (allProducts['спирт']) {
			allProducts['спирт'].totalWeight = +(allProducts['спирт'].totalWeight * (newTrip.alcoKoeff || 0)).toFixed(3);
			allProducts['спирт'].correctWeight = Math.round(allProducts['спирт'].totalWeight * 100) / 100;

		}
		productsTotal.forEach(function (product) {
			var prodName = product.name;
			if (prodName in allProducts) {
				if (product.diffWeight.toFixed(4) == (product.correctWeight - allProducts[prodName].totalWeight).toFixed(4))
					allProducts[prodName].correctWeight = product.correctWeight;
				allProducts[prodName].note = product.note;
				allProducts[prodName].berun = (product.berun === '') ? undefined : product.berun;

			}
		});
		trainTotal.forEach(function (product) {
			var prodName = product.name;
			if (prodName in newTrip.trainProducts) {
				newTrip.trainProducts[prodName].note = product.note;					
				newTrip.trainProducts[prodName].berun = (product.berun === '') ? undefined : product.berun;
			}
		});
		
		return allProducts;


		function calcProducts(trainMenu) {
			trainMenu[0].meals.forEach( function(product) {
				if (!product.femaleNorm) product.femaleNorm = product.maleNorm;
				var noEatMales = 0;
				var noEatFemales = 0;
				if (product.name in noEatProducts) {
					var noEatMales = noEatProducts[product.name].males;
					var noEatFemales = noEatProducts[product.name].females;
				}
				newTrip.trainProducts[product.name] = {};
				newTrip.trainProducts[product.name].name = product.name;
				newTrip.trainProducts[product.name].measure = product.measure;
				newTrip.trainProducts[product.name].quant = +(product.maleNorm*(males - noEatMales)
							+ product.femaleNorm*(females - noEatFemales)).toFixed(3);
				newTrip.trainProducts[product.name].note = '';
				newTrip.trainProducts[product.name].berun = undefined;	
			});
		};

		function calculateProducts(menu) {
			var times = menu.times;
			if (times) {
				menu.meals.forEach(function(product) {
					if (!product.femaleNorm) product.femaleNorm = product.maleNorm;
					var noEatMales = 0;
					var noEatFemales = 0;
					if (product.name in noEatProducts) {
						var noEatMales = noEatProducts[product.name].males;
						var noEatFemales = noEatProducts[product.name].females;
					}
					if (product.name in allProducts) {
						allProducts[product.name].quant += +((product.maleNorm*(males - noEatMales)
							+ product.femaleNorm*(females - noEatFemales))* times).toFixed(3);
					}
					else {
						allProducts[product.name] = {};
						allProducts[product.name].name = product.name;
						allProducts[product.name].measure = product.measure;						
						allProducts[product.name].quant = +((product.maleNorm*(males - noEatMales)
							+ product.femaleNorm*(females - noEatFemales))* times).toFixed(3);									
						allProducts[product.name].measWeight = measWeights[product.name] ? measWeights[product.name][product.measure] || 0 : 0;
						allProducts[product.name].note = '';
						allProducts[product.name].berun = undefined;
								
					}
					if (product.measure == 'г') allProducts[product.name].measWeight = 0.001;
					if (product.measure == 'кг') allProducts[product.name].measWeight = 1;	
					allProducts[product.name].totalWeight = Math.round(allProducts[product.name].quant * allProducts[product.name].measWeight * 1000) / 1000;	
					allProducts[product.name].correctWeight = Math.round(allProducts[product.name].totalWeight * 100) / 100;
					
				})
			}
		}
	}

	newTrip.saveMeasureWeight = function(name, measure, measWeight)	{
		measWeights[name] = measWeights[name] || {};
		measWeights[name][measure] = measWeight || 0;
	}

	newTrip.refreshProductsTotal = function() {
		productsTotal = [];
		trainTotal = [];
		for (var key in allProducts) {
			var product = allProducts[key];
			productsTotal.push({'name': product.name, 'correctWeight': product.correctWeight, 
			'diffWeight': (product.correctWeight - product.totalWeight), 'note': product.note, 
			'berun': product.berun});
		}
		for (var key in newTrip.trainProducts) {
			var product = newTrip.trainProducts[key];
			trainTotal.push({'name': product.name, 'note': product.note, 'berun': product.berun});
		}		
	}

	newTrip.getSavedCosts = function() {
		for (var i=0; i < memberExpenses.length; i++) {
			if (i >= readyRaskladka.length) return;
			readyRaskladka[i].addCost = memberExpenses[i].addCost;
			readyRaskladka[i].addCostNote = memberExpenses[i].addCostNote;
			readyRaskladka[i].totalCost += readyRaskladka[i].addCost;

			readyRaskladka[i].food.forEach(function(product){
				if (product.name in memberExpenses[i].foodExpenses)
					product.cost = memberExpenses[i].foodExpenses[product.name];
			});

			readyRaskladka[i].trainFood.forEach(function(product){
				if (product.name in memberExpenses[i].trainExpenses)
					product.cost = memberExpenses[i].trainExpenses[product.name];
			});

			readyRaskladka[i].equipment.forEach(function(eq) {
				if (eq.name in memberExpenses[i].eqExpenses) {
					for (var j=0; j < equipmentInfo.length; j++) {
						if (equipmentInfo[j].equipName == eq.name && +equipmentInfo[j].berun == i) {
							eq.cost = memberExpenses[i].eqExpenses[eq.name];
							break;
						}
					}					
				}
			});
		}
	}

	newTrip.rememberExpenses = function(members) {
		memberExpenses = [];
		members.forEach( function(member) {
			var memEx = {};
			memEx.addCost = member.addCost;
			memEx.addCostNote = member.addCostNote;
			memEx.eqExpenses = {};
			member.equipment.forEach(function(equip) {
				memEx.eqExpenses[equip.name] = equip.cost;
			});
			memEx.foodExpenses = {};
			member.food.forEach(function(product) {
				memEx.foodExpenses[product.name] = product.cost;
			});
			memEx.trainExpenses = {};
			member.trainFood.forEach(function(product) {
				memEx.trainExpenses[product.name] = product.cost;
			});
			memberExpenses.push(memEx);
		});
	}

	newTrip.saveReadyRaskladka = function(products, members) {
		
		allProducts = products;
		membersInfo = members;
		newTrip.refreshProductsTotal();
		readyRaskladka = [];
		var memberUnitedInfo;
		for (var i = 0; i < membersInfo.length; i++) {
			memberUnitedInfo = {};
			memberUnitedInfo.name = membersInfo[i].name;
			memberUnitedInfo.phone = membersInfo[i].phone;
			memberUnitedInfo.equipWeight = membersInfo[i].equipWeight;
			memberUnitedInfo.foodWeight = membersInfo[i].foodWeight;
			memberUnitedInfo.equipment = [];
			memberUnitedInfo.food = [];
			memberUnitedInfo.trainFood = [];
			memberUnitedInfo.noEat = membersInfo[i].noEat;
			memberUnitedInfo.totalCost = 0;
			memberUnitedInfo.addCost = 0;
			memberUnitedInfo.balance = 0;
			memberUnitedInfo.addCostNote = '';
			readyRaskladka.push(memberUnitedInfo);
		}
		
		equipmentInfo.forEach(function(equip) {
			var berunNumber = +equip.berun;
			var nesunNumber = +equip.nesun;
			var noteBerun = '';
			var noteNesun = '';
			if (berunNumber != nesunNumber) {
				noteBerun = 'Отдать ' + membersInfo[nesunNumber].name;
				noteNesun = 'Взять у ' + membersInfo[berunNumber].name;
				readyRaskladka[nesunNumber].equipment.push({name: equip.equipName, weight: equip.equipWeight, note: noteNesun, cost: 0});
			}
			readyRaskladka[berunNumber].equipment.push({name: equip.equipName, weight: equip.equipWeight, note: noteBerun, cost: 0});
			
		});
		for (var product in allProducts) {
			var memberNumber = +allProducts[product].berun;
			readyRaskladka[memberNumber].food.push(
				{name: allProducts[product].name, 
				quant: allProducts[product].quant * (1+ ((allProducts[product].name == 'спирт') && ((newTrip.alcoKoeff || 0) - 1))),
				measure: allProducts[product].measure,
				weight: allProducts[product].correctWeight,
				note: allProducts[product].note,
				cost: 0
			});			
		}

		for (var product in newTrip.trainProducts) {
			var memberNumber = +newTrip.trainProducts[product].berun;
			readyRaskladka[memberNumber].trainFood.push(
				{name: newTrip.trainProducts[product].name, 
				quant: newTrip.trainProducts[product].quant,
				measure: newTrip.trainProducts[product].measure,
				weight: 0,
				note: newTrip.trainProducts[product].note,
				cost: 0
			})
		}

		newTrip.getSavedCosts();		
		
	}

	newTrip.getReady = function() {		
		return readyRaskladka;
	}

	
	newTrip.getActualDate = function(format) { // format: true - тогда просто получаем текущую дату/время в виде STRING
		var options = {							// format: false - тогда с часовым сдвигом и возвращаем в формате DATE
			  year: 'numeric',
			  month: 'long',
			  day: 'numeric',
			  weekday: 'long',
			  timezone: 'UTC',
			  hour: '2-digit',
			  minute: 'numeric',
			  second: 'numeric'
			};
		var date = new Date();
		

		if (format) return date.toLocaleString('en-GB', options);
		else {
			var hoursOffset = date.getTimezoneOffset() / 60;
			date.setHours(date.getHours() - hoursOffset);
			return date;
			}
	}	

	newTrip.countSecsLeft = function(tripDate, nowDate) {
		var date = +tripDate;
		var now = +nowDate;
		return Math.floor((date - now) / 1000) + 1;
	}

	newTrip.countTimeLeft = function(secs) {
		var secsLeft = secs;
		var secsPerDay = 24*60*60;
		var timeLeft = {
			days: 0,
			hours: 0,
			minutes: 0,
			secs: 0
		};
		var message = '';

		if (secsLeft > secsPerDay) {
			timeLeft.days = Math.floor( secsLeft / secsPerDay ) 
		}
		secsLeft -=timeLeft.days*secsPerDay;
		if ( secsLeft > 3600 ){
			timeLeft.hours = Math.floor( secsLeft / 3600);
		}
		secsLeft -= timeLeft.hours*3600;
		if ( secsLeft > 60 ){
			timeLeft.minutes = Math.floor( secsLeft / 60)
		}
		secsLeft -= timeLeft.minutes*60;
		timeLeft.secs = secsLeft;

		message = 'До похода осталось ' + timeLeft.days + ' дней и ' + timeLeft.hours + ' часов и ' + timeLeft.minutes + ' минут и ' 
		+ timeLeft.secs + ' секунд!';

		return message;
	}

}
	
})();