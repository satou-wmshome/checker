(function() {

  var LeftPanel = function() {
    this.$elm = $('#chk-leftpanel');
    this.open_width = 230;
    this.close_width = 0;
    this.close();
    this.addListenerClose();
  };
  LeftPanel.prototype = {
    open: function() {
      this.$elm.animate({'width': this.open_width, 'left': 0});
      this.$elm.removeClass('closed');
    },
    close: function() {
      var pos = this.close_width - this.open_width;
      this.$elm.animate({'left': pos});
      this.$elm.addClass('closed');
    },
    addListenerClose: function() {
      var self = this;
      $('.mod-body').on('click', function() {
        self.close();
      });
    }
  };

  var Form = function() {
    this.$elm = $('form[name=settings]');
    this.addListenerSubmit();
  };
  Form.prototype = {
    getValue: function() {
      var res = this.$elm.serializeArray();
      return res;
    },
    createForm: function(param) {
      var res = null;
      var form = document.createElement('form');
      $.each(param, function(idx, obj) {
        if(obj['value'].match(/\S/g)) {
          var elm = document.createElement("input");
          elm.name = obj['name'];
          elm.value = obj['value'];
          form.appendChild(elm);
        }
      });
      document.body.appendChild(form);
      res = form;
      return res;
    },
    addListenerSubmit: function() {
      var self = this;
      $('.submit_btn').on('click', function() {
        var param = self.getValue();
        var form = self.createForm(param);
        form.submit();
      });
    },
  };

  var Tab = function() {
    this.$elm = $('.chk-tabs').children('li');
    this.addListenerTab();
  };
  Tab.prototype = {
    addListenerTab: function() {
      var self = this;
      self.$elm.on('click', function() {
        $('.chk-panel').css('display', 'none');
        self.$elm.removeClass('on');
        var panel_id = '#' + $(this).attr('data-chk-tab');
        $(panel_id).css('display', 'block');
        $(this).addClass('on');
      });
    }
  };

  var Accordion = function() {
    this.addListenerAcc();
  };
  Accordion.prototype = {
    addListenerAcc: function() {
      $('.chk-accordion_h').on('click', function() {
        $(this).next().slideToggle();
        $(this).toggleClass("closed");
      });
    }
  };

  var FirstChild = function() {
    this.addFirstChild();
  };
  FirstChild.prototype = {
    addFirstChild: function() {
      $('[data-cms-element-group]').each(function() {
        $(this).children().eq(0).addClass('ex-first-child');
      });
    }
  };

  var ExStyle = function() {
    this.$elm = $('.chk-part-name');
    this.addListenerChange();
  };
  ExStyle.prototype = {
    getSelectedValue: function() {
      return $('[name=ex-style]:checked').val();
    },
    removeExClass: function() {
      this.$elm.each(function() {
        var obj = $(this);
        var variation_arr = obj.attr('data-chk-variation').split(' ');
        $.each(variation_arr, function(idx, val) {
          obj.next('[data-parts-name]').removeClass('ex-style_' + val);
        });
      });
    },
    addExClass: function(cls_name) {
      this.$elm.each(function() {
        var part_variation = $(this).attr('data-chk-variation');
        if(part_variation.indexOf(cls_name) >= 0) {
          $(this).next('[data-parts-name]').addClass('ex-style_' + cls_name);
        }
      });
    },
    addListenerChange: function() {
      var self = this;
      $('[name=ex-style]').on('change', function() {
        var cls_name = self.getSelectedValue();
        self.removeExClass();
        self.addExClass(cls_name);
      });
    }
  };

  var ExOthersStyle = function(input_name, parts_elm) {
    this.input_name = input_name;
    this.$input_elm = $('[name=' + this.input_name + ']');
    this.$parts_elm = parts_elm || $('[data-parts-name]');
    this.values = this.getValues();
    this.addListenerChange();
  };
  ExOthersStyle.prototype = {
    getValues: function() {
      var res = null;
      var tmp = '';
      this.$input_elm.each(function() {
        tmp += $(this).val() + ' ';
      });
      res = tmp.split(' none ')[0];
      return res;
    },
    getSelectedValue: function() {
      return $('[name=' + this.input_name + ']:checked').val();
    },
    removeExClass: function() {
      var self = this;
      this.$parts_elm.each(function() {
        $(this).removeClass(self.values);
      });
    },
    addExClass: function(cls_name) {
      this.$parts_elm.each(function() {
        $(this).addClass(cls_name);
      });
    },
    addListenerChange: function() {
      var self = this;
      this.$input_elm.on('change', function() {
        var cls_name = self.getSelectedValue();
        self.removeExClass();
        if(cls_name !== 'none') {
          self.addExClass(cls_name);
        }
      });
    }
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

    var form = new Form();

    var tab = new Tab();

    var accordion = new Accordion();

    var first_child = new FirstChild();

    var ex_style = new ExStyle();

    var ex_img_size = new ExOthersStyle('ex-imgSize');

    var ex_img_layout = new ExOthersStyle('ex-imgLayout');

    var ex_img_float = new ExOthersStyle('ex-imgFloat');

    var ex_align = new ExOthersStyle('ex-align', $('[data-parts-name]').find('[data-cms-editable-heading]'));

  });

  /////

  function init() {
    var leftpanel = new LeftPanel();
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
