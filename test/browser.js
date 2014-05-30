var assert = chai.assert,
    html = React.DOM.html,
    title = React.DOM.title,
    FrozenHead = ReactFrozenHead;

var page = function (pageTitle) {
    return (
        html(null,
            FrozenHead(null,
                title(null, pageTitle)
            )
        )
    );
};

var App = React.createClass({
    getDefaultProps: function () {
        return {title: 'HOME'};
    },
    render: function () {
        return page(this.props.title);
    }
});

describe('react-frozenhead', function () {
    beforeEach(function () { document.title = 'NONE'; });

    it('renders the initial title', function () {
        var app = App({title: 'INITIAL'}),
            html = React.renderComponentToString(app);
        assert.include(html, '<title>INITIAL</title>');
    });

    it("doesn't update the DOM title after mounting", function (done) {
        var container = document.createElement('div');
            app = React.renderComponent(App({title: 'INITIAL'}), container);
        app.setProps({title: 'NEW'}, function () {
            var titleEl = container.querySelector('title');
            assert.equal(titleEl.text, 'INITIAL');
            done();
        });
    });

    it('changes the page title using document.title after mounting', function (done) {
        var container = document.createElement('div');
            app = React.renderComponent(App({title: 'INITIAL'}), container);
        app.setProps({title: 'NEW'}, function () {
            assert.equal(document.title, 'NEW');
            done();
        });
    });
});
