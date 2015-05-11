define([
  'backbone'
], function(Backbone){
	var SliderThumbView = Backbone.View.extend({
		a_el:null,
		events:{
			"click a":"onclick"
		},
		initialize:function(options){
			var _t = this;

			_t.group = options.group;
			_t.el.style.width = options.thumbWidth;
			_t.a_el = _t.$el.find("a.cfm-slider-content")[0];

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
		onclick:function(e){
			if(e) e.preventDefault();

			if(this.model){
				var current = this.model.collection.findWhere({active:true});
				if(current && current != this.model) current.set("active", false);

				this.model.set("active", true);
			}
		},
		toactivestate:function(){
			if( !this.$el.hasClass("active") ) this.$el.addClass("active");
		},
		toinactivestate:function(){
			this.$el.removeClass("active");
		}
	});
	return SliderThumbView;
});