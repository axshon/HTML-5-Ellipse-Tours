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
  name: "", 
  
  // ----------
  init: function () {
    var self = this;
    
    this.$output = $("#log");
    this.$users = $("#users");
    
    if (!Modernizr.websockets) {
      alert("This browser does not support web sockets");
      return;
    }
    
    this.$entry = $("#entry")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          var message = self.$entry.val();
          self.$entry.val(""); 
          self.$output.append("<p>" + self.name + ": " + message + "</p>");
        }
      });
    
    this.$name = $("#name")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          self.name = self.$name.val();
          self.$users.append("<p>" + self.name + "</p>");
          $("#login").hide();
          $("#chat").show();
          self.$entry.focus();
        }
      })
      .focus();
  },
  
  // ----------
  message: function() {
  }
};

