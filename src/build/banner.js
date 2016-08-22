/*
 * <%= pkg.name %> v<%= pkg.version %>
 * https://github.com/private-face/jquery.fullscreen
 *
 * Copyright (c) 2012–<%= grunt.template.today("yyyy") %> Vladimir Zhuravlev
 * Released under the MIT license
 * https://github.com/private-face/jquery.fullscreen/blob/master/LICENSE
 *
 * Date: <%= grunt.template.today("yyyy-mm-dd") %>
 **/
(function(global, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], function (jQuery) {
			return factory(jQuery);
		});
	} else if (typeof exports === 'object') {
		// CommonJS/Browserify
		factory(require('jquery'));
	} else {
		// Global
		factory(global.jQuery);
	}
}(this, function($) {
