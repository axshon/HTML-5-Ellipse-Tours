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
        var boxes = [];
        self.$boxes.each(function(index, boxElement) {
          var $box = $(boxElement);
          var position = $box.position();
          boxes.push({
            left: position.left, 
            top: position.top
          });
        });
        
        localStorage.boxes = JSON.stringify(boxes);
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
        
        x += 210;
      });
    }
    
    this.$boxes.show();
    
    setInterval(function() {
      if (parseInt(localStorage.modificationTime, 10) > self.modificationTime)
        self.loadState();
    }, 500);
  }, 
  
  // ----------
  loadState: function() {
    var data = localStorage.boxes; 
    if (!data) 
      return false;

    var boxes = JSON.parse(data);
    var a;
    for (a = 0; a < boxes.length; a++) {
      var box = boxes[a];
      this.$boxes.eq(a).css({
        left: box.left, 
        top: box.top
      }); 
    }
    
    this.modificationTime = parseInt(localStorage.modificationTime, 10);
    return true;
  }
};

