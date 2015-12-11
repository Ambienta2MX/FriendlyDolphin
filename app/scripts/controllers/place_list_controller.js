'use strict';

var Place = require('../models/place');
var PlaceListView = require('../views/place_list_view');

module.exports = (function(){

  var selectors = {
    
  }

  var list = function(params){
    Place.list({url:'https://demo7697406.mockable.io/api/fasteagle/places'}).then(success,failure); 
  };
  
  var success = function(data){
    PlaceListView.render(data); 
  };

  var failure = function(data){
    console.log("Error: " + data);
  };

  var start = function(){
    list(); 
  }; 
  
  return{
    start:start
  };

}());
