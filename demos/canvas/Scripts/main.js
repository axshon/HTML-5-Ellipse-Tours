/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.0.6-development-only.js" />

// ----------
$(document).ready(function() {
  if (!Modernizr.canvas) {
    alert("This browser does not support the canvas tag.");
    return;
  }

  var $canvas = $("#main");
  var context = $canvas[0].getContext("2d");
  var $imageCanvas = null;
  var imageContext = null;
  
  var $image = $("<img>")
    .load(function() {
      $imageCanvas = $("<canvas>")
        .width($image.width())
        .height($image.height());
        
      imageContext = $imageCanvas[0].getContext("2d");
      imageContext.drawImage($image[0], 0, 0);
      try {
        var imageData = imageContext.getImageData(0, 0, $imageCanvas.width(), $imageCanvas.height());
        for (var i = 0; i < imageData.data.length; i++) {
          if (i % 4 != 3) // operate on R, G, B, but not A
            imageData.data[i] = 255 - imageData.data[i]; // invert
        }
  
        imageContext.putImageData(imageData, 0, 0);        
      } catch(e) {
        $("<div class='error'>Note: Direct manipulation of pixels loaded from image files isn't allowed when running locally</div>")
          .appendTo("body");
      }
    })
    .attr("src", "Images/smiley.png") // kick off the loading after we've attached the event handler
    .hide()
    .appendTo("body"); // we can't get the image's width and height without attaching to the DOM
  
  var w; 
  var h;
  function resize() {  
    w = $canvas.width();
    h = $canvas.height();
    $canvas.attr("width", w);
    $canvas.attr("height", h);
    
    // resetting the width and height also resets these other properties, so we set them again
    context.lineWidth = 6;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.font = "100px sans-serif";  
    context.textAlign = "center";
    context.textBaseline = "middle";
  }
  
  $(window).resize(resize);
  resize();
  
  var maxVelocity = 10;
  var points = []; 
  for (var i = 0; i < 7; i++) {
    points.push({
      x: Math.random() * w, 
      y: Math.random() * h,
      vx: (Math.random() * maxVelocity * 2) - maxVelocity, 
      vy: (Math.random() * maxVelocity * 2) - maxVelocity
    });
  }
  
  var radians = 0; // 2 * Math.PI is a complete circle
  var text = "hello!";
  var spotlightRadius = Math.min(w, h) / 2;
  
  function frame() {
    context.save();
  
    // ___ clear
    context.fillStyle = "rgba(0, 0, 0, 1)"; // 100% opaque black 
    context.fillRect(0, 0, w, h);
    
    // ___ spotlight
   	context.beginPath();
   	context.arc(points[5].x, points[5].y, spotlightRadius, 0, 360, false);
    context.clip();
    
    context.fillStyle = "rgba(56, 56, 56, 1)"; // 100% opaque dark gray 
    context.fillRect(0, 0, w, h);
  
    // ___ lines
    context.strokeStyle = "#0f0";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (a = 1; a < 3; a++) 
      context.lineTo(points[a].x, points[a].y);
      
    context.stroke();
    
    // ___ image
    context.save();
    context.translate(points[3].x, points[3].y);
    context.rotate(radians);
    context.drawImage($image[0], -($image.width()) / 2, -($image.height()) / 2);
    context.restore();
    
    // ___ imageCanvas
    if ($imageCanvas) {
      context.drawImage($imageCanvas[0], 
          points[6].x - ($imageCanvas.width() / 2), 
          points[6].y - ($imageCanvas.height() / 2));
    }
    
    // ___ text
    context.fillStyle = "#00a";
    context.fillText(text, points[4].x, points[4].y); 
    
    // ___ update positions and handle bounce
    for (a = 0; a < points.length; a++) {
      var p = points[a];

      p.x += p.vx;
      if (p.x < 0) { 
        p.x = 0;
        p.vx *= -1;
      } else if (p.x > w) {
        p.x = w;
        p.vx *= -1;
      }
        
      p.y += p.vy;
      if (p.y < 0) { 
        p.y = 0;
        p.vy *= -1;
      } else if (p.y > h) {
        p.y = h;
        p.vy *= -1;
      }
    }
    
    radians += 0.01;
    
    context.restore();

    // ___ set up the next frame   
    setTimeout(frame, 30);
  }
  
  frame();
});