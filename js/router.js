define([
  'backbone',
  'collections/page_collection',
  'pages/attract_view',
  'pages/intro_view',
  'pages/photo_view',
  'pages/search_view',
  'pages/wrapup_view',
  'pages/thankyou_view',
  'pages/upload_view',
  'modules/navigation/views/navigation_view',
  'models/session_model'
], function (Backbone, PageCollection, AttractView, IntroView, PhotoView, SearchView, WrapupView, ThankyouView, UploadView, NavigationView, SessionModel){
  var Router   = Backbone.Router.extend({
    initialize:function(){
      var _t = this;

      _t.page_collection  = new PageCollection();
      _t.session_model    = new SessionModel();

      _t.page_views = [   
        new AttractView({ collection:_t.page_collection, session_model:_t.session_model }),
        new IntroView({ collection:_t.page_collection, session_model:_t.session_model }),
        new PhotoView({ collection:_t.page_collection, session_model:_t.session_model }),
        new SearchView({ collection:_t.page_collection, session_model:_t.session_model }),
        new WrapupView({ collection:_t.page_collection, session_model:_t.session_model }),
        new ThankyouView({ collection:_t.page_collection, session_model:_t.session_model }),
        new UploadView({ collection:_t.page_collection, session_model:_t.session_model })
      ];

      /** ===== BUILD MAIN NAVIGATIONS ===== **/
      _t.navigations = [];
      $(".main-navigation.cfm-navigation").each(function(i, _el){
        var navigation = new NavigationView({
          id: _el.getAttribute("id"), 
          el:_el, page_collection:_t.page_collection
        });

        _t.navigations.push( navigation );
      });

      $(window).resize(function doresize(e){
        didresize = true;
      });

      this.start();
    },
    start:function(){

      Backbone.history.start( { pushState: pushstate, hashChange:true, silent:false, root:root_dir } );
    },
    routes: {
      ':pageid'   : 'onchangepage',
      '*actions'  : 'onchangepage'
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