/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
function updateState(state) {
  var $dish = $(".preview-dish");
  
  if (!state || !state.dish) {
    $dish.empty();
    return;
  }
    
  var url = "/Preview/Index/" + state.dish;
  $dish.load(url, function() {
  });
  
  $(".menu").each(function(index, menu) {
    var $menu = $(menu);
    if ($menu.data("meal") == state.meal)
      $menu.addClass("active");
    else
      $menu.removeClass("active");
  });

  $(".menu-item").each(function(index, item) {
    var $item = $(item);
    if ($item.data("dish") == state.dish)
      $item.addClass("selected");
    else
      $item.removeClass("selected");
  });
}

// ----------
$(document).ready(function () {
  $(window).bind("popstate", function(event) {
    updateState(history.state);
  });
  
  $(".menu-item").click(function(event) {
    event.preventDefault();
    event.stopPropagation();

    var $target = $(this);
    var url = $target.find("a").attr("href");
    var state = {
      dish: $target.data("dish"),
      meal: $target.parents(".menu").data("meal")
    };

    history.pushState(state, "", url);
    updateState(state);
  });
});