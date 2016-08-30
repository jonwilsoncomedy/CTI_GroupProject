angular.module('App').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/views/login.html',
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .when('/home', {
      templateUrl: '/views/home.html',
      controller: 'HomeController',
      controllerAs: 'home',
      resolve: {
        someting: ['DataService', function(DataService){
          return DataService.getData();
        }],stuff: ['DataService', function(DataService){
          return DataService.getTemplates();
        }]
      }
    })
    // .when('/edit', {
    //   templateUrl: '/views/edit.html',
    //   controller: 'EditController',
    //   controllerAs: 'edit'
    // })
    .when('/settings' , {
      templateUrl: '/views/settings.html',
      controller: 'SettingsController',
      controllerAs: 'settings'
    })
    .when('/gettingdata',{
      templateUrl: '/views/gettingdata.html',
      controller: 'GettingDataController',
      controllerAs: 'getting'
    })
    .when('/donor', {
      templateUrl: '/views/donor.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .when('/overview', {
      templateUrl: '/views/overview.html',
      controller: 'OverviewController',
      controllerAs: 'over',
      resolve: {
        bleh: ['DonationService', function(DonationService){
          return DonationService.getDonorDbStuff();
        }]
      }
    })

    .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode(true);
}]);
