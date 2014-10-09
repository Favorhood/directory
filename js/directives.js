angular.module('contactsApp.directives',['ionic'])
.directive('imScroll',function(){

	return {
		restrict : 'A',
		link:function(scope,element,attrs)
		{
			element.on('scroll',function(e){
				console.log(e.detail.scrollTop, e.detail.scrollLeft);
			})
		}
	}
})