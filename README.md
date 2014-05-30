react-frozenhead
================


Why?
----

Rendering the same React app on the client and server is awesome, but `<head>`s
are problematic. They need to be rendered on the server so that the page has the
right title tag and metadata, but browsers freak out if you try to update them
in the DOM. So normally, you can't include the `<head>` in your app, which makes
them a big pain.

react-frozenhead is the solution for this problem.

Write your application as normal, but use this component in place of
`React.DOM.head`:

```jsx
var React = require('react'),
    FrozenHead = require('react-frozenhead'); // Or `window.ReactFrozenHead`

var App = React.createClass({
    // snip
    render: function () {
        if (this.state.page === 'page1') {
            return (
                <html>
                    <FrozenHead>
                        <title>Page 1</title>
                        <meta name="description" content="This is Page 1" />
                    </FrozenHead>
                    <body>
                        Welcome to Page 1
                    </body>
                </html>
            );
        } else if (this.state.page === 'page2') {
            return (
                <html>
                    <FrozenHead>
                        <title>Page 2</title>
                        <meta name="description" content="This is Page 2" />
                    </FrozenHead>
                    <body>
                        Welcome to Page 2
                    </body>
                </html>
            );
        } else {
            // snip
        }
    }
});
```

When you render the app on the server, the `<head>` will be rendered with the
appropriate contents; however, when you switch between the two pages *the DOM
won't be updated*.


And the title will be right?
----------------------------

Yup.

The page title of a client-side app needs to be updated using `document.title`,
whereas the title of a server-rendered page is derived from the DOM.
react-frozenhead always does what's appropriate. So, with the code above, the
application will be rendered with the correct title in the document but, after
being mounted, will translate subsequent changes to the `<title>` tag into
`document.title` assignments.
