/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
window.SocketServer = function(callback) {
  this.callback = callback;
  this.connectionection = null;
};

// ----------
SocketServer.prototype = {
  // ----------
  send: function(method, data, complete) {
    var self = this;
    if (method == "connect") {
      var Socket = window.WebSocket || window.MozWebSocket;
      if (Socket) {
        var url = "ws://" 
          + location.hostname 
          + ":4502/ChatServer?userName=" 
          + data.From;
          
        this.connection = new Socket(url);
        
        this.connection.onopen = function() { 
          data.code = "success";
          complete(data);
        };
        
        this.connection.onmessage = function(event) { 
          self.callback("message", JSON.parse(event.data));
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

			this.connection.send(JSON.stringify(data));
			this.callback(method, data);
    }
  }
};

