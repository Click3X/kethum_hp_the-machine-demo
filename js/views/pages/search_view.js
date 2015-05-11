define([
  'pages/page_view',
  'text!templates/pages/search.html'
], function(PageView, Template){
	var SearchView = PageView.extend({
		template: _.template( Template ),
		id:"search",
		onready:function(){
			var _t = this;

			_t.selected_photo = _t.$el.find("div.selected-photo")[0];

			if( _t.session_model.get("selected_photo_url") ){
				$(_t.selected_photo).css("background-image","url("+_t.session_model.get("selected_photo_url")+")");
			}
		},
		onclose:function(){
		},
	});
	return SearchView;
});