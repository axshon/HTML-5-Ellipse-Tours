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
            var value = this.imageData.data[a] + 1;
            if (value > 255)
              value = 0;
              
            this.imageData.data[a] = value;
          }
        }
        break;
      
      case "sort":
        var data = this.imageData.data;
        var rowWidth = this.imageData.width * 4;
        for (var a = 0; a < this.imageData.data.length; a += 4) {
          var b = a + rowWidth;
          var valueA = data[a] + data[a + 1] + data[a + 2];
          var valueB = data[b] + data[b + 1] + data[b + 2];
          if (valueA < valueB) {
            var temp0 = data[a];
            var temp1 = data[a + 1];
            var temp2 = data[a + 2];
            data[a] = data[b];
            data[a + 1] = data[b + 1];
            data[a + 2] = data[b + 2];
            data[b] = temp0;
            data[b + 1] = temp1;
            data[b + 2] = temp2;
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

      case "diffuse":
        for (y = 0; y < this.imageData.height; y++) {
          for (x = 0; x < this.imageData.width; x++) {
            var pixel = this.getPixel(x, y);
            var direction = directions[Math.floor(Math.random() * directions.length)];
            var x1 = x + direction[0];
            var y1 = y + direction[1];
            var pixel1 = this.getPixel(x1, y1);
            if (pixel1) {
              this.setPixel(x, y, pixel1);
              this.setPixel(x1, y1, pixel);
            }
          }
        }
        break;

      case "sharpen":
        for (y = 0; y < this.imageData.height; y++) {
          for (x = 0; x < this.imageData.width; x++) {
            var pixel = this.getPixel(x, y);
            var blurredPixel = {
              r: pixel.r, 
              g: pixel.g, 
              b: pixel.b,
              a: pixel.a
            };
            var count = 1;
            for (a = 0; a < directions.length; a++) {
              var direction = directions[a];
              var neighbor = this.getPixel(x + direction[0], y + direction[1]);
              if (neighbor) {
                count++;
                blurredPixel.r += neighbor.r;
                blurredPixel.g += neighbor.g;
                blurredPixel.b += neighbor.b;
              }
            }
            
            pixel.r = Math.max(0, Math.min(255, pixel.r + (pixel.r - (blurredPixel.r / count))));
            pixel.g = Math.max(0, Math.min(255, pixel.g + (pixel.g - (blurredPixel.g / count))));
            pixel.b = Math.max(0, Math.min(255, pixel.b + (pixel.b - (blurredPixel.b / count))));
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
