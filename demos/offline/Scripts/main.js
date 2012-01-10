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
    
    this.$input = $("#input")
      .keypress(function(event) {
        if (event.which == 13) { // return key
          var value = self.$input.val();
          if (value) {
            var item = self.newItem(value);
            
            if (false && navigator.onLine) {
              // send to server
            } else {
              self.itemActions.push({
                type: "add", 
                title: item.title
              });
            }
            
            self.saveState();
            self.$input.val("");
          }
        }
      })
      .focus();
      
    if (false && navigator.onLine) {
/*       syncWithServer */
    } else {
      this.loadState();
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

        if (false && navigator.onLine) {
          // send to server
        } else {
          self.itemActions.push({
            type: "delete", 
            title: item.title
          });
        }
        
        self.saveState();
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
    var a;
    for (a = 0; a < items.length; a++)
      this.newItem(items[a]);
    
    return true;
  },
  
  // ----------
  saveState: function() {
    localStorage.itemActions = JSON.stringify(this.itemActions);
    
    var items = [];
    var a; 
    for (a = 0; a < this.shoppingItems.length; a++)
      items.push(this.shoppingItems[a].title);
    
    localStorage.shoppingItems = JSON.stringify(items);
  }
};

