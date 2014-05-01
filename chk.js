$(function() {
  $('.chk-accordion_h').click(function() {
    $(this).next().slideToggle();
    $(this).toggleClass("open");
  });
});