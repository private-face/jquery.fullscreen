var FullScreenFallback = function() {
	FullScreenFallback._super.constructor.apply(this, arguments);
};

extend(FullScreenFallback, FullScreenAbstract, {
	__JQ_LT_17: parseFloat($.fn.jquery) < 1.7,
	__isFullScreen: false,
	__delegateKeydownHandler: function() {
		var $doc = $(document);
		$doc.delegate('*', 'keydown.fullscreen', $.proxy(this.__keydownHandler, this));
		var data = this.__JQ_LT_17 ? $doc.data('events') : $._data(document).events;
		var events = data['keydown'];
		if (!this.__JQ_LT_17) {
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
	_init: function() {
		FullScreenFallback._super._init.apply(this, arguments);
		this.__delegateKeydownHandler();

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
	},
	element: function() {
		return this.__isFullScreen ? this._fullScreenElement : null;
	}
});
