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
  nextBoxIndex: 0, 
  offset: 0,
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
    
    this.$slider = $("#hue")
      .slider({
        min: 0, 
        max: 360, 
        slide: function(event, ui) {
          self.setHue(self.$selectedBox, ui.value);
        },
        change: function(event, ui) {
          self.setHue(self.$selectedBox, ui.value);
          self.saveBox(self.$selectedBox);
        }
      });
      
    $("#new")
      .button()
      .click(function() {
        var $box = self.createBox();
        self.saveBox($box);
      });

    $("#reset")
      .button()
      .click(function() {
        self.resetState();
      });

    $(window)
      .bind("storage", function() {
        self.loadState();
      });

    this.loadState();
  }, 
  
  // ----------
  loadState: function() {
    var ids = [];
    for (var a = 0; a < localStorage.length; a++) {
      var key = localStorage.key(a);
      if (key.indexOf("box-") !== 0)
        continue;
        
      var data = localStorage[key];
      var box = JSON.parse(data);
      var id = "#" + key;
      ids.push(id);
      
      var $box = $(id);
      if (!$box.length)
        $box = this.createBox(key);

      $box
        .css({
          left: box.left, 
          top: box.top
        }); 
        
      this.setHue($box, box.hue);
    }
    
    var found = ids.join(", ");
    $(".box").not(found).remove();
  },
  
  // ----------  
  resetState: function() {
    $(".box").remove();
    localStorage.clear();
  },
  
  // ----------
  createBox: function(key) {
    var self = this;
    
    if (key) {
      var parts = key.split("-");
      var index = parseInt(parts[1], 10);
      this.nextBoxIndex = Math.max(index, this.nextBoxIndex) + 1;
    } else {
      key = "box-" + this.nextBoxIndex;
      this.nextBoxIndex++;
      this.offset += 20;
    }
    
    var html = "<div class='box box-shadow box-round'>"
      + "Drag me<br>"
      + "or <button class='change-color'>change color</button><br>"
      + "or <button class='remove'>remove</button>"
      + "</div>";
    
    var $box = $(html)
      .attr("id", key)
      .css({
        left: this.offset, 
        top: this.offset
      })
      .draggable({
        stop: function(event, ui) {
          self.saveBox($box);
        }
      })
      .appendTo("body");
      
    this.setHue($box, this.offset);

    var $colorButton = $box.find(".change-color")
      .button()
      .click(function() {
        var $dialog = $("#dialog")
          .dialog({
            resizable: false
          });
          
        var buttonPosition = $colorButton.offset(); 
        $dialog.dialog("option", "position", [
          buttonPosition.left + (($colorButton.outerWidth() - $dialog.outerWidth()) / 2), 
          buttonPosition.top + ($colorButton.outerHeight() * 1.5)
        ]);
    
        self.$selectedBox = $box;
        self.$slider.slider("value", self.$selectedBox.data("hue")); 
      });
      
    $box.find(".remove")
      .button()
      .click(function() {
        $box.remove();
        localStorage.removeItem(key);
      });
      
    return $box;
  },
  
  // ----------
  saveBox: function($box) {
    var position = $box.position();
    localStorage[$box.attr("id")] = JSON.stringify({
      left: position.left, 
      top: position.top,
      hue: $box.data("hue")
    });
  }, 

  // ----------
  setHue: function($box, hue) {
    $box.data("hue", hue);
    $box.css({
      "background-color": "hsl(" + hue + ", 100%, 75%)"
    });
  }
};

