'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');

  /* styles start */
  var classNames = ReactStyleSheets.createUniqueClassStyles({
    basicHeader: {
      margin: [10, 'auto'],
      fontFamily: ['arial', 'helvetica', 'sans-serif'],
      fontSize: 24,
      fontWeight: 'normal',
      color: 'red'
    }
  });
  /* styles end */

  var Example = React.createClass({
    render: function () {
      return (
        /* markup start */
        <h2 className={classNames.basicHeader}>
          Header
        </h2>
        /* markup end */
      );
    }
  });

  module.exports = Example;

})();
