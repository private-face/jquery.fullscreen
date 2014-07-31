$(function() {

	describe('jquery.fullscreen', function() {
		var fscreenState, fscreenElement,
			fscreenOpen, fscreenClose;

		$(document).bind('fscreenchange', function(e, fs, fe) {
			fscreenState = fs;
			fscreenElement = fe;
		});

		$('body').bind('fscreenopen', function() {
			fscreenOpen = true;
		});

		$('body').bind('fscreenclose', function() {
			fscreenClose = true;
		});

		$('body').bind('click.open', function(e) {
			$(this).fullscreen({
				toggleClass: "fscreen"
			});
			$('body').unbind('.open');
			e.stopImmediatePropagation();
		});

		$('body').bind('click.close', function(e) {
			$.fullscreen.exit();
			$('body').unbind('.close');
			return false;
		});

		// check browser is not in fs mode
		it('should not be in fullscreen mode', function() {
			expect($.fullscreen.isFullScreen()).toBeFalsy();
		});

		// checking fs mode
		describe('go fullscreen', function() {

			// check event "fscreenchange" fired on document
			it('event "fscreenchange" should be fired on document', function() {
				$('.specSummary').last().append('<h4>click on the page to continue testing...</h4>');
				waitsFor(function() {
					return fscreenState === true;
				}, '"fscreenchange" to be fired', 60000);
			});

			// check event "fscreenopen" fired on element
			it('event "fscreenopen" should be fired on element', function() {
				$('.specSummary h4').remove();
				expect(fscreenOpen).toBeTruthy();
			});

			it('body should be passed in "fscreenopen" as current fullscreen element', function() {
				expect(fscreenElement).toBe(document.body);
			});

			// check browser is in fs mode
			it('should be in fullscreen mode', function() {
				expect($.fullscreen.isFullScreen()).toBeTruthy();
			});

			// check fs element
			it('body should be current fullscreen element', function() {
				expect($.fullscreen.element()).toBe(document.body);
			});

			// check fs element has class 'fscreen'
			it('body should have "fscreen" class', function() {
				expect($('body').hasClass('fscreen')).toBeTruthy();
			});
		});


		// checking exit fs
		describe('exit fullscreen', function() {
			// check event "fscreenchange" fired on document
			it('event "fscreenchange" should be fired on document', function() {
				$('.specSummary').last().append('<h4>click on the page again to continue testing...</h4>');
				waitsFor(function() {
					return fscreenState === false;
				}, '"fscreenchange" to be fired', 60000);
			});

			// check event "fscreenclose" fired on element
			it('event "fscreenclose" should be fired on element', function() {
				$('.specSummary h4').remove();
				expect(fscreenClose).toBeTruthy();
			});

			// check browser is not in fs mode
			it('should not be in fullscreen mode', function() {
				expect($.fullscreen.isFullScreen()).toBeFalsy();
			});

			it('current fullscreen element should be null', function() {
				expect($.fullscreen.element()).toBe(null);
			});

			// check exfs element has no class 'fscreen'
			it('body should not have "fscreen" class', function() {
				expect($('body').hasClass('fscreen')).toBeFalsy();
			});

			// check $.fullscreen.exit() does not throw an error [#23]
			it('should not throw an error if not in fullscreen already [#23]', function() {
				var exit = $.proxy($.fullscreen.exit, $.fullscreen);
				expect(exit).not.toThrow();
			});
		});


	});

});
