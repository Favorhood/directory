      //var $scope.isde = null;
var app =  angular.module('contactsApp', ['ionic']);

app.config(function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home');

       $stateProvider.state('home',
       {
          url : '/home',
          templateUrl : 'templates/main.html',
          controller : 'MainCtrl'
       });
});

app.controller('MainCtrl', function($scope,$http,$ionicScrollDelegate,$interval) {
      
      $scope.isde = $ionicScrollDelegate.$getByHandle('isde');
      $scope.direction = 'x';
      $scope.totalElement = "";
      $scope.reverseElement = 0;    
      $scope.play = false;

      var letters = $scope.letters = [];
      var contacts = $scope.contacts = [];
      var currentCharCode = 'A'.charCodeAt(0) - 1;
      $scope.scrollposition = 0;
      $scope.toscroll = 1200;



      //window.CONTACTS is defined below
      window.CONTACTS
        .sort(function(a, b) {
          return a.last_name > b.last_name ? 1 : -1;
        })
        .forEach(function(person) {
          //Get the first letter of the last name, and if the last name changes
          //put the letter in the array
          var personCharCode = person.last_name.toUpperCase().charCodeAt(0);
          //We may jump two letters, be sure to put both in
          //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
          var difference = personCharCode - currentCharCode;
          for (var i = 1; i <= difference; i++) {
            addLetter(currentCharCode + i);
          }
          currentCharCode = personCharCode;
          contacts.push(person);
        });

      //If names ended before Z, add everything up to Z
      for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
        addLetter(i);
      }

      function addLetter(code) {
        var letter = String.fromCharCode(code);
        contacts.push({
          isLetter: true,
          letter: letter
        });
        letters.push(letter);
      }

      //$scope.layout = function()
      // {
      //     console.log($scope.direction);
      // }

      //Letters are shorter, everything else is 52 pixels
      $scope.getItemHeight = function(item) {
        return item.isLetter ? 40 : 100;
      };
      $scope.getItemWidth = function(item) {
        return '100%';
      };

      //  $scope.getScrollPosition = function()
      // {
      //   console.log($scope.isde.getScrollPosition());
      //   console.log($scope.isde.getScrollView());
      // }
    
      $scope.scrollPrev = function()
      {
          if($scope.scrollposition == 0)
          {
            $index = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
            $scope.items.unshift($scope.contacts[$index]);
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
      // Main Functioning of Controller

      $scope.items = [];
      $scope.number = 10;
      locitems = $scope.items.length;
      for(var i=0;i<$scope.number;i++)
      {
          $scope.items.push($scope.contacts[locitems + i]);
      }
     
      //  It is called when there is need of more contacts
      $scope.totalElement = $scope.contacts.length;
      $scope.noMoreItemsAvailable = false;

      $scope.loadMore = function()
      {
        
        locitems = $scope.items.length % $scope.totalElement;
        //$scope.toScroll = $scope.isde.getScrollView()["__clientHeigth"];
        
        if((($scope.totalElement - locitems) < 10) && (($scope.totalElement - locitems) != 0))
        {
          var newitems = $scope.totalElement - locitems;
          for(var i=0;i<newitems;i++)
          {
            $scope.items.push($scope.contacts[locitems + i]);
          }
        }
        else
        { 
          for(var i=0;i<$scope.number;i++)
          {
             $scope.items.push($scope.contacts[locitems + i]);
          }
        }
  

        $scope.$broadcast('scroll.infiniteScrollComplete');
  
      }

      // Change the number of Items Displayed on screen
      $scope.currentItemsPerPage =  1;
      $scope.itemWidth = 100/$scope.currentItemsPerPage + "%"; 


      // $scope.changeItems = function()
      // {
      //   $scope.itemWidth = 100/$scope.currentItemsPerPage + "%";
      //   console.log($scope.isde.resize());
      // }

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
            },1200); 
        }
        else if($scope.play == false)
        {
          console.log(angular.isDefined(scroll));
          $interval.cancel(scroll);
        }
        

      }

        // // Get Feed
        // $http.jsonp("http://georgiafacts.org/smart/api/itemfeed?dynamic=1&tid=16400&callback=JSON_CALLBACK").success(function(data){
        //     $scope.feed = data;
        // });
    

    });
