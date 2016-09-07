'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');

  var classNames = ReactStyleSheets.createUniqueClassStyles({
    container: {
      margin: [0, 'auto'],
      padding: {
        left: 15,
        right: 15
      },
      maxWidth: 768
    },
    center: {
      textAlign: 'center',
      marginTop: '40%'
    }
  });

  var App = React.createClass({
    render: function () {
      return (
        <div className={classNames.container}>
          <div className={classNames.center}>
            <h1>
              React Style Sheets
            </h1>
            <p>
              Hello! This is a placeholder. Come back soon and there'll be some nice content here!
            </p>
          </div>
        </div>
      );
    }
  });

  module.exports = App;

})();
