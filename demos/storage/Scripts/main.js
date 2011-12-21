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
  $boxes: null, 
  modificationTime: 0,
  
  // ----------
  init: function() {
    var self = this;
    
    if (!Modernizr.localstorage) {
      alert("This browser does not support local storage.");
      return;
    }
    
    if (!window.JSON) {
      alert("This browser does not support JSON.");
      return;
    }
    
    this.$boxes = $(".box").draggable({
      stop: function(event, ui) {
        var worldState = {
          boxes: []
        };
        
        self.$boxes.each(function(index, box) {
          var $box = $(box);
          var position = $box.position();
          worldState.boxes.push({
            left: position.left, 
            top: position.top
          });
        });
        
        localStorage.worldState = JSON.stringify(worldState);
        localStorage.modificationTime = self.modificationTime = $.now();
      }
    });
    
    if (!this.loadState()) {
      var x = 10;
      this.$boxes.each(function(index, box) {
        $(box).css({
          left: x, 
          top: 10
        });
        
        x += 250;
      });
    }
    
    this.$boxes.show();
    
    setInterval(function() {
      var storedTime = parseInt(localStorage.modificationTime, 10);
      if (storedTime > self.modificationTime)
        self.loadState();
    }, 500);
  }, 
  
  // ----------
  loadState: function() {
    var data = localStorage.worldState; 
    if (!data) 
      return false;

    var worldState = JSON.parse(data);
    var a;
    for (a = 0; a < worldState.boxes.length; a++) {
      this.$boxes.eq(a).css({
        left: worldState.boxes[a].left, 
        top: worldState.boxes[a].top
      }); 
    }
    
    this.modificationTime = parseInt(localStorage.modificationTime, 10);
    return true;
  }
};

