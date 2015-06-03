define([
  'backbone',
  'collections/page_collection',
  'pages/attract_view',
  'pages/intro_view',
  'pages/photo_view',
  'pages/search_view',
  'pages/wrapup_view',
  'models/session_model'
], function (Backbone, PageCollection, AttractView, IntroView, PhotoView, SearchView, WrapupView, SessionModel){
  var Router   = Backbone.Router.extend({
    initialize:function(){
      var _t = this;

      _t.page_collection  = new PageCollection();
      _t.session_model    = new SessionModel();

      _t.session_model.set( "presenter_mode", true );

      _t.page_views = [
        new AttractView({ collection:_t.page_collection, session_model:_t.session_model }),
        new IntroView({ collection:_t.page_collection, session_model:_t.session_model }),
        new PhotoView({ collection:_t.page_collection, session_model:_t.session_model }),
        new SearchView({ collection:_t.page_collection, session_model:_t.session_model }),
        new WrapupView({ collection:_t.page_collection, session_model:_t.session_model })
      ];

      _t.register_container_el  = $( "div#register-container" );
      _t.email_message_el       = _t.register_container_el.find( "span.message" ).eq(0);
      _t.email_form_el          = _t.register_container_el.find( "form#register-form" ).eq(0);
      _t.email_input_el         = _t.register_container_el.find( "input.email" ).eq(0);

      _t.email_form_el.submit( function(e){
        e.preventDefault();

        var _email_val = _t.email_input_el.val();

        //validate form
        _t.email_input_el.removeClass("error");

        if( _email_val && _email_val != "" && validateemail(_email_val) ){
          _t.registeruser( _email_val );
        } else {
          _t.email_input_el.addClass("error");
        }
      });

      $(window).resize(function doresize(e){
        didresize = true;
      });

      _t.onchangepage("attract");
    },
    registeruser:function( _email ){
      var _t = this;

      _t.register_container_el.removeClass();
      _t.register_container_el.addClass("sending");

      var data = {
        "email" : _email
      };

      $.ajax({
          url: app.routes.register,
          method:"post",
          cache: false,
          contentType: 'application/json',
          processData: false, 
          data:JSON.stringify( data ),
          success:function( _response ){
            console.log( "register user success: ", _response );

            _t.register_container_el.removeClass();
            _t.register_container_el.addClass("success");
            _t.email_message_el.html("Thank you for registering!");
          },
          error: function( _e ) 
          {
            console.log( "register error: " );
            console.log( _e );

            _t.register_container_el.addClass("error");
            _t.email_message_el.html("Sorry, please try again later");
          }
      });

      //reset form
      if(_t.resetform_timeout) clearTimeout(_t.resetform_timeout);

      _t.resetform_timeout = setTimeout(function resetregisterform(){
        _t.register_container_el.removeClass();
        _t.email_message_el.html("Register for updates");
        _t.email_input_el.val("");
      }, 4000);
    },
    onchangepage:function(_pageid){
      !_pageid ? _pageid = "attract" : null;

      $("html,body").scrollTop(0);

      this.page_collection.activatePageById( _pageid );

      if( firstpage ) firstpage = false;
    }
  });

  return Router;
});