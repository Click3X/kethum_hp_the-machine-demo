define([
  'backbone'
], function(Backbone){
	var SliderSlideView = Backbone.View.extend({
		initialize:function(options){
			var _t = this;

			_t.el.style.width = options.slideWidth;
			_t.a_el = _t.$el.find("a.cfm-slider-content")[0];
			
			_t.model = new Backbone.Model({ id:_t.id });

			if( _t.el.hasAttribute("data-image") ) _t.image_url = _t.el.getAttribute("data-image");
			if(_t.image_url) _t.loadimage();
		},
		loadimage:function(){
			var _t = this;
			
			_t.img = new Image();
			_t.img.onload = function(e){
				_t.a_el.style.backgroundImage = "url(" + _t.image_url + ")";
			};
			_t.img.src = _t.image_url;
		},
		toactivestate:function(){
			if(this.model){
				var current = this.model.collection.findWhere({active:true});
				if(current && current != this.model){
					current.set("active", false);
				}

				this.model.set("active", true);
			}
		}
	});
	return SliderSlideView;
});