$.when($.getScript('/script/jquery-ui.js'), $.getScript('/script/underscore.js'), $.getScript('/script/backbone.js'), $.getScript('/script/bootstrap.js')).then(
# get all required javascript, include jquery-ui.js, underscroe.js, and backbone.js 
	(e) ->
		# if the data is success to retrival
		console.log "Data is ready"
		backboneWrap()
	(e) ->
		# if any error occureed
		console.warn "Error occured"
)

backboneWrap = ->
	menudata = '/data/menuitem.json'
	MenuModel = Backbone.Model.extend()
	# make the model as null because the data will retrival from json filel

	MenuView = Backbone.View.extend
	# it's the view for menu
		initialize: ->
			console.log "It's the view"
		el: "#container > button"
		events:
			'click': 'display'
		o:
			{}
		run: (cls = 'ul_topmenu') ->
			me = @
			d = @model.get('items')
			$.each d, (k, v) ->
				if v.hasOwnProperty('subitems')
					me.o.main_title = v.title
					for x of v.subitems
						me.run(v.subitems[x], 'ul_' + v.title)
				else
					me.o =
						sub_src: v.src
						sub_title: v.title
		display: ->
			@$container.html(this.template(me.o))

	$.getJSON menudata, (d) ->
		menumodel = new MenuModel(d)

		menuview = new MenuView
			model: menumodel
			container: '#list-template'
			template: _.template($('#menu_template').html())

		menuview.run()
	

ckWindow = ->
	text: ->
		if $(window).width() >= 1200
			'wild'
		else if $(window).width() <= 980 and $(window).width() >= 768
			'big'
		else if $(window).width() < 768 and $(window).width() > 480
			'tablet'
		else if $(window).width() <= 480
			'phone'
		else
			'normal'
	isDesktop: ->
		!!($(window).width() > 980)
	isTablet: ->
		!!($(window).width() > 480 and $(window).width <= 980)
	isPhone: ->
		!!($(window).width() <= 480)
	notDesktop: ->
		!!($(window).width() < 789)
	notTablet: ->
		!!(($(window).width() < 768 and $(window).width() > 480) or $(window).width() > 980)
	notPhone: ->
		!!($(window).width() > 480)

