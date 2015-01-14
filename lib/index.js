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
