define([
  'backbone',
  'models/page_model',
  'modules/audioplayer/views/audioplayer_view'
], function(Backbone, PageModel, AudioPlayerView){
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
			this.$el.fadeOut( 0 );
			
			this.$el.html( this.template() );

			ga( 'send', 'pageview', "/" + this.id );

			this.ready();
		},
		ready:function(){
			var _t = this;

			_t.isready = true;
			_t.buildaudioplayers();
			_t.initialize_navigation();

			_t.$el.fadeIn( 400 );

			requestAnimationFrame( function(){ _t.step(); } );

			_t.onready();

			console.log( "page ready: ", _t.id, "presenter_mode:", _t.presenter_mode() );
		},
		initialize_navigation:function(){
			var _t = this;

			_t.page_navigation 		=  _t.$el.find(".page-navigation").eq(0);
			_t.navigation_buttons 	= _t.page_navigation.find("li");
			_t.navigation_buttons.each(function(){
				var li = $(this);
				var a = li.children("a").eq(0);

				a.click(function(e){
					e.preventDefault();

					_t.onnavbuttonclicked( $(this).data("navigate-to") );
				});
			});
		},
		enableallnavigation:function(){
			this.navigation_buttons.removeClass("disabled");
		},
		buildaudioplayers:function(){
			var _t = this;

			_t.audioplayers = [];

			this.$el.find(".cfm-audioplayer").each( function( i, _el ){
				var audioplayer = new AudioPlayerView({
				  id:_el.getAttribute("id"), el:_el, page_collection:_t.page_collection
				});

				_t.audioplayers.push( audioplayer );
			});
		},
		step:function(e,h){
			var _t = this;

			if( didresize ){
				_t.win_w = _t.win.width(); 
				_t.win_h = _t.win.height();
	        	_t.onresize();
	        	didresize = false;
		    }

			if( _t.isready == true ) requestAnimationFrame( function(){ _t.step(); } );

			_t.onstep();
	    },
		onnavbuttonclicked:function( _pageid ){
			changepage( _pageid );
		},
		presenter_mode:function(){ return this.session_model.get("presenter_mode"); },
		onstep:function(){/*overridden*/},
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