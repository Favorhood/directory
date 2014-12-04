      //var $scope.isde = null;
'use strict';

var app =  angular.module('contactsApp', ['ionic','contactsApp.config','contactsApp.directives']);

app.controller('ScrollCtrl', function($scope,$http,$ionicScrollDelegate,$interval,data, $ionicPopup,$state, filterFilter) {
      
      $scope.isde = $ionicScrollDelegate.$getByHandle('isde');
      $scope.reverseElement = 0;    
      $scope.scrollposition = 0;
      $scope.toscroll = 1200;
      $scope.feed = data;
      $scope.items = [];
      $scope.noMoreItemsAvailable = false;
      $scope.number = 40;
      $scope.totalElement = $scope.feed.data.items.length;
      $scope.settings = {"play" : false,"direction" : "x" ,"rows" : 1,"cols" : 1};
      var letters = $scope.letters = [];
      var locations = $scope.locations = [];
      var currentCharCode = 'A'.charCodeAt(0) - 1;
      
      
       
      var locitems = $scope.items.length;
      for(var i=0;i<10;i++)
      {
          $scope.items.push($scope.feed.data.items[locitems + i]);
      }
      
      $scope.items
      .sort(function(a, b) {
        return a.last_name > b.last_name ? 1 : -1;
      })
      .forEach(function(location) {
        //Get the first letter of the last name, and if the last name changes
        //put the letter in the array
        var locationCharCode = location.title.toUpperCase().charCodeAt(0);
        //We may jump two letters, be sure to put both in
        //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
        var difference = locationCharCode - currentCharCode;
        for (var i = 1; i <= difference; i++) {
          addLetter(currentCharCode + i);
        }
        currentCharCode = locationCharCode;
        locations.push(location);
      });

      //If names ended before Z, add everything up to Z
      for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
        addLetter(i);
      }

      function addLetter(code) {
        var letter = String.fromCharCode(code);
        locations.push({
          isLetter: true,
          letter: letter
        });
        letters.push(letter);
      }
      
      var letterHasMatch = {};
      $scope.getLocations = function() {
        letterHasMatch = {};
        //Filter contacts by $scope.search.
        //Additionally, filter letters so that they only show if there
        //is one or more matching contact
        return locations.filter(function(item) {
          if (typeof item.title != 'undefined') {
              var itemDoesMatch = !$scope.search || item.isLetter ||
                item.title.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

              //Mark this person's last name letter as 'has a match'
              if (!item.isLetter && itemDoesMatch) {
                var letter = item.title.charAt(0).toUpperCase();
                letterHasMatch[letter] = true;
              }

              return itemDoesMatch;
          }
        }).filter(function(item) {
          //Finally, re-filter all of the letters and take out ones that don't
          //have a match
          if (item.isLetter && !letterHasMatch[item.letter]) {
            return false;
          }
          return true;
        });
      };
 
      $scope.clearSearch = function() {
        $scope.search = '';
      };
      //Letters are shorter, everything else is 52 pixels
      $scope.getItemHeight = function(item) {
        return item.isLetter ? 40 : 100;
      };
      $scope.getItemWidth = function(item) {
        return '100%';
      };
      $scope.scrollBottom = function() {
        $ionicScrollDelegate.scrollBottom(true);
      };
      $scope.getScrollPosition = function()
      {
        console.log($scope.isde.getScrollPosition());
        console.log($scope.isde.getScrollView());
      }
      
      $scope.scrollTop = function()
      {
          $ionicScrollDelegate.scrollTop();
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
          // Stopping to AutoScroll
          $scope.settings.play = false;
          $scope.autoScroll('toggle');

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
        // Stopping to AutoScroll
        $scope.settings.play = false;
        $scope.autoScroll('toggle');
        
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
        /* apply filter again */
        $scope.items.filter(function(item) {
          if (typeof item.title != 'undefined') {
              var itemDoesMatch = !$scope.search || item.isLetter ||
                item.title.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

              //Mark this person's last name letter as 'has a match'
              if (!item.isLetter && itemDoesMatch) {
                var letter = item.title.charAt(0).toUpperCase();
                letterHasMatch[letter] = true;
              }

              return itemDoesMatch;
          }
        }).filter(function(item) {
          //Finally, re-filter all of the letters and take out ones that don't
          //have a match
          if (item.isLetter && !letterHasMatch[item.letter]) {
            return false;
          }
          return true;
        });

        $scope.$broadcast('scroll.infiniteScrollComplete');
  
      }

      // Change the number of Items Displayed on screen
      $scope.itemWidth = 100/$scope.settings.cols + "%"; 
      $scope.itemHeight = 100/$scope.settings.rows + "%";

      $scope.lessRows = $scope.settings.rows <= 3;
      console.log($scope.settings.rows <= 3);
      $scope.changeItems = function()
      {
        $scope.itemWidth = 100/$scope.settings.cols + "%";
        $scope.itemHeight = 100/$scope.settings.rows + "%";
        $scope.lessRows = ($scope.settings.rows <= 3);
        $scope.isde.resize();

      }

      // Function for Auto Scroll
      // Default Set to True
      var scroll;
      $scope.autoScroll = function(value)
      {
        $scope.isde.getScrollView().options.animationDuration = 1500;  
        if(value === 'button')
        {
          $scope.settings.play = !$scope.settings.play;
        }

        if($scope.settings.play == true)
        { 
            $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
            $scope.scrollposition = $scope.scrollposition + $scope.toscroll;
            $scope.isde.scrollTo($scope.scrollposition,0,true); 

                      
            scroll = $interval(function(){
            $scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
            $scope.scrollposition = $scope.scrollposition + $scope.toscroll;
            $scope.isde.scrollTo($scope.scrollposition,0,true);            
            },2500); 
        }
        else if($scope.settings.play == false)
        {
          $interval.cancel(scroll);
        }
        

      }

      // // Changing Directions.
      // $scope.$watch('settings.direction',function(newVal,oldVal)
      // {
      //       // When Direction is Horizontal
      //       if(newVal == 'x')
      //       {
      //         $state.go('home.horizontal');
      //       }
      //       else if(newVal == 'y')
      //       {
      //         $state.go('home.vertical');
      //       }

      // });
         

      $scope.ShowSettingsPopup = function() {
          $scope.data = {}

          // An elaborate, custom popup
          var settingsPopup = $ionicPopup.show({
            templateUrl: 'templates/popup.html',
            title: 'Slideshow Settings',
            scope: $scope,
            buttons : [
                  {
                    text : '<b>Close</b>',
                    type : 'button-positive',
                    onTap : function(e)
                    {
                      console.log("Closing Popup");
                      settingsPopup.close();
                    }
                  }
            ]
          });

         
          
      }; 

      $scope.gotScrolled = function () {
        
      };


      $scope.onDragUp = function () {
        console.log("onDragUp: " + $ionicScrollDelegate.getScrollPosition().top);
        $ionicScrollDelegate.scrollBy(0,20);
      };
      $scope.onDragDown = function () {
        console.log("onDragDown: " + $ionicScrollDelegate.getScrollPosition().top);
        $ionicScrollDelegate.scrollBy(0,-20);
      };
      
      $scope.onScroll = function() {
          console.log($scope.totalElement);
          console.log($scope.reverseElement);
          $scope.currentElement = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
      };

    });
