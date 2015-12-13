module.exports = (function(){
 var settings = {
   renderDiv: '#applicationDiv',
   detailedInformationDiv: '#detailedWeatherInformation'
 };

 var render = function(data){
   var html = "";
   if(data) {
      html = FriendlyDolphin.templates.weatherDetailedInformation(data);
      $(settings.detailedInformationDiv).html(html); 
   } 
   else {
      html = FriendlyDolphin.templates.weather();
      $(settings.renderDiv).html(html); 
   }
 };

 return{
   render:render
 };

}());
