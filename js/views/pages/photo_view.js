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
			
			_t.file_input = _t.$el.find("input[type=file]")[0];
			_t.selected_photo_container = _t.$el.find(".selected-photo-container")[0];
			_t.selected_photo = _t.$el.find("div.selected-photo")[0];
			_t.canvas = _t.$el.find("canvas")[0];
			_t.library_list = _t.$el.find("#library-list").eq(0);

			_t.file_input.addEventListener('change', function(e){
				 _t.resizeimage( e.target.files[0] );
			});

			_t.getImageList();

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

			var srcContent = {
				"name": "myImage.jpg",
				"src" : _t.canvas_data
			};

			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/uploadImageFromSrc",
		        method:"post",
			    cache: false,
			    contentType: 'application/json',
			    processData: false, 
		        data:JSON.stringify(srcContent),
		        success: function(data){
		           	console.log( data );
		           	var filename = data['filename'].slice(0, -4);

		           	console.log(filename);

	           		_t.session_model.set( "selected_photo_url", _t.canvas_data );
	    			_t.session_model.set( "selected_file_id", filename );
		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });
		},

		getImageList: function() {
			var _t = this;
			
			_t.counter = 0;

			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/getImageList",
		        method:"get",
		        success: function(data){
		           	$('.gear').fadeOut(); 
		           	displayList( data );	
		           	setTimeout(function(){ $("#more-image-btn").css('opacity', 1); }, 1100);		           	

		           	_t.library_list = _t.$el.find("#library-list").eq(0);

		           	//more button functionality
		           	$("#more-image-btn").click(function(){
		           		_t.counter = _t.counter + 4; if(_t.counter > data.length - 4) _t.counter = 0;

		           		_t.library_list.find("li").removeClass('visible');
		           		_t.library_list.find("li").slice(_t.counter, _t.counter+4).addClass('visible'); 
		           	});
		        },
		        error: function(e) 
		        {
		           	console.log( "getImageList:error " );
		           	console.log(e);
		        }
		    });

			function displayList(data) {
				console.log(data);

		        var li, project_inner, filename, a;
		    
				for (i = 0; i < data.length; i++) { 
					getfilepath( data[i].split("/")[1].slice(0,-4) );

					function getfilepath(filename){
						$.ajax({
					        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/getImageFullPath/" + filename,
					        method:"get",
					        success: function(filepath){
					        	li = $('<li data-filepath="' + filepath + '" data-filename="' + filename + '"></li>');
					        	project_inner = $('<div class="project-inner"></div>');
								a = $('<a style="background-image: url(' + filepath + ')"></a>');

								project_inner.append(a);
								li.append(project_inner);
								_t.library_list.append(li);

								li.click( function(){ _t.selectLibrary( $(this) ); } );

								_t.library_list.find("li").slice(0, 4).addClass('visible');
					        },
					        error: function(e) 
					        {
					           	console.log( "displayList:error " );
					           	console.log(e);
					        }
					    });
					}
				}
		    }	
		},
		selectLibrary:function(_li) {
			var _t = this;

	    	_t.library_list.find("li").removeClass('selected');
	    	_li.addClass('selected');

	    	filepath = _li.data('filepath');
	    	filename = _li.data('filename');

	    	console.log("selectLibrary", filename, filepath);

	    	_t.session_model.set( "selected_photo_url", filepath );
	    	_t.session_model.set( "selected_file_id", filename );
	    },
		onclose:function(){
		},
	});
	return PhotoView;
});