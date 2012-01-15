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
	open: function(elem, options) {
		FullScreenNative._super.open.apply(this, arguments);

		var requestFS = elem.open || elem.mozRequestFullScreen || elem.webkitRequestFullScreen;
		requestFS.call(elem);
	},
	exit: function() {
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
