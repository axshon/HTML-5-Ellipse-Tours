/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
window.LoopbackServer = function(callback) {
    this.callback = callback;
};

// ----------
LoopbackServer.prototype = {
  // ----------
  send: function(method, data, complete) {
    if (method == "connect") {
      data.code = "success";
      complete(data);
    } else if (method == "message") {
      this.callback("message", data);
    }
  }
};

