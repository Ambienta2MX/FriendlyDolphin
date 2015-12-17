'use strict';

var Weather = require('../models/weather');
var WeatherView = require('../views/weather_view');
var WeatherInfoView = require('../views/weather_info_view');
var MapsManagement = require('../conf/maps_management');
var Config = require('../conf/config');

module.exports = (function(){
  
  var WeatherConf = {
    url:Config.smartOwlUrl.concat('/weather'),
    initialLatitude:19.381836,
    initialLongitude:-99.1372371
  }

  var selectors = {
    searchForm:'form[name=byLatLng]',
    latitudeInput: "input[name=latitude]",
    longitudeInput: "input[name=longitude]",
    latitudeSelector: ".text-latitude",
    longitudeSelector: ".text-longitude"
  };  

  var showWeatherInfoModal = function(){
    $.magnificPopup.open({
      removalDelay:500,
      items:{
        src:"#modal-panel" 
      }
    });
  };

  var searchWeatherByName = function(event){
    event.preventDefault(); 
    //Weather.get({url: WeatherConf.url ,data:$(this).serialize()}).then(success,failure);
  };

  var getWeatherByLatLng = function (event) {
    event.preventDefault();
    Weather.get({url:WeatherConf.url, data: $(this).serialize()}).then(success, failure);
  };

  var success = function(data){
    WeatherInfoView.render(data);
    var lista = [];
    lista.push(data); 
    console.log(data);
    drawHeatMap(lista);
    showWeatherInfoModal();
    showMarker();    
  };
  
  var failure = function(data){
    console.error("Error");
    console.error(data);
  };

  var bindEvents = function(){
    $(selectors.searchForm).on('submit',getWeatherByLatLng); 
  };

  var drawMap = function (){
    window.globalMap = MapsManagement.createMap();

    $(selectors.latitudeSelector).text(WeatherConf.initialLatitude);
    $(selectors.longitudeSelector).text(WeatherConf.initialLongitude);
    $(selectors.latitudeInput).val(WeatherConf.initialLatitude);
    $(selectors.longitudeInput).val(WeatherConf.initialLongitude);

    showMarker();
  };

  var showMarker = function(){
    var currentMarker = new google.maps.Marker({
      position: {lat: 19.381836, lng: -99.1372371},
      map: window.globalMap,
      title: 'Latitud/Longitud',
      draggable: true
    });
    
    google.maps.event.addListener(currentMarker, 'dragend', function(evt){
      $(selectors.latitudeSelector).text(evt.latLng.lat().toFixed(6));
      $(selectors.longitudeSelector).text(evt.latLng.lng().toFixed(6));
      $(selectors.latitudeInput).val(evt.latLng.lat().toFixed(6));
      $(selectors.longitudeInput).val(evt.latLng.lng().toFixed(6));
    });
  }

  var drawHeatMap = function (data) {
    window.globalMap = MapsManagement.createMap();
    var heatmapData = [],
        coordinates;
    for(var i=0; i < data.length; i++) {
      coordinates = data[i].location.coordinates;
      var googleMapsPoint = new google.maps.LatLng(coordinates[1], coordinates[0]);
      heatmapData.push(googleMapsPoint);
    }
    if(window.heatMap) {
      window.heatMap.setMap(null); 
    } else {
      window.heatMap = MapsManagement.createMapHeatMap(heatmapData);
    }
    window.heatMap.setMap(window.globalMap);
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
    basicInformation.maxTemperature = maxTemperature.substring(maxTemperature.indexOf(".") - 3, maxTemperature.indexOf(".") + 3);
    basicInformation.minTemperature = minTemperature.substring(minTemperature.indexOf(".") - 3, minTemperature.indexOf(".") + 3);
    basicInformation.averageTemperature = averageTemperature.substring(minTemperature.indexOf(".") - 3, minTemperature.indexOf(".") + 3);
    
    return basicInformation;
  };

  var getTemperatureChart = function(data) {
    var ctx = document.getElementById("weatherChart").getContext("2d");
    var chartOptions = {
      scaleBeginAtZero : true,
      scaleShowGridLines : false,
      scaleGridLineColor : "rgba(0,0,0,.05)",
      scaleGridLineWidth : 1,
      scaleShowHorizontalLines: false,
      scaleShowVerticalLines: false,
      barShowStroke : true,
      animation: false,
    }

    var temperatureData = {
      labels: [],
      datasets: []
    };

    var dataSetContent = {
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: []
    };

    for(var i=0; i < data.weathers.length; i++) {
      temperatureData.labels.push("");
      dataSetContent.data.push(data.weathers[i].temperature);
    }

    temperatureData.datasets.push(dataSetContent);

    var myBarChart = new Chart(ctx).Bar(temperatureData, chartOptions);

  }

  var start = function(){
    WeatherView.render(false);
    drawMap();
    bindEvents();
  };

  return{
    start:start
  };

}());
