'use strict';

var Pollution = {
  airQualityDescription:'',
  airQuality:'',
  ozone:'',
  sulphureDiode:'',
  nitrogenDiode:'',
  carbonMonoxide:'',
  uv:'',
  provider:[],

  create: function(data){
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
  },

  list:function(params){
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

module.exports = Pollution;
