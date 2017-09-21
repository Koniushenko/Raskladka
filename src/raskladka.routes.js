(function() {
	'use strict';
	angular.module('Raskladka')
	.config(RoutesConfig);

	RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
	function RoutesConfig($stateProvider, $urlRouterProvider) {
		$stateProvider
		    .state('loadReady', {
		    	url: '/load',
		    	templateUrl: 'templates/loadready.html',
		    	controller: 'LoadReadyController',
		    	controllerAs: 'loadCtrl'

		    })
		    .state('createNew', {
		    	url: '/create',
		    	templateUrl: 'templates/startcreating.html',
		    	controller: 'StartCreatingController',
		    	controllerAs: 'startCtrl'

		    })
		    .state( 'addMembers', {
		    	url: '/addmembers',
		    	templateUrl: 'templates/addmembers.html',
		    	controller: 'MembersController',
		    	controllerAs: 'memCtrl',		    	

		    })
		    .state('addEquipment', {
		    	url: '/addequipment',
		    	templateUrl: 'templates/addequipment.html',
		    	controller: 'EquipmentController',
		    	controllerAs: 'equipCtrl',
		    })
		    .state('menuSelect', {
		    	url: '/menuselect',
		    	templateUrl: 'templates/menuselect.html',
		    	controller: 'MenuController',
		    	controllerAs: 'menuCtrl',
		    })
		    .state('setProducts', {
		    	url: '/setproducts/{fromDB}',
		    	templateUrl: 'templates/setproducts.html',
		    	controller: 'ProductsController',
		    	controllerAs: 'prodCtrl',
		    	resolve: {
		    		twoParam: ['$stateParams','NewTripService', function($stateParams, NewTripService) {
		    			if ($stateParams.fromDB != 1) return;
		    			return NewTripService.loadFromDB();
		    		}]
		    	}	
		    })		    
		    .state('showReady', {
		    	url: '/showready',
		    	templateUrl: 'templates/showready.html',
		    	controller: 'ShowReadyController',
		    	controllerAs: 'showCtrl'
		    		    	
		    })
		    .state('testDB', {
		    	url: '/testdb',
		    	templateUrl: 'templates/testdb.html',
		    	controller: 'dbController',
		    	controllerAs: 'dbCtrl',		    	
		    	resolve: {		    		  	
		    		twoParam: ['NewTripService', function(NewTripService) {
		    			return NewTripService.loadFromDB();
		    		}]
		    	}
		    });
		    
		// If user goes to a path that doesn't exist, redirect to public root
  		$urlRouterProvider.otherwise('/');
	}

})();
