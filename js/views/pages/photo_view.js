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
		onclose:function(){
		},
	});
	return PhotoView;
});