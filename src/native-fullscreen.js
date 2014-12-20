var FullScreenNative = function() {
	FullScreenNative._super.constructor.apply(this, arguments);
	this.exit = $.proxy(native('exitFullscreen'), document);
	this._DEFAULT_OPTIONS = $.extend(true, {}, this._DEFAULT_OPTIONS, {
		'styles': {
			'width': '100%',
			'height': '100%'
		}
	});
	$(document)
		.bind(this._prefixedString('fullscreenchange') + ' MSFullscreenChange', $.proxy(this._fullScreenChange, this))
		.bind(this._prefixedString('fullscreenerror') + ' MSFullscreenError', $.proxy(this._fullScreenError, this));
};

extend(FullScreenNative, FullScreenAbstract, {
	VENDOR_PREFIXES: ['', 'o', 'moz', 'webkit'],
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
	},
	element: function() {
		return native('fullscreenElement');
	}
});
