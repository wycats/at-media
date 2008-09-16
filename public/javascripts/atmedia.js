$.fn.autocomplete = function(opts) {
  opts.list = opts.list || function(arr) { 
    ret = "<ul class='complete'><li>"; 
    ret += arr.join("</li><li>");
    return ret + "</li></ul>";
  };
  
  opts.match = opts.match || function(element, typed) {
    return element.match(new RegExp(typed, "i"));
  };
  
  // Low-level events
  
  // Main keyboard event catcher. In general, you don't want to be
  // modifying this later.
  this.keyup(function(e) {
    if($.isTypedChar(e.keyCode)) $(this).trigger("autocomplete.typed");
    else if(e.keyCode == 38) $(this).trigger("autocomplete.uparrow");
    else if(e.keyCode == 40) $(this).trigger("autocomplete.downarrow");
    else if(e.keyCode ==  9) $(this).trigger("autocomplete.tab");
    else if(e.keyCode == 27) $(this).trigger("autocomplete.escape");
    else if(e.keyCode ==  8) $(this).trigger("autocomplete.backspace");
    else if(e.keyCode == 13) 
      $(this).trigger("autocomplete.activate", [$(this).val()]);
  });

  // manage state and catch high-level events
  
  var state = {
    toSelectState: function(arr) {

      $.currentState("autocomplete", "select");
      var self = $(this), original = self.val();

      arr = $(arr).filter(function() { 
        return opts.match(this, original); 
      }).get();
      
      if(!arr.length) return self.fn("toTypeState");

      var list = $(opts.list.call(self, arr));
      var size = $("li", list).length;
      var selected = null;
      
      list.appendTo("body").css({left: self.offset().left, 
        top: self.offset().top + self.outerHeight});

      var updateSelected = function() {
        if(selected < 0) selected = size + (selected % size);
        var el = $("li", list)
          .removeClass("selected")
          .eq(selected % size)
          .addClass("selected");

        self.val(el.html());
      };
      
      $(this)
        .unbind("autocomplete:select")
        .bind("autocomplete:select.typed", function() {
          list.remove();
          self.fn("toTypeState").trigger("autocomplete.typed");

        }).bind("autocomplete:select.escape", function() {

          list.remove();
          self.val(original).trigger("autocomplete.cancel").fn("toTypeState");        

        }).bind("autocomplete:select.backspace", function() {

          list.remove();
          self.fn("toTypeState").trigger("autocomplete.backspace");
          
        })
        .bind("autocomplete:select.downarrow", function() {

          selected = selected != null ? selected + 1 : 0;
          updateSelected();

        }).bind("autocomplete:select.uparrow", function() {

          selected = selected != null ? selected - 1 : -1;
          updateSelected();

        }).bind("autocomplete:select.activate", function() {

          updateSelected();
          list.remove();
          self.fn("toTypeState");

        });      
        
    }, toTypeState: function() {
      
      $.currentState("autocomplete", "type");
      var countup = function() {
        var self = $(this);

        var interval = self.data("interval");

        if(!interval) {
          interval = new $.delayedInterval(function() {
            interval.pause();
            opts.getList.call(self);
          }, 1000, true);
          self.data("interval", interval);
        }

        interval.reset();
      };
      
      $(this)
        .unbind("autocomplete:type")
        .bind("autocomplete:type.escape", function() {
          var interval = $(this).data("interval");
          if(interval) interval.pause();
        })
        .bind("autocomplete:type.typed", countup)
        .bind("autocomplete:type.downarrow", countup)
        .bind("autocomplete:type.uparrow", countup)
        .bind("autocomplete:type.backspace", countup);
    },
    
    setList: function(list) { $(this).fn("toSelectState", list); }
    
  };
  
  return this.fn(state).fn("toTypeState");
  
};