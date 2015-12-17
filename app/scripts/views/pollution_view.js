module.exports = (function(){
  
  var settings = {
    renderDiv:'#applicationDiv'
  };
  
  var render = function(data){
    var html = FriendlyDolphin.templates.pollution();
    $(settings.renderDiv).html(html);
  };

  return{
    render:render
  };

}());
