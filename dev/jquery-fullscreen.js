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
		$.fullscreen.open(elem, options);
	}

	return this;
};
