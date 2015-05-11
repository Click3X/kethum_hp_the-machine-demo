define([
  'pages/page_view',
  'text!templates/pages/attract.html'
], function(PageView, Template){
	var AttractView = PageView.extend({
		template: _.template( Template ),
		id:"attract",
		onready:function(){
		},
		onclose:function(){
		},
	});
	return AttractView;
});