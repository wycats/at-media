(function($) {
  
  $.isTypedChar = function(c) {
    //     alt            arrows            backspace
    return c != 18 && !(c >= 37 && c <= 40) && c != 8 &&
    // caps     ctrl        delete    end
    c != 20 && c != 17 && c != 46 && c != 35 &&
    // enter    esc         f-keys
    c != 13 && c != 27 && !(c >= 112 && c <= 123) &&
    // home     insert    num-lock    scr-lock    pg-up       pg-down
    c != 36 && c != 45 && c != 144 && c != 145 && c != 33 && c != 34 &&
    // shift   tab       start      window      pause
    c != 16 && c != 9 && c != 91 && c != 92 && c != 19 &&
    // select
    c != 93;
  };  
  
  $.currentState = function(namespace, state) {
    $.currentState[namespace] = state;
  };
  
  var trigger = $.fn.trigger;
  $.fn.trigger = function( type, data, fn ) {
    var types = type.split(".");
    var namespace = types[0];

    if($.currentState[namespace] && types[1])
      trigger.call(this, 
        namespace + ":" + $.currentState[namespace] + "." + types[1], data, fn);
    
    trigger.call(this, type, data, fn);
    return this;
  };

})(jQuery);