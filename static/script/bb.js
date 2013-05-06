/***
* Created by Kim Hsiao
***/

// jQuery.error = console.error;
/* this is for jquery debugger */

$.when(
  // $.getScript('/script/jquery-ui.js'),
  $.getScript('/script/underscore.js'),
  $.getScript('/script/backbone.js'),
  $.getScript('/script/bootstrap.js')
).then(
  function(e) {
    /* run this function when everything is ready and done */
    backboneWrap();
    /* Backbone implementation */
  }, function(e) {
    /* run this function if anything error or fail to retrival anything above */
    console.error("Something error");
    console.error(e);
    // return window.location.reload()
  }, function(e) {
    // this is the progress callback
    return true;
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
    },

    selector: function() {
      /* if the parameter is not correct, selector is will choose the correction method to handle the process */
    },

    viewMenu: function(o) {
      /* display the menu items */
      var me = this, template = _.template($('#t_mainmenu').html());
      me.$el.html(template(me.model.attributes));
    },

    runWindowResize: function(o) {
      if(!ckWindow.notDesktop() && !$('div.borderArrow').is(':hidden')) {
        return changeResolution.changeArrow();
      } else {
        $('div.borderArrow').hide();
      }

      if(ckWindow.notDesktop()) {
        return $('div.popContent').css('height', '400px');
      /* in mobile device, set the height to fixed 400px */
      } else {
        /* if the device is not mobile phone*/
        return changeResolution.changePopC();
      }
      // changeResolution.changeArrow().fadeIn('slow');
    },

    runMain: function(o) {
      /* handling the click event for main menu items, o is the current object which is clicked */
      var me = this, self = $(o.target), mainmenu = $('div.MainMenu');
      console.log(self.attr('opt'));
      console.log(self);
      if(self.hasClass('closeMenu')) {
        mainmenu.each(function(k, v) {
          if($(v).hasClass('openMenu')) {
            $(v).removeClass('openMenu').addClass('closeMenu').siblings('ul.inactive').slideUp('slow');
          }
        });
        self.removeClass('closeMenu').addClass('openMenu').siblings('ul.inactive').slideDown('slow');
        /* open selected menu which has closeMenu class name*/

        if('undefined' === typeof($('span.maintitle').attr('opt')) || self.attr('opt') === $('span.maintitle').attr('opt')) {
          /* when switch to other menu item, hide arrow image by checking the page navigation options */
          $('div.borderArrow').show('slow');
        } else {
          $('div.borderArrow').hide();
        }
      }
    },

    runSub: function(o) {
      /* handling the click event for sub menu items*/
      var me = this, self = $(o.target), main = self.parents('ul.inactive').siblings('.MainMenu'), model, view;

      $('div.selectItem').removeClass('selectItem').addClass('SubMenu').removeClass('itemHover');
      /* fix sometimes will lost all the classname */
      self.removeClass('SubMenu').addClass('selectItem');

      model = new MenuModel({
        "opt": main.attr('opt'),
        "maintitle": main.text(),
        "subtitle": self.text()
      });

      view = new MenuView({
        el: "#Paganation",
        model: model,
        events: {
          'click .maintitle': 'runPagination',
          'click .subtitle': 'runPagination'
        }
      });

      changeResolution.changePopC(self).fadeIn('slow');
      changeResolution.changeArrow(self).fadeIn('slow');

      return view.viewPagination();
    },

    viewPagination: function(o) {
      /* paga navigation display */
      var me = this, template = _.template($('#t_pagnation').html());
      return me.$el.html(template(me.model.attributes));
    },

    runPagination: function(o) {
      /* when click item on page navigation will triggle menu click event */
      var me = this, opt = $(o.target).attr('opt');
      $('div[opt=' +  opt + ']').trigger('click');
    },

    runHoverSub: function(o) {
      /* when mouse enter or leave the sub item, will change the style */
      var me = this, self = $(o.target);
      if(!self.hasClass('selectItem')) {
        self.toggleClass('itemHover').toggleClass('SubMenu');
        /* add/remove itemHover / SubMenu for hover handle */
      }
    },

    runLogout: function(o) {
      /* logout the page */
      window.location = '/logout';
    }
  });

  $.getJSON('/data/menuitem.json', function(d) {
    /* realtime get the menu item data */
    var menumodel, menuview, bodyview;
    menumodel = new MenuModel(d);
    menuview = new MenuView({
      model: menumodel,
      /* data source */
      el: '#menu-template',
      /* triggle dom, all the events and handler will be based on this dom */
      events: {
        'click .MainMenu': 'runMain',
        'click .SubMenu': 'runSub',
        'click .itemHover': 'runSub',
        'mouseenter .SubMenu': 'runHoverSub',
        'mouseleave .itemHover': 'runHoverSub'
      }
    });

    // menuview.run('topmenu');
    menuview.viewMenu();

    var windowview = new MenuView({
      /* work for window size and resolution changed */
      el: window,
      events: {
        'resize': 'runWindowResize'
      }
    });

    $('div.MainMenu:first').trigger('click');
    $('div.SubMenu:first').trigger('click');
    /* initial the view, open every first item of the menu as default */

    bodyview = new MenuView({
      el: 'div.info',
      events: {
        'click #oLogout': 'runLogout'
      }
    });
    /* bind other main page components */
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

var changeResolution = {
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
    pop = $('div.popContent'),
    itm = op || $('div[opt=' + actopt +']'),
    // offset = ('wild' == ckWindow.text()) ? 40 : 50,
    bias = -30,
    offset = -60,
    arrow = this.arrow;
    arrow.css({
      top: function() {
        return itm.position().top + 'px';
      },
      left: function() {
        console.log(pop.position().left);
        // return itm.position().left + itm.width() - offset + 'px';
        return pop.position().left + bias + offset + 'px';
      }
    }).addClass('hidden-phone');
    return op ? arrow : true;
  }
};