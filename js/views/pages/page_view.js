define([
  'backbone',
  'models/page_model',
  'modules/slider/views/slider_view',
  'modules/videoplayer/views/videoplayer_view',
  'modules/navigation/views/navigation_view'
], function(Backbone, PageModel, SliderView, VideoPlayerView, NavigationView){
	var PageView = Backbone.View.extend({
		el: "#page-container",
		initialize:function( options ){
			var _t = this;

			if( options.session_model ) _t.session_model = options.session_model;

			_t.model = new PageModel( { id:_t.id } );
			_t.collection.push( _t.model );

			_t.model.on( "change:active", function( _model ){
				if( _model.get("active") == true )
					_t.render();
				else
					_t.close();
			});

			_t.win = $(window);
		},
		render:function(){
			console.log("Render page html");

			this.$el.fadeOut( 0 );
			
			this.$el.html( this.template() );

			ga( 'send', 'pageview', "/" + this.id );

			this.ready();
		},
		ready:function(){
			var _t = this;

			_t.isready = true;

			_t.buildsliders();
			_t.buildvideos();
			_t.buildnavigations();

			_t.$el.fadeIn( 400 );

			requestAnimationFrame( function(){ _t.step(); } );

			_t.onready();

			console.log(_t.videos);
		},
		buildsliders:function(){
			var _t = this;

			console.log("PageView: ", this.id, " :buildsliders");

			_t.sliders = [];

			this.$el.find(".cfm-slider" ).each( function( i, _el ){
				var slider = new SliderView({
					id:_el.getAttribute( "id" ), 
					el:_el
				} );

				_t.sliders.push( slider );				
			});
		},
		buildvideos:function(){
			var _t = this;

			console.log("PageView: ", this.id, " :buildvideos");

			_t.videos = [];

			this.$el.find(".cfm-videoplayer").each( function( i, _el ){
				var video = new VideoPlayerView({
				  id:_el.getAttribute("id"), el:_el, page_collection:_t.page_collection
				});

				_t.videos.push( video );
			});
		},
		buildnavigations:function(){
			var _t = this;

			console.log("PageView: ", this.id, " :buildnavigations");

			_t.navigations = [];

			this.$el.find(".cfm-navigation").each( function( i, _el ){
				var navigation = new NavigationView({
		          id: _el.getAttribute("id"), 
		          el:_el, page_collection:_t.collection
		        });

		        _t.navigations.push( navigation );
			});
		},
		step:function(e,h){
			var _t = this;

			if( didresize ){
				_t.win_w = _t.win.width(); 
				_t.win_h = _t.win.height();

				$.each(_t.videos, function(k,v){
					v.resize( _t.win_w, _t.win_h );
				});

	        	_t.onresize();
	        	didresize = false;
		    }

			if( _t.isready == true ) requestAnimationFrame( function(){ _t.step(); } );
	    },
	    onresize:function(){/*overridden*/},
		onready:function(){/*overridden*/},
		onready:function(){/*overridden*/},
		onclose:function(){/*overridden*/},
		close:function(){
			this.onclose();
			this.isready = false;
		}
	});
	return PageView;
});