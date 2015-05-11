define([
  'pages/page_view',
  'text!templates/pages/thankyou.html'
], function(PageView, Template){
	var ThankyouView = PageView.extend({
		template: _.template( Template ),
		id:"thankyou",
		onready:function(){
		},
		onclose:function(){
		},
	});
	return ThankyouView;
});