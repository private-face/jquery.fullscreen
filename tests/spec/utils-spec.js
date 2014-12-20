describe('Utils', function() {

	describe('native()', function() {
		var native = $.fullscreen.native;
		// spec and opera
		var specObjElem = {
				requestFullscreen: function() {}
			},
			specObjDoc = {
				exitFullscreen: function() {},
				fullscreenEnabled: false,
				fullscreenElement: null
			};

		it('should detect unprefixed FS API properties and methods', function() {
			expect(native(specObjElem, 'requestFullscreen')).toBeDefined();
			expect(native(specObjDoc, 'exitFullscreen')).toBeDefined();
			expect(native(specObjDoc, 'fullscreenEnabled')).toBeDefined();
			expect(native(specObjDoc, 'fullscreenElement')).toBeDefined();
		});

		// webkit
		var webkitObjElem = {
				webkitRequestFullscreen: function() {}
			},
			webkitObjDoc = {
				webkitExitFullscreen: function() {},
				webkitFullscreenEnabled: false,
				webkitFullscreenElement: null
			};

		it('should detect -webkit-prefixed FS API properties and methods', function() {
			expect(native(webkitObjElem, 'requestFullscreen')).toBeDefined();
			expect(native(webkitObjDoc, 'exitFullscreen')).toBeDefined();
			expect(native(webkitObjDoc, 'fullscreenEnabled')).toBeDefined();
			expect(native(webkitObjDoc, 'fullscreenElement')).toBeDefined();
		});

		// old webkit
		var oldWebkitcObjDoc = {
				webkitCurrentFullscreenElement: null,
				webkitCancelFullscreen: function() {}
			};

		it('should detect old-webkit "webkitCancelFullscreen" methods as "exitFullscreen"', function() {
			expect(native(oldWebkitcObjDoc, 'exitFullscreen')).toBeDefined();
		});

		it('should detect old-webkit "currentFullscreenElement" methods as "fullscreenElement [#4]"', function() {
			expect(native(oldWebkitcObjDoc, 'fullscreenElement')).toBeDefined();
		});

		// mozilla
		var mozObjElem = {
				mozRequestFullScreen: function() {}
			},
			mozObjDoc = {
				mozCancelFullScreen: function() {},
				mozFullScreenEnabled: false,
				mozFullScreenElement: null
			};

		it('should detect -moz-prefixed non-standard FS API properties and methods', function() {
			expect(native(mozObjElem, 'requestFullscreen')).toBeDefined();
			expect(native(mozObjDoc, 'exitFullscreen')).toBeDefined();
			expect(native(mozObjDoc, 'fullscreenEnabled')).toBeDefined();
			expect(native(mozObjDoc, 'fullscreenElement')).toBeDefined();
		});

	});

});