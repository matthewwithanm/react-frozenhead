// React children iteration utilities.
var React = require('react');

// Iterate over each child in the children object. This is necessary because the
// ReactChildren.* methods can't be broken.
var forEach = function (children, func, context) {
    var child;
    if (Array.isArray(children)) {
        for (var i = 0, len = children.length; i < len; i++) {
            child = children[i];
            if (child != null && func.call(context, child) === false) {
                return false;
            }
        }
    } else {
        child = children;
        if (child != null && func.call(context, child) === false) {
            return false;
        }
    }
};

var walk = function (children, func, context) {
    return forEach(children, function (child) {
        if (func.call(context, child) === false) {
            return false;
        }
        if ((React.isValidElement || React.isValidComponent)(child)) {
            return walk(child.props.children, func, context);
        }
    });
};

var find = function (children, test) {
    var match;
    walk(children, function (child) {
        if (test(child)) {
            match = child;
            return false;
        }
    });
    return match;
};

module.exports = {
    forEach: forEach,
    walk: walk,
    find: find
};
