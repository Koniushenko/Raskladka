
(function() {
angular.module('Raskladka')
.controller('EquipmentController', EquipmentController);

EquipmentController.$inject = ['NewTripService', '$interval', '$scope'];
function EquipmentController(NewTripService, $interval, $scope) {
	var equipCtrl = this;	

	$scope.mainCtrl.edit = true;
	NewTripService.checkMembersQuantity();
	equipCtrl.admin =NewTripService.admin
	equipCtrl.members = NewTripService.getMembersInfo();
	equipCtrl.equipment = NewTripService.getEquipment();  
	NewTripService.productState = false; 

	equipCtrl.addEquip = function() {	
		equipCtrl.equipment.push({
			equipName: '',
			equipWeight: 0.1,
			berun: '0',
			nesun: equipCtrl.members[0].number.toString()
		})
	}

	equipCtrl.removeEquip = function(index) {
		equipCtrl.equipment.splice(index, 1);

	}

	equipCtrl.isDoubleEquip = function() {
		for (var i=0; i < equipCtrl.members.length; i++) {
			var equipNames = [];
			equipCtrl.equipment.forEach(function(equip) {
				if (+equip.berun == i)
					equipNames.push(equip.equipName);
			});
			while (equipNames.length > 0) {
				var nextName = equipNames.pop();
				if (nextName && ~equipNames.indexOf(nextName)) return true;
			}
		};
		return false	};

	equipCtrl.formError = function() {		
		if ($scope.regEquip.$invalid || equipCtrl.isDoubleEquip())
			NewTripService.errorEquip = true;
		else NewTripService.errorEquip = false;		
	}

	

	
	
}
	
})();