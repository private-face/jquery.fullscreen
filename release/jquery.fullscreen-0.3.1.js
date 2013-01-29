/*
 * jQuery.fullscreen library v0.3.1
 * Copyright (c) 2013 Vladimir Zhuravlev
 *
 * Released under MIT License
 *
 * Date: Tue Jan 29 20:37:02 ICT 2013
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

var SUBST = [
    ['', ''],               // spec
    ['exit', 'cancel'],     // firefox & old webkits expect cancelFullScreen instead of exitFullscreen
    ['screen', 'Screen']    // firefox expects FullScreen instead of Fullscreen
];
var VENDOR_PREFIXES = ['', 'o', 'ms', 'moz', 'webkit'];

function native(obj, name) {
    var prefixed;

    if (typeof obj === 'string') {
        name = obj;
        obj = document;
    }

    for (var i = 0; i < SUBST.length; ++i) {
        name = name.replace(SUBST[i][0], SUBST[i][1]);
        for (var j = 0; j < VENDOR_PREFIXES.length; ++j) {
            prefixed = VENDOR_PREFIXES[j];
            prefixed += j === 0 ? name : name.charAt(0).toUpperCase() + name.substr(1);
            if (defined(obj[prefixed])) {
                return obj[prefixed];
            }
        }
    }

    return void 0;
}var IS_NATIVELY_SUPPORTED = defined(native('fullscreenElement'));

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
var FullScreenNative = function() {
	FullScreenNative._super.constructor.apply(this, arguments);
	this.exit = $.proxy(native('exitFullscreen'), document);
};

extend(FullScreenNative, FullScreenAbstract, {
	VENDOR_PREFIXES: ['', 'o', 'ms', 'moz', 'webkit'],
	_init: function() {
		FullScreenNative._super._init.apply(this, arguments);
		$(document)
			.bind(this._prefixedString('fullscreenchange'), $.proxy(this._fullScreenChange, this))
			.bind(this._prefixedString('fullscreenerror'), $.proxy(this._fullScreenError, this));
	},
	_prefixedString: function(str) {
		return $.map(this.VENDOR_PREFIXES, function(s) {
			return s + str;
		}).join(' ');
	},
	open: function(elem, options) {
		FullScreenNative._super.open.apply(this, arguments);
		var requestFS = native(elem, 'requestFullscreen');
		requestFS.call(elem);
	},
	exit: $.noop,
	isFullScreen: function() {
		return native('fullscreenElement') !== null;
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
	__JQ_LT_17: parseFloat($.fn.jquery) < 1.7,
	__isFullScreen: false,
	__allowedKeys: [
		// left arrow, right arrow, up arrow, down arrow, space, page up, page down, home, end, tab,
		37, 39, 38, 40, 32, 33, 34, 36, 35, 9,
		// shift, control, alt, cmd, win
		16, 17, 18, 224, 91
	],
	__delegateKeydownHandler: function() {
		var $doc = $(document);
		$doc.delegate('*', 'keydown.fullscreen', $.proxy(this.__keydownHandler, this));
		var data = this.__JQ_LT_17 ? $doc.data('events') : $._data(document).events;
		var events = data['keydown'];

		if (!this.__JQ_LT_17) {
			events.splice(0, 0, events.splice(events.delegateCount - 1, 1)[0]);
		} else {
			data.live.unshift(data.live.pop());
		}
	},
	__keydownHandler: function(e) {
		if (!this.isFullScreen() || $.inArray(e.which, this.__allowedKeys) !== -1) {
			return true;
		}
		
		this.exit();
		return false; // ?
	},
	_init: function() {
		FullScreenFallback._super._init.apply(this, arguments);
		this.__delegateKeydownHandler();

	},
	open: function(elem) {
		FullScreenFallback._super.open.apply(this, arguments);
		this.__isFullScreen = true;
		this._fullScreenChange();
	},
	exit: function() {
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
	var elem = this[0];

	options = $.extend({
		toggleClass: null,
		overflow: 'hidden'
	}, options);
	options.styles = {
		overflow: options.overflow
	};
	delete options.overflow;

	if (elem) {
		$.fullscreen.open(elem, options);
	}

	return this;
};
})(jQuery);
