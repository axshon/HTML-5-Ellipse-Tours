/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.js" />
/// <reference path="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0" />

// ----------
$(document).ready(function () {
	function resize(event) {
		var left = $("#main-map").width() - 250;
		$("aside").css("left", left);
	}

	$(window).resize(resize);
	resize();
	gis.init();
});

// ----------
var gis = {
	map: null,
	m: Microsoft.Maps,
	dirMgr: null,
	mode: "MapClick",
	distPoints: [],

	// ----------
	init: function () {
		var self = this;
		self.map = new self.m.Map(
			document.getElementById("main-map"),
			{ credentials: config.mapKey }
		);
		$("#cmdMapClick").click(function () {
			self.resetMapEnvelope();
			self.removeEvents();
			alert("Click on the map to get the location.");
			self.mode = "MapClick";
			self.m.Events.addHandler(self.map, "click", self.mapClick);
		});
		$("#cmdLocationAndZoom").click(function () {
			self.resetMapEnvelope();
			self.removeEvents();
			alert("Click the map to find Smith Island Maryland and shot a custom pushpin.");
			self.mode = "LocAndZoom";
			self.m.Events.addHandler(self.map, "click", self.mapLocationAndZoom);
		});
		$("#cmdStraightLines").click(function () {
			self.resetMapEnvelope();
			self.removeEvents();
			alert("Click the map to build a shape using straight lines.");
			self.mode = "StraighLines";
			self.m.Events.addHandler(self.map, "click", self.mapStraightLines);
		});
		$("#cmdDistances").click(function () {
			self.resetMapEnvelope();
			self.removeEvents();
			alert("Click the map at various points to draw line and pushpins and find the distances between them.");
			self.mode = "Distances";
			self.m.Events.addHandler(self.map, "click", self.getDistances);
		});
		$("#cmdBufferPoint").click(function () {
			self.resetMapEnvelope();
			self.removeEvents();
			alert("Click the map to assign a point and draw a 10 Kilometer polygon around it.");
			self.mode = "BufferPoint";
			self.m.Events.addHandler(self.map, "click", self.createPolygonAroundPoint);
		});
		$("#cmdRouteAddr").click(function () {
			self.resetMapEnvelope();
			self.removeEvents();
			alert("Click the map to get directions from the Smithsonian to the National Aquarium.");
			self.mode = "RouteAddress";
			self.m.Events.addHandler(self.map, "click", self.getRouteBetweenAddresses);
		});
		self.resetMapEnvelope();
		
		// ___ geolocation
		if (Modernizr.geolocation) {
		  function updateForPosition(position) {
    		var loc = new self.m.Location(position.coords.latitude, position.coords.longitude);
    		var a = Math.min(25000, position.coords.accuracy) / 5000;
    		var zoom = 16 - Math.round(a);
    		self.map.setView(
    			{
    				zoom: zoom,
    				center: loc,
    			}
    		);
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
	},

	// ----------
	removeEvents: function () {
		var self = window.gis;
		switch (self.mode) {
			case "MapClick":
				self.m.Events.removeHandler(self.mapClick);
				break;
			case "LocAndZoom":
				self.m.Events.removeHandler(self.mapLocationAndZoom);
				break;
			case "StraighLines":
				self.m.Events.removeHandler(self.mapStraightLines);
				break;
			case "Distances":
				self.m.Events.removeHandler(self.getDistances);
				break;
			case "BufferPoint":
				self.m.Events.removeHandler(self.createPolygonAroundPoint);
				break;
			case "RouteAddress":
				self.m.Events.removeHandler(self.getRouteBetweenAddresses);
				break;
		}
	},

	// ----------
	resetMapEnvelope: function () {
		var self = this;
		self.map.setView(
			{
				zoom: 5,
				center: new self.m.Location(38, -76),
				mapTypeId: self.m.MapTypeId.aerial
			}
		);
		self.map.entities.clear();
	},

	// ----------
	mapClick: function (e) {
		var self = window.gis;
		if (e.targetType == "map") {
			var point = new self.m.Point(e.getX(), e.getY());
			var loc = e.target.tryPixelToLocation(point);
			var pin = new self.m.Pushpin(loc, null);
			self.map.entities.push(pin);
			var lat = Math.round(loc.latitude * 1000) / 1000;
			var lon = Math.round(loc.longitude * 1000) / 1000;
			alert("latitude: " + lat + ", longitude: " + lon);
		}
	},

	// ----------
	mapLocationAndZoom: function () {
		var self = window.gis;
		var loc = new self.m.Location(37.982, -76.017);
		self.map.setView(
			{
				zoom: 12,
				center: loc,
				mapTypeId: self.m.MapTypeId.road
			}
		);
		var pin = new self.m.Pushpin(loc,
			{
				icon: "Images/SmithIsland.gif",
				width: 73,
				height: 94
			}
		);
		self.map.entities.push(pin);
	},

	// ----------
	mapStraightLines: function (e) {
		var self = window.gis;
		if (e.targetType == "map") {
			self.map.entities.clear();
			var point = new self.m.Point(e.getX(), e.getY());
			var loc = e.target.tryPixelToLocation(point);
			var lines = self.getLine(loc);
			for (var i = 0; i < lines.length; i++) {
				self.map.entities.push(lines[i]);
			}
			self.map.setView(
				{
					zoom: 8,
					center: loc,
					mapTypeId: self.m.MapTypeId.aerial
				}
			);
		}
	},

	// ----------
	getLine: function (startLoc) {
		var self = window.gis;
		var lines = [];
		var lat = startLoc.latitude;
		var lon = startLoc.longitude;
		var a = .4;
		var b = .5;
		lines.push(new self.m.Polyline([
					new self.m.Location(lat - a, lon),
					new self.m.Location(lat + a, lon)
				], null));
		lines.push(new self.m.Polyline([
					new self.m.Location(lat - (a / 8), lon - (b / 2)),
					new self.m.Location(lat + (a / 8), lon - (b / 2))
				], null));
		lines.push(new self.m.Polyline([
					new self.m.Location(lat - (a / 8), lon + (b / 2)),
					new self.m.Location(lat + (a / 8), lon + (b / 2))
				], null));
		lines.push(new self.m.Polyline([
					new self.m.Location(lat, lon - b),
					new self.m.Location(lat, lon + b)
				], null));
		lines.push(new self.m.Polyline([
					new self.m.Location(lat - (a / 2), lon - (b / 8)),
					new self.m.Location(lat - (a / 2), lon + (b / 8))
				], null));
		lines.push(new self.m.Polyline([
					new self.m.Location(lat + (a / 2), lon - (b / 8)),
					new self.m.Location(lat + (a / 2), lon + (b / 8))
				], null));
		return lines;
	},

	// ----------
	getRouteBetweenAddresses: function () {
		var self = window.gis;
		if (self.dirMgr) {
			self.getRouteWithDirMgr();
		}
		else {
			self.m.loadModule("Microsoft.Maps.Directions",
			{
				callback: function () {
					// alert("Directions ManagerLoaded");
					self.dirMgr = new self.m.Directions.DirectionsManager(self.map);
					dirErrs = self.m.Events.addHandler(self.dirMgr, "directionsError",
						function (arg) {
							alert("An error in the directions manager");
						}
					);
					dirUpdated = self.m.Events.addHandler(self.dirMgr, "directionsUpdated", function () { });
					self.getRouteBetweenAddresses();
				}
			});
		}
	},

	// ----------
	getRouteWithDirMgr: function () {
		var self = window.gis;
		self.map.setView(
			{
				zoom: 10,
				center: new self.m.Location(39.1, -76.8),
				mapTypeId: self.m.MapTypeId.aerial
			}
		);
		self.dirMgr.resetDirections();

		// Set Route Mode to driving 
		self.dirMgr.setRequestOptions(
			{ routeMode: self.m.Directions.RouteMode.driving }
		);

		var addrAirAndSpace = "7th and Independence Ave SW, Washington, DC, 20591";
		var wpAirAndSpace = new self.m.Directions.Waypoint({ address: addrAirAndSpace });
		self.dirMgr.addWaypoint(wpAirAndSpace);

		var addrAquarium = "501 East Pratt Street, Baltimore, Maryland, 21202";
		var wpAquarium = new self.m.Directions.Waypoint({ address: addrAquarium });
		self.dirMgr.addWaypoint(wpAquarium);
		self.dirMgr.setRenderOptions({ itineraryContainer: document.getElementById("itinerary") });
		self.dirMgr.calculateDirections();
	},

	// ----------
	geoCodeAddress: function () {
		alert("proxy the service using web apis");
		//http://msdn.microsoft.com/en-us/library/cc966828.aspx
	},

	// ----------
	getDistances: function (e) {
		var self = window.gis;
		if (e.targetType == "map") {
			var point = new self.m.Point(e.getX(), e.getY());
			var loc = e.target.tryPixelToLocation(point);
			if (self.distPoints.length == 2) {
				self.distPoints.splice(0, 1);
			}
			self.distPoints.push(loc);
			var pin = new self.m.Pushpin(loc, null);
			self.map.entities.push(pin);
			if (self.distPoints.length == 2) {
				var line = new self.m.Polyline([self.distPoints[0], self.distPoints[1]], null);
				self.map.entities.push(line);
				var distance = self.getDistanceBetweenPoints(self.distPoints[0], self.distPoints[1]);
				alert("Distance is: " + distance);
			}
		}
	},

  // ----------
  getDistanceBetweenPoints: function (pointA, pointB) {
    var latA = pointA.latitude;
    var lonA = pointA.longitude;
    var latB = pointB.latitude;
    var lonB = pointB.longitude;
    var r = 6371; // Kilometers

    var dLat = (latB - latA) * Math.PI / 180;
    var dLon = (lonB - lonA) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = (r * c);

    if (d > 1) {
      d = Math.round(d * 100) / 100 + " km";
    }
    else if (d <= 1) {
      d = Math.round((d * 1000) * 10) / 10 + " m";
    }
    return d;
  },

	// ----------
	getAddressForPoint: function(e) {
		var self = window.gis;
		if (e.targetType == "map") {
			var point = new self.m.Point(e.getX(), e.getY());
			var loc = e.target.tryPixelToLocation(point);
			var pin = new self.m.Pushpin(loc, null);
			self.map.entities.push(pin);
			var lat = Math.round(loc.latitude * 1000) / 1000;
			var lon = Math.round(loc.longitude * 1000) / 1000;
			
		} 
	},

	// ----------
	getRateOfTravel: function () {
	},

	// ----------
	createPolygonAroundPoint: function (e) {
		var self = window.gis;
		if (e.targetType == "map") {
			var point = new self.m.Point(e.getX(), e.getY());
			var loc = e.target.tryPixelToLocation(point);
			var pin = new self.m.Pushpin(loc, null);
			self.map.entities.push(pin);
			var bufferMeters = 10000;
			var sides = 18;
			self.map.setView(
				{
					zoom: 9,
					center: loc,
					mapTypeId: self.m.MapTypeId.aerial
				}
			);
			var latitude = loc.latitude;
			var longitude = loc.longitude;
			var radius = bufferMeters / 1000;
			var r = 6371; // earth's mean radius in km
			var lat = (latitude * Math.PI) / 180; // rad
			var lon = (longitude * Math.PI) / 180; // rad
			var d = parseFloat(radius) / r; // d = angular distance covered on earth's surface
			polygonPoints = new Array();
			var iterator = 360 / sides;
			for (x = 0; x <= 360; x += iterator) {
				var p2 = new self.m.Location(0, 0);
				brng = x * Math.PI / 180; // radians
				p2.latitude = Math.asin(Math.sin(lat) *
					Math.cos(d) + Math.cos(lat) *
					Math.sin(d) * Math.cos(brng));
				p2.longitude = ((lon + Math.atan2(Math.sin(brng) *
					Math.sin(d) * Math.cos(lat),
					Math.cos(d) - Math.sin(lat) *
					Math.sin(p2.latitude))) * 180) / Math.PI;
				p2.latitude = (p2.latitude * 180) / Math.PI;
				polygonPoints.push(p2);
			}
			var polygoncolor = new Microsoft.Maps.Color(0, 0, 0, 0);
			var polygonstroke = new Microsoft.Maps.Color(255, 255, 255, 255);
			var polygon = new Microsoft.Maps.Polygon(polygonPoints, { fillColor: polygoncolor, strokeColor: polygonstroke });
			self.map.entities.push(polygon);
		}
	}
};

