define([
  'pages/page_view',
  'text!templates/pages/wrapup.html'
], function(PageView, Template){
	var WrapupView = PageView.extend({
		template: _.template( Template ),
		id:"wrapup",
		onready:function(){
		},
		onclose:function(){
		},
	});
	return WrapupView;
});