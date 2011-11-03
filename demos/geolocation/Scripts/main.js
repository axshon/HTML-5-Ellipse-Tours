/// Copyright 2011, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />
/// <reference path="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0" />

// ----------
$(document).ready(function () {
  gis.init();
});

// ----------
window.gis = {
  map: null,
  watchID: null,
  $autoCheckbox: null, 
  $status: null,
  startTime: 0,
  distance: 0,
  previousLocation: null,

  // ----------
  init: function () {
    var self = this;
    
    this.$status = $("#status");
    
    // ___ map
    this.map = new Microsoft.Maps.Map($("#main-map")[0], {credentials: config.mapKey});

    Microsoft.Maps.Events.addHandler(this.map, "click", function(event) {
      if (event.targetType == "map") {
        var point = new Microsoft.Maps.Point(event.getX(), event.getY());
        var loc = event.target.tryPixelToLocation(point);
        var pin = new Microsoft.Maps.Pushpin(loc, {
          icon: "Images/html5.png",
          width: 32,
          height: 32
        });
        
        self.map.entities.push(pin);
      }
    });
    
    // ___ button
    this.$autoCheckbox = $("#auto").change(function() {
      self.setAutoLocate(self.$autoCheckbox[0].checked);
    });

    // ___ get started
    if (Modernizr.geolocation)
      this.setAutoLocate(true);
  }, 
  
  // ----------
  setAutoLocate: function(value) {
    var self = this;
    
    if (this.auto == value)
      return;
      
    if (value && !Modernizr.geolocation) {
      this.$status.text("This browser does not support geolocation.");
      return;
    }
      
    this.auto = value;
    this.$autoCheckbox[0].checked = this.auto;
    
    if (this.auto) {
      this.$status.text("locating...");
      this.watchID = navigator.geolocation.watchPosition(function(position) {
        self.updateForPosition(position);
      }, function(error) {
        if (error.code == 1)
          self.$status.text("Please enable geolocation!");
        else if (error.code == 2)
          self.$status.text("Unable to get location.");
        else if (error.code == 3)
          self.$status.text("Timeout while getting location.");
        else
          self.$status.text("Unknown error while getting location.");
          
        self.setAutoLocate(false);
      }, {
        enableHighAccuracy: true, 
        maximumAge: 30000
      });
    } else {
      navigator.geolocation.clearWatch(this.watchID);
      this.watchID = null;
    }
  },

  // ----------
  updateForPosition: function(position) {
    var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
    var a = Math.min(25000, position.coords.accuracy) / 5000;
    var zoom = 16 - Math.round(a);
    this.map.setView({
      zoom: zoom,
      center: loc,
    });

    if (this.previousLocation) {
      var distance = this.computeDistance(this.previousLocation, loc);
      if (distance > position.coords.accuracy / 2) { // threshold to filter out noise
        var line = new Microsoft.Maps.Polyline([this.previousLocation, loc], null);
        this.map.entities.push(line);

        this.distance += distance;
        this.previousLocation = loc;
      }
      
      var millisecondsPerHour = 1000 * 60 * 60;
      var hours = ($.now() - this.startTime) / millisecondsPerHour;
      var kilometerDistance = this.distance / 1000;
      var speed = kilometerDistance / hours;
      this.$status.html("distance:&nbsp;" 
        + (Math.round(this.distance * 10) / 10) 
        + "&nbsp;m, speed:&nbsp;"
        + (Math.round(speed * 10) / 10)
        + "&nbsp;km/h"); 
    } else {
      this.previousLocation = loc;
      this.startTime = $.now();
      this.$status.text("located"); 
    }
  },
    
  // ----------
  computeDistance: function (locationA, locationB) {
    var latA = locationA.latitude;
    var lonA = locationA.longitude;
    var latB = locationB.latitude;
    var lonB = locationB.longitude;
    var kilometerConversion = 6371;

    var dLat = (latB - latA) * Math.PI / 180;
    var dLon = (lonB - lonA) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var meters = c * kilometerConversion * 1000;

    return meters;
  }
};

