/// Copyright 2012, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
$(document).ready(function () {
  Main.init();
});

// ----------
window.Main = {
  $input: null, 
  
  // ----------
  init: function() {
    var self = this;
    
    if (!Modernizr.localstorage) {
      alert("This browser does not support local storage.");
      return;
    }

/*     navigator.onLine */

    this.$input = $("#input")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          var value = self.$input.val();
          if (value) {
            var html = "<div class='item box-round box-shadow'>"
              + value
              + "<button class='close'>x</button></div>";
              
            var $item = $(html)
              .prependTo("#items");
            
            $item.find(".close")
              .click(function() {
                $item.remove();
              });
            
            self.$input.val("");
          }
        }
      })
      .focus();
  }
};

