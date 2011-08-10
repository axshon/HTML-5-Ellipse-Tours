$(document).ready(function() {
  var $canvas = $("#main");
  var context = $canvas[0].getContext("2d");
  
  var $image = $("<img src='img/smiley.png'>")
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
  for (var a = 0; a < 5; a++) {
    points.push({
      x: Math.random() * w, 
      y: Math.random() * h,
      vx: (Math.random() * maxVelocity * 2) - maxVelocity, 
      vy: (Math.random() * maxVelocity * 2) - maxVelocity
    });
  }
  
  var radians = 0; // 2 * Math.PI is a complete circle
  var text = "hello!";
  
  function frame() {
    // ___ clear
    context.fillStyle = "rgba(255, 255, 255, 0.2)"; // 20% opaque white 
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
    
    // ___ set up the next frame   
    setTimeout(frame, 30);
  }
  
  frame();
});