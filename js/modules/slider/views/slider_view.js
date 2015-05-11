define([
  'backbone',
  'modules/slider/views/slider-slide-list_view',
  'modules/slider/views/slider-thumb-list_view'
], function(Backbone, SliderSlideListView, SliderThumbListView){
	var SliderView = Backbone.View.extend({
		initialize:function(){
			var _t = this;

			_t.collection = new Backbone.Collection();

			_t.loop = _t.el.hasAttribute("loop") ? true : false;

			if( _t.$el.children("div.cfm-slider-slides").length > 0 ){
				_t.slides_view = new SliderSlideListView( { 
					el:_t.$el.children("div.cfm-slider-slides")[ 0 ], 
					collection:_t.collection,
					loop:_t.loop });
			}

			if( _t.$el.children("div.cfm-slider-thumbs").length > 0 ){
				_t.thumbs_view = new SliderThumbListView( {
					el:_t.$el.children("div.cfm-slider-thumbs")[ 0 ], 
					collection:_t.collection });
			}

			_t.slides_view.scrolltoslide( 0 );
		}	
	});

	return SliderView;
});