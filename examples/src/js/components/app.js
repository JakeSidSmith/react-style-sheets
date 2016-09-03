'use strict';

(function () {

  var React = require('react');
  var ReactDOM = require('react-dom');
  var ReactStyleSheets = require('../../../../lib/index');

  var classNames = ReactStyleSheets.createUniqueClassStyles({
    container: {
      margin: [0, 'auto'],
      padding: {
        left: 15,
        right: 15
      },
      maxWidth: 768
    }
  });

  var App = React.createClass({
    render: function () {
      return (
        <div className={classNames.container}>
          <h1>
            React Style Sheets
          </h1>
          <h2>
            About
          </h2>
          <p>
            React Style Sheets allows defining styles in your javascript similarly to React Native,
            with additional
          </p>
        </div>
      );
    }
  });

  module.exports = App;

})();
