define([
  'backbone'
], function(Backbone){
	var SliderNavView = Backbone.View.extend({
		events:{
			"click a": "onclick"
		},
		initialize:function(){
		},
		onclick:function(e){
			this.trigger( $(e.target).index() == 0 ? "backclicked" : "nextclicked" );
		}
	});
	return SliderNavView;
});