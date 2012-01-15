var IS_NATIVELY_SUPPORTED = defined(document.fullScreen) ||
			 defined(document.mozFullScreen) ||
			 defined(document.webkitFullScreen) || defined(document.webkitIsFullScreen);

var PLUGIN_DEFAULTS = {
		toggleClass: null, /* string */
		overflow: 'hidden' /* hidden|auto */
	};

$.fullscreen = IS_NATIVELY_SUPPORTED 
				? new FullScreenNative() 
				: new FullScreenFallback();

$.fn.fullscreen = function(options) {
	var elem = this.first()[0];

	options = $.extend({}, PLUGIN_DEFAULTS, options);
	options.styles = {
		overflow: options.overflow
	};
	delete options.overflow;

	if (elem) {
		$.fullscreen.requestFullScreen(elem, options);
	}

	return this;
};
