/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
$(document).ready(function () {
  Main.init();
});

// ----------
window.Main = {
  user: null, 
  members: [], 
  
  // ----------
  init: function() {
    var self = this;
    
    if (!Modernizr.websockets) {
      alert("Your browser doesn't support WebSockets.");
      return;
    }
    
    function receive(method, data) { 
      if (method == "memberEnter")
        self.addMember(data);
      else if (method == "memberExit")
        self.removeMember(data);
      else if (method == "message")
        self.addMessage(data);
    }

    this.$output = $("#log");
    this.$members = $("#members");
    
    this.$name = $("#name")
      .focus();
      
    $("#login")
      .submit(function(event) {
        event.preventDefault();
        var name = self.$name.val();
        if (name) {
          var $status = $("#login-status")
            .text("Connecting…");
          
          self.server = new SocketServer(receive);
          self.server.send("connect", {
            From: name
          }, function(result) {
            if (result && result.code == "success") {
              result.local = true;
              self.user = self.addMember(result);
              $("#login").hide();
              $("#chat").show();
              self.$entry.focus();
            } else {
              $status.text("Failed to connect.");
            }
          });
        }
      });
      
    this.$entry = $("#entry")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          var message = self.$entry.val();
          if (message) {
            self.$entry.val(""); 
            
            var data = {
              From: self.user.name, 
              Message: message
            };
            
            self.server.send("message", data);
            self.addMessage(data);
          }
        }
      });
  },
  
  // ----------
  addMember: function(data) {
    var member = {
      name: data.From
    };
    
    member.$element = $("<p>" + member.name + "</p>")
      .toggleClass("local-member", data.local || false)
      .appendTo(this.$members);
      
    this.members.push(member);
    return member;
  },
  
  // ----------
  removeMember: function(data) {
    for (var i = 0; i < this.members.length; i++) {
      var member = this.members[i];
      if (member.name == data.From) {
        member.$element.remove();
        this.members.splice(i, 1);
        break;
      }
    }
  },

  // ----------
  addMessage: function(data) {
    $("<p>" + data.From + ": " + data.Message + "</p>")
      .toggleClass("local-member", data.From == this.user.name)
      .appendTo(this.$output);
  }
};

