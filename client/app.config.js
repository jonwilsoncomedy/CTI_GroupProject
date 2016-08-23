angular.module('App').config(['$routeProvider', '$locationProvider', 'DataService', function($routeProvider, $locationProvider, DataService){
  $routeProvider
    .when('/', {
      templateUrl: '/views/login.html',
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .when('/home', {
      templateUrl: '/views/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
      resolve: {
        donors: function(DataService){
          return DataService.getDonors();
        }
      }
    })
    .when('/edit', {
      templateUrl: '/views/edit.html',
      controller: 'EditController',
      controllerAs: 'edit'
    })
    .when('/settings' , {
      templateUrl: '/views/settings.html',
      controller: 'SettingsController',
      controllerAs: 'settings'
    })


    .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode(true);
}]);
