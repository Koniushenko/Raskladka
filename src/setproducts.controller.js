
(function() {
angular.module('Raskladka')
.controller('ProductsController', ProductsController)


ProductsController.$inject = ['NewTripService'];
function ProductsController(NewTripService) {
	var prodCtrl = this;
	prodCtrl.admin = NewTripService.admin;
	prodCtrl.products = NewTripService.getProducts(); // пересчитываем продукты, если готовую раскладку не сохраняли
	prodCtrl.members = NewTripService.getMembersInfo();
	prodCtrl.trainProducts = NewTripService.trainProducts;
	prodCtrl.equipTotalWeight = 0;
	prodCtrl.foodTotalWeight = 0;
	prodCtrl.alcoKoeff = NewTripService.alcoKoeff;
	prodCtrl.emanKoeff = NewTripService.emanKoeff;
	prodCtrl.males = NewTripService.males;
	prodCtrl.females = NewTripService.females;
	prodCtrl.filePath = NewTripService.filePath;
	
	
	//удаляем нулевые позиции и считаем общий вес
	for ( product in prodCtrl.products) {
		if (prodCtrl.products[product].quant == 0) delete prodCtrl.products[product];
		else prodCtrl.foodTotalWeight +=prodCtrl.products[product].correctWeight;
	}	


	for (product in prodCtrl.trainProducts)
		if (prodCtrl.trainProducts[product].quant == 0) delete prodCtrl.trainProducts[product];


 
	prodCtrl.members.forEach(function(member) {
		prodCtrl.equipTotalWeight += member.equipWeight;
		
	});

	prodCtrl.weightPerPerson = ( prodCtrl.foodTotalWeight + prodCtrl.equipTotalWeight ) / 
							   ( prodCtrl.males + (prodCtrl.emanKoeff || 0) * prodCtrl.females );



	prodCtrl.recalcFoodWeight = function(name, number) {
		prodCtrl.finished = false; //сигнал о том, что произошли изменения на странице, был сдела пересчет
		switch (number) {
			
			case 1: 
				if (name in prodCtrl.products) {//measure weight changed пересчитываем только поле нейм, его вес цепляем поле корректВейт
					prodCtrl.products[name].totalWeight = 
					Math.round(prodCtrl.products[name].quant * (prodCtrl.products[name].measWeight || 0) * 100) / 100;
					prodCtrl.products[name].totalWeight = 
					+(prodCtrl.products[name].totalWeight * (1 + ((name == 'спирт') && ((prodCtrl.alcoKoeff || 0) - 1)) )).toFixed(3);
					prodCtrl.products[name].correctWeight = +(prodCtrl.products[name].totalWeight).toFixed(2);
					NewTripService.saveMeasureWeight(name, prodCtrl.products[name].measure, prodCtrl.products[name].measWeight);
				}
				
			case 2: // correctWeight changed - тоже только по одному полю пересчитываем беруна
				if (prodCtrl.products[name].berun){
						var memberNumber = +prodCtrl.products[name].berun;
						prodCtrl.members[memberNumber].foodWeight = 0;
						for (var product in prodCtrl.products) {				
							if (+prodCtrl.products[product].berun == memberNumber){
								prodCtrl.members[memberNumber].foodWeight += +(prodCtrl.products[product].correctWeight || 0).toFixed(3) ;
							}
						}
				}
				break;
				
			case 3: // berun changed - обнуляем вес всех берунов и заново пересчитываем
				for (var memberNumber in prodCtrl.members) prodCtrl.members[memberNumber].foodWeight = 0;
				for (var product in prodCtrl.products) {				
					if (prodCtrl.products[product].berun){
						memberNumber = +prodCtrl.products[product].berun;
						//  Если мы выбросили нескольких у частников, а в распределении продуктов они были, то надо подчистить раскладку
						if (prodCtrl.members[memberNumber])
							prodCtrl.members[memberNumber].foodWeight += +(prodCtrl.products[product].correctWeight || 0).toFixed(3);
						else
							prodCtrl.products[product].berun = undefined;
					}
				}				
		}
		prodCtrl.foodTotalWeight = 0;
		for ( product in prodCtrl.products) {
			prodCtrl.foodTotalWeight += +(prodCtrl.products[product].correctWeight || 0).toFixed(3);
		}	
		prodCtrl.weightPerPerson = ( prodCtrl.foodTotalWeight + prodCtrl.equipTotalWeight ) / 
							   ( prodCtrl.males + (prodCtrl.emanKoeff || 0) * prodCtrl.females );
		NewTripService.alcoKoeff = prodCtrl.alcoKoeff;
		NewTripService.emanKoeff = prodCtrl.emanKoeff;

//  Если мы выбросили нескольких у частников, а в распределении продуктов они были, то надо подчистить раскладку
		for (product in prodCtrl.trainProducts)
			if (prodCtrl.trainProducts[product].berun) {
				var trainBerun = +prodCtrl.trainProducts[product].berun;
				if (!prodCtrl.members[trainBerun])
					prodCtrl.trainProducts[product].berun = undefined;
			}

	}
		

	prodCtrl.spreadAllWeights = function() {
	
		var maleWeight = prodCtrl.weightPerPerson;
		var femaleWeight = maleWeight * prodCtrl.emanKoeff;
		var leftProducts = [];
		var fixedWeights = prodCtrl.members.map( function(member) {
			var sexWeight = (member.sex == 'male') ? maleWeight : femaleWeight;
			return [ member.equipWeight + member.foodWeight, sexWeight ];
		});

		for (var product in prodCtrl.products)
			if (prodCtrl.products[product].berun === undefined)
				leftProducts.push({name: prodCtrl.products[product].name, correctWeight: prodCtrl.products[product].correctWeight});
		leftProducts.sort(function(product1, product2) {return product2.correctWeight - product1.correctWeight});

		for (var i=0; i < leftProducts.length; i++) {
		
			var localMin = Infinity;
			localIndex = undefined;
			for (var j=0; j < fixedWeights.length; j++) {			
				if (fixedWeights[j][0] + leftProducts[i].correctWeight > fixedWeights[j][1]) continue;
				var localDifference = Math.abs(fixedWeights[j][0] + leftProducts[i].correctWeight - fixedWeights[j][1]);
				if (localDifference < localMin) {    
					localMin = localDifference;
					var localIndex = j;			
				}
			}
			if (localIndex === undefined) {
				localMin = Infinity;
				for (j=0; j < fixedWeights.length; j++) {
					var localDifference = Math.abs(fixedWeights[j][0] + leftProducts[i].correctWeight - fixedWeights[j][1]);
					if (localDifference < localMin) {
						localMin = localDifference;
						var localIndex = j;			
					}	
				}		
			}
			var nameSelected = leftProducts[i].name;
			prodCtrl.products[nameSelected].berun = localIndex.toString();
			fixedWeights[localIndex][0] +=leftProducts[i].correctWeight;
			
		}
		prodCtrl.recalcFoodWeight('', 3);

		var leftTrainProducts = [];
		var takenByBeruns = {};
		for (var product in prodCtrl.trainProducts)
			if (prodCtrl.trainProducts[product].berun === undefined) 
				leftTrainProducts.push(prodCtrl.trainProducts[product].name)
			else {
				var berun = prodCtrl.trainProducts[product].berun;
				takenByBeruns[berun] = takenByBeruns[berun] || 0;				
				takenByBeruns[berun] += 1;
			};	
		var berunsArray = [];
		for (j=0; j < prodCtrl.members.length; j++)
			berunsArray.push([j.toString(), 0]);

		for (berun in takenByBeruns) 
			berunsArray[+berun] = [berun, takenByBeruns[berun]];
		
		leftTrainProducts.forEach(function(prodName) {
			berunsArray.sort(function(berun1, berun2) { return berun1[1] - berun2[1]});
			prodCtrl.trainProducts[prodName].berun = berunsArray[0][0];	
			berunsArray[0][1] += 1;		
		}); 
	};

	prodCtrl.resetAllWeights = function() {
		for (var product in prodCtrl.products)	prodCtrl.products[product].berun = undefined;
		prodCtrl.recalcFoodWeight('', 3); 
		for (var product in prodCtrl.trainProducts)	prodCtrl.trainProducts[product].berun = undefined;
		

	};

	prodCtrl.saveAllWeights = function() {
		NewTripService.saveReadyRaskladka(prodCtrl.products, prodCtrl.members);
		
	};

	prodCtrl.refreshTotal = function() {
		NewTripService.refreshProductsTotal();
	}

	prodCtrl.somethingChanged = function() {
		prodCtrl.finished = NewTripService.finished = false;
	}

	prodCtrl.zeroMeasureWeight = function() {
	for (var product in prodCtrl.products) 
		if (!prodCtrl.products[product].measWeight) return true;
	return false;
	}

	prodCtrl.berunUndefined = function() {
		for (var product in prodCtrl.products) 
			if (prodCtrl.products[product].berun === undefined) return true;
		for (var product in prodCtrl.trainProducts) 
			if (prodCtrl.trainProducts[product].berun === undefined) return true;

		return false;
	}

	
	prodCtrl.recalcFoodWeight('', 3);
			
}

	
})();