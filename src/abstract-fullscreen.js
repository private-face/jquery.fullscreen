var ua = navigator.userAgent;
var fsEnabled = native('fullscreenEnabled');

var parsedChromeUA = ua.match(/Android.*Chrome\/(\d+)\./);
var IS_ANDROID_CHROME = !!parsedChromeUA;
var CHROME_VERSION;
var ANDROID_CHROME_VERSION;

if (IS_ANDROID_CHROME) {
	ANDROID_CHROME_VERSION = parseInt(parsedChromeUA[1]);
}

var IS_NATIVELY_SUPPORTED = 
		(!IS_ANDROID_CHROME || ANDROID_CHROME_VERSION > 37) &&
		 defined(native('fullscreenElement')) && 
		(!defined(fsEnabled) || fsEnabled === true);

var version = $.fn.jquery.split('.');
var JQ_LT_17 = (parseInt(version[0]) < 2 && parseInt(version[1]) < 7);

var FullScreenAbstract = function() {
	this.__options = null;
	this._fullScreenElement = null;
	this.__savedStyles = {};
};

FullScreenAbstract.prototype = {
	'native': native,
	_DEFAULT_OPTIONS: {
		styles: {
			'boxSizing': 'border-box',
			'MozBoxSizing': 'border-box',
			'WebkitBoxSizing': 'border-box'
		},
		toggleClass: null
	},
	__documentOverflow: '',
	__htmlOverflow: '',
	_preventDocumentScroll: function() {
		this.__documentOverflow = document.body.style.overflow;
		this.__htmlOverflow = document.documentElement.style.overflow;
		if(!$(this._fullScreenElement).is('body, html')){
			$('body, html').css('overflow', 'hidden');
		}
	},
	_allowDocumentScroll: function() {
		document.body.style.overflow = this.__documentOverflow;
		document.documentElement.style.overflow = this.__htmlOverflow;
	},
	_fullScreenChange: function() {
		if (!this.__options) {
			return; // only process fullscreenchange events caused by this plugin
		}
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
	_fullScreenError: function(e) {
		if (!this.__options) {
			return; // only process fullscreenchange events caused by this plugin
		}
		this._revertStyles();
		this._fullScreenElement = null;
		if (e) {
			$(document).trigger('fscreenerror', [e]);
		}
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
		if ($elem.is('body')) {
			// in order to manipulate scrollbar of BODY in Chrome/OPR
			// you have to change 'overflow' property HTML element
			document.documentElement.style.overflow = this.__options.styles.overflow;
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
		if ($elem.is('body')) {
			// in order to manipulate scrollbar of BODY in Chrome/OPR
			// you have to change 'overflow' property HTML element
			document.documentElement.style.overflow = this.__savedStyles.overflow;
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
		this.__options = $.extend(true, {}, this._DEFAULT_OPTIONS, options);
		// save current element styles and apply new
		this._saveAndApplyStyles();
	},
	exit: null,
	isFullScreen: null,
	isNativelySupported: function() {
		return IS_NATIVELY_SUPPORTED;
	}
};
