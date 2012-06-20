/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.21/jquery-ui.min.js" />
/// <reference path="Scripts/jquery.ui.touch-punch.min.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.0.6-development-only.js" />

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
    
    $("#new")
      .button()
      .click(function() {
        var $box = self.createBox();
        self.saveBox($box);
      });

    $("#clear")
      .button()
      .click(function() {
        self.clearAll();
      });

    $(window)
      .bind("storage", function() {
        setTimeout(function() { // this slight delay is necessary on IE
          self.loadAll();
        }, 1);
      });

    this.initDialog();
    this.loadAll();
  }, 
  
  // ----------
  initDialog: function() {
    var self = this;
    
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
  },
  
  // ----------
  loadAll: function() {
    var ids = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
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
  clearAll: function() {
    $(".box").remove();
    localStorage.clear();
  },
  
  // ----------
  createBox: function(key) {
    var self = this;
    
    var index;
    if (key) {
      var parts = key.split("-");
      index = parseInt(parts[1], 10);
      this.nextBoxIndex = Math.max(index, this.nextBoxIndex) + 1;
    } else {
      index = this.nextBoxIndex;
      key = "box-" + index;
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
        top: this.offset, 
        "z-index": index
      })
      .appendTo("body")
      .draggable({
        stop: function(event, ui) {
          self.saveBox($box);
        }
      });
      
    this.setHue($box, this.offset);

    $box.find(".change-color")
      .button()
      .click(function() {
        self.startDialogFor($box);
      });
      
    $box.find(".remove")
      .button()
      .click(function() {
        self.removeBox($box);
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
  removeBox: function($box) {
    $box.remove();
    localStorage.removeItem($box.attr("id"));
  },

  // ----------
  startDialogFor: function($box) {
    var $dialog = $("#dialog")
      .dialog({
        resizable: false
      });
      
    var $colorButton = $box.find(".change-color")
    var buttonPosition = $colorButton.offset(); 
    $dialog.dialog("option", "position", [
      buttonPosition.left + (($colorButton.outerWidth() - $dialog.outerWidth()) / 2), 
      buttonPosition.top + ($colorButton.outerHeight() * 1.5)
    ]);

    this.$selectedBox = $box;
    this.$slider.slider("value", this.$selectedBox.data("hue")); 
  },
  
  // ----------
  setHue: function($box, hue) {
    $box.data("hue", hue);
    $box.css({
      "background-color": "hsl(" + hue + ", 100%, 75%)"
    });
  }
};
