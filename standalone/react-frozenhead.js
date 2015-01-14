!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ReactFrozenHead=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var
    React = (window.React),
    it = _dereq_('./it');
    head = React.DOM.head;


var isString = function (node) {
    return typeof node === 'string';
};

var isTitleNode = function (node) {
    // Ideally we would just check `tagName`, but composite components don't
    // have that.
    return (
        (React.isValidElement || React.isValidComponent)(node) &&
            node.type === 'title' ||
            (node.type && node.type.displayName === 'ReactFullPageComponenttitle') ||
            (node.type && node.type.displayName === 'title')
    );
};

var findTitle = function (children) {
    // Sucks to have to crawl the DOM descriptors like this. But how else
    // could we do it without mucking up our API?
    return it.find(it.find(children, isTitleNode), isString);
};

var FrozenHead = React.createClass({
    getInitialState: function () {
        return {
            title: findTitle(this.props.children)
        };
    },
    shouldComponentUpdate: function () {
        // Once the component is mounted in the DOM, we should never update.
        return !this.isMounted();
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.isMounted()) {
            var oldTitle = this.state.title;
                newTitle = findTitle(nextProps.children);
            if (newTitle && newTitle !== oldTitle) {
                document.title = newTitle;
                this.setState({title: newTitle});
            }
        }
    },
    render: function () {
        // This will only ever be called once because you can't update unmounted
        // components (i.e. call `setProps` or `setState` on them to trigger a
        // render) and, once the component's mounted, all future renders are
        // prevented by `shouldComponentUpdate`.
        var html = '';
        it.forEach(this.props.children, function (child) {
            // Since we don't want React to diff the DOM, we can just render to
            // static HTML without markers.
            html += (React.renderToStaticMarkup || React.renderComponentToStaticMarkup)(child);
        });
        return head({dangerouslySetInnerHTML: {__html: html}});
    }
});

module.exports = FrozenHead;

},{"./it":2}],2:[function(_dereq_,module,exports){
// React children iteration utilities.
var React = (window.React);

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

},{}]},{},[1])
(1)
});