/*
 * jquery.fullscreen v0.6.0
 * https://github.com/private-face/jquery.fullscreen
 *
 * Copyright (c) 2012–2016 Vladimir Zhuravlev
 * Released under the MIT license
 * https://github.com/private-face/jquery.fullscreen/blob/master/LICENSE
 *
 * Date: 2016-08-25
 **/
(function(global, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], function (jQuery) {
			return factory(jQuery);
		});
	} else if (typeof exports === 'object') {
		// CommonJS/Browserify
		factory(require('jquery'));
	} else {
		// Global
		factory(global.jQuery);
	}
}(this, function($) {
function defined(a) {
    return typeof a !== "undefined";
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

var SUBST = [ [ "", "" ], [ "exit", "cancel" ], [ "screen", "Screen" ] ];

var VENDOR_PREFIXES = [ "", "o", "ms", "moz", "webkit", "webkitCurrent" ];

function native(obj, name) {
    var prefixed;
    if (typeof obj === "string") {
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
}

var ua = navigator.userAgent;

var fsEnabled = native("fullscreenEnabled");

var parsedChromeUA = ua.match(/Android.*Chrome\/(\d+)\./);

var IS_ANDROID_CHROME = !!parsedChromeUA;

var CHROME_VERSION;

var ANDROID_CHROME_VERSION;

if (IS_ANDROID_CHROME) {
    ANDROID_CHROME_VERSION = parseInt(parsedChromeUA[1]);
}

var IS_NATIVELY_SUPPORTED = (!IS_ANDROID_CHROME || ANDROID_CHROME_VERSION > 37) && defined(native("fullscreenElement")) && (!defined(fsEnabled) || fsEnabled === true);

var version = $.fn.jquery.split(".");

var JQ_LT_17 = parseInt(version[0]) < 2 && parseInt(version[1]) < 7;

var FullScreenAbstract = function() {
    this.__options = null;
    this._fullScreenElement = null;
    this.__savedStyles = {};
};

FullScreenAbstract.prototype = {
    native: native,
    _DEFAULT_OPTIONS: {
        styles: {
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            WebkitBoxSizing: "border-box"
        },
        toggleClass: null
    },
    __documentOverflow: "",
    __htmlOverflow: "",
    _preventDocumentScroll: function() {
        this.__documentOverflow = document.body.style.overflow;
        this.__htmlOverflow = document.documentElement.style.overflow;
        if (!$(this._fullScreenElement).is("body, html")) {
            $("body, html").css("overflow", "hidden");
        }
    },
    _allowDocumentScroll: function() {
        document.body.style.overflow = this.__documentOverflow;
        document.documentElement.style.overflow = this.__htmlOverflow;
    },
    _fullScreenChange: function() {
        if (!this.__options) {
            return;
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
            return;
        }
        this._revertStyles();
        this._fullScreenElement = null;
        if (e) {
            $(document).trigger("fscreenerror", [ e ]);
        }
    },
    _triggerEvents: function() {
        $(this._fullScreenElement).trigger(this.isFullScreen() ? "fscreenopen" : "fscreenclose");
        $(document).trigger("fscreenchange", [ this.isFullScreen(), this._fullScreenElement ]);
    },
    _saveAndApplyStyles: function() {
        var $elem = $(this._fullScreenElement);
        this.__savedStyles = {};
        for (var property in this.__options.styles) {
            this.__savedStyles[property] = this._fullScreenElement.style[property];
            this._fullScreenElement.style[property] = this.__options.styles[property];
        }
        if ($elem.is("body")) {
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
        if ($elem.is("body")) {
            document.documentElement.style.overflow = this.__savedStyles.overflow;
        }
        if (this.__options.toggleClass) {
            $elem.removeClass(this.__options.toggleClass);
        }
    },
    open: function(elem, options) {
        if (elem === this._fullScreenElement) {
            return;
        }
        if (this.isFullScreen()) {
            this.exit();
        }
        this._fullScreenElement = elem;
        this.__options = $.extend(true, {}, this._DEFAULT_OPTIONS, options);
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
    this.exit = $.proxy(native("exitFullscreen"), document);
    this._DEFAULT_OPTIONS = $.extend(true, {}, this._DEFAULT_OPTIONS, {
        styles: {
            width: "100%",
            height: "100%"
        }
    });
    $(document).bind(this._prefixedString("fullscreenchange") + " MSFullscreenChange", $.proxy(this._fullScreenChange, this)).bind(this._prefixedString("fullscreenerror") + " MSFullscreenError", $.proxy(this._fullScreenError, this));
};

extend(FullScreenNative, FullScreenAbstract, {
    VENDOR_PREFIXES: [ "", "o", "moz", "webkit" ],
    _prefixedString: function(str) {
        return $.map(this.VENDOR_PREFIXES, function(s) {
            return s + str;
        }).join(" ");
    },
    open: function(elem, options) {
        FullScreenNative._super.open.apply(this, arguments);
        var requestFS = native(elem, "requestFullscreen");
        requestFS.call(elem);
    },
    exit: $.noop,
    isFullScreen: function() {
        return native("fullscreenElement") !== null;
    },
    element: function() {
        return native("fullscreenElement");
    }
});

var FullScreenFallback = function() {
    FullScreenFallback._super.constructor.apply(this, arguments);
    this._DEFAULT_OPTIONS = $.extend({}, this._DEFAULT_OPTIONS, {
        styles: {
            position: "fixed",
            zIndex: "2147483647",
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        }
    });
    this.__delegateKeydownHandler();
};

extend(FullScreenFallback, FullScreenAbstract, {
    __isFullScreen: false,
    __delegateKeydownHandler: function() {
        var $doc = $(document);
        $doc.delegate("*", "keydown.fullscreen", $.proxy(this.__keydownHandler, this));
        var data = JQ_LT_17 ? $doc.data("events") : $._data(document).events;
        var events = data["keydown"];
        if (!JQ_LT_17) {
            events.splice(0, 0, events.splice(events.delegateCount - 1, 1)[0]);
        } else {
            data.live.unshift(data.live.pop());
        }
    },
    __keydownHandler: function(e) {
        if (this.isFullScreen() && e.which === 27) {
            this.exit();
            return false;
        }
        return true;
    },
    _revertStyles: function() {
        FullScreenFallback._super._revertStyles.apply(this, arguments);
        this._fullScreenElement.offsetHeight;
    },
    open: function(elem) {
        FullScreenFallback._super.open.apply(this, arguments);
        this.__isFullScreen = true;
        this._fullScreenChange();
    },
    exit: function() {
        if (!this.__isFullScreen) {
            return;
        }
        this.__isFullScreen = false;
        this._fullScreenChange();
    },
    isFullScreen: function() {
        return this.__isFullScreen;
    },
    element: function() {
        return this.__isFullScreen ? this._fullScreenElement : null;
    }
});

$.fullscreen = IS_NATIVELY_SUPPORTED ? new FullScreenNative() : new FullScreenFallback();

$.fn.fullscreen = function(options) {
    var elem = this[0];
    options = $.extend({
        toggleClass: null,
        overflow: "hidden"
    }, options);
    options.styles = {
        overflow: options.overflow
    };
    delete options.overflow;
    if (elem) {
        $.fullscreen.open(elem, options);
    }
    return this;
};return $.fullscreen;
}));