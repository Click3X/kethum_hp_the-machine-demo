define([
  'backbone',
  'modules/slider/views/slider-thumb_view',
  'modules/slider/views/slider-nav_view'
], function(Backbone, SliderThumbView, SliderNavView){
	var SliderTumbListView = Backbone.View.extend({
		currentgroup:0,
		initialize:function(){
			var _t = this;

			_t.views = [];

			_t.ul_el = this.$el.children("ul")[0];
			_t.thumb_els = $(_t.ul_el).children("li");
			
			_t.ar = _t.ul_el.getAttribute("data-aspectratio");
			_t.thumbs_shown = _t.ul_el.getAttribute("data-thumbs-shown");
			_t.numgroups = Math.ceil( _t.thumb_els.length/_t.thumbs_shown );

			_t.thumb_els.each(function(i, _el){
				var thumb = new SliderThumbView({
					id: i, el: _el,
					thumbWidth: (100/_t.thumb_els.length) + "%",
					model:_t.collection.get(i),
					group:Math.floor(i/_t.thumbs_shown)
				});

				_t.views.push(thumb);
			});

			_t.ul_width_percent = _t.thumb_els.length*(100/_t.thumbs_shown);

			_t.ul_el.style.width = _t.ul_width_percent + "%";

			_t.nav = new SliderNavView({
				el:_t.$el.find(".cfm-slider-nav")
			});
			_t.nav.on("backclicked", function(){
				_t.scrolltopreviousgroup();
			});
			_t.nav.on("nextclicked", function(){
				_t.scrolltonextgroup();
			});

			_t.collection.on("change:active", function(_model){
				var thumb = _t.views[_model.id];

				if( _model.get("active") == true ){
					thumb.toactivestate();

					if(thumb.group != _t.currentgroup) _t.scrolltogroup(thumb.group);
				}else{ 
					thumb.toinactivestate(); 
				}
			});
		},
		scrolltogroup:function(_i){
			this.currentgroup = _i;
			this.scrolltocurrentgroup();
		},
		scrolltonextgroup:function(){
			this.currentgroup = Math.min( this.currentgroup+1, this.numgroups-1 );
			this.scrolltocurrentgroup();
		},	
		scrolltopreviousgroup:function(){
			this.currentgroup = Math.max( this.currentgroup-1, 0 );
			this.scrolltocurrentgroup();
		},
		scrolltocurrentgroup:function(){
			var min = Math.max( -(this.ul_width_percent-100), -(this.currentgroup*100) );

			this.ul_el.style.marginLeft =  min + "%";
		}
	});
	return SliderTumbListView;
});