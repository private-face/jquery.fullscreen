var FullScreen = function() {
	this._init();
};

$.extend(FullScreen, {
	IS_NATIVELY_SUPPORTED: defined(document.fullScreen) ||
				 defined(document.mozFullScreen) ||
				 defined(document.webkitFullScreen) || defined(document.webkitIsFullScreen),
	PLUGIN_DEFAULTS: {
		toggleClass: null, /* string */
		overflow: 'hidden' /* hidden|auto */
	}
});

FullScreen.prototype = {
	/* private: */
	__fullScreenElement: null,
	__fs: null,
	__options: {},
	__savedStyles: '',
	
	/* protected: */
	_init: function() {
		var stateChangeProxy = $.proxy(this._fsStateChange, this);
		this.setOptions({});
		this.__fs = FullScreen.IS_NATIVELY_SUPPORTED 
					? new NativeFullScreen(stateChangeProxy) 
					: new FallbackFullScreen(stateChangeProxy);
	},
	_fsStateChange: function(key, value) {
		var elem;

		switch (key) {
			case 'fullscreen':
					elem = this.__fs.getFullScreenElement();
					$(document).trigger('fscreenchange', [value, elem]);
					
					if (elem) {
						$(elem).trigger('fscreenopen');
						this.__fullScreenElement = elem;
					} else {
						this._restoreStyles();
						$(this.__fullScreenElement).trigger('fscreenclose')
						this.__fullScreenElement = null;
					}
					break;
		}
	},
	_saveAndApplyStyles: function(elem) {
		if (this.__options.toggleClass) {
			$(elem).addClass(this.__options.toggleClass);
		}
	},
	_restoreStyles: function(elem) {
		if (this.__options.toggleClass) {
			$(this.__fullScreenElement).removeClass(this.__options.toggleClass);
		}
	},
	
	/* public: */
	isSupported: FullScreen.IS_NATIVELY_SUPPORTED,
	setOptions: function(options) {
		this.__options = $.extend({}, FullScreen.PLUGIN_DEFAULTS, options);
	},
	isFullScreen: function() {
		return this.__fs.isFullScreen();
	},
	goFullScreen: function(elem) {
		this._saveAndApplyStyles(elem);
		this.__fs.requestFullScreen(elem);
	},
	exitFullScreen: function() {
		this.__fs.exitFullScreen();
	},
	toggleFullScreen: function(elem) {
		this[this.__fs.isFullScreen() ? 'exitFullScreen' : 'goFullScreen'](elem);
	}
};

$.fullscreen = new FullScreen();

$.fn.fullscreen = function(/*OPTIONAL*/ options, /*OPTIONAL*/ state) {
	var elem = this.first()[0];

	if (!elem) {
		return this;
	}

	if (typeof options !== 'object') {
		if (typeof options === 'boolean') {
			state = options;
		}
		options = null;
	}
	
	if (options) {
		$.fullscreen.setOptions(options);
	}
	

	if (typeof state !== 'boolean') {
		// toggle
		$.fullscreen.toggleFullScreen(elem);
	} else {
		if (state) {
			// go fullscreen
			$.fullscreen.goFullScreen(elem);
		} else {
			// exit fullscreen
			$.fullscreen.exitFullScreen();
		}
		
	}

	return this;
};
