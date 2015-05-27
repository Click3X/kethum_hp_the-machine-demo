define([
  'pages/page_view',
  'text!templates/pages/search.html'
], function(PageView, Template){
	var SearchView = PageView.extend({
		template: _.template( Template ),
		id:"search",
		onready:function(){
			var _t = this;

			_t.ajax_queue 			= [];
			_t.audiotrack_keys 		= { "hadoop":0, "naive":1, "lsh":2 }
			_t.selected_photo_el 	= _t.$el.find( "div.selected-photo" )[0];
			_t.uuid 				= randomString( 36, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' );

			if( _t.session_model.get( "selected_photo_url" ) ){
				$( _t.selected_photo_el).css( "background-image", "url(" + _t.session_model.get( "selected_photo_url" ) + ")" );

				_t.selected_photo_id = _t.session_model.get( "selected_file_id" );

				if( _t.selected_photo_id ){
					setTimeout( function(){ _t.doSearch( "hadoop" ) }, 500 );
					setTimeout( function(){ _t.doSearch( "naive" ) }, 10500 );
					setTimeout( function(){ _t.doSearch( "lsh" ) }, 20500 );
				}
			}
		},
		doSearch:function( _method ){
			var _t 			= this,
			search_el 		= _t.$el.find("#" + _method).eq(0);

			search_el.addClass( "visible" );

			_t.ajax_queue.push( $.ajax({
		        url: app.routes.search[ _method ] + _t.selected_photo_id + "/" + ( _method == "hadoop" ? _t.uuid : "" ) ,
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        success:function( _data ){
		           	console.log( "search success : ", _method,",", _data );

		           	_t.displayImageList( _data, _method, search_el );          
		        },
		        error:function( _e ) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log( _e );
		        }
		    }) );

		    _t.audioplayers[ _t.audiotrack_keys[ _method ] ].play();
		},
		displayImageList:function( _data, _method, _search_el ) {
			var _t 			= this, 
			search_ul 		= _search_el.find("ul.image-list").eq(0), 
			time_el 		= _search_el.find(".time-cost").eq(0),
			gear_el 		= _search_el.find(".gear").eq(0),
			time 			= _data['results'][ _data['results'].length - 1 ]['time'];

	        console.log( 'time consumed: ', _method, ":", time );

           	gear_el.fadeOut();
	        search_ul.addClass("visible");
	        search_ul.empty();

	        //animate time
	        time_el.jQuerySimpleCounter( { start:0, end:time, duration: 800 } );

	        //build images
			for(i = 0; i < 4; i++) { 
				var filename = _data['results'][i]['img'].split("/")[1];

				_t.ajax_queue.push( $.ajax({
			        url: app.routes.image_path + filename,
			        method:"get",
			        success: function( _file_path ){
			        	console.log("display image list success: ", _method, ":", _file_path);

			        	//create image li
			        	var li 				= $('<li class="visible"></li>'),
			        	inner 				= $('<div class="project-inner"></div>'),
						a 					= $('<a style="background-image: url(' + _file_path + ')"></a>');

						li.append( inner );
						inner.append( a );

						//append li to image list ul
						search_ul.append( li );	
			        },
			        error: function( _e ) 
			        {
			           	console.log( "display image list success: ", _method );
			           	console.log( _e );
			        }
			    }) );
			}
		},
		cancelHadoop:function(){
			var _t = this;

			//cancel ajax calls
			$.each( _t.ajax_queue, function(){ this.abort(); });

			_t.ajax_queue = [];

			//don't queue this one. It must finish!
			$.ajax({
		        url: app.routes.cancel_hadoop + _t.uuid,
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        success:function( _data ){
		           	console.log("cancel hadoop success: ", _data );			           	
		        },
		        error: function( _e ) 
		        {
		           	console.log( "cancel hadoop error: " );
		           	console.log( _e );
		        }
		    });
		},
		onclose:function(){
			console.log("closing search view page");

			this.cancelHadoop();
		},
	});
	return SearchView;
});