/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
$(document).ready(function () {
  dragWorkers.init();
});

// ----------
window.dragWorkers = {
  // ----------
  init: function () {
    var self = this;
    
    if (!Modernizr.draganddrop) {
      alert("This browser does not support drag & drop");
      return;
    }
    
    var types = [
      "cycle", 
      "blur", 
      "edges", 
      "blur"
    ];
    
    var a;
    for (a = 0; a < 4; a++) {
      new Unit($("#unit" + (a + 1)), types[a]);
    }
  }
};

// ----------
window.Unit = function($container, type) {
  if (!(this instanceof arguments.callee))
   throw new Error("Don't forget to use 'new'!");
   
  var self = this;
  this.$container = $container;
  this.$canvas = $container.find("canvas");
  this.context = this.$canvas[0].getContext("2d");
 
  // ___ worker
  this.worker = new Worker('Scripts/worker.js');  
  this.worker.onmessage = function(event) {  
    self.context.putImageData(event.data, 0, 0); 
    setTimeout(function() {       
      self.worker.postMessage({
        method: "nextFrame"
      });
    }, 10);
  };
  
  this.worker.postMessage({
    method: "setType", 
    type: type
  });
  
  // ___ as a draggable object
  this.$container
    .bind("dragstart", function(event) {
      var url = self.$canvas[0].toDataURL();
      event.originalEvent.dataTransfer.setData("text/uri-list", url);    
/*       event.originalEvent.dataTransfer.dropEffect = 'move';   */
    });
    
  // ___ as a drop target
  this.$container
    .bind("dragenter", function(event) {
      $(this).css({background: "blue"});
    })
    .bind("dragover", function(event) {
      event.preventDefault();
      event.stopPropagation();
    })
    .bind("dragleave", function(event) {
      $(this).css({background: "white"});
    })
    .bind("drop", function(event) {
      $(this).css({background: "white"});
  
      var data = event.originalEvent.dataTransfer;
      if (!data)
        return;
        
      event.preventDefault();
      event.stopPropagation();
      
      function doImage(url) {
          var $image = $("<img>")
            .load(function() {
              var img = $image[0];
              var w = img.naturalWidth || img.width || img.clientWidth || img.scrollWidth;
              var h = img.naturalHeight || img.height || img.clientHeight || img.scrollHeight;
              w *= 0.5;
              h *= 0.5;
              self.$canvas
                .attr("width", w)
                .attr("height", h)
                .width(w)
                .height(h);
                
              self.context.drawImage($image[0], 0, 0, w, h);
              var imageData = self.context.getImageData(0, 0, w, h);
              self.worker.postMessage({
                method: "setImageData",
                imageData: imageData
              });
            })
            .attr("src", url);
      }
            
      var urlList = data.getData("text/uri-list");
      if (urlList) {
        doImage(urlList);
      } else if ("FileReader" in window) {
        var files = data.files;
        $.each(files, function(index, file) {
          if (!file.type.match('image.*')) 
            return;
    
          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            doImage(loadEvent.target.result);
          };
    
          reader.readAsDataURL(file);
        });
      }
    });
};
