// ==========
// socket server
var ws = require("ws");
var port = 16433; // or whatever port your server is set up for
var socketServer = new ws.Server({port: port}); 

socketServer.on("connection", function(socket) {
  chatServer.addUser(socket);
});

// ==========
// chat server
var chatServer = {
  users: [], 
  
  // ----------
  addUser: function(socket) {
    var self = this;
    
    var user = {
      socket: socket
    };
    
    this.users.push(user);
  
    socket.on("message", function(message) {
      var envelope = JSON.parse(message);
      if (envelope.method == "memberEnter") {
        user.name = envelope.data.From;
        self.sendMembersTo(user);
      }
        
      self.sendToAllBut(user, message);
    });
   
    socket.on("close", function() {
      self.sendToAllBut(user, JSON.stringify({
        method: "memberExit", 
        data: {
          From: user.name
        }
      }));
      
      self.removeUser(user);
    });
  },
  
  // ----------
  removeUser: function(user) {
    for (var a = 0; a < this.users.length; a++) {
      if (this.users[a] == user) {
        this.users.splice(a, 1);
        break;
      }
    }
  },
  
  // ----------
  sendToAllBut: function(userException, message) {
    for (var a = 0; a < this.users.length; a++) {
      var user = this.users[a];
      if (user != userException)
        user.socket.send(message);
    }
  },
  
  // ----------
  sendMembersTo: function(recipient) {
    for (var a = 0; a < this.users.length; a++) {
      var user = this.users[a];
      if (user != recipient) {
        recipient.socket.send(JSON.stringify({
          method: "memberEnter", 
          data: {
            From: user.name
          }
        }));
      }
    }
  }
};

// ==========
console.log("Server started. Connect via ws://localhost:" + port);
