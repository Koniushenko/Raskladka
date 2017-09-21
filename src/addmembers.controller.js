
(function() {
angular.module('Raskladka')
.controller('MembersController', MembersController);

MembersController.$inject = ['NewTripService', '$interval'];
function MembersController(NewTripService, $interval) {
	var memCtrl = this;		
	NewTripService.checkMembersQuantity();
	memCtrl.members = NewTripService.getMembersInfo();
	memCtrl.products = NewTripService.getProductNames();

	memCtrl.eatAll = function(member) {
		member.noEat = [];
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

	memCtrl.isTimeOut = function() {
		return NewTripService.timeOut;
	}	

	memCtrl.saveMemberData = function(member) {
		NewTripService.saveMemberData(member);
	};

	memCtrl.submit = function() {
		for (var i=0; i < memCtrl.length; i++) {
			if (!memCtrl.members[i].name) memCtrl.members[i].name = 'Участник ' + i;
			if (!memCtrl.members[i].phone) memCtrl.members[i].phone = '000-000-00-00';		
		}			
		NewTripService.saveMembersInfo(memCtrl.members);	
	}

	
	
}







	
})();