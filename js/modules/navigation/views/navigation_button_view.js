define([
  'backbone',
], function(Backbone){
	var NavigationButtonView = Backbone.View.extend({
		initialize:function(){
			var _t = this;

			_t.model 	= new Backbone.Model( { id : _t.id } );
			_t.model.on( "change:active", function( _model ){
				if( _model.get( "active" ) == true ) _t.toActiveState();
				else _t.toInactiveState();
			});
			
			$(_t.$el.children("a")[0]).on("click", function(event){
				event.preventDefault();
				router.navigate( _t.id, true );
			});
		},
		toActiveState:function(){
			if(!this.$el.hasClass("active"))
			this.$el.addClass("active");
		},
		toInactiveState:function(){
			this.$el.removeClass("active");
		}
	});
	return NavigationButtonView;
});