'use strict';

var WeatherController = require('./controllers/weather_controller');
var HomeController = require('./controllers/home_controller');
var PollutionController = require('./controllers/pollution_controller');

var Application = (function(){

  var initRouter = function(){
    var router = new Router({
      '/weather':{
        on:WeatherController.start
      },
      '/pollution':{
        on:PollutionController.start
      }
    }).configure({recurse:'backward'});

    router.init('/');
  };
  
  var start = function(){
    HomeController.start();
    initRouter(); 
  };

  return{
    start:start
  };

}());

jQuery(function(){
  Application.start();  
});
