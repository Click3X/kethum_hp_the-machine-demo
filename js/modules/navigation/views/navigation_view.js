define([
  'backbone',
  'modules/navigation/views/navigation_button_view'
], function(Backbone, NavigationButtonView){
	var NavigationView = Backbone.View.extend({
		initialize:function(options){
			var _t = this;

			_t.page_collection = options.page_collection;
			_t.ul_el = _t.$el.children("ul")[0];

			_t.collection = new Backbone.Collection();
			_t.buildButtons();

			_t.page_collection.on("change:active",function(_model){
				var button_model = _t.collection.get(_model.id);
				if(button_model) button_model.set( "active", _model.get("active") );
			});
		},
		buildButtons:function(){
			var _t = this;

			$.each( $(this.ul_el).children("li"), function(i,_el){
				var a_el = $(_el).children("a")[0];

				if( a_el.hasAttribute( "data-navigate-to" ) ){
					var button = new NavigationButtonView({
						el:_el, id:a_el.getAttribute( "data-navigate-to" )
					});

					_t.collection.push( button.model );
				}
			});
		}
	});
	return NavigationView;
});