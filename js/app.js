      //var $scope.isde = null;
var app =  angular.module('contactsApp', ['ionic']);

app.config(function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home');

       $stateProvider.state('home',
       {
          url : '/home',
          templateUrl : 'templates/main.html',
          controller : 'MainCtrl',
          resolve : {
              data : function($http,$q)
              {
                var deffered = $q.defer();
                $http.jsonp("http://gastateparks.org/smart/api/itemfeed?show=images&btid=1,3&callback=JSON_CALLBACK").then(function(data){

                    deffered.resolve(data);
                });

                return deffered.promise;
              }
          }
       });
});

app.controller('MainCtrl', function($scope,$http,$ionicScrollDelegate,$interval,data) {
      
      $scope.isde = $ionicScrollDelegate.$getByHandle('isde');
      $scope.direction = 'x';
      $scope.reverseElement = 0;    
      $scope.play = false;
      $scope.scrollposition = 0;
      $scope.toscroll = 1200;
      $scope.feed = data;
      $scope.items = [];
      $scope.noMoreItemsAvailable = false;
      $scope.number = 5;
      $scope.totalElement = $scope.feed.data.items.length;
     
      var locitems = $scope.items.length;
      for(var i=0;i<5;i++)
      {
          $scope.items.push($scope.feed.data.items[locitems + i]);
      }
 

      //Letters are shorter, everything else is 52 pixels
      $scope.getItemHeight = function(item) {
        return item.isLetter ? 40 : 100;
      };
      $scope.getItemWidth = function(item) {
        return '100%';
      };

      $scope.getScrollPosition = function()
      {
        console.log($scope.isde.getScrollPosition());
        console.log($scope.isde.getScrollView());
      }

      $scope.swipeRight = function()
      {
           if($scope.scrollposition == 0)
            {
              $index = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
              $scope.items.unshift($scope.feed.data.items[$index]);
              $scope.reverseElement++;
            }
          
      }

      $scope.swipeLeft = function()
      {
        alert("Swipe Left");
      }
    
      $scope.scrollPrev = function()
      {
          if($scope.scrollposition == 0)
          {
            $index = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
            $scope.items.unshift($scope.feed.data.items[$index]);
            $scope.reverseElement++;
          }
          else
          {
            $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
            $scope.scrollposition = $scope.scrollposition - $scope.toscroll;
            $scope.isde.scrollTo($scope.scrollposition,0,true);
          }
          
        
      }

      $scope.scrollNext = function()
      {
        $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
        $scope.scrollposition = $scope.scrollposition + $scope.toscroll;
        $scope.isde.scrollTo($scope.scrollposition,0,true);
      }
     
      //  It is called when there is need of more feed
     


      $scope.loadMore = function()
      {
        
        locitems = $scope.items.length % $scope.totalElement;
        
        if((($scope.totalElement - locitems) < 10) && (($scope.totalElement - locitems) != 0))
        {
          var newitems = $scope.totalElement - locitems;
          for(var i=0;i<newitems;i++)
          {
            $scope.items.push($scope.feed.data.items[locitems + i]);
          }
        }
        else
        { 
          for(var i=0;i<$scope.number;i++)
          {
             $scope.items.push($scope.feed.data.items[locitems + i]);
          }
        }
  

        $scope.$broadcast('scroll.infiniteScrollComplete');
  
      }

      // Change the number of Items Displayed on screen
      $scope.currentItemsPerPage =  1;
      $scope.itemWidth = 100/$scope.currentItemsPerPage + "%"; 


      $scope.changeItems = function()
      {
        $scope.itemWidth = 100/$scope.currentItemsPerPage + "%";
        console.log($scope.isde.resize());
      }

      // Function for Auto Scroll
      // Default Set to True
      var scroll;
      $scope.autoScroll = function(value)
      {
        console.log($scope.play);
        if($scope.play == true)
        { 
            scroll = $interval(function(){
            $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
            $scope.scrollposition = $scope.scrollposition + $scope.toscroll;
            $scope.isde.scrollTo($scope.scrollposition,0,true);
            },1500); 
        }
        else if($scope.play == false)
        {
          console.log(angular.isDefined(scroll));
          $interval.cancel(scroll);
        }
        

      }

      
      
    

    });
