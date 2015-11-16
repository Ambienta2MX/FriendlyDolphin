'use strict';

var PlaceListController = require('./controllers/place_list_controller');

var Application = (function(){

  var initRouter = function(){
    var router = new Router({
      '/places':{
        on:PlaceListController.start
      }
    }).configure({recurse:'backward'});

    router.init('/');
  };
  
  var start = function(){
    initRouter();  
  };

  return{
    start:start
  };

}());

jQuery(function(){
  Application.start();  
});
