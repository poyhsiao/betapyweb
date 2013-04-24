/***
* Created by Kim Hsiao
***/

jQuery.error = console.error;
/* this is for jquery debugger */

$.when(
  $.getScript('/script/jquery-ui.js'),
  $.getScript('/script/underscore.js'),
  $.getScript('/script/backbone.js'),
  $.getScript('/script/bootstrap.js')
).then(
  function(e) {
    /* run this function when everything is ready and done */
    backboneWrap();
  },
  function(e) {
    /* run this function if anything error or fail to retrival anything above */
    console.warn("Something error");
  }
);

var backboneWrap = function() {
  /* this is the backbone object, here is the all MVC for whole site for front-end */
  var MenuModel = Backbone.Model.extend({});
  /* keep the model as blank for some of them will be retrival from the server with Ajax */
  var MenuView = Backbone.View.extend({
  /* This is the view portion for most of the object was present in this site*/
    initialize: function() {
      /* initial the view */
      console.log("The view is ready");
    },

    events: {
      /* all the event handler */
      'click .MainMenu': 'openMain',
      'click .SubMenu': 'openSub'
    },

    selector: function() {
      /* if the parameter is not correct, selector is will choose the correction method to handle the process */
    },

    run: function(cls) {
      /* handling the menu item model and will pass to createView() when the format is correct */
      if('undefined' === typeof(cls) || !this.model.get('items')) {
      /* if the data structure is not defined, will redirect to selector to choose which item function should work for */
      /* if not get items will be not the menu items */
        return this.selector();
      }
      var me = this, o = me.model.get('items'), i;
      if($.isArray(o)) {
        $.each(o, function(k, v) {
          return me.createView(cls, v);
        });
      } else {
        return me.createView(cls, o);
      }
    },

    createView: function(cls, obj) {
    /* parser for menu item data */
      var me = this, container =  $('#menu-template'), title = obj.title, src = obj.src, x, li;
      if(obj.hasOwnProperty('subitems')) {
        li = $('<li/>')
          .addClass('boxShadow')
          .text(title)
          .wrapInner('<div class="MainMenu closeMenu" opt="' + title + '" />')
          .appendTo(container.find('.' + cls));

        $('<ul />')
          .addClass('ul_' + title + ' inactive')
          .appendTo(li);

        return $.each(obj.subitems, function(k, v) {
          return me.createView(title, v);
        });
      } else {
        return $('<li />')
          .addClass('boxShadow')
          .text(title)
          .wrapInner('<div class="SubMenu" opt="' + src + '" />')
          .appendTo(container.find('.ul_' + cls));
      }
    },

    windowResize: function(o) {
      /* change window size and the resoultion */
      if(!ckWindow.notDesktop() && !$('div.borderArrow').is(':hidden')) {
        /* this only work on Desktop environment and the arrow is shown */
        changeResolution.changeArrow();
      }

      if(ckWindow.isPhone()) {
        $('div.popContent').css('height', '400px');
      /* in mobile device, set the height to fixed 400px */
      } else {
        /* if the device is not mobile phone*/
        changeResolution.changePopC();
      }
    },

    openMain: function(o) {
      /* handling the click event for main menu items, o is the current object which is clicked */
      var me = this, self = $(o.target), mainmenu = $('div.MainMenu');
      if(self.hasClass('closeMenu')) {
        mainmenu.each(function(k, v) {
          if($(v).hasClass('openMenu')) {
            $(v).removeClass('openMenu').addClass('closeMenu').siblings('ul.inactive').slideUp('slow');
          }
        });
        self.removeClass('closeMenu').addClass('openMenu').siblings('ul.inactive').slideDown('slow');
        /* open selected menu which has closeMenu class name*/

        if('undefined' === typeof($('span.maintitle').attr('opt')) || self.attr(opt) === $('span.maintitle').attr('opt')) {
          /* when switch to other menu item, hide arrow image by checking the page navigation options */
          $('div.borderArrow').show('slow');
        } else {
          $('div.borderArrow').hide();
        }
      }
    },

    openSub: function(o) {
      /* handling the click event for sub menu items*/
      var me = this, self = $(o.target), main = self.parents('ul.inactive').siblings('.MainMenu');;
      console.log(me);
      console.log('submenu');
      console.log(o);
    }
  });

  $.getJSON('/data/menuitem.json', function(d) {
    /* realtime get the menu item data */
    var menumodel, menuview;
    menumodel = new MenuModel(d);
    menuview = new MenuView({
      model: menumodel,
      /* data source */
      el: '#menu-template'
      /* triggle dom, all the events and handler will be based on this dom */
    });

    menuview.run('topmenu');
  });

  var windowview = new MenuView({
    /* work for window size and resolution changed */
    el: window,
    events: {
      'resize': 'windowResize'
    }
  });
};

var ckWindow = {
    /* check if the device resolution */
    text: function() {
        if($(window).width() >= 1200) {
            /* it's wild or large display*/
           return 'wild';
        } else if($(window).width() <= 980 && $(window).width() >= 768) {
            /* it's display between desktop and tablet */
           return 'big';
        } else if($(window).width() < 768 && $(window).width() > 480) {
            /* it's tablet */
            return 'tablet';
        } else if($(window).width() <= 480) {
            /* it's mobile phone */
           return 'phone';
        } else {
            /* it's default and normal display */
           return 'normal';
        }
    },

    isDesktop: function() {
        return $(window).width() >= 980;
    },
    isTablet: function() {
        return ($(window).width() > 480 && $(window).width() < 980);
    },
    isPhone: function() {
        return ($(window).width() <= 480);
    },
    notDesktop: function() {
        return ($(window).width() < 768);
    },
    notTablet: function() {
        return (($(window).width() < 768 && $(window).width() > 480) || ($(window).width() > 980));
    },
    notPhone: function() {
        return ($(window).width() > 480);
    }
};

changeResolution = {
  /* define relative DOM position for initial or change resolution. this is defined as private method */
  pop: $('div.popContent'),
  arrow: $('div.borderArrow'),

  changePopC: function(op) {
    /* for the height of popContent adjustment */
    var pop = this.pop;
    pop.css({
      height: function() {
        var border = 20;
        /* this is work for define all the border width */
        return $(window).height() - $('div.head').outerHeight() - $('div.info').outerHeight() - $('div.footer').outerHeight() - border + 'px';
      }
    });
    return (ckWindow.notDesktop()) ? pop.css('margin', '0px') : pop.css('margin', '0 0 0 -60px');
  },

  changeArrow: function(op) {
    /* change the position of the arrow image, if op is given as the jquery obj, the position will be located based on given op */
    var actopt = $('span.subtitle').attr('opt'),
    itm = op || $('div[opt=' + actopt +']'),
    offset = ('wild' == ckWindow.text()) ? 50 : 60,
    arrow = this.arrow;
    arrow.css({
      top: function() {
        return itm.position().top + 'px';
      },
      left: function() {
        return itm.position().left + itm.width() - offset + 'px';
      }
    });
    return op ? arrow : true;
  }
};