# jQuery.fullscreen

jQuery Fullscreen plugin allows you to open any element on a page in fullscreen mode without using Flash in all modern browsers (Firefox, IE, Chrome, Safari, Opera). If this feature is not supported by the browser then element will be just stretched to fit the screen without switching to fullscreen.

[Fullscreen API](http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html#api) is natively supported in Chrome 15+, Safari 5.1+, Firefox 10+, Opera 12.1+ and IE 11. It is also present in Firefox 9.0, but it is disabled by default. You can be enable it by setting `fullscreen-api.enabled` to `true` in `about:config`.

## Usage

### Request/exit fullscreen

```html
<div id="some_selector">
    Block to be displayed in fullscreen.
</div>

<script>
    // open element in fullscreen
    $('#some_selector').fullscreen(options);
    // close fullscreen
    $.fullscreen.exit();
</script>
```

Currently the following options are supported:
* `overflow {'hidden'}`: 'overflow' css-property, which is set to an element when it is being opened in fullscreen;
* `toggleClass {null}`: class name which is toggled when an element changes its 'fullscreen' state;

### $.fullscreen object methods

* `$.fullscreen.open(element[, options])`: equivalent to `$(element).fullscreen(options)`;
* `$.fullscreen.exit()`: exit fullscreen mode;
* `$.fullscreen.isNativelySupported() {true|false}`: returns `true` if browser supports Fullscreen API natively;
* `$.fullscreen.isFullScreen() {true|false}`: returns `true` if there is an element opened in fullscreen.

### Events

#### fscreenchange

`fscreenchange` event is sent to `window.document` when some element on the page changes its 'fullscreen' state. Three parameters are passed to an event's handler:
* jQuery.Event object
* fullscreen state (true or false)
* Element

#### fscreenopen/fscreenclose

`fscreenopen` and `fscreenclose` events are sent to an element when it's being opened in fullscreen (or exited fullscreen mode).

#### fscreenerror

`fscreenerror` event is fired on the @document@ if requested fullscreen operation could not be performed. 

## Security notes

Due to security reasons, calls like `$(...).fullscreen()`, `$.fullscreen.open()`, and `$.fullscreen.close()` are allowed only inside *user generated event* (such as click, keydown, etc...). This means that the following code will not work:
```js
$(function() {
    $('body').fullscreen();
});
```
because fullscreen here is called directly without any action from user.

## Browser support

### Native

* Firefox 10+
* Chrome 15+
* Safari 5.1+
* Opera 12.1+
* Internet Explorer 11

### Fallback

* IE 8–10 (Should work in IE7 as well, perhaps with some minor issues)

## Read more

* [FullScreen API Editor's Draft](http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html#api)
* [MDN – Using full-screen mode](https://developer.mozilla.org/en/DOM/Using_full-screen_mode)

## License

### MIT License

Copyright (c) 2016 Vladimir Zhuravlev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
