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

	if (elem) {
		$.fullscreen.requestFullScreen(elem, {
			styles: {
				overflow: options.overflow
			},
			toggleClass: options.toggleClass
		});
	}

	return this;
};
