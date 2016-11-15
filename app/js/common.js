$(document).ready(function() {

	// SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
        return $(this).attr("src").replace(".svg", ".png");
    });
  };

  //---------------

  svg4everybody({});

  //---------------

});