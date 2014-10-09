// Configuration
angular.module('contactsApp.config',['ionic'])
.config(function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home/horizontal');

       $stateProvider.state('home',
       {
          url : '/home',
          templateUrl : 'templates/main.html',
          abstract : true,
          controller : 'MainCtrl',
          resolve : {
              data : function($http,$q)
              {
                var deffered = $q.defer();
                //http://gastateparks.org/smart/api/itemfeed?show=images&btid=1,3&callback=JSON_CALLBACK
                
                $http.jsonp("http://review.georgiafacts.org/smart/api/itemfeed?tid=16400&callback=JSON_CALLBACK").then(function(data){

                    deffered.resolve(data);
                });

                return deffered.promise;
              }
          }
       })
       .state('home.horizontal',
       {
          url : '/horizontal',
          templateUrl : 'templates/horizontal.html'
       }).
       state('home.vertical',
       {
          url : '/vertical',
          templateUrl : 'templates/vertical.html'
       });
});