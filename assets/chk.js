(function() {

  var ChkLeftPanelPC = function() {
    var settings = {
      elm_id: '#chk-leftpanel',
      open_width: 230,
      close_width: 0,
    };

    this.open = function() {
      $(settings.elm_id).css({'width': settings.open_width, 'left': 0});
    };
    this.close = function() {
      var pos = settings.close_width - settings.open_width;
      $(settings.elm_id).css('left', pos);
    };
    this.init = function() {
      this.close();
    };

    this.init();
  }

  $(function() {

    var w = window.innerWidth ? window.innerWidth: $(window).width();
    var h = window.innerHeight ? window.innerHeight: $(window).height();

    if($('#chk-leftpanel').hasClass('chk-pc')) {
      var chk_leftpanel = new ChkLeftPanelPC();
    } else {
      mobileInit(w);
    }

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
    var panel_width = w * 0.7;
  	var snapper = new Snap({
  		element: document.getElementById('chk-content'),
  		disable: 'right',
  		maxPosition: panel_width,
  		minPosition: -panel_width,
  		tapToClose: false
  	});
  	$('.snap-drawer').css('width', panel_width);

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

}());
