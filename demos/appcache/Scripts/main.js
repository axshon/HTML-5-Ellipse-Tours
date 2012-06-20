/// Copyright 2012, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.0.6-development-only.js" />

// ----------
$(document).ready(function () {
  Main.init();
});

// ----------
window.Main = {
  $log: null,
  shownStatus: "",
  statusCodes: [  
    "UNCACHED",
    "IDLE",
    "CHECKING",
    "DOWNLOADING",
    "UPDATEREADY",
    "OBSOLETE"
  ],
  eventNames: [
    "cached",
    "checking",
    "downloading",
    "error",
    "noupdate",
    "obsolete",
    "progress",
    "updateready"
  ],
  
  // ----------
  init: function() {
    var self = this;
    
    if (!Modernizr.applicationcache) {
      alert("This browser does not support the application cache.");
      return;
    }
    
    this.$log = $("#log");
    
    this.updateStatus();    
    
    $("#update")
      .click(function() {
        try {
          applicationCache.update();
        } catch(e) {
          self.log("error: " + e);
        }
      });

    $.each(this.eventNames, function(index, name) {
      applicationCache.addEventListener(name, function() {
        self.log("event: " + name);           
        self.updateStatus();
        
        if (name == "updateready") {
          applicationCache.swapCache();
          if (confirm("A new version of this site is available. Load it?")) 
            window.location.reload();
        }
      }, false);
    });
  }, 

  // ----------
  updateStatus: function() {
    var statusText = "UNKNOWN"; 
    $.each(this.statusCodes, function(index, code) {
      if (applicationCache.status === applicationCache[code])
        statusText = code;
    });
    
    if (statusText == this.shownStatus)
      return;
          
    this.log("status: " + statusText);
    this.shownStatus = statusText;
  },

  // ----------
  log: function(text) {
    $("<div>")
      .text(text)
      .appendTo(this.$log);
  }
};

