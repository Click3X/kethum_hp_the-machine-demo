define([
  'pages/page_view',
  'text!templates/pages/photo.html'
], function(PageView, Template){
	var PhotoView = PageView.extend({
		template: _.template( Template ),
		id:"photo",
		onready:function(){
			//router.navigate("search", true);

			var _t = this;
			
			_t.file_input = _t.$el.find("input[type=file]")[0];
			_t.selected_photo_container = _t.$el.find(".selected-photo-container")[0];
			_t.selected_photo = _t.$el.find("div.selected-photo")[0];
			_t.canvas = _t.$el.find("canvas")[0];
			
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

				_t.session_model.set( "selected_photo_url", _t.canvas.toDataURL( "image/png" ) );
			}

			reader.onload = function(e){
				img.src = e.target.result;
			}

			reader.readAsDataURL(file);
		},
		getImageList: function() {

			var counter = 0,
				data_length,
				data = [];

			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/getImageList",
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        data:data,
		        success: function(data){
		           	// console.log( "pull image list: ", data );
		           	data_length = data.length;
		           	displayList(data);	
		           	$('.project-inner').slice(0, 4).addClass('visible');  

		           	// var library_sets = 	split(data, 8);
		           	// displayList(library_sets[0]);
		           	$("#more-image-btn").click(function(){
		           		countImages(data_length - 4);
		           		$('.project-inner').removeClass('visible');
		           		$('.project-inner').slice(counter, counter+4).addClass('visible'); 
		           	});
		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }


		    });

		    function countImages(length) {
				if (counter < length) {
					counter = counter + 4;
				} else {
					counter = 0;
				}
			}


			function displayList(data) {
				
		        var library_inner;
		    
				for (i = 0; i < data.length; i++) { 
					library_inner = '<li id="p' + i + '"><div class="project-inner" style="background: url(https://sirius-2.hpl.hp.com:8443/LSHImages/' + data[i] + ') center center no-repeat"><a data-navigate-to=""></a></div></li>';
					// library_inner = library_inner.concat(library_inner_item);	
					document.getElementById("library-list").insertAdjacentHTML('beforeend', library_inner);		    
				}
				
		    }

		    function split(a, n) {
			    var len = a.length,out = [], i = 0;
			    while (i < len) {
			        var size = Math.ceil((len - i) / n--);
			        out.push(a.slice(i, i += size));
			    }
			    
			    return out;
			}			

		},

		onclose:function(){
		},
	});
	return PhotoView;
});