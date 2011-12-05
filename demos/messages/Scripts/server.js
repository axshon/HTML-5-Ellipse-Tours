/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
window.Server = {
  callback: null, 
  nextID: 1, 
    
  // ----------
  receive: function(callback) {
    this.callback = callback;

/*
    if (!Modernizr.websockets) {
      alert("This browser does not support web sockets");
      return;
    }
*/
  },
  
  // ----------
  send: function(method, data, complete) {
    if (method == "connect") {
      data.id = this.nextID;
      this.nextID++;
      data.code = "success";
      complete(data);
    } else if (method == "message") {
      this.callback("message", data);
    }
  }
};

