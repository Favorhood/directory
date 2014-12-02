// Configuration
angular.module('contactsApp.config',['ionic'])
.config(function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home/scroll');

       $stateProvider.state('home',
       {
          url : '/home',
          templateUrl : 'templates/main.html',
          abstract : true
       })
       .state('home.scroll',
       {
          url : '/scroll',
          resolve : {
              data : function($http,$q)
              {
                var deffered = $q.defer();
                //http://gastateparks.org/smart/api/itemfeed?show=images&btid=1,3&callback=JSON_CALLBACK
                //http://review.georgiafacts.org/smart/api/itemfeed?tid=16400&callback=JSON_CALLBACK
                //http://review.gastateparks.org/smart/api/itemfeed?btid=1%2C3&show=images&callback=JSON_CALLBACK
                $http.get("feed.txt").then(function(data){

                    deffered.resolve(data);
                });

                return deffered.promise;
              }
          },
          controller : 'ScrollCtrl',
          templateUrl : 'templates/scroll.html'
       })
});