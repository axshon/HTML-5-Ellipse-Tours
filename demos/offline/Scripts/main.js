/// Copyright 2012, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />

// ----------
$(document).ready(function () {
  Main.init();
});

// ----------
window.Main = {
  $status: null,
  $input: null,
  shoppingItems: [], 
  itemActions: [],  
  
  // ----------
  init: function() {
    var self = this;
    
    if (!Modernizr.applicationcache) {
      alert("This browser does not support the application cache.");
      return;
    }

    if (!Modernizr.localstorage) {
      alert("This browser does not support local storage.");
      return;
    }

    if (!window.JSON) {
      alert("This browser does not support JSON.");
      return;
    }
    
    this.$status = $("#status");
    
    this.$input = $("#input")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          var value = self.$input.val();
          if (value) {
            var item = self.newItem(value);
            
            self.itemActions.push({
              type: "add", 
              title: item.title
            });
            
            self.saveState();
            self.$input.val("");
            
            if (navigator.onLine)
              self.syncWithServer();
          }
        }
      })
      .focus();
      
    $(window)
      .bind("online", function() {
        self.updateForNetStatus(true);
      })
      .bind("offline", function() {
        self.updateForNetStatus(false);
      });
      
    this.loadState();
    this.updateForNetStatus(navigator.onLine);
  }, 

  // ----------
  updateForNetStatus: function(connected) {
    if (connected) {
      this.$status.text("(online)");
      this.syncWithServer();
    } else {
      this.$status.text("(offline)");
    }
  },

  // ----------
  newItem: function(title) {
    var self = this;
    
    var item = {
      title: title
    };
    
    var html = "<div class='item box-round box-shadow'>"
      + title
      + "<button class='close'>x</button></div>";
      
    item.$element = $(html)
      .prependTo("#items");
    
    item.$element.find(".close")
      .click(function() {
        var index = $.inArray(item, self.shoppingItems);
        if (index != -1)
          self.shoppingItems.splice(index, 1);
          
        item.$element.remove();

        self.itemActions.push({
          type: "delete", 
          title: item.title
        });

        self.saveState();
        
        if (navigator.onLine)
          self.syncWithServer();
      });
      
    this.shoppingItems.push(item);
    return item;
  },
  
  // ----------
  loadState: function() {
    if (localStorage.itemActions)
      this.itemActions = JSON.parse(localStorage.itemActions);
      
    var data = localStorage.shoppingItems; 
    if (!data) 
      return false;

    var items = JSON.parse(data);
    for (var i = 0; i < items.length; i++)
      this.newItem(items[i]);
    
    return true;
  },
  
  // ----------
  saveState: function() {
    localStorage.itemActions = JSON.stringify(this.itemActions);
    
    var items = [];
    for (var i = 0; i < this.shoppingItems.length; i++)
      items.push(this.shoppingItems[i].title);
    
    localStorage.shoppingItems = JSON.stringify(items);
  },
  
  // ----------
  syncWithServer: function() {
    var self = this;
    
    $.ajax({
      url: "/ShoppingList/SyncShoppingList",
      type: "POST",
      dataType: "json", 
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        itemActions: this.itemActions
      }),
      success: function(data, textStatus, jqXHR) {
        if (!data || !("length" in data)) {
          alert("Unable to synch with server");
          return;
        }

        var i;
        for (i = 0; i < self.shoppingItems.length; i++)
          self.shoppingItems[i].$element.remove();
          
        self.shoppingItems = [];

        for (i = 0; i < data.length; i++)
          self.newItem(data[i]);
    
        self.itemActions = [];
        self.saveState();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("Unable to sync with server: " + errorThrown);
      }
    });
  }
};

