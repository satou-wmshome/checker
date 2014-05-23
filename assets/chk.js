(function() {

  var ChkLeftPanelPC = function() {
    var settings = {
      elm_id: '#chk-leftpanel',
      open_width: 230,
      close_width: 0,
    };
    var utils = {
      open: function() {
        $(settings.elm_id).animate({'width': settings.open_width, 'left': 0});
        $(settings.elm_id).removeClass('closed');
      },
      close: function() {
        var pos = settings.close_width - settings.open_width;
        $(settings.elm_id).animate({'left': pos});
        $(settings.elm_id).addClass('closed');
      },
      add_listener_close: function() {
        $('.mod-body').on('click', function() {
          utils.close();
        });
      }
    };
    var init = function() {
      utils.close();
      utils.add_listener_close();
    }

    this.open = function() {
      utils.open();
    };
    this.close = function() {
      utils.close();
    };

    init();
  }

  /////

  $(function() {

    if($('body').hasClass('chk-pc')) {
      init();
    } else {
      initMobile();
    }

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
      $(this).toggleClass("closed");
    });

  });

  /////

  function init() {
    var chk_leftpanel = new ChkLeftPanelPC();
    $('.chk-button').on('click', function() {
      if($('#chk-leftpanel').hasClass('closed')) {
        chk_leftpanel.open();
      } else {
        chk_leftpanel.close();
      }
    });
  }

  function initMobile() {
    var w = window.innerWidth ? window.innerWidth: $(window).width();
    var w = w * 0.7;
  	var snapper = new Snap({
  		element: document.getElementById('chk-content'),
  		disable: 'right',
  		maxPosition: w,
  		minPosition: -w,
  		tapToClose: false
  	});
  	$('.snap-drawer').css('width', w);
  }

}());
