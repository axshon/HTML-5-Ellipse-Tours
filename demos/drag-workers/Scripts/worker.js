// ----------
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
    var x;
    var y;
    var a;
    var directions = [
      [-1, -1], 
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0]
    ];
    
    switch(this.type) {
      case "cycle":
        for (var a = 0; a < this.imageData.data.length; a++) {
          if (a % 4 != 3) { // operate on R, G, B, but not A
            var value = this.imageData.data[a] - 1;
            if (value < 0)
              value = 255;
              
            this.imageData.data[a] = value;
          }
        }
        break;
      
      case "blur":
        for (y = 0; y < this.imageData.height; y++) {
          for (x = 0; x < this.imageData.width; x++) {
            var pixel = this.getPixel(x, y);
            var count = 1;
            for (a = 0; a < directions.length; a++) {
              var direction = directions[a];
              var neighbor = this.getPixel(x + direction[0], y + direction[1]);
              if (neighbor) {
                count++;
                pixel.r += neighbor.r;
                pixel.g += neighbor.g;
                pixel.b += neighbor.b;
              }
            }
            
            pixel.r /= count;
            pixel.g /= count;
            pixel.b /= count;
            this.setPixel(x, y, pixel);
          }
        }
        break;

      case "edges":
        for (y = 0; y < this.imageData.height; y++) {
          for (x = 0; x < this.imageData.width; x++) {
            var pixel = this.getPixel(x, y);
            var newPixel = {
              r: 0, 
              g: 0, 
              b: 0,
              a: 255
            };
            var count = 0;
            for (a = 0; a < directions.length; a++) {
              var direction = directions[a];
              var neighbor = this.getPixel(x + direction[0], y + direction[1]);
              if (neighbor) {
                count++;
                newPixel.r += Math.abs(neighbor.r - pixel.r);
                newPixel.g += Math.abs(neighbor.g - pixel.g);
                newPixel.b += Math.abs(neighbor.b - pixel.b);
              }
            }
            
/*
            newPixel.r /= count;
            newPixel.g /= count;
            newPixel.b /= count;
*/
            count *= 0.5;
            newPixel.r = Math.min(255, newPixel.r / count);
            newPixel.g = Math.min(255, newPixel.g / count);
            newPixel.b = Math.min(255, newPixel.b / count);
            this.setPixel(x, y, newPixel);
          }
        }
        break;
    }

    self.postMessage(this.imageData);  
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
