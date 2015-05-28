define([
  'pages/page_view',
  'text!templates/pages/attract.html',
  'modules/videoplayer/views/videoplayer_view'
], function(PageView, Template, VideoPlayerView){
	var AttractView = PageView.extend({
		template: _.template( Template ),
		id:"attract",
		onready:function(){
			var _t = this;

			_t.video = new VideoPlayerView({
			  id:"attract_video", 
			  el:_t.$el.find(".cfm-videoplayer")[0]
			});

			_t.video.onended(function(){
				_t.video.play();
			});
		},
		onresize:function(){
			this.video.resize( this.win_w, this.win_h );
		},
		onclose:function(){
		},
	});
	return AttractView;
});