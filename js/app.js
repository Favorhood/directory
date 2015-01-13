      //var $scope.isde = null;
'use strict';

var app =  angular.module('contactsApp', ['ionic','contactsApp.config','contactsApp.directives']);
app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
app.controller('ScrollCtrl', function($scope,$http,$ionicScrollDelegate,$interval,data, $ionicPopup,$state, filterFilter) {
      
      $scope.isde = $ionicScrollDelegate.$getByHandle('isde');
      $scope.reverseElement = 0;    
      $scope.toscroll = undefined;
      $scope.feed = data;
      $scope.items = [];
      $scope.noMoreItemsAvailable = false;
      $scope.number = 1;
      $scope.totalElement = $scope.feed.data.items.length;
      $scope.settings = {"play" : false,"direction" : "x" ,"rows" : 1,"cols" : 1};
      $scope.celm = 1;
      $scope.scrollTo = undefined;
      var letters = $scope.letters = [];
      var locations = $scope.locations = [];
      var currentCharCode = 'A'.charCodeAt(0) - 1;
      var scrollposition = 0;
      var check = false;
      console.log($scope.feed.data.items);
      
      $scope.feed.data.items
      .sort(function(a, b) {
        return a.title > b.title ? 1 : -1;
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
      
      var itemslen = $scope.items.length;
      var locitems = $scope.getLocations();
          
      for(var i=0;i<$scope.number;i++)
      {
          $scope.items.push(locitems[itemslen + i]);
      }
      
 
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
          scrollposition = $scope.isde.getScrollPosition()["left"];
           if(scrollposition == 0)
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
         
          // Scroll if Direction is Horizontal
          if($scope.settings.direction === 'x')
          {
               if(scrollposition === 0)
                {
                  $index = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
                  $scope.items.unshift($scope.feed.data.items[$index]);
                  $scope.reverseElement++;
                }
                else
                {
                  imScroll('x',$scope.isde,false);
                  $scope.celm = Math.ceil(scrollposition / 1002);
                }
          }
          // If Direction is Vertical
          else if($scope.settings.direction === 'y')
          { 
                if(scrollposition === 0)
                {
                  $index = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
                  $scope.items.unshift($scope.feed.data.items[$index]);
                  $scope.reverseElement++;
                }
                else
                {
                  imScroll('y',$scope.isde,false);
                  $scope.celm = Math.ceil(scrollposition / 1002);   
                }

          }
         
          
        
      }
      
      $scope.scrollAtSlide = function(scrollposition)
      {
          if (scrollposition == 0) {
              $scope.celm = 1;
          } else {
              $scope.celm = Math.ceil(scrollposition / 1002);
              $scope.celm = $scope.celm + 1;
          }
          $scope.isde.scrollTo(scrollposition,0,true);
      }

      $scope.scrollNext = function()
      {
        // Stopping to AutoScroll
        $scope.settings.play = false;
        $scope.autoScroll('toggle');
        console.log(scrollposition);
        if($scope.settings.direction === 'x')
        {
          imScroll('x',$scope.isde,true);
          if (scrollposition == 0) {
              $scope.celm = 2;
          } else {
              $scope.celm = Math.ceil(scrollposition / 1002);
              $scope.celm = $scope.celm + 2;
          }
        }
        else if($scope.settings.direction === 'y')
        {
          imScroll('y',$scope.isde,true);
          $scope.celm = Math.ceil(scrollposition / 1002);
        }
                  
      }
     
      //  It is called when there is need of more feed
      /*$scope.loadMore = function()
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
  
      }*/
      
      $scope.loadMore = function() {
        console.log("loading elements");
        var locitems = $scope.getLocations();
        var itemslen = $scope.items.length;
        var eltadd = $scope.number;
        
        if(itemslen < $scope.totalElement)  {
            if(itemslen + eltadd > $scope.totalElement) {
                eltadd = (itemslen + eltadd) - $scope.totalElement;
            }
            for(var i=0; i<eltadd; i++){
              $scope.items.push(locitems[itemslen + i]);
            }
        }
        
        if ( $scope.items.length >= $scope.totalElement ) {
        
          $scope.noMoreItemsAvailable = true;
        }
       $scope.$broadcast('scroll.infiniteScrollComplete');
        
      };

      // Change the number of Items Displayed on screen
      $scope.itemWidth = 100/$scope.settings.cols + "%"; 
      $scope.itemHeight = 100/$scope.settings.rows + "%";

      $scope.lessRows = $scope.settings.rows <= 3;
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
            if($scope.settings.direction === 'x'){

              imScroll('x',$scope.isde,true);                      
              scroll = $interval(function(){
                imScroll('x',$scope.isde,true);  
                $scope.celm = Math.ceil(scrollposition / 1002);
              },2500); 
            }
            else if($scope.settings.direction === 'y'){

              imScroll('y',$scope.isde,true);  

                      
              scroll = $interval(function(){
                imScroll('y',$scope.isde,true);  
                $scope.celm = Math.ceil(scrollposition / 1002);
              },2500); 
            }
        }
        else if($scope.settings.play == false)
        {
          $interval.cancel(scroll);
        }
        

      }

      // // Changing Directions.
      $scope.$watch('settings.direction',function(newVal,oldVal)
      {
            // When Direction is Vertical
            if(newVal == 'y')
            {
              
              scrollposition = scrollposition / $scope.isde.getScrollView()["__clientWidth"];
              scrollposition = scrollposition * $scope.isde.getScrollView()["__clientHeight"];
                    
            }

            else if(newVal == 'x')
            {
                if(check === false)
                {
                  check = true;
                }
                else
                {

                  scrollposition = scrollposition / $scope.isde.getScrollView()["__clientHeight"];
                  scrollposition = scrollposition * $scope.isde.getScrollView()["__clientWidth"]; 
                }
               
            }
            
            $scope.scrollTo = Math.ceil(scrollposition);
      });
         

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
          //console.log($scope.totalElement);
          //console.log($scope.reverseElement);
          //$scope.currentElement = ($scope.totalElement - 1) - $scope.reverseElement % $scope.totalElement;
          //$scope.toscroll = $scope.isde.getScrollView()["__clientWidth"];
          //scrollposition = scrollposition + $scope.toscroll;
          //$scope.celm = Math.ceil(scrollposition / 1002);        

          if($scope.settings.direction === 'x')
            scrollposition  = $scope.isde.getScrollPosition()["left"];
          else if($scope.settings.direction === 'y')
            scrollposition  = $scope.isde.getScrollPosition()["top"];


      };
      
    $scope.loadMoreByPaging = function()
    {
        $scope.isde.scrollBottom(true);
        $scope.loadMore();
    };
    
    console.log(scrollposition);
    
    
    $scope.getPages = function() {
        if($scope.items.length >=1 && $scope.items.length <= 24) {
            return new Array($scope.totalElement);
        } else {
            return new Array(10);
        }
    };
    

    });


// Function for Scrolling

function imScroll(direction,delegate,increment)
{
    var toscroll  = undefined;
    var scrollposition = undefined;

    if(direction === 'x')
    {
      toscroll = delegate.getScrollView()["__clientWidth"];
      if(increment === true)
        scrollposition = delegate.getScrollPosition()["left"] + toscroll;
      else 
        scrollposition = delegate.getScrollPosition()["left"] - toscroll;
      delegate.scrollTo(scrollposition,0,true);
    }
    else if(direction === 'y')
    {
      toscroll = delegate.getScrollView()["__clientHeight"];
      if(increment === true)
        scrollposition = delegate.getScrollPosition()["top"] + toscroll;
      else 
        scrollposition = delegate.getScrollPosition()["top"] - toscroll;
      delegate.scrollTo(0,scrollposition,true);
    }

}