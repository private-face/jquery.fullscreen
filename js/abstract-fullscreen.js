FullScreenAbstract = function(onStateChange) {
	this.onStateChange = typeof onStateChange === 'function' ? onStateChange : $.noop;
	this.__state = {
		fullscreen: false
	};
	this.__options = null;
	this._fullScreenElement = null;
	this.__savedStyles = {};

	this._init();
};

FullScreenAbstract.prototype = {
	__DEFAULT_OPTIONS: {
		styles: {
			'width': '100%',
			'height': '100%',
			'position': 'fixed',
			'z-index': '2147483647',
			'box-sizing': 'border-box',
			'left': 0,
			'top': 0,
			'bottom': 0,
			'right': 0
		},
		toggleClass: ''
	},
	_init: function() {
		// this._fullScreenChange();
	},
	_fullScreenChange: function() {
		if (!this.isFullScreen()) {
			this._revertStyles();
			this._triggerEvents();
			this._fullScreenElement = null;
		} else {
			this._triggerEvents();
		}
		this.state('fullscreen', this.isFullScreen());
	},
	_fullScreenError: function() {
		this._revertStyles();
		this._fullScreenElement = null;
	},
	_triggerEvents: function() {
		$(this._fullScreenElement).trigger(this.isFullScreen() ? 'fscreenopen' : 'fscreenclose');
		$(document).trigger('fscreenchange', [this.isFullScreen(), this._fullScreenElement]);
	},
	_saveAndApplyStyles: function() {
		var $elem = $(this._fullScreenElement);
		this.__savedStyles = {};
		for (var property in this.__options.styles) {
			// save
			this.__savedStyles[property] = $elem.css(property);
			// apply
			$elem.css(property, this.__options.styles[property]);
		}
		if (this.__options.toggleClass) {
			$elem.addClass(this.__options.toggleClass);
		}
	},
	_revertStyles: function() {
		var $elem = $(this._fullScreenElement);
		for (var property in this.__options.styles) {
			$elem.css(property, this.__savedStyles[property]);
		}
		if (this.__options.toggleClass) {
			$elem.removeClass(this.__options.toggleClass);
		}
	},
	// get/set with onchange notification
	state: function(key, value) {
		if (!defined(key)) {
			return;
		}
		if (defined(value) && this.__state[key] !== value) {
			this.__state[key] = value;
			this.onStateChange(key, value);
		}
		return this.__state[key];
	},
	requestFullScreen: function(elem, options) {
		// do nothing if request is for already fullscreened element
		if (elem === this._fullScreenElement) {
			return;
		}
		// exit active fullscreen before opening another one
		if (this.isFullScreen()) {
			this.exitFullScreen();
		}
		// save fullscreened element
		this._fullScreenElement = elem;
		// apply options, if any
		this.__options = $.extend(true, {}, this.__DEFAULT_OPTIONS, options);
		// save current element styles and apply new
		this._saveAndApplyStyles();
	},
	getFullScreenElement: function() {
		return this._fullScreenElement;
	},
	isFullScreen: null
};