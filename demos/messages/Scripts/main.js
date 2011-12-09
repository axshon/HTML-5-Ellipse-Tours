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
  init: function(useLoopback) {
    var self = this;
    
    function receive(method, data) { 
      if (method == "memberEnter")
        self.addMember(data);
      else if (method == "memberExit")
        self.removeMember(data);
      else if (method == "message")
        self.addMessage(data);
    }

    if (useLoopback)
      this.server = new LoopbackServer(receive);
/*
    else if (Modernizr.websockets) 
      this.server = new SocketServer(receive);
*/
    else
      this.server = new PollingServer(receive);
    
    this.$output = $("#log");
    this.$members = $("#members");
    
    this.$name = $("#name")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          var name = self.$name.val();
          if (name) {
            self.server.send("connect", {
              name: name
            }, function(result) {
              if (result && result.code == "success") {
                self.user = self.addMember(result);
                $("#login").hide();
                $("#chat").show();
                self.$entry.focus();
              }
            });
          }
        }
      })
      .focus();
    
    this.$entry = $("#entry")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          var message = self.$entry.val();
          self.$entry.val(""); 
          self.server.send("message", {
            user: self.user, 
            message: message
          });
        }
      });
      
    $(window).bind("beforeunload", function() {
      if (self.user) {
        self.server.send("disconnect", {
          memberID: self.user.id 
        });
      }
    });
  },
  
  // ----------
  addMember: function(data) {
    var member = {
      name: data.name, 
      id: data.id
    };
    
    member.$element = $("<p>" + member.name + "</p>")
      .appendTo(this.$members);
      
    this.members.push(member);
    return member;
  },
  
  // ----------
  deleteMember: function(data) {
    var a; 
    for (a = 0; a < this.members.length; a++) {
      var member = this.members[a];
      if (member.id == data.member) {
        member.$element.remove();
        this.members.splice(a, 1);
        break;
      }
    }
  },

  // ----------
  addMessage: function(data) {
    var a; 
    for (a = 0; a < this.members.length; a++) {
      var member = this.members[a];
      if (member.id == data.memberID) {
        this.$output.append("<p>" + member.name + ": " + data.message + "</p>");
        break;
      }
    }
  }
};

