module.exports = (function(){
  var settings = {
    renderDiv:'#detailedWeatherInformation'
  };
  
  var render = function(data){
    var html = FriendlyDolphin.templates.weatherDetailedInformation(data);
    $(settings.renderDiv).html(html);
  };
  
  return{
    render:render
  };

}());
