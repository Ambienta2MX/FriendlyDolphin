'use strict';

var Weather = require('../models/weather');
var WeatherMapView = require('../views/weather_map_view');

module.exports = (function(){
  
  var selectors = {
    searchForm:'form[name=searchForm]',
    searchInput:'input[name=search]'
  };  

  var searchWeatherByName = function(event){
    event.preventDefault(); 
    Weather.get({url:'http://192.168.100.4/api/hardant/weather',data:$(this).serialize()}).then(success,failure);
  };

  var success = function(data){
    WeatherMapView.render(data);
  };
  
  var failure = function(data){
    console.log("Error : " + data);
  };

  var bindEvents = function(){
    $(selectors.searchForm).on('submit',searchWeatherByName); 
  };

  var start = function(){
    bindEvents();
    console.log("Home controller");    
  };

  return{
    start:start
  };

}());
