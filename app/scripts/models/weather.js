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
 location:null,
 fullName:'',
  
  create:function(data){
    return $.extend({},this,data);
  },

  deserialize: function(data){
    var _self = Weather.create({});

    Object.keys(_self).forEach(function(key){
      if(typeof _self[key] != 'function'){
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
        contentType:'application/json; charset=utf-8',
        crossDomain:true,
        mozSystem: true
      })
      .done(function(response){
        var model = {weathers:[]};
        response.forEach(function(item){
          var weather = Weather.deserialize({weather:item}); 
          model.weathers.push(weather);
        });
        resolve(model); 
      })
      .fail(function(response){
        reject(response); 
      });
    });
  }
};

module.exports = Weather;
