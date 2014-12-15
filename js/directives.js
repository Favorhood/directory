angular.module('contactsApp.directives',['ionic'])
.directive('scrollTo',function($ionicScrollDelegate){

	return {
		restrict : 'A',
		link:{
				pre: function(scope,element,attrs){
					var direction = attrs.direction;
					var delegateHandle = attrs.delegateHandle;
					var delegate = $ionicScrollDelegate.$getByHandle(delegateHandle);
					var scrollPosition = attrs.scrollTo || 0;
					if(direction === 'x')
					{
						//console.log(scrollPosition);
						delegate.scrollTo(0,0,true);
						delegate.scrollTo(scrollPosition,0,true);
					}
					else if(direction === 'y')
					{
						delegate.scrollTo(0,0,true);
						delegate.scrollTo(0,scrollPosition,true);
					
					}
				}
		}
	}
})