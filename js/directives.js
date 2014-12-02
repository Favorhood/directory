angular.module('contactsApp.directives',['ionic'])
.directive('scrollDirectionChange',function(){

	return {
		restrict : 'A',
		link:function(scope,element,attrs)
		{
			scope.$watch(attrs.direction,function(newValue){
				attrs.scrollDirectionChange();
			});
		}
	}
})