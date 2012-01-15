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
