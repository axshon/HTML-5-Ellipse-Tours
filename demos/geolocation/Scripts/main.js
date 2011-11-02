/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />
/// <reference path="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0" />

// ----------
$(document).ready(function () {
	gis.init();
});

// ----------
window.gis = {
	map: null,

	// ----------
	init: function () {
		var self = this;
    
  	function resize(event) {
  		var left = $("#main-map").width() - 250;
  		$("aside").css("left", left);
  	}
  
  	$(window).resize(resize);
  	resize();

    // ___ map
		this.map = new Microsoft.Maps.Map($("#main-map")[0], {credentials: config.mapKey});

		Microsoft.Maps.Events.addHandler(this.map, "click", function(event) {
  		if (event.targetType == "map") {
  			var point = new Microsoft.Maps.Point(event.getX(), event.getY());
  			var loc = event.target.tryPixelToLocation(point);
  			var pin = new Microsoft.Maps.Pushpin(loc, {
  				icon: "Images/SmithIsland.gif",
  				width: 73,
  				height: 94
  			});
  			
  			self.map.entities.push(pin);
  		}
		});

		// ___ geolocation
		if (Modernizr.geolocation) {
		  function updateForPosition(position) {
    		var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
    		var a = Math.min(25000, position.coords.accuracy) / 5000;
    		var zoom = 16 - Math.round(a);
    		self.map.setView({
  				zoom: zoom,
  				center: loc,
  			});
  		}
  		
  		function positionError(error) {
  		  if (error.code == 1)
  		    alert("please enable geolocation!");
  		}
  		
  		var options = {
  		  enableHighAccuracy: true, 
  		  maximumAge: 30000
  		};

  		var wpid = navigator.geolocation.watchPosition(updateForPosition, positionError, options);
    }
	}
};

