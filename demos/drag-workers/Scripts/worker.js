self.onmessage = function(event) {  
  var imageData = event.data;
  for (var a = 0; a < imageData.data.length; a++) {
    if (a % 4 != 3) // operate on R, G, B, but not A
      imageData.data[a] = 255 - imageData.data[a]; // invert
  }
  self.postMessage(imageData);  
};  
