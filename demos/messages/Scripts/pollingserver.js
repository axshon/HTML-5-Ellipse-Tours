/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
window.PollingServer = function(callback) {
    this.callback = callback;
    this.nextID = 1;
};

// ----------
PollingServer.prototype = {
  // ----------
  send: function(method, data, complete) {
    if (method == "connect") {
      data.id = data.name;
      data.code = "success";
      complete(data);
      this.getMessages(data.name);
    } else if (method == "message") {
      $.post("/SimpleChat/SendMessage", { 
        user: data.user.name, 
        message: data.message 
      }, function (data) {
/*
        if (!data.result) {
          self.displayMessage("Error posting message");
        }
*/
      });
    }
  }, 
  
  // ----------
  getMessages: function(userName) {
    var self = this;
    $.post("/SimpleChat/GetMessages", {
      user: userName 
    }, function (data) {
      for (var i = 0; i < data.length; i++) {
        self.callback("message", {
          memberID: data[i].From,
          message: data[i].Message
        });
      }

      setTimeout(function () {
        self.getMessages(userName);
      }, 1000);
    });
  },
};

