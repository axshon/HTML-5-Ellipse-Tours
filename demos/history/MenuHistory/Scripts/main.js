/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
function stateFromPath(path) {
  var base = "/Menu/";
  var parts = path.replace(base, "").split("/");
  return {
    meal: (parts.length >= 1 ? parts[0] : ""),
    dish: (parts.length >= 2 ? parts[1] : "")
  };
}

// ----------
function updateState(state) {
  if (!state)
    state = stateFromPath(location.pathname);
  
  // ___ menu
  var $selectedMenu = $(".menu[data-meal='" + state.meal + "']");
  $(".menu").not($selectedMenu).removeClass("active");
  $selectedMenu.addClass("active");
  
  var $selectedItem = $(".menu-item[data-dish='" + state.dish + "']");
  $(".menu-item").not($selectedItem).removeClass("selected");
  $selectedItem.addClass("selected");

  // ___ preview    
  var $dishContainer = $(".preview-dish");
  var $oldDish = $dishContainer.find("section");
  
  if (!state.dish) {
    $oldDish.fadeOut(function() {
      $oldDish.remove();
    });
    
    return;
  }
    
  var url = "/Preview/Index/" + state.dish;
  $.ajax({
    url: url, 
    dataType: "html", 
    success: function(data) {
      var $newDish = $(data);
  
      $newDish.find("img").load(function() {
        $newDish.fadeIn(function() {
          $newDish.css("z-index", 0);
        });
  
        $oldDish.fadeOut(function() {
          $oldDish.remove();
        });
      });
      
      $newDish
        .css("z-index", 1)
        .hide()
        .appendTo($dishContainer);
    }
  });
}

// ----------
$(document).ready(function () {
  if (!Modernizr.history)
    return;
    
  // ___ history event
  $(window).bind("popstate", function(event) {
    updateState(history.state);
  });
  
  // ___ clicks
  $(".menu-item").click(function(event) {
    event.preventDefault();
    event.stopPropagation();

    var $target = $(this);
    var url = $target.find("a").attr("href");
    var state = stateFromPath(url);

    history.pushState(state, "", url);
    updateState(state);
  });
});