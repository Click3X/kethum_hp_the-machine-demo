define([
  'pages/page_view',
  'text!templates/pages/search.html'
], function(PageView, Template){
	var SearchView = PageView.extend({
		template: _.template( Template ),
		id:"search",
		onready:function(){
			var _t = this;
			var selected_url;

			_t.selected_photo = _t.$el.find("div.selected-photo")[0];

			if( _t.session_model.get("selected_photo_url") ){
				$(_t.selected_photo).css("background-image","url("+_t.session_model.get("selected_photo_url")+")");
				selected_url = _t.session_model.get("selected_file_id");
				_t.searchFast(selected_url);
				// _t.searchMed(selected_url);
				// _t.searchSlow(selected_url);
			}
		},

		searchSlow:function(selected_url) {
			var data = {};
			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByNaive/" + selected_url,
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        data:data,
		        success: function(data){
		           	console.log( "slow search result: ", data );	           	

		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });
		},

		searchMed:function(selected_url) {
			var data = {};
			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByHadoop/" + selected_url,
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        data:data,
		        success: function(data){
		           	console.log( "medium search result: ", data );	           	

		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });
		},

		searchFast:function(selected_url) {
			var data = {};
			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByHadoopWithTracking/" + selected_url,
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        data:data,
		        success: function(data){
		           	console.log( "fast search result: ", data );	           	

		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });
		},

		onclose:function(){
		},
	});
	return SearchView;
});