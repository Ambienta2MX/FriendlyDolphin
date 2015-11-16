var WeatherIndexView = require('../views/weather_index_view');

module.exports = (function(){
 
  var start = function(){
    WeatherIndexView.render();
  }; 

  return{
    start:start
  };

}());
