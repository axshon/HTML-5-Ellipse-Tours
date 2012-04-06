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
  $slider: null,
  $selectedBox: null, 
  
  // ----------
  init: function() {
    var self = this;
    
    if (!Modernizr.localstorage) {
      alert("This browser does not support local storage.");
      return;
    }
    
    if (!Modernizr.hsla) {
      alert("This browser does not support hsl.");
      return;
    }
    
    if (!window.JSON) {
      alert("This browser does not support JSON.");
      return;
    }
    
    this.$boxes = $(".box").draggable({
      stop: function(event, ui) {
        self.saveState();
      }
    });
    
    this.$boxes.each(function(index, boxElement) {
      var $box = $(boxElement);
      var $button = $box.find("button")
        .button()
        .click(function() {
          var $dialog = $("#dialog")
            .dialog({
              resizable: false
            });
            
          var buttonPosition = $button.offset(); 
          $dialog.dialog("option", "position", [
            buttonPosition.left + (($button.outerWidth() - $dialog.outerWidth()) / 2), 
            buttonPosition.top + ($button.outerHeight() * 1.5)
          ]);
      
          self.$selectedBox = $box;
          self.$slider.slider("value", self.$selectedBox.data("hue")); 
        });
    });
    
    this.$slider = $("#hue")
      .slider({
        min: 0, 
        max: 360, 
        slide: function(event, ui) {
          self.setHue(self.$selectedBox, ui.value);
        },
        change: function(event, ui) {
          self.setHue(self.$selectedBox, ui.value);
          self.saveState();
        }
      });
      
    $("#reset")
      .button()
      .click(function() {
        self.resetState();
        self.saveState();
      });

    if (!this.loadState())
      this.resetState();
    
    this.$boxes.show();
    
    $(window)
      .bind("storage", function() {
        self.loadState();
      });
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
      var $box = this.$boxes.eq(a)
        .css({
          left: box.left, 
          top: box.top
        }); 
        
      this.setHue($box, box.hue);
    }
    
    return true;
  },
  
  // ----------
  saveState: function() {
    var boxes = [];
    this.$boxes.each(function(index, boxElement) {
      var $box = $(boxElement);
      var position = $box.position();
      boxes.push({
        left: position.left, 
        top: position.top,
        hue: $box.data("hue")
      });
    });
    
    localStorage.boxes = JSON.stringify(boxes);
  }, 

  // ----------  
  resetState: function() {
    var self = this;
    
    var x = 10;
    var hue = 0;
    this.$boxes.each(function(index, box) {
      var $box = $(box)
        .css({
          left: x, 
          top: 10
        });
      
      self.setHue($box, hue);
      
      x += 210;
      hue += 120;
    });
  },
  
  // ----------
  setHue: function($element, hue) {
    $element.data("hue", hue);
    $element.css({
      "background-color": "hsl(" + hue + ", 100%, 75%)"
    });
  }
};

