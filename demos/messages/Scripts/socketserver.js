/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.js" />

// ----------
window.SocketServer = function(callback) {
  this.callback = callback;
  this.connection = null;
};

// ----------
SocketServer.prototype = {
  // ----------
  send: function(method, data, complete) {
    var self = this;
    if (method == "connect") {
      var Socket = window.WebSocket || window.MozWebSocket;
      if (Socket) {
        var url = "wss://manning-socket-demo.jit.su:443";
        this.connection = new Socket(url);
        
        this.connection.onopen = function() { 
          self.connection.send(JSON.stringify({
            method: "memberEnter", 
            data: data
          }));
          
          data.code = "success";
          complete(data);
        };
        
        this.connection.onmessage = function(event) { 
          var envelope = JSON.parse(event.data);
          self.callback(envelope.method, envelope.data);
        };
        
        this.connection.onclose = function(event) { 
          data.code = "failure";
          complete(data);
        };
      } else {
        data.code = "failure";
        complete(data);
      }
    } else if (method == "message") {
      if (this.connection.readyState != 1)
        return;

			this.connection.send(JSON.stringify({
        method: method, 
        data: data
      }));
    }
  }
};

