(function() {
angular.module('Raskladka')
.controller('HomeController', HomeController);

HomeController.$inject = ['$scope'];
function HomeController($scope) {
	
	$scope.mainCtrl.seo = {
		title: 'Программа меню-раскладка продуктов в поход | Что брать в поход из еды',
		description: 'Что брать в поход из еды? Какую еду взять в поход? Как собрать рюкзак, ничего не забыть и не тащить лишний вес?  Программа меню раскладка – образец для планирования похода!'
	}	

}
	
})();