self.onmessage = function(event) {  
  var data = event.data;
  switch(event.data.method) {
    case "setType":
      Main.setType(data.type);
      break;
    case "setImageData":
      Main.setImageData(data.imageData);
      break;
    case "nextFrame":
      Main.nextFrame();
      break;
  }  
};  

// ----------
self.Main = {
  type: null,
  imageData: null,
  
  // ----------
  setType: function(type) {
    this.type = type;
  },
  
  // ----------
  setImageData: function(imageData) {
    this.imageData = imageData;
    this.nextFrame();
  },
  
  // ----------
  nextFrame: function() {
    for (var a = 0; a < this.imageData.data.length; a++) {
      if (a % 4 != 3) { // operate on R, G, B, but not A
        var value = this.imageData.data[a] - 1;
        if (value < 0)
          value = 255;
          
        this.imageData.data[a] = value;
      }
    }

    self.postMessage(this.imageData);  
  }
};
