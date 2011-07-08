# Listing 3.13 Using the setTimeout() and clearTimeout() methods

```javascript
var timerID = null;		                // Define and initialize our variable. 			

function toggleTimeout() {
  if (timerID) {                      // If we have a timer,
    clearTimeout(timerID);            //   cancel it,
    console.log("cancelled");         //   log it for debugging,
    timerID = null;	                  //   and clear our variable so we know it's not valid.
  } else {                            // Otherwise, if we have no timer,
    timerID = setTimeout(function() { //   make a new timer with an anonymous function
      console.log("expired");         //   that when fired, logs a message 
      timerID = null;                 //   and clears our variable.
    }, 3000);	                        // 3000 milliseconds = 3 seconds.
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
  console.log("Count: " + intervalCount); //   logs the count.
  if(intervalCount == 10) {               // If this is our 10th time through,
    clearInterval(intervalID);            //   cancel the interval, 
    intervalID = null;                    //   and clear our variable. 
  }
}, 2000);                                 // 2000 milliseconds = 2 seconds

// The log will show "Count: 1" through "Count: 10", over the course of 20 seconds.
```