/// Copyright 2012, Ian Gilman
/// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
///
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.0.6-development-only.js" />

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
    
    this.video = this.initMedia("video");
    this.audio = this.initMedia("audio");    
    
    this.$volume = $("#volume");
    
    this.$volumeUp = $("#volume-up")
      .click(function() {
        self.audio.media.muted = false;
        self.audio.media.volume += 0.1;
      });

    this.$volumeDown = $("#volume-down")
      .click(function() {
        self.audio.media.muted = false;
        self.audio.media.volume -= 0.1;
      });
      
    this.$mute = $("#mute")
      .click(function() {
        self.audio.media.muted = !self.audio.media.muted;
      });
      
    this.audio.$media
      .bind("volumechange", function() {
        self.showVolume();    
      });
      
    this.showVolume();    
  },
  
  // ----------
  initMedia: function(name) {
    var result = {};
    result.$media = $("#" + name);
    result.media = result.$media[0];
    result.$controls = $("#" + name + "-controls");
    result.$play = result.$controls.find(".play");
    result.$time = result.$controls.find(".time");
    
    result.$play
      .click(function() {
        if (result.media.paused)
          result.media.play();
        else
          result.media.pause();
      });
      
    result.$media
      .bind("playing", function() {
        result.$play.text("pause");
      })
      .bind("pause", function() {
        result.$play.text("play");
      })
      .bind("ended", function() {
        result.media.play();
      })
      .bind("timeupdate", function() {
        var prettyTime = Math.round(result.media.currentTime * 100) / 100;
        result.$time
          .text("time: " + prettyTime + "s");
      });
      
    result.media.play();
    return result;
  }, 
  
  // ----------
  showVolume: function() {
    var prettyVolume = Math.round(this.audio.media.volume * 10) / 10;
    if (this.audio.media.muted) {
      prettyVolume = 0;
      this.$mute.text("unmute");
    } else {
      this.$mute.text("mute");
    }
    
    this.$volume.text(prettyVolume);  
  }
};

