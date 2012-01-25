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
  // ----------
  init: function() {
    var self = this;
    
    if (!Modernizr.audio) {
      alert("This browser does not support the audio tag.");
      return;
    }

    if (!Modernizr.video) {
      alert("This browser does not support the video tag.");
      return;
    }
    
    this.$play = $("#play")
      .click(function() {
        if (self.video.paused)
          self.video.play();
        else
          self.video.pause();
      });
      
    this.$video = $("#video1")
      .bind("playing", function() {
        self.$play.text("pause");
      })
      .bind("pause", function() {
        self.$play.text("play");
      });
      
    this.video = this.$video[0];
    
/*
	<button onclick="document.getElementById('player').play()">Play</button>
	<button onclick="document.getElementById('player').pause()">Pause</button>
	<button onclick="document.getElementById('player').volume+=0.1">Volume Up</button>
	<button onclick="document.getElementById('player').volume-=0.1">Volume Down</button>
*/
  }
};

