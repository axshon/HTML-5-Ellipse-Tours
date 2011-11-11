self.onmessage = function(event) {  
  var imageData = event.data;
  
  while (true) {
    var changed = false;
    for (var a = 0; a < imageData.data.length; a++) {
      if (a % 4 != 3) { // operate on R, G, B, but not A
        if (imageData.data[a]) {
          changed = true;
          imageData.data[a] = Math.max(0, imageData.data[a] - 1);
        }
      }
    }
    
    if (!changed)
      break;
      
    self.postMessage(imageData);  
  }
};  
