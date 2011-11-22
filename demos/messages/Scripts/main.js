/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
$(document).ready(function () {
  Main.init();
});

// ----------
window.Main = {
  // ----------
  init: function () {
    var self = this;
    
    this.$output = $("#output");
    
    if (!Modernizr.postmessage) {
      alert("This browser does not support web messaging");
      return;
    }
    
    if (!Modernizr.websockets) {
      alert("This browser does not support web sockets");
      return;
    }
    
    $("#spawn").click(function() {
      self.childWindow = window.open(location.href);
    });
    
    this.$entry = $("#entry").keypress(function(event) {
      if (event.which == 13) { // return key
        var message = self.$entry.val();
        self.$entry.val(""); 
        self.$output.append("<p>" + message + "</p>");
        if (self.childWindow)
          self.childWindow.postMessage(message, location.href); 
      }
    });
    
    $(window).bind("message", function(event) {
      if (event.originalEvent.origin != location.protocol + "//" + location.hostname)
        return;

      self.$output.append("<p>" + event.originalEvent.data + "</p>");
    });
  }
};

