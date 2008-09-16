jQuery(function($) {
  $("input.autocomplete").autocomplete({
    getList: function() { 
      var self = $(this);
      
      $.getJSON("/simple/list", function(json) {
        self.fn("setList", json.array);
      });
    }
  })
  .bind("autocomplete.activate", function(e, d) {
    console.log(d);
  })
  .bind("autocomplete.cancel", function(e, d) {
    console.log("Cancelling");
  });
});  
