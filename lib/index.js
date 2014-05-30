var
    React = require('react'),
    it = require('./it');
    head = React.DOM.head;


var isString = function (node) {
    return typeof node === 'string';
};

var isTitleNode = function (node) {
    // Ideally we would just check `tagName`, but composite components don't
    // have that.
    return node.type.displayName === 'ReactFullPageComponenttitle';
};

var findTitle = function (children) {
    // Sucks to have to crawl the DOM descriptors like this. But how else
    // could we do it without mucking up our API?
    return it.find(it.find(children, isTitleNode), isString);
};

var FrozenHead = React.createClass({
    shouldComponentUpdate: function () {
        // Once the component is mounted in the DOM, we should never update.
        return !this.isMounted();
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.isMounted()) {
            document.title = findTitle(nextProps.children);
        }
    },
    render: function () {
        var html = '';
        it.forEach(this.props.children, function (child) {
            // Since we don't want React to diff the DOM, we can just render to
            // static HTML without markers.
            html += React.renderComponentToStaticMarkup(child);
            return false;
        });
        return head({dangerouslySetInnerHTML: {__html: html}});
    }
});

module.exports = FrozenHead;
