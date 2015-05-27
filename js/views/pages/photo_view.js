define([
  'pages/page_view',
  'text!templates/pages/photo.html'
], function(PageView, Template){
	var PhotoView = PageView.extend({
		template: _.template( Template ),
		id:"photo",
		canvas_data:null,
		onready:function(){
			var _t = this;

			//html elements
			_t.file_input 					= _t.$el.find("input[type=file]")[0];
			_t.selected_photo_container 	= _t.$el.find(".selected-photo-container")[0];
			_t.selected_photo 				= _t.$el.find("div.selected-photo")[0];
			_t.canvas 						= _t.$el.find("canvas")[0];

			//jquery objects
			_t.library_list 				= _t.$el.find("#library-list").eq(0);
			_t.more_button 					= _t.$el.find("#more-image-btn").eq(0);

			//file input change hadler handler
			_t.file_input.addEventListener('change', function(e){
				 _t.resizeimage( e.target.files[0] );
			});

			//more button click handler
           	_t.more_button.click(function(){
           		_t.imagelist_page = _t.imagelist_page + 4; if(_t.imagelist_page > _t.library_list.find("li").length - 4) _t.imagelist_page = 0;

           		_t.library_list.find("li").removeClass('visible');
           		_t.library_list.find("li").slice(_t.imagelist_page, _t.imagelist_page + 4).addClass('visible'); 
           	});

           	_t.getImageList();

           	_t.audioplayers[0].play();
		},
		resizeimage:function(file){
			var _t = this;

			var img = new Image(), reader = new FileReader();

			img.onload = function(e){
				var ctx = _t.canvas.getContext("2d");
		        var sourceSize = img.width > img.height ? img.height : img.width;
		        var destX = (img.width-sourceSize)*.5;
		        var destY = (img.height-sourceSize)*.5;

				ctx.drawImage(img, destX, destY, sourceSize, sourceSize, 0, 0, 500, 500);

				_t.canvas_data = _t.canvas.toDataURL( "image/jpeg" );
				_t.uploadImage();
			}

			reader.onload = function(e){
				img.src = e.target.result;
			}

			reader.readAsDataURL(file);
		},
		uploadImage:function() {
			var _t = this;

			var data = {
				"name": "myImage.jpg",
				"src" : _t.canvas_data
			};

			$.ajax({
		        url: app.routes.image_upload,
		        method:"post",
			    cache: false,
			    contentType: 'application/json',
			    processData: false, 
		        data:JSON.stringify( data ),
		        success:function( _response ){
		           	var filename = _response['filename'].slice(0, -4);

		           	console.log( "upload image success: ", _response, filename );

	           		_t.session_model.set( "selected_photo_url", _t.canvas_data );
	    			_t.session_model.set( "selected_file_id", filename );
		        },
		        error: function( _e ) 
		        {
		           	console.log( "upload image error: " );
		           	console.log( _e );
		        }
		    });
		},
		getImageList: function() {
			var _t = this;
			
			$.ajax({
		        url: app.routes.image_list,
		        method:"get",
		        success: function( _response ){
		        	_t.imagelist_page = 0;
		        	
		        	//todo:fix this
		           	$('.gear').fadeOut(); 

		           	_t.buildImageList( _response );	

		           	_t.library_list = _t.$el.find("#library-list").eq(0);

		           	//todo:fix this
		           	_t.more_button.css("opacity",1);
		        },
		        error:function( _e ) 
		        {
		           	console.log( "getImageList error " );
		           	console.log( _e );
		        }
		    });
		},
		buildImageList:function( _data ){
			var _t = this;

			for (i = 0; i < _data.length; i++) { 
				getfilepath( i, _data[i].split("/")[1].slice(0,-4) );

				function getfilepath(_i, _filename){
					$.ajax({
				        url: app.routes.image_path + _filename,
				        method:"get",
				        success: function( _response ){
				        	var li = $('<li data-filepath="' + _response + '" data-filename="' + _filename + '"></li>'),
				        	inner = $('<div class="project-inner"></div>'),
							a = $('<a style="background-image: url(' + _response + ')"></a>');

							inner.append(a);
							li.append(inner);
							_t.library_list.append(li);

							li.click( function doimagelistimageselected(){ _t.imageListImageSelected( $(this) ); } );

							if(_i < 4) li.addClass("visible");
				        },
				        error:function( _e ) 
				        {
				           	console.log( "buildImageList getfilepath error: " );
				           	console.log( _e );
				        }
				    });
				}
			}
		},
		imageListImageSelected:function( _li ){
			var _t = this;

	    	_t.library_list.find("li").removeClass('selected');
	    	_li.addClass('selected');

	    	filepath = _li.data('filepath');
	    	filename = _li.data('filename');

	    	console.log("imageListSelected", filename, filepath);

	    	_t.session_model.set( "selected_photo_url", filepath );
	    	_t.session_model.set( "selected_file_id", filename );
	    },
		onclose:function(){
		},
	});
	return PhotoView;
});