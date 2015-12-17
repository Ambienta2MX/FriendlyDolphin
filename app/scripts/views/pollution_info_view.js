module.exports = (function(){
  var settings = { 
    renderDiv:'#detailedPollutionInformation'
  };

  var render = function(data){
    var html = FriendlyDolphin.templates.pollutionDetailedInformation(data);
    console.log(html);
    $(settings.renderDiv).html(html);
  };

  return{
    render:render
  };

}());
