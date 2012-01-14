var NativeFullScreen = function(onStateChange) {
	NativeFullScreen._super.constructor.apply(this, arguments);

};

extend(NativeFullScreen, AbstractFullScreen, {
	_init: function() {
		NativeFullScreen._super._init.apply(this, arguments);

		$(document).bind('fullscreenchange mozfullscreenchange webkitfullscreenchange', $.proxy(this._fullScreenChange, this));
		$(document).bind('fullscreenerror mozfullscreenerror webkitfullscreenerror', $.proxy(this._fullScreenError, this));
	},
	requestFullScreen: function(elem) {
		NativeFullScreen._super.requestFullScreen.apply(this, arguments);

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
	},
	// getFullScreenElement: function() {
		/* return defined(document.fullScreenElement) && document.fullScreenElement ||
			defined(document.mozFullScreenElement) && document.mozFullScreenElement ||
			defined(document.webkitFullScreenElement) && document.webkitFullScreenElement || 
			null; */

		// since both document.fullScreenElement and document.webkitFullScreenElement doesn't work in webkit yet,
		// using this.__fullScreenElement instead
	// 	return this.__fullScreenElement;
	// }
});
