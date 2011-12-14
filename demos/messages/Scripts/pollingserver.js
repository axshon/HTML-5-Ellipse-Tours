/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
window.PollingServer = function(callback) {
    this.callback = callback;
};

// ----------
PollingServer.prototype = {
  // ----------
  send: function(method, data, complete) {
    if (method == "connect") {
      data.code = "success";
      complete(data);
      this.getMessages(data.From);
    } else if (method == "message") {
      $.post("/SimpleChat/SendMessage", { 
        user: data.From, 
        message: data.Message 
      }, function (data) {
/*
        if (!data.result) {
          self.displayMessage("Error posting message");
        }
*/
      });

			this.callback(method, data);
    }
  }, 
  
  // ----------
  getMessages: function(userName) {
    var self = this;
    $.post("/SimpleChat/GetMessages", {
      user: userName 
    }, function (data) {
      for (var i = 0; i < data.length; i++)
        self.callback("message", data[i]);

      setTimeout(function () {
        self.getMessages(userName);
      }, 1000);
    });
  }
};

