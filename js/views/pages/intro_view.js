define([
  'pages/page_view',
  'text!templates/pages/intro.html',
  'modules/videoplayer/views/videoplayer_view'
], function(PageView, Template, VideoPlayerView){
	var IntroView = PageView.extend({
		template: _.template( Template ),
		id:"intro",
		onready:function(){
			var _t = this;

			_t.video = new VideoPlayerView({
			  id:"intro_video", 
			  el:_t.$el.find(".cfm-videoplayer")[0]
			});

			_t.video.onended( function(){
				changepage("photo");
			});
		},
		onresize:function(){
			this.video.resize( this.win_w, this.win_h );
		},
		onclose:function(){
		},
	});
	return IntroView;
});