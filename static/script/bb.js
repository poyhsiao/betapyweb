/***
* Created by Kim Hsiao
***/

(function() {
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
      console.log("Data is ready");
      backboneWrap();
    },
    function(e) {
      /* run this function if anything error or fail to retrival anything above */
      console.warn("Something error");
    }
  );

  var backboneWrap = function() {
    /* this is the backbone object, here is the all MVC for whole site for front-end */
    var menuRawdata = '/data/menuitem.json';
    /* this is the menu data and structure of the site */
    var MenuModel = Backbone.Model.extend({});
    /* keep the model as blank for some of them will be retrival from the server with Ajax */
    var MenuView = Backbone.View.extend({
    /* This is the view portion for most of the object was present in this site*/
      initialize: function() {
        /* initial the view */
        console.log("The view is ready");
      },

      events: {
        'click': 'execItem'
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

      execItem: function() {
        /* handling the click event for menu items */
        var me = this;
        console.log(me);
      }
    });

    $.getJSON(menuRawdata, function(d) {
      /* initial the menu item structure */
      var menumodel, menuview;
      menumodel = new MenuModel(d);
      menuview = new MenuView({
        model: menumodel,
        /* data source */
        el: '#container button'
        /* triggle dom */
      });

      menuview.run('topmenu');
    });
  };
}).call(this);