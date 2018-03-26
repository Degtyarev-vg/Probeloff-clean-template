'use strict';

$(function() {

  // Magnific Popup
  // $('.popup-with-move-anim').magnificPopup({
  $('.popup-with-zoom-anim').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',

    closeBtnInside: true,
    preloader: false,

    midClick: true,
    removalDelay: 300,
    // mainClass: 'my-mfp-slide-bottom'
    mainClass: 'my-mfp-zoom-in'
  });

});
