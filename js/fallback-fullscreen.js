FallbackFullScreen = function() {
	FallbackFullScreen._super.constructor.apply(this, arguments);
};

extend(FallbackFullScreen, AbstractFullScreen, {
	__documentOverflow: '',
	_init: function() {
		FallbackFullScreen._super._init.apply(this, arguments);
		
		$(document).delegate('*', 'keydown.fullscreen', $.proxy(this._keydownHandler, this)); // delegateFirst?
		// TODO: prevent document from scrolling
	},
	_keydownHandler: function(e) {
		if (!this.isFullScreen()) {
			return true;
		}
		
		// TODO
		switch (e.which) {
			case 27:
				this.exitFullScreen();
				break;
			default:
				return true
		}

		return false;
	},
	requestFullScreen: function(elem) {
		FallbackFullScreen._super.requestFullScreen.apply(this, arguments);
		
		this._fullScreenChange();
	},
	exitFullScreen: function() {
		this._revertStyles();
		this.__fullScreenElement = null;
		this.state('fullscreen', this.isFullScreen());
	}
});
