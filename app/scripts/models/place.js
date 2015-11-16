'use strict';

var Place = {
  city:'',
  extraInfo:[],
  fullName:'',
  height:'',
  itrf_coordinates:[],
  location:null,
  nad27_coordinates:[],
  sexagesimal_coordinates:[],
  state:'',
  town:'',
  zipCode:'',

  create:function(data){
    return $.extend({},this,data);
  },

  deserialize: function(data){
    var _self = Place.create({});

    Object.keys(_self).forEach(function(key){
      if(typeof _self[key] != 'function'){
        _self[key] = data.place[key];
      }
    });
    
    return _self;
  },

  list:function(params){
    return new RSVP.Promise(function(resolve,reject){
      $.ajax({
        url:params.url,
        type:'GET',
        data:params.data,
        datatype:'json',
        contentType:'application/json; charset=utf-8' 
      })
      .done(function(response){
        var model = {places:[]};

        response.forEach(function(item){
          var place = Place.deserialize({place:item});
          model.places.push(place);
        });
        
        resolve(model);
      }).
      fail(function(response){
        reject(response);
      });
    });
  }

};

module.exports = Place;
