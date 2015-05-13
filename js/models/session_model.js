define([
  'backbone',
], function (Backbone) {
  var SessionModel = Backbone.Model.extend({
    selected_photo_url:null,
    selected_file_id: null,
    initialize:function(){
    	console.log("initialize session:");
    }
  });

  return SessionModel;
});