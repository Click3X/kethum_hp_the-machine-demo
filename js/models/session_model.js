define([
  'backbone',
], function (Backbone) {
  var SessionModel = Backbone.Model.extend({
    selected_photo_url:null,
    initialize:function(){
    	console.log("initialize session:");
    }
  });

  return SessionModel;
});