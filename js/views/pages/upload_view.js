define([
  'pages/page_view',
  'text!templates/pages/upload.html'
], function(PageView, Template){
	var UploadView = PageView.extend({
		template: _.template( Template ),
		id:"upload",
		onready:function(){
			var _t = this;

			_t._form = _t.$el.find("form").eq(0);

			_t._form.submit(function(e){
				e.preventDefault();

				var formData = new FormData($(this)[0]);

				console.log("submit form");

				$.ajax({
			        url: "https://sirius-2.hpl.hp.com:8443/ImageSearchService/library/uploadImageFromFile",
			        method:"post",
				    cache: false,
				    contentType: false,
				    processData: false, 
			        data:formData,
			        success: function(data){
			           	console.log( "Submitting Recipe Form: ", data );
			        },
			        error: function(e) 
			        {
			           	console.log( "Submit Form Error: " );
			           	console.log(e);
			        }
			    });

			    return false;
			});
		},
		onclose:function(){
		},
	});
	return UploadView;
});