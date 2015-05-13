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
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByHadoopWithTracking/" + selected_url + "/13krjaposd8823r-aw3hrad",
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
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByNaive/" + selected_url,
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
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByLSH/" + selected_url,
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        data:data,
		        success: function(data){
		           	console.log( "fast search result: ", data );	
		           	$('#fast-search > .gear').fadeOut();           	
		           	displayList(data);
		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });

		    function displayList(data) {
				
		        var fast_inner, filename, data_img;

		        // console.log(data['results']);


		    
				for (i = 0; i < data['results'].length - 2; i++) { 
					data_img = data['results'][i]['img'];
					// console.log(data_img);

					// filename = data[0][i].slice(16, -4);

					fast_inner = '<li id="fast' + i + '"><div class="result-inner" data-filename="' + filename + '" style="background-image: url(https://sirius-2.hpl.hp.com:8443/LSHImages/' + data_img + '.jpg)"></div></li>';
					document.getElementById("fast-list").insertAdjacentHTML('beforeend', fast_inner);	
					// console.log(fast_inner);  	    
				}
				
		    }
		},

		onclose:function(){
		},
	});
	return SearchView;
});