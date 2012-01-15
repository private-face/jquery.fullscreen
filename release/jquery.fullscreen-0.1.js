/*
 * jQuery.fullscreen library v0.1
 * Copyright (c) 2012 Vladimir Zhuravlev
 * 
 * Released under MIT License
 * 
 * Date: Sun Jan 15 17:51:35 GST 2012
 **/
;(function($) {

function defined(a) {
	return typeof a !== 'undefined';
}

function extend(child, parent, prototype) {
    var F = function() {};
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
	parent.prototype.constructor = parent;
    child._super = parent.prototype;
    if (prototype) {
        $.extend(child.prototype, prototype);
    }
}
var IS_NATIVELY_SUPPORTED = defined(document.fullScreen) ||
			 defined(document.mozFullScreen) ||
			 defined(document.webkitFullScreen) || defined(document.webkitIsFullScreen);
			
var FullScreenAbstract = function(onStateChange) {
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
		// this._fullScreenChange();
	},
	_fullScreenChange: function() {
		if (!this.isFullScreen()) {
			this._allowDocumentScroll();
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
		// prevent document from scrolling
		this._preventDocumentScroll();
	},
	getFullScreenElement: function() {
		return this._fullScreenElement;
	},
	isFullScreen: null,
	isNativelySupported: function() {
		return IS_NATIVELY_SUPPORTED;
	}
};
var FullScreenNative = function(onStateChange) {
	FullScreenNative._super.constructor.apply(this, arguments);
};

extend(FullScreenNative, FullScreenAbstract, {
	_init: function() {
		FullScreenNative._super._init.apply(this, arguments);

		$(document)
			.bind('fullscreenchange mozfullscreenchange webkitfullscreenchange', $.proxy(this._fullScreenChange, this))
			.bind('fullscreenerror mozfullscreenerror webkitfullscreenerror', $.proxy(this._fullScreenError, this));
	},
	requestFullScreen: function(elem, options) {
		FullScreenNative._super.requestFullScreen.apply(this, arguments);

		var requestFS = elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen;
		requestFS.call(elem);
	},
	exitFullScreen: function() {
		var cancelFullScreen = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen;
		cancelFullScreen.call(document);
	},
	isFullScreen: function() {
		if (document.fullScreenElement && document.fullScreenElement === null ||
			defined(document.mozFullScreen) && !document.mozFullScreen ||
			defined(document.webkitIsFullScreen) && !document.webkitIsFullScreen) {
				return false;
		}
		return true;
	}/*,
	getFullScreenElement: function() {
		// document.fullScreenElement and document.webkitFullScreenElement don't work in webkit yet
		return defined(document.fullScreenElement) && document.fullScreenElement ||
			defined(document.mozFullScreenElement) && document.mozFullScreenElement ||
			defined(document.webkitFullScreenElement) && document.webkitFullScreenElement || 
			null;
	}*/
});
var FullScreenFallback = function() {
	FullScreenFallback._super.constructor.apply(this, arguments);
};

extend(FullScreenFallback, FullScreenAbstract, {
	__isFullScreen: false,
	__allowedKeys: [
		// left arrow, right arrow, up arrow, down arrow, space, page up, page down, home, end, tab,
		37, 39, 38, 40, 32, 0, 0, 0, 0, 9,
		// meta, shift, control, alt
		224, 16, 17, 18
	],
	__keydownHandler: function(e) {
		if (!this.isFullScreen()) {
			return true;
		}
		
		var key = e.which;
		for (var i = 0; i < this.__allowedKeys.length; ++i) {
			if (key === this.__allowedKeys[i]) {
				return true;
			}
		}

		this.exitFullScreen();
		return false; // ?
	},
	_init: function() {
		FullScreenFallback._super._init.apply(this, arguments);
		
		$(document).delegate('*', 'keydown.fullscreen', $.proxy(this.__keydownHandler, this)); // use delegateFirst?
	},
	requestFullScreen: function(elem) {
		FullScreenFallback._super.requestFullScreen.apply(this, arguments);
		this.__isFullScreen = true;
		this._fullScreenChange();
	},
	exitFullScreen: function() {
		this.__isFullScreen = false;
		this._fullScreenChange();
	},
	isFullScreen: function() {
		return this.__isFullScreen;
	}
});
$.fullscreen = IS_NATIVELY_SUPPORTED 
				? new FullScreenNative() 
				: new FullScreenFallback();

$.fn.fullscreen = function(options) {
	var elem = this.first()[0];

	options = $.extend({
		toggleClass: null, /* string */
		overflow: 'hidden' /* hidden|auto */
	}, options);
	options.styles = {
		overflow: options.overflow
	};
	delete options.overflow;

	if (elem) {
		$.fullscreen.requestFullScreen(elem, options);
	}

	return this;
};
})(jQuery);
