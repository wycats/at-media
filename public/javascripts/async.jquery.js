(function($) {

  $.delayedInterval = function(fn, time, halted) {
    var interval;
    
    this.reset = function() {
      clearInterval(interval);
      interval = setInterval(fn, time);
    };
  
    this.pause = function() { clearInterval(interval); };
    this.start = function() { return setInterval(fn, time); };

    if(!halted) interval = this.start();
  };

})(jQuery);