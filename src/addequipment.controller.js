
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

	equipCtrl.isTimeOut = function() {
		return NewTripService.timeOut;
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

	

	equipCtrl.submit = function() {

		for (var i = 0; i < equipCtrl.equipment.length; i++) {
			if (!equipCtrl.equipment[i].equipName) equipCtrl.equipment[i].equipName = 'Снаряжение ' + i;
			if (!equipCtrl.equipment[i].equipWeight) equipCtrl.equipment[i].equipWeight = 0.1;
		};
		NewTripService.saveEquipment(equipCtrl.equipment);
	}

	
	
}
	
})();