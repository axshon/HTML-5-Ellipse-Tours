// ##########
// ----------
Tour = {
  $container: null,
  
  // ----------
  init: function() {
    this.$container = $("#tour"); 
    
    function handleClick(event) {
      var $target = $(this);
      $target.css({"z-index": $target.css("z-index") + 1});
    }
    
    $("<img src='img/tour/whitehouse1.jpg'>")
      .appendTo(this.$container)
      .css({
        left: 0, 
        top: 0,
        "z-index": 1
      })
      .click(handleClick);

    $("<img src='img/tour/whitehouse2.jpg'>")
      .appendTo(this.$container)
      .css({
        left: 50, 
        top: 50,
        "z-index": 0
      })
      .click(handleClick);
  }
};

// ##########
$(function() {
  Tour.init();
});