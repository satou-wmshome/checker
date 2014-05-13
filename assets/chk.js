$(function() {

  var h = window.innerHeight ? window.innerHeight: $(window).height();
  $('#chk-leftpanel').css('height', h);
  $('.chk-panel').css('height', h - 100);

  $('.chk-tabs').children('li').on('click', function() {
    var panel_id = '#' + $(this).attr('data-chk-tab');
    $('.chk-panel').css('display', 'none');
    $(panel_id).css('display', 'block');
    $('.chk-tabs').children('li').removeClass('on');
    $(this).addClass('on');
  });

  $('.chk-accordion_h').on('click', function() {
    $(this).next().slideToggle();
    $(this).toggleClass("open");
  });

});

function mobileInit(w) {
	var snapper = new Snap({
		element: document.getElementById('chk-content'),
		disable: 'right',
		maxPosition: w,
		minPosition: -w,
		tapToClose: false
	});
	$('.snap-drawer').css('width', w);

	$('.chk-button').on('click', function() {
		if(snapper.state().info.opening == 'left') {
//			snapper.close();
		} else {
//			snapper.open('left');
		}
console.log($('#chk-content').css('transform'));
	});

//snapper.on('start', function() {
//	console.log(snapper.state().info.opening);
//});
}
