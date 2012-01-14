function defined(a) {
	return typeof a !== 'undefined';
}

function extend(child, parent, prototype) {
    var F = function() {};
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
	parent.prototype.constructor = parent;
    child._super = parent.prototype;
    if (prototype) {
        $.extend(child.prototype, prototype);
    }
}
