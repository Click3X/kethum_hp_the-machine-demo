define([
  'pages/page_view',
  'text!templates/pages/intro.html'
], function(PageView, Template){
	var IntroView = PageView.extend({
		template: _.template( Template ),
		id:"intro",
		onready:function(){
		},
		onclose:function(){
		},
	});
	return IntroView;
});