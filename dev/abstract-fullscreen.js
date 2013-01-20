var IS_NATIVELY_SUPPORTED = defined(native('fullscreenElement'));

var FullScreenAbstract = function() {
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
			'zIndex': '2147483647',
			'boxSizing': 'border-box',
			'MozBoxSizing': 'border-box',
			'WebkitBoxSizing': 'border-box',
			'left': 0,
			'top': 0,
			'bottom': 0,
			'right': 0
		},
		toggleClass: '',
		documentScroll: false
	},
	__documentOverflow: '',
	_preventDocumentScroll: function() {
		if (!this.__options.documentScroll) {
			this.__documentOverflow = $('body').css('overflow');
			$('body').css('overflow', 'hidden');
		}
	},
	_allowDocumentScroll: function() {
		if (!this.__options.documentScroll) {
			$('body').css('overflow', this.__documentOverflow);
		}
	},
	_init: function() {
	},
	_fullScreenChange: function() {
		if (!this.isFullScreen()) {
			this._allowDocumentScroll();
			this._revertStyles();
			this._triggerEvents();
			this._fullScreenElement = null;
		} else {
			this._preventDocumentScroll();
			this._triggerEvents();
		}
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
			this.__savedStyles[property] = this._fullScreenElement.style[property];
			// apply
			this._fullScreenElement.style[property] = this.__options.styles[property];
		}
		if (this.__options.toggleClass) {
			$elem.addClass(this.__options.toggleClass);
		}
	},
	_revertStyles: function() {
		var $elem = $(this._fullScreenElement);
		for (var property in this.__options.styles) {
			this._fullScreenElement.style[property] = this.__savedStyles[property];
		}
		if (this.__options.toggleClass) {
			$elem.removeClass(this.__options.toggleClass);
		}
	},
	open: function(elem, options) {
		// do nothing if request is for already fullscreened element
		if (elem === this._fullScreenElement) {
			return;
		}
		// exit active fullscreen before opening another one
		if (this.isFullScreen()) {
			this.exit();
		}
		// save fullscreened element
		this._fullScreenElement = elem;
		// apply options, if any
		this.__options = $.extend(true, {}, this.__DEFAULT_OPTIONS, options);
		// save current element styles and apply new
		this._saveAndApplyStyles();
	},
	exit: null,
	isFullScreen: null,
	isNativelySupported: function() {
		return IS_NATIVELY_SUPPORTED;
	}
};
