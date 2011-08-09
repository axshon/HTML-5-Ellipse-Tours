$(document).ready(function() {
  var $canvas = $("#main");
  var context = $canvas[0].getContext("2d");
  
  var w; 
  var h;
  function resize() {  
    w = $canvas.width();
    h = $canvas.height();
    $canvas.attr("width", w);
    $canvas.attr("height", h);
    context.fillStyle = "rgba(255, 255, 255, 0.1)";
    context.lineWidth = 6;
    context.lineCap = "round";
    context.lineJoin = "round";
  }
  
  $(window).resize(resize);
  resize();
  
  var maxVelocity = 10;
  var points = []; 
  for (var a = 0; a < 3; a++) {
    points.push({
      x: Math.random() * w, 
      y: Math.random() * h,
      vx: (Math.random() * maxVelocity * 2) - maxVelocity, 
      vy: (Math.random() * maxVelocity * 2) - maxVelocity
    });
  }
  
  function frame() {
    context.fillRect(0, 0, w, h);
  
    context.strokeStyle = "#0f0";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (a = 1; a < points.length; a++) 
      context.lineTo(points[a].x, points[a].y);
      
    context.stroke();
    
    for (a = 0; a < points.length; a++) {
      var p = points[a];
      p.x += p.vx;
      if (p.x < 0 || p.x > w)
        p.vx *= -1;
        
      p.y += p.vy;
      if (p.y < 0 || p.y > h)
        p.vy *= -1;
    }
    
    setTimeout(frame, 30);
  }
  
  frame();
});