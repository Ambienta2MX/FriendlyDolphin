module.exports = (function(){

  var render = function(){
    var html = FriendlyDolphin.templates.weatherIndex();
    $("#applicationDiv").html(html);
  };
  
  return{
    render:render
  };

}());
