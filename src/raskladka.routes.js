(function() {
	'use strict';
	angular.module('Raskladka')
	.config(RoutesConfig);

	RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
	function RoutesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider
			.state('home', {
		    	url: '/',
		    	templateUrl: 'templates/home.html',
		    	controller: 'HomeController',
		    	controllerAs: 'homeCtrl'

		    })
		    .state('loadReady', {
		    	url: '/load',
		    	templateUrl: 'templates/loadready.html',
		    	controller: 'LoadReadyController',
		    	controllerAs: 'loadCtrl'

		    })
		    .state('createNew', {
		    	url: '/vpohod/{fromDB}',
		    	templateUrl: 'templates/startcreating.html',
		    	controller: 'StartCreatingController',
		    	controllerAs: 'startCtrl',
		    	resolve: {
		    		twoParam: ['$stateParams','NewTripService', function($stateParams, NewTripService) {
		    			if ($stateParams.fromDB != 1) return NewTripService.checkDataOK();
		    			return NewTripService.loadFromDB();
		    		}]
		    	}

		    })
		    .state( 'addMembers', {
		    	url: '/members',
		    	templateUrl: 'templates/addmembers.html',
		    	controller: 'MembersController',
		    	controllerAs: 'memCtrl',	
		    	resolve: {
		    		dataOK: ['NewTripService', function(NewTripService) {
		    			return NewTripService.checkDataOK();
		    		}]
		    	}	    	

		    })
		    .state('addEquipment', {
		    	url: '/equipment',
		    	templateUrl: 'templates/addequipment.html',
		    	controller: 'EquipmentController',
		    	controllerAs: 'equipCtrl',
		    	resolve: {
		    		dataOK: ['NewTripService', function(NewTripService) {
		    			return NewTripService.checkDataOK();
		    		}]
		    	}
		    })
		    .state('menuSelect', {
		    	url: '/menu-v-pohod',
		    	templateUrl: 'templates/menuselect.html',
		    	controller: 'MenuController',
		    	controllerAs: 'menuCtrl',
		    	resolve: {
		    		dataOK: ['NewTripService', function(NewTripService) {
		    			return NewTripService.checkDataOK();
		    		}]
		    	}
		    })
		    .state('setProducts', {
		    	url: '/products/{fromDB}',
		    	templateUrl: 'templates/setproducts.html',
		    	controller: 'ProductsController',
		    	controllerAs: 'prodCtrl',
		    	resolve: {
		    		dataOK: ['NewTripService', function(NewTripService) {
		    			return NewTripService.checkDataOK();
		    		}]
		    	}
		    })		    
		    .state('showReady', {
		    	url: '/showready',
		    	templateUrl: 'templates/showready.html',
		    	controller: 'ShowReadyController',
		    	controllerAs: 'showCtrl',
		    	resolve: {
		    		dataOK: ['NewTripService', function(NewTripService) {
		    			return NewTripService.checkDataOK();
		    		}]
		    	}
		    		    	
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

  		$locationProvider.html5Mode(true);
  		$locationProvider.hashPrefix('');
	}

})();
