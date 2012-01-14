AbstractFullScreen = function(onStateChange) {
	this.onStateChange = typeof onStateChange === 'function' ? onStateChange : $.noop;
	this.__state = {
		fullscreen: false
	};
	this.__fullScreenElement = null;
	this.__savedStyles = {};

	this._init();
};

AbstractFullScreen.prototype = {
	_styles: {
		'width': '100%',
		'height': '100%',
		'position': 'fixed',
		'z-index': '2147483647',
		'left': 0,
		'top': 0,
		'bottom': 0,
		'right': 0
	},
	_init: function() {
		this._fullScreenChange();
	},
	_fullScreenChange: function() {
		if (!this.isFullScreen()) {
			this._revertStyles();
			this.__fullScreenElement = null;
		}
		this.state('fullscreen', this.isFullScreen());
	},
	_fullScreenError: function() {
		this._revertStyles();
		this.__fullScreenElement = null;
	},
	_saveAndApplyStyles: function() {
		this.__savedStyles = {};
		for (var property in this._styles) {
			// save
			this.__savedStyles[property] = $(this.__fullScreenElement).css(property);
			// apply
			$(this.__fullScreenElement).css(property, this._styles[property]);
		}
	},
	_revertStyles: function() {
		for (var property in this._styles) {
			$(this.__fullScreenElement).css(property, this.__savedStyles[property]);
		}
	},
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
	requestFullScreen: function(elem) {
		// do nothing if request is for already fullscreened element
		if (elem === this.__fullScreenElement) {
			return;
		}
		// exit active fullscreen before opening another one
		if (this.isFullScreen()) {
			this.exitFullScreen();
		}
		// save fullscreened element
		this.__fullScreenElement = elem;
		// save current element styles and apply new
		this._saveAndApplyStyles();
	},
	getFullScreenElement: function() {
		return this.__fullScreenElement;
	},
	isFullScreen: function() {
		return !!this.__fullScreenElement;
	}
	// exitFullScreen: function() {
	// 	this._revertStyles();
	// };
};