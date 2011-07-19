# Listing 3.13 Using the setTimeout() and clearTimeout() methods

```javascript
var timerID = null;                   

function toggleTimeout() {
  if (timerID) {                      // If we have a timer,
    clearTimeout(timerID);            //   cancel it,
    console.log("cancelled");         //   log it for debugging,
    timerID = null;                   //   and clear our variable so we know it's not valid.
  } else {                            // Otherwise, if we have no timer,
    timerID = setTimeout(function() { //   make a new timer with an anonymous function
      console.log("expired");         //   that when fired, logs a message 
      timerID = null;                 //   and clears our variable.
    }, 3000);                         // 3000 milliseconds = 3 seconds.
    console.log("started");           // Now that the timer is created, log a message.
  }
}

toggleTimeout();  // The log shows "started".
toggleTimeout();  // The log shows "cancelled".
toggleTimeout();  // The log shows "started", and 3 seconds later "expired".
```

# Listing 3.14 setInterval() performs similarly to setTimeout() but continues to execute

```javascript
var intervalCount = 0;

var intervalID = setInterval(function() { // Make a new interval that when fired
  intervalCount++;                        //   increments the count
  console.log("Count: " + intervalCount); //   and logs the count.
  if(intervalCount == 10) {               // If this is our 10th time through,
    clearInterval(intervalID);            //   cancel the interval 
    intervalID = null;                    //   and clear our variable. 
  }
}, 2000);                                 // 2000 milliseconds = 2 seconds.

// The log will show "Count: 1" through "Count: 10", over the course of 20 seconds.
```

# Listing 3.15 Walking the DOM tree and storing properties

```javascript
function iterateProps(elements, properties) {
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    properties.push({
      id: element.id,
      height: element.clientHeight,
      tag: element.tagName
    });
    
    if (element.children.length)
      iterateProps(elements.children, properties);
  }
}

function walkDOMTree() {
   var elements = document.getElementsByTagName("body");	
   var properties = [];
   iterateProps(elements, properties);
   console.dir(properties);
}

walkDOMTree();
```

# Listing 3.16 Assigning variables in a namespace instead of the global scope

```javascript
window._app = {
  mode: "clean",
  setupInfo: {
    startUpTasks: {},
    cacheInfo: {}
  }
};

_app.theme = {
  color: "blue"
};

currentUser = {
  userName: "Earnest"
};
```

# Listing 3.19 Understanding prototypes in JavaScript

```javascript
function Truck() {
}

Truck.prototype.wheels = 4;

var ford = new Truck();
console.log(ford.wheels); // 4

var chevy = new Truck();
chevy.wheels = 6;
console.log(ford.wheels); // 4
console.log(chevy.wheels); // 6

Truck.prototype.wheels = 8;
console.log(ford.wheels); // 8
console.log(chevy.wheels); // 6
```

# Listing for this, function structure, closure, etc (Listing 3.20, Listing 3.21, Listing 3.28)

```javascript
function Counter() {
  this.count = 0;
  
  var self = this;
  setInterval(function() {
    self.increment();
  }, 1000);
}

Counter.prototype = {
  increment: function() {
    this.count++;
  }
};

var counter = new Counter();
```