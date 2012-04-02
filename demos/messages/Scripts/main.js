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
          
          if (self.$socketsCheckbox.prop("checked"))
            self.server = new SocketServer(receive);
          else
            self.server = new PollingServer(receive);

          self.server.send("connect", {
            From: name
          }, function(result) {
            if (result && result.code == "success") {
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
      
    this.$socketsCheckbox = $("#sockets")
      .prop("checked", Modernizr.websockets)
      .change(function() {
        if (self.$socketsCheckbox.prop("checked")) {
          if (!Modernizr.websockets) {
            alert("Your browser doesn't support WebSockets.");
            self.$socketsCheckbox.prop("checked", false);
          }
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
      
    $(window).bind("beforeunload", function() {
      if (self.user) {
        self.server.send("disconnect", {
          From: self.user.name
        });
      }
    });
  },
  
  // ----------
  addMember: function(data) {
    var member = {
      name: data.From
    };
    
    member.$element = $("<p>" + member.name + "</p>")
      .appendTo(this.$members);
      
    this.members.push(member);
    return member;
  },
  
  // ----------
  removeMember: function(data) {
    var a; 
    for (a = 0; a < this.members.length; a++) {
      var member = this.members[a];
      if (member.name == data.From) {
        member.$element.remove();
        this.members.splice(a, 1);
        break;
      }
    }
  },

  // ----------
  addMessage: function(data) {
    this.$output.append("<p>" + data.From + ": " + data.Message + "</p>");
  }
};

