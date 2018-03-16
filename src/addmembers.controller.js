(function() {
angular.module('Raskladka')
.controller('MembersController', MembersController);

MembersController.$inject = ['NewTripService', '$interval', '$scope'];
function MembersController(NewTripService, $interval, $scope) {
	var memCtrl = this;		

$scope.mainCtrl.seo = {
		title: 'Я иду в поход в горы | Турпоход - состав участников | Продукты в поход - личный выбор',
		description: 'Продукты в поход в целом уже выбраны, но на этой странице каждый участник турпохода может отметить продукты, которые он не будет есть или пить. В этом случае количество еды в походной раскладке будет автоматически уменьшено. Я иду в поход в горы с удовольствием и без лишнего веса!'
	}	
	$scope.mainCtrl.edit = true;
	NewTripService.checkMembersQuantity();
	memCtrl.members = NewTripService.getMembersInfo();
	memCtrl.products = NewTripService.getProductNames();
	NewTripService.productState = false; 

	// memCtrl.eatAll = function(member) {
	// 	member.noEat = [];
	// }

	memCtrl.noEatReplace = function(member) {
		return member.noEat.toString().replace(/,/g , ", ");
    }

	memCtrl.removeRemoved = function(prodNames) {
		for (var i=0; i < prodNames.length; i++)
			if ( !~memCtrl.products.indexOf(prodNames[i]) ) {
				prodNames.splice(i, 1);
				i--;
			}
		return prodNames;
	}

	memCtrl.isDoubleName = function() {
		var memberNames = [];
		for (var key in memCtrl.members) memberNames.push(memCtrl.members[key].name);
		while (memberNames.length > 0) {
			var nextName = memberNames.pop();
			if (nextName && ~memberNames.indexOf(nextName)) return true;
		}
		return false;
	}

	memCtrl.formError = function() {		
		if ($scope.regMem.$invalid || memCtrl.isDoubleName())
			NewTripService.errorMembers = true;
		else NewTripService.errorMembers = false;
		
	}

	
	memCtrl.saveMemberData = function(member) {
		NewTripService.saveMemberData(member);
	};

}
	
})();