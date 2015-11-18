'use strict';

var PlaceListController = require('./controllers/place_list_controller');
var HomeController = require('./controllers/home_controller');

var Application = (function(){

  var initRouter = function(){
    var router = new Router({
      '/':{
        on:HomeController.start
      },
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
