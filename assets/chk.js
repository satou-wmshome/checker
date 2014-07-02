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
    this.$elm = $('.chk-label');
    this.addListenerChange();
  };
  ExStyle.prototype = {
    getSelectedValue: function() {
      return $('[name=ex-style]:checked').val();
    },
    removeExClass: function() {
      this.$elm.each(function() {
				var obj = $(this).next('[data-parts-name]');
        if(obj[0]) {
          var cls_arr = obj.attr('class').split(' ');
          $.each(cls_arr, function(idx, val) {
            if(val.indexOf('ex-style') >= 0) {
              obj.removeClass(val);
            }
          });
        }
      });
    },
    addExClass: function(cls_name) {
      this.$elm.each(function() {
        var part_variation = $(this).attr('data-chk-variation');
				var ex_cls = 'ex-style_' + cls_name;
        if(part_variation.indexOf(cls_name) < 0) {
					tmp_cls = $(this).attr('data-chk-default-ex');
					ex_cls = (tmp_cls !== '') ? 'ex-style_' + tmp_cls: '';
        }
        $(this).next('[data-parts-name]').addClass(ex_cls);
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

  var AnchorManage = function() {
    this.$elm_banner = $('[data-cms-editable="banner"]');
    this.$elm_heading = $('[data-cms-editable="heading"]');
    this.$elm_div_heading = $('div[data-cms-editable="heading"]');
    this.$elm_table_td = $('[class*="mod-table"]').find('th, td');
    this.$elm_text = $('[data-cms-editable="text"]');
    this.$elm_wysiwyg_li = $('[data-cms-editable="wysiwyg"]').find('li');
    this.$elm_wysiwyg_p = $('[data-cms-editable="wysiwyg"]').children('p');
    this.anchor_tag = '<a href="#" data-chk-anchormanage></a>';
    this.sapn_tag = '<span data-chk-anchormanage></span>';
    this.addListenerChange();
  };
  AnchorManage.prototype = {
    getSelectedValue: function() {
      return $('[name=anchor]:checked').val();
    },
    switchType: function(type) {
      this.removeAnchorTag();
      switch(type) {
        case 'link':
          this.addAnchorTag();
          break;
        case 'hover':
          this.removeAnchorTag();
          this.addAnchorTag();
          this.makeHover();
          break;
      }
    },
    addAnchorTag: function() {
      this.$elm_banner.wrap(this.anchor_tag);
      this.$elm_banner.find('[data-cms-editable="text"]').children('a').wrapInner(this.sapn_tag).children('span').unwrap();
      this.$elm_heading.wrap(this.anchor_tag);
      this.$elm_div_heading.unwrap().find('.mod-h').wrap(this.anchor_tag);
      this.$elm_table_td.wrapInner(this.anchor_tag);
      this.$elm_text.wrapInner(this.anchor_tag);
      this.$elm_wysiwyg_li.wrapInner(this.anchor_tag);
      this.$elm_wysiwyg_p.wrapInner(this.anchor_tag);
    },
    makeHover: function() {
      for(var i = 0; i < document.styleSheets.length; i++) {
        if(document.styleSheets[i].href.indexOf('mod.css') != -1) {
          var stylesheet = document.styleSheets[i];
        }
      }
      var css_rules = stylesheet.cssRules;
      var rule = '';
      $.each(css_rules, function(key, val) {
        if('href' in val) {
          $.each(val.styleSheet.rules, function(key2, val2) {
            if(val2.selectorText.indexOf(':hover') != -1) {
              var selector = val2.selectorText.replace(/:hover/g, '');
              rule += selector + '{' + val2.style.cssText + '}';
            }
          });
        } else {
          if(val.selectorText.indexOf(':hover') != -1) {
            var selector = val.selectorText.replace(/:hover/g, '');
            rule += selector + '{' + val.style.cssText + '}';
          }
        }
      });
      var elm = document.createElement('style');
      var node = document.createTextNode(rule);
      elm.type = 'text/css';
      if(elm.styleSheet) {
        elm.styleSheet.cssText = node.nodeValue;
      } else {
        elm.appendChild(node);
      }
      elm.setAttribute('data-chk-hover-style', '');
      $('head').append(elm);
    },
    removeAnchorTag: function() {
      $('[data-chk-hover-style]').remove();
      $('[data-chk-anchormanage]').contents().unwrap();
    },
    addListenerChange: function() {
      var self = this;
      $('[name=anchor]').on('change', function() {
        var value = self.getSelectedValue();
        self.switchType(value);
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

    var anchor = new AnchorManage();

    $('.chk-label').each(function() {
      $(this).powerTip({placement: 'sw-alt'});
    });
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
