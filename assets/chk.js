(function() {

  var LeftPanelPC = function() {
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
      },
      init: function() {
        utils.close();
        utils.add_listener_close();
      }
    };
    this.open = function() {
      utils.open();
    };
    this.close = function() {
      utils.close();
    };

    utils.init();
  };

  var Tab = function() {
    var settings = {};
    var utils = {
      add_listener_tab: function() {
        $('.chk-tabs').children('li').on('click', function() {
          var panel_id = '#' + $(this).attr('data-chk-tab');
          $('.chk-panel').css('display', 'none');
          $(panel_id).css('display', 'block');
          $('.chk-tabs').children('li').removeClass('on');
          $(this).addClass('on');
        });
      },
      init: function() {
        utils.add_listener_tab();
      }
    };

    utils.init();
  };

  var Accordion = function() {
    var settings = {};
    var utils = {
      add_listener_acc: function() {
        $('.chk-accordion_h').on('click', function() {
          $(this).next().slideToggle();
          $(this).toggleClass("closed");
        });
      },
      init: function() {
        utils.add_listener_acc();
      }
    };

    utils.init();
  };

  var FirstChild = function() {
    var settings = {};
    var utils = {
      add_class: function() {
        $('[data-cms-element-group]').each(function() {
          $(this).children().eq(0).addClass('ex-first-child');
        });
      },
      init: function() {
        utils.add_class();
      }
    };

    utils.init();
  };

  var ExStyle = function() {
    var settings = {
      radio_name: 'ex-style',
      label_cls: '.chk-part-name'
    };
    var utils = {
      get_select_val: function() {
        return $('[name=' + settings.radio_name + ']:checked').val();
      },
      remove_ex_class: function(id) {
        $(settings.label_cls).each(function() {
          var obj = $(this);
          var variation_arr = obj.attr('data-chk-variation').split(' ');
          $.each(variation_arr, function(idx, val) {
            obj.next('[data-parts-name]').removeClass('ex-style_' + val);
          });
        });
      },
      add_ex_class: function(id) {
        $(settings.label_cls).each(function() {
          var part_variation = $(this).attr('data-chk-variation');
          if(part_variation.indexOf(id) >= 0) {
            $(this).next('[data-parts-name]').addClass('ex-style_' + id);
          }
        });
      },
      chenge_variation: function(id) {
        utils.remove_ex_class(id);
        utils.add_ex_class(id);
      },
      add_listener_change: function() {
        $('[name=' + settings.radio_name + ']').on('change', function() {
          var id = utils.get_select_val();
          utils.chenge_variation(id);
        });
      },
      init: function() {
        utils.add_listener_change();
      }
    };

    utils.init();
  };

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

    var tab = new Tab();

    var accordion = new Accordion();

    var first_child = new FirstChild();

    var ex_style = new ExStyle();

  });

  /////

  function init() {
    var leftpanel = new LeftPanelPC();
    $('.chk-button').on('click', function() {
      if($('#chk-leftpanel').hasClass('closed')) {
        leftpanel.open();
      } else {
        leftpanel.close();
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
