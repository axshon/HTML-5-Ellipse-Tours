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

    $("#drop1")
      .bind("dragover", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).css({background: "blue"});
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
        
        var files = data.files;
        $.each(files, function(index, file) {
          if (!file.type.match('image.*')) 
            return;
    
          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            $("#drop1").append("<img src='" + loadEvent.target.result + "'>");

/*
  var $image = $("<img>")
    .load(function() {
      $imageCanvas = $("<canvas>")
        .width($image.width())
        .height($image.height());
        
      imageContext = $imageCanvas[0].getContext("2d");
      imageContext.drawImage($image[0], 0, 0);
      try {
        var imageData = imageContext.getImageData(0, 0, $imageCanvas.width(), $imageCanvas.height());
        for (var a = 0; a < imageData.data.length; a++) {
          if (a % 4 != 3) // operate on R, G, B, but not A
            imageData.data[a] = 255 - imageData.data[a]; // invert
        }
  
        imageContext.putImageData(imageData, 0, 0);        
      } catch(e) {
        $("<div class='error'>Note: Direct manipulation of pixels loaded from image files isn't allowed when running locally</div>")
          .appendTo("body");
      }
    })
    .attr("src", "img/smiley.png") // kick off the loading after we've attached the event handler
    .hide()
    .appendTo("body"); // we can't get the image's width and height without attaching to the DOM
*/

          };

          reader.readAsDataURL(file);
        });
      });
    
    $("#drag1")
      .bind("dragstart", function(event) {
        $(this).css({opacity:0.5});
      });
  }
};

