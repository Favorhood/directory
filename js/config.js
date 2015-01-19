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
                $http.jsonp("http://gastateparks.org/smart/api/itemfeed?show=images&btid=1,3&callback=JSON_CALLBACK").then(function (data) {

                    deffered.resolve(data);
                });

                return deffered.promise;
              },
              flickr : function($http, $q) {
                var deffered = $q.defer();
                $http.jsonp("http://api.flickr.com/services/feeds/photos_public.gne?tagmode=any&tags=\"Grant+Park+Atlanta\"&lang=en-us&format=json&jsoncallback=JSON_CALLBACK").then(function (data) {

                    deffered.resolve(data);
                });
                return deffered.promise;
              }
          }, 
          views: {
            'gallery' : {
              templateUrl : 'templates/gallery.html',
              controller : 'ScrollCtrl'
            },
            'flickr' : {
              templateUrl : 'templates/flickr.html',
              controller : 'FlickrCtrl'
            }
          }
       })
});