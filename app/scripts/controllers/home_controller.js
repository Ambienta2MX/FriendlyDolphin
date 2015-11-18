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
    Weather.get({url:'http://localhost/api/hardant/weather',data:$(this).serialize()}).then(success,failure);
  };

  var success = function(data){
    var placeInformation = getInformationFromPlace(data);    
    WeatherMapView.render(placeInformation);
    drawHeatMap(data);
  };
  
  var failure = function(data){
    console.log("Error : " + data);
  };

  var bindEvents = function(){
    $(selectors.searchForm).on('submit',searchWeatherByName); 
  };

  var drawHeatMap = function (data) {
    /*TODO refactor!*/
    var strictBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(19.600237, -99.403214), 
          new google.maps.LatLng(19.222031, -98.941788)),
        distritoFederal = new google.maps.LatLng(19.381836, -99.1372371),
        map = new google.maps.Map(document.getElementById('map'),{
          center: distritoFederal,
          zoom: 10,
          maxZoom: 13,
          minZoom: 8, 
          streetViewControl: false, 
          mapTypeId: google.maps.MapTypeId.HYBRID
        }),
        heatmapData = [],
        coordinates;
    for(var i=0; i < data.weathers.length; i++) {
      coordinates = data.weathers[i].location.coordinates;
      var googleMapsPoint = new google.maps.LatLng(coordinates[1], coordinates[0]);
      heatmapData.push(googleMapsPoint);
    }
    console.log(heatmapData);
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData
    });
    heatmap.setMap(map);
    heatmap.set('radius', 40);

    google.maps.event.addListener(map, 'zoom_changed', function() {
     if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
    });
  };

  var getInformationFromPlace = function (data) {
    var basicInformation = {},
        maxTemperature = "",
        minTemperature = "",
        averageTemperature = "";

    maxTemperature = "" + Math.max.apply(Math,data.weathers.map(function(element){return element.temperature;}));
    minTemperature = "" + Math.min.apply(Math,data.weathers.map(function(element){return element.temperature;}));
    averageTemperature = "" + data.weathers.map(function(obj) {return obj.temperature})
                  .reduce(function(a, b) { return a + b }) / data.weathers.length;

    basicInformation.place = data.weathers[0].fullName;
    basicInformation.maxTemperature = maxTemperature.substring(maxTemperature.indexOf(".") - 3,  maxTemperature.indexOf(".") + 3);
    basicInformation.minTemperature = minTemperature.substring(minTemperature.indexOf(".") - 3,  minTemperature.indexOf(".") + 3);
    basicInformation.averageTemperature = averageTemperature.substring(minTemperature.indexOf(".") - 3,  minTemperature.indexOf(".") + 3);

    return basicInformation;
  };

  var start = function(){
    bindEvents();
    console.log("Home controller");    
  };

  return{
    start:start
  };

}());
