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

				var fileid = _t.session_model.get("selected_file_id");

				if( fileid ){
					_t.searchFast( fileid );
					_t.searchMed( fileid );
					_t.searchSlow( fileid );
				}
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
		           	$('#slow-search > .gear').fadeOut();           	
		           	_t.displayList(data, "slow");
		           	$('#slow-list').addClass('visible');  	           	

		        },
		        error: function(e) 
		        {
		           	console.log( "pull list Error: " );
		           	console.log(e);
		        }
		    });

		    $('.cancel-search').click(function(){
				_t.cancelSearch(rString);
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
			var search_inner, filename, time, li, a;

			last_index = data['results'].length - 1;
	        time = data['results'][last_index]['time'];

	        console.log('time consumed: ' + time);

			for (i = 0; i < 4; i++) { 
				filename = data['results'][i]['img'].split("/")[1];

				$.ajax({
			        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/getImageFullPath/" + filename,
			        method:"get",
			        success: function(filepath){
			        	li = $('<li class="visible"></li>');
			        	search_inner = $('<div class="project-inner"></div>');
						a = $('<a style="background-image: url(' + filepath + ')"></a>');

						li.append(search_inner);
						search_inner.append( a );
						$("#" + searchSpeed + "-list").append( li );		
			        },
			        error: function(e) 
			        {
			           	console.log( "displayList:error " );
			           	console.log(e);
			        }
			    });
			}

			$('#' + searchSpeed + '-search').find('.time-cost').jQuerySimpleCounter({start:0, end:time, duration: 800});
		},

		cancelSearch:function(uuid) {
			var _t = this;
			var data = {};
			
			$.ajax({
		        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchServiceDev/search/cancel/hadoop/" + uuid,
		        method:"get",
			    cache: false,
			    contentType: false,
			    processData: false, 
		        data:data,
		        success: function(data){
		           	console.log( "cancel done: ", data );			           	
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