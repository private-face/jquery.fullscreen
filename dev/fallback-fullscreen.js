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

		this.exit();
		return false; // ?
	},
	_init: function() {
		FullScreenFallback._super._init.apply(this, arguments);
		
		$(document).delegate('*', 'keydown.fullscreen', $.proxy(this.__keydownHandler, this)); // use delegateFirst?
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
