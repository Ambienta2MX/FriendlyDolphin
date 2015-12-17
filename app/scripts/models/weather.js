'use strict';

var Weather = {
 weatherTime:'',
 description:'',
 precipIntensity:'',
 precipProbability:'',
 temperature:'',
 apparentTemperature:'',
 humidity:'',
 windSpeed:'',
 windBearing:'',  
 visibility:'',
 cloudCover:'',
 pressure:'',
 provider:[],
 fullName:'',
  
  create:function(data){
    return $.extend({},this,data);
  },

  deserialize: function(data){
    var _self = Weather.create({});

    Object.keys(_self).forEach(function(key){
      if(typeof _self[key] !== 'function'){
        _self[key] = data.weather[key];
      }
    });

    return _self;
  },

  get:function(params){
    return new RSVP.Promise(function(resolve,reject){
      $.ajax({
        url:params.url,
        type:'GET',
        data:params.data,
        datatype:'json',
        crossDomain:true,
        mozSystem: true
      })
      .done(function(response){
        resolve(response); 
      })
      .fail(function(response){
        reject(response); 
      });
    });
  }
};

module.exports = Weather;
