'use strict';

var Config = require('../conf/config');
var PollutionView = require('../views/pollution_view');
var MapsManagement = require('../conf/maps_management');
var Pollution = require('../models/pollution');
var PollutionInfoView = require('../views/pollution_info_view');

module.exports = (function(){
  
  var settings = {
    url:Config.smartOwlUrl.concat('/pollution'),
    initialLatitude:19.381836,
    initialLongitude:-99.1372371
  };

  var selectors = {
    searchForm:'form[name=byLatLng]',
    latitudeInput: "input[name=latitude]",
    longitudeInput: "input[name=longitude]",
    latitudeSelector: ".text-latitude",
    longitudeSelector: ".text-longitude"
  };

  var showPollutionInfoModal = function(){
    $.magnificPopup.open({
      removalDelay:500,
      items:{
        src:"#modal-panel" 
      }
    });
  };

  var bindEvents = function(){
    $(selectors.searchForm).on('submit',getPollutionByLatLong); 
  };
  
  var getPollutionByLatLong = function(event){
    event.preventDefault();
    Pollution.get({url:settings.url,data:$(this).serialize()}).then(success,failure);
  };

  var success = function(data){
    PollutionInfoView.render(data); 
    var lista = [];
    lista.push(data); 
    drawHeatMap(lista); 
    showPollutionInfoModal();
    showMarker();
  };
  
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

  
  var failure = function(data){
    console.log("Error");
    console.log(data);
  };

  var getPollutionByLatLng = function (event) {
    event.preventDefault();
    Pollution.get({url:WeatherConf.url, data: $(this).serialize()}).then(success, failure);
  };

  var start = function(){
    PollutionView.render(); 
    drawMap();
    bindEvents();
  };
  
  var drawMap = function (){
    window.globalMap = MapsManagement.createMap();

    $(selectors.latitudeSelector).text(settings.initialLatitude);
    $(selectors.longitudeSelector).text(settings.initialLongitude);
    $(selectors.latitudeInput).val(settings.initialLatitude);
    $(selectors.longitudeInput).val(settings.initialLongitude);

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

  return{
    start:start
  };

}());
