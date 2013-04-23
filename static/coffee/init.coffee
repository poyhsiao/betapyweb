###
Initial javascript

Auther: Kim Hsiao
###

# load all necessary javascript once 

#extraData(v, 'menu_root');

# check and close the other open menu items 

# open selected closed menu item 

# when switch to other menu item, hide arrow item 

# change the style and add arrow 

# add pagenation and also add click to go back original page option 
$.when($.getScript("/script/jquery-ui.js"), $.getScript("/script/bootstrap.js"), $.getScript("/script/underscore.js"), $.getScript("/script/backbone.js"), $.getJSON("/data/menuitem.json", (d) ->
  $.each d.items, (k, v) ->
    extraData v, "ul_topmenu"

  $("div.MainMenu").on "click", ->
    if $(this).hasClass("closeMenu")
      $("div.MainMenu").each (k, v) ->
        $(this).removeClass("openMenu").addClass("closeMenu").siblings("ul.inactive").slideUp "slow"  if $(this).hasClass("openMenu")

      $(this).removeClass("closeMenu").addClass("openMenu").siblings("ul.inactive").slideDown "slow"
      if "undefined" is typeof ($("span.maintitle").attr("opt")) or $(this).attr("opt") is $("span.maintitle").attr("opt")
        $("div.borderArrow").show "slow"
      else
        $("div.borderArrow").hide()

  $("div.SubMenu").on("click", ->
    me = $(this)
    main = undefined
    changeResolution.changeArrow(me).addClass("hidden-phone").fadeIn()
    changeResolution.changePopC(me).fadeIn "slow"
    $("div.selectItem").removeClass("selectItem").removeClass("itemHover").addClass "SubMenu"
    me.addClass "selectItem"
    main = me.parents("ul.inactive").siblings(".MainMenu")
    $("span.maintitle").attr("opt", main.attr("opt")).text(main.text()).css("cursor", "pointer").on "click", ->
      $("div[opt=" + main.attr("opt") + "]").trigger "click"

    $("span.subtitle").attr("opt", me.attr("opt")).text(me.text()).css("cursor", "pointer").on "click", ->
      $("div[opt=" + main.attr("opt") + "]").trigger "click"

  ).on "mouseenter mouseleave", ->
    $(this).toggleClass("itemHover").toggleClass "SubMenu"  unless $(this).hasClass("selectItem")

)).done ->
  main = $("div.MainMenu")[0]
  $(main).trigger "click"
  $(main).siblings().find("div:first").addClass("itemHover").trigger("click").removeClass "SubMenu"


# initial open the first menu item
extraData = (d, cls) ->
  
  # handling main menu as tree structure 
  template = $("#menu-template")
  cl = (if ("undefined" is typeof (cls)) then "ul_topmenu" else cls)
  if d.hasOwnProperty("subitems")
    li = $("<li/>").addClass("boxShadow").text(d.title).wrapInner("<div class=\"MainMenu closeMenu\" opt=\"" + d.title + "\" />").appendTo(template.find("ul." + cl))
    cl = "ul_" + d.title
    $("<ul/>").addClass(cl + " inactive").appendTo li
    for x of d.subitems
      extraData d.subitems[x], cl
  else
    $("<li/>").addClass("boxShadow").text(d.title).wrapInner("<div class=\"SubMenu\" opt=\"" + d.src + "\" />").appendTo template.find("ul." + cl)

changeResolution =
  
  # define relative DOM position for initial or change resolution 
  pop: $("div.popContent")
  arrow: $("div.borderArrow")
  changePopC: (op) ->
    
    # for the height of popContent adjustment 
    @pop.css height: ->
      border = 20
      
      # this is work for define all the border width 
      $(window).height() - $("div.head").outerHeight() - $("div.info").outerHeight() - $("div.footer").outerHeight() - border + "px"

    (if (ckWindow.notDesktop()) then @pop.css("margin", "0px") else @pop.css("margin", "0 0 0 -60px"))
    
    # if the device is not the desktop, then remove margin 
    (if (op) then @pop else true)

  changeArrow: (op) ->
    
    # change the position of the arrow image, if op is given as the jquery obj, the position will be located based on given op 
    actopt = $("span.subtitle").attr("opt")
    itm = op or $("div[opt=" + actopt + "]")
    offset = (if ("wild" is ckWindow.text()) then 50 else 60)
    
    # the bias of the dialog, only wild will be 50, the other's are 60 
    @arrow.css
      top: ->
        itm.position().top + "px"

      left: ->
        itm.position().left + itm.width() - offset + "px"

    
    # this work for wild screen 
    (if op then @arrow else true)

ckWindow =
  
  # check if the device resolution 
  text: ->
    if $(window).width() >= 1200
      
      # it's wild or large display
      "wild"
    else if $(window).width() <= 980 and $(window).width() >= 768
      
      # it's display between desktop and tablet 
      "big"
    else if $(window).width() < 768 and $(window).width() > 480
      
      # it's tablet 
      "tablet"
    else if $(window).width() <= 480
      
      # it's mobile phone 
      "phone"
    else
      
      # it's default and normal display 
      "normal"

  isDesktop: ->
    $(window).width() >= 980

  isTablet: ->
    $(window).width() > 480 and $(window).width() < 980

  isPhone: ->
    $(window).width() <= 480

  notDesktop: ->
    $(window).width() < 768

  notTablet: ->
    ($(window).width() < 768 and $(window).width() > 480) or ($(window).width() > 980)

  notPhone: ->
    $(window).width() > 480

$(window).on "resize", ->
  
  # window resize handler 
  
  # this only work on Desktop environment and the arrow is shown 
  changeResolution.changeArrow()  if not ckWindow.notDesktop() and not $("div.borderArrow").is(":hidden")
  if ckWindow.isPhone()
    $("div.popContent").css "height", "400px"
  
  # in mobile device, set the height to fixed 400px 
  else
    
    # if the device is not mobile phone
    changeResolution.changePopC()
