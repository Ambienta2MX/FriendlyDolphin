'use strict';

var Weather = require('../models/weather');
var WeatherMapView = require('../views/weather_map_view');
var MapsConf = require('../conf/maps_coordinates');
var Config =  require('../conf/config');

module.exports = (function(){
  
  var selectors = {
    searchForm:'form[name=searchForm]',
    searchInput:'input[name=search]',
    body:'body',
    leftToggleButton:'#toggle_sidemenu_l',
    leftMenu:'.sidebar-menu li a.accordion-toggle'
  };
  
  var options = {
    sbl: "sb-l-o",
    sbr: "sb-r-c",
    collapse: "sb-l-m"
  };

  var searchWeatherByName = function(event){
    event.preventDefault(); 
    Weather.get({url:Config.hardAntUrl.concat('/weather'),
                 data:$(this).serialize()}).then(success,failure);
  };

  var success = function(data){
    var placeInformation = getInformationFromPlace(data);    
    WeatherMapView.render(placeInformation);
    drawHeatMap(data);
    getTemperatureChart(data);
  };
  
  var failure = function(data){
    console.error("Error");
    console.error(data);
  };
  
  var sidebarLeftToggle = function(){
    if ($('body.sb-top').length) { return; }

    if ($(selectors.body).hasClass('sb-l-c') && options.collapse === "sb-l-m") {
      $(selectors.body).removeClass('sb-l-c');
    }
    
    $(selectors.body).toggleClass(options.collapse).removeClass(options.sbl).addClass(options.sbr);
  };
  
  var leftMenuToggle = function(event){
    event.preventDefault(); 
    if ($(selectors.body).hasClass('sb-l-m') && !$(this).parents('ul.sub-nav').length) { return; }

    if (!$(this).parents('ul.sub-nav').length) {

      if ($(window).width() > 900) {
        if ($('body.sb-top').length) { return; }
      }

      $('a.accordion-toggle.menu-open').next('ul').slideUp('fast', 'swing', function() {
        $(this).attr('style', '').prev().removeClass('menu-open');
      });
    }
    else {
      var activeMenu = $(this).next('ul.sub-nav');
      var siblingMenu = $(this).parent().siblings('li').children('a.accordion-toggle.menu-open').next('ul.sub-nav')

      activeMenu.slideUp('fast', 'swing', function() {
        $(this).attr('style', '').prev().removeClass('menu-open');
      });

      siblingMenu.slideUp('fast', 'swing', function() {
        $(this).attr('style', '').prev().removeClass('menu-open');
      });
    }

    if (!$(this).hasClass('menu-open')) {
      $(this).next('ul').slideToggle('fast', 'swing', function() {
        $(this).attr('style', '').prev().toggleClass('menu-open');
      });
    }

  };

  var bindEvents = function(){
    //$(selectors.searchForm).on('submit',searchWeatherByName); 
    $(selectors.leftToggleButton).on('click',sidebarLeftToggle);
    $(selectors.leftMenu).on('click',leftMenuToggle);
  };

  var drawHeatMap = function (data) {
    /*TODO refactor!*/
    var strictBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(19.600237, -99.403214), 
          new google.maps.LatLng(19.222031, -98.941788)),
        distritoFederal = new google.maps.LatLng(19.381836, -99.1372371),
        map = new google.maps.Map(document.getElementById('map'),{
          zoom: 10,
          center: {lat: 19.45, lng: -99},
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

    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData
    });

    heatmap.setMap(map);

    var flightPlanCoordinates_DF = MapsConf.DF_Coordinates;

    var flightPath2 = new google.maps.Polyline({
      path: flightPlanCoordinates_DF,
      geodesic: true,
      strokeColor: '#E0FFFF',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath2.setMap(map);
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
    bindEvents();    
  };

  return{
    start:start
  };

}());
