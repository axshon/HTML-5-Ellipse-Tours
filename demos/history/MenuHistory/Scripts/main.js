/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
function updateState(state) {
  console.dir(state);
}

// ----------
$(document).ready(function () {
  $(window).bind("popstate", function(event) {
    console.log("pop");
    updateState(history.state);
  });
  
  $(".menu-item").click(function(event) {
    var $target = $(this);
    var url = $target.find("a").attr("href");
    var state = {
      dish: url
    };
    history.pushState(state, "", url);
    console.log("click");
    updateState(state);
    
    event.preventDefault();
    event.stopPropagation();
  });
});