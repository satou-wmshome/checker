(function() {

  var LeftPanel = function() {
    this.$elm = $('#chk-leftpanel');
    this.$body_elm = $('.mod-body');
    this.$pushpin_elm = $('.chk-pushpin');
    this.open_width = 230;
    this.close_width = 0;
    this.close();
    this.addListenerClose();
    this.addListenerHold();
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
      this.$body_elm.on('click', function() {
        if(self.$pushpin_elm.attr('class').indexOf('hold') < 0) {
          self.close();
        }
      });
    },
    addListenerHold: function() {
      var self = this;
      this.$pushpin_elm.children('svg').on('click', function() {
        self.$pushpin_elm.toggleClass('hold');
      });
    }
  };

  var Form = function() {
    this.$elm = $('form[name=settings]');
    this.$submit_elm = $('.submit_btn');
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
          var elm = document.createElement('input');
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
      this.$submit_elm.on('click', function() {
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
      this.$elm.on('click', function() {
        $('.chk-panel').css('display', 'none');
        self.$elm.removeClass('on');
        var panel_id = '#' + $(this).attr('data-chk-tab');
        $(panel_id).css('display', 'block');
        $(this).addClass('on');
      });
    }
  };

  var Accordion = function() {
    this.$elm = $('.chk-accordion_h');
    this.addListenerAcc();
  };
  Accordion.prototype = {
    addListenerAcc: function() {
      this.$elm.on('click', function() {
        $(this).next().slideToggle();
        $(this).toggleClass('closed');
      });
    }
  };

  var PartLabel = function() {
    this.$elm = $('.chk-label');
    this.partInfo();
    this.addListenerAcc();
  };
  PartLabel.prototype = {
    partInfo: function() {
      this.$elm.each(function() {
        $(this).powerTip({placement: 'sw-alt'});
      });
    },
    addListenerAcc: function() {
      this.$elm.on('click', function() {
        $(this).next().slideToggle();
      });
    }
  };

  var FirstChild = function() {
    this.$elm;
    this.setElement();
    this.addFirstChild();
  };
  FirstChild.prototype = {
    setElement: function() {
      this.$elm = $('[data-cms-element-group]');
    },
    removeFirstChild: function() {
      this.$elm.each(function() {
        $(this).children().removeClass('ex-first-child');
      });
    },
    addFirstChild: function() {
      this.$elm.each(function() {
        $(this).children().each(function() {
          if($(this).css('display').indexOf('none') < 0) {
            $(this).addClass('ex-first-child');
            return false;
          }
        });
      });
    }
  };

  var ExStyle = function() {
    this.input_name = 'ex-style';
    this.$input_elm = $('[name=' + this.input_name + ']');
    this.$elm = $('.chk-label');
    this.addListenerChange();
  };
  ExStyle.prototype = {
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
      this.$input_elm.on('change', function() {
        var cls_name = $('[name=' + self.input_name + ']:checked').val();
        self.removeExClass();
        self.addExClass(cls_name);
      });
    }
  };

  var ExOthersStyle = function(input_name, target) {
    this.target = target || 'normal';
    this.input_name = input_name;
    this.$input_elm = $('[name=' + this.input_name + ']');
    this.$parts_elm;
    this.setElement();
    this.values = this.getValues();
    this.addListenerChange();
  };
  ExOthersStyle.prototype = {
    setElement: function() {
      this.$parts_elm = (this.target == 'normal') ? $('[data-parts-name]') : $('[data-parts-name]').find(this.target);
    },
    getValues: function() {
      var res = null;
      var tmp = '';
      this.$input_elm.each(function() {
        tmp += $(this).val() + ' ';
      });
      res = tmp.split(' none ')[0];
      return res;
    },
    removeExClass: function() {
      var self = this;
      this.$parts_elm.each(function() {
        $(this).removeClass(self.values);
      });
    },
    addExClass: function(cls_name) {
      if(cls_name !== 'none') {
        this.$parts_elm.each(function() {
          $(this).addClass(cls_name);
        });
      }
    },
    addListenerChange: function() {
      var self = this;
      this.$input_elm.on('change', function() {
        var value = $('[name=' + self.input_name + ']:checked').val();
        self.removeExClass();
        self.addExClass(value);
      });
    }
  };

  var AnchorManage = function() {
    this.input_name = 'anchor';
    this.$input_elm = $('[name=' + this.input_name + ']');
    this.$elm_banner;
    this.$elm_heading;
    this.$elm_div_heading;
    this.$elm_table_td;
    this.$elm_text;
    this.$elm_wysiwyg_li;
    this.$elm_wysiwyg_p;
    this.anchor_tag = '<a href="#" data-chk-anchormanage></a>';
    this.sapn_tag = '<span data-chk-anchormanage></span>';
    this.setElement();
    this.addListenerChange();
  };
  AnchorManage.prototype = {
    setElement: function() {
      this.$elm_banner = $('[data-cms-editable=banner]');
      this.$elm_heading = $('[data-cms-editable=heading]');
      this.$elm_div_heading = $('div[data-cms-editable=heading]');
      this.$elm_table_td = $('[class*=mod-table]').find('th, td');
      this.$elm_text = $('[data-cms-editable=text]');
      this.$elm_wysiwyg_li = $('[data-cms-editable=wysiwyg]').find('li');
      this.$elm_wysiwyg_p = $('[data-cms-editable=wysiwyg]').children('p');
    },
    anchorType: function(type) {
      switch(type) {
        case 'link':
          this.addAnchorTag();
          break;
        case 'hover':
          this.addAnchorTag();
          this.makeHover();
          break;
      }
    },
    addAnchorTag: function() {
      this.$elm_banner.wrap(this.anchor_tag);
      this.$elm_banner.find('[data-cms-editable=text]').children('a').wrapInner(this.sapn_tag).children('span').unwrap();
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
      this.$input_elm.on('change', function() {
        var value = $('[name=' + self.input_name + ']:checked').val();
        self.removeAnchorTag();
        self.anchorType(value);
      });
    }
  };

  var SwitchableManage = function(first_child) {
    this.input_name = 'switchable';
    this.$input_elm = $('[name=' + this.input_name + ']');
    this.$elm;
    this.first_child = first_child;
    this.setElement();
    this.addListenerChange();
  };
  SwitchableManage.prototype = {
    setElement: function() {
      this.$elm = $('[data-cms-switchable=false]');
    },
    switchable: function(sw_flg) {
      if(sw_flg == 'true') {
        this.$elm.css('display', 'none');
      } else {
        this.$elm.removeAttr('style');
      }
      $.heighter();
    },
    firstChildControl: function() {
      this.first_child.setElement();
      this.first_child.removeFirstChild();
      this.first_child.addFirstChild();
    },
    addListenerChange: function() {
      var self = this;
      this.$input_elm.on('change', function() {
        var value = $('[name=' + self.input_name + ']:checked').val();
        self.switchable(value);
        self.firstChildControl();
      });
    }
  };

  var StepManage = function(switchable, ex_align, anchor, rte_fs_change) {
    this.input_name = 'flowstep';
    this.$input_elm = $('[name=' + this.input_name + ']');
    this.$elm = $('[data-cms-part=step]');
    this.switchable = switchable;
    this.ex_align = ex_align;
    this.anchor = anchor;
    this.rte_fs_change = rte_fs_change;
    this.addListenerChange();
  };
  StepManage.prototype = {
    addStep: function(step_cnt) {
      this.$elm.each(function() {
        var step_frame = $(this).find('[data-cms-step]');
        var step_tag = $(this).find('script').text();
        step_frame.html('');
        for(var i = 1; i < Number(step_cnt) + 1; i++) {
          var ins_tag = step_tag.replace(/<%- step_number %>/g, i);
          step_frame.append(ins_tag);
        }
      });
    },
    switchableControl: function() {
      var value = $('[name=' + this.switchable.input_name + ']:checked').val();
      this.switchable.setElement();
      this.switchable.switchable(value);
      this.switchable.firstChildControl();
    },
    exAlignControl: function() {
      var value = $('[name=' + this.ex_align.input_name + ']:checked').val();
      this.ex_align.setElement();
      this.ex_align.removeExClass();
      this.ex_align.addExClass(value);
    },
    anchorControl: function() {
      var value = $('[name=' + this.anchor.input_name + ']:checked').val();
      this.anchor.setElement();
      this.anchor.removeAnchorTag();
      this.anchor.anchorType(value);
    },
    rteFsChangeControl: function() {
      var value = $('[name=' + this.rte_fs_change.input_name + ']').val();
      this.rte_fs_change.setElement();
      this.rte_fs_change.removeFontSizeTag();
      this.rte_fs_change.changeFontSize(value);
    },
    addListenerChange: function() {
      var self = this;
      this.$input_elm.on('change', function() {
        var value = $(this).val();
        self.addStep(value);
        self.switchableControl();
        self.exAlignControl();
        self.anchorControl();
        self.rteFsChangeControl();
      });
    }
  };

  var RTEFontSizeChange = function() {
    this.input_name = 'rtefs';
    this.$input_elm = $('[name=' + this.input_name + ']');
    this.$elm_heading;
    this.$elm_heading_h4;
    this.$elm_heading_h5;
    this.$elm_text;
    this.$elm_wysiwyg;
    this.setElement();
    this.addListenerChange();
  };
  RTEFontSizeChange.prototype = {
    setElement: function() {
      this.$elm_heading = $('[data-cms-editable="heading"]').find('p, .mod-h');
      this.$elm_heading_h4 = $('h4[data-cms-editable="heading"]');
      this.$elm_heading_h5 = $('h5[data-cms-editable="heading"]');
      this.$elm_text = $('[data-cms-editable="text"]');
      this.$elm_wysiwyg = $('[data-cms-editable="wysiwyg"]').find('li, th, td');
      this.$elm_wysiwyg_p = $('[data-cms-editable="wysiwyg"]').children('p');
    },
    removeFontSizeTag: function() {
      $('[data-chk-rtefontsizechange]').contents().unwrap();
    },
    changeFontSize: function(size) {
      size = size.replace(/\s+/g, "");
      if(isFinite(size) && size !== '') {
        var tag = '<span style="font-size:' + size + 'px;" data-chk-rtefontsizechange></span>';
        this.$elm_heading.wrapInner(tag);
        this.$elm_heading_h4.wrapInner(tag);
        this.$elm_heading_h5.wrapInner(tag);
        this.$elm_text.wrapInner(tag);
        this.$elm_wysiwyg.wrapInner(tag);
        this.$elm_wysiwyg_p.wrapInner(tag);
      }
    },
    addListenerChange: function() {
      var self = this;
      this.$input_elm.on('change', function() {
        self.removeFontSizeTag();
        self.changeFontSize($(this).val());
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
    var part_label = new PartLabel();
    var first_child = new FirstChild();
    var ex_style = new ExStyle();
    var ex_img_size = new ExOthersStyle('ex-imgSize');
    var ex_img_layout = new ExOthersStyle('ex-imgLayout');
    var ex_img_float = new ExOthersStyle('ex-imgFloat');
    var ex_align = new ExOthersStyle('ex-align', '[data-cms-editable-heading]');
    var anchor = new AnchorManage();
    var switchable = new SwitchableManage(first_child);
    var rte_fs_change = new RTEFontSizeChange();
    var flowstep = new StepManage(switchable, ex_align, anchor, rte_fs_change);

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
