/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

// ----------
addEventListener("message", function(event) {  
  var method = event.data.method;
  if (typeof method == "string" && method in DragWorker)
    DragWorker[method].call(DragWorker, event.data);
}, false);

// ----------
var DragWorker = {
  type: null,
  imageData: null,
  directions: [
    [-1, -1], 
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0]
  ],
  
  // ----------
  setType: function(data) {
    this.type = data.type;
  },
  
  // ----------
  setImageData: function(data) {
    this.imageData = data.imageData;
    this.nextFrame();
  },
  
  // ----------
  nextFrame: function() {
    switch(this.type) {
      case "cycle":
        for (var i = 0; i < this.imageData.data.length; i++) {
          if (i % 4 != 3) { // operate on R, G, B, but not A
            var value = this.imageData.data[i] + 1;
            if (value > 255)
              value = 0;
              
            this.imageData.data[i] = value;
          }
        }
        break;
      
      case "diffuse":
        var x;
        var y;
        for (y = 0; y < this.imageData.height; y++) {
          for (x = 0; x < this.imageData.width; x++) {
            var direction = this.directions[Math.floor(Math.random() * this.directions.length)];
            var x1 = x + direction[0];
            var y1 = y + direction[1];
            var pixel = this.getPixel(x, y);
            var pixel1 = this.getPixel(x1, y1);
            if (pixel1) {
              this.setPixel(x, y, pixel1);
              this.setPixel(x1, y1, pixel);
            }
          }
        }
        break;
    }

    postMessage(this.imageData);  
  }, 
  
  // ----------
  getPixelIndex: function(x, y) {
    if (x < 0 || x >= this.imageData.width || y < 0 || y >= this.imageData.height)
      return -1;
      
    return (y * this.imageData.width * 4) + (x * 4);
  },

  // ----------
  getPixel: function(x, y) {
    var index = this.getPixelIndex(x, y);
    if (index == -1)
      return null;
      
    return {
      r: this.imageData.data[index], 
      g: this.imageData.data[index + 1], 
      b: this.imageData.data[index + 2], 
      a: this.imageData.data[index + 3]
    }; 
  },

  // ----------
  setPixel: function(x, y, pixel) {
    var index = this.getPixelIndex(x, y);
    if (index == -1)
      return null;
      
    this.imageData.data[index] = pixel.r; 
    this.imageData.data[index + 1] = pixel.g; 
    this.imageData.data[index + 2] = pixel.b;
    this.imageData.data[index + 3] = pixel.a;
  }
};

