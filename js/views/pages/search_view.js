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
				_t.searchMed(selected_url);
				_t.searchSlow(selected_url);
			}


		    $.fn.jQuerySimpleCounter = function( options ) {
			    var settings = $.extend({
			        start:  0,
			        end:    216000,
			        easing: 'swing',
			        duration: 2500,
			        complete: ''
			    }, options );

			    var thisElement = $(this);

			    $({count: settings.start}).animate({count: settings.end}, {
					duration: settings.duration,
					easing: settings.easing,
					step: function() {						
						var mathCount = Math.ceil(this.count);
						thisElement.text(mathCount);
					},
					complete: function() {
						settings.complete;
						thisElement.parent().addClass('time-done');
					} 
				});
			};
		},

		searchSlow:function(selected_url) {
			var _t = this;
			var data = {};
			var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
			console.log(rString);
			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/search/searchByHadoopWithTracking/" + selected_url + "/" + rString,
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

		    function randomString(length, chars) {
			    var result = '';
			    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
			    return result;
			}
		},

		searchMed:function(selected_url) {
			var _t = this;
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
		           	$('#med-search > .gear').fadeOut();           	
		           	_t.displayList(data, "med");
		           	$('#med-list').addClass('visible');           	

		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });
		},

		searchFast:function(selected_url) {
			var _t = this;
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
		           	_t.displayList(data, "fast");
		           	$('#fast-list').addClass('visible');
		           	
		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });
		},

		displayList:function(data, searchSpeed) {
			var search_inner, filename, data_img, time;
	        time = data['results'][data['results'].length - 1]['time'];
	        console.log('time consumed: ' + time);

			for (i = 0; i < 4; i++) { 
				data_img = data['results'][i]['img'];

				// filename = data[0][i].slice(16, -4);

				search_inner = '<li id="' + searchSpeed + i + '"><div class="result-inner" data-filename="' + filename + '" style="background-image: url(https://sirius-2.hpl.hp.com:8443/LSHImages/' + data_img + '.jpg)"></div></li>';
				document.getElementById(searchSpeed + "-list").insertAdjacentHTML('beforeend', search_inner);		


				$('#' + searchSpeed + '-search').find('.time-cost').jQuerySimpleCounter({start:0, end: time,duration: 800});    
			}
		},

		onclose:function(){
		},
	});
	return SearchView;
});