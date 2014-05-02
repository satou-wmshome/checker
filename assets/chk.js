$(function() {
  var snapper = new Snap({
    element: document.getElementById('chk-content'),
    disable: 'right',
    tapToClose: false,
    maxPosition: 230,
    minPosition: -250,
  });

  $('.chk-open_button').on('click', function() {
    snapper.open('left');
  });

  $('.chk-accordion_h').on('click', function() {
    $(this).next().slideToggle();
    $(this).toggleClass("open");
  });
});