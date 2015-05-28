define([
  'pages/page_view',
  'text!templates/pages/wrapup.html',
  'modules/videoplayer/views/videoplayer_view'
], function(PageView, Template, VideoPlayerView){
	var WrapupView = PageView.extend({
		template: _.template( Template ),
		id:"wrapup",
		onready:function(){
			var _t = this;

			_t.video = new VideoPlayerView({
			  id:"wrapup_video", 
			  el:_t.$el.find(".cfm-videoplayer")[0]
			});

			_t.video.onended(function(){
				changepage("attract");
			});
		},
		onresize:function(){
			this.video.resize( this.win_w, this.win_h );
		},
		onclose:function(){
		},
	});
	return WrapupView;
});