'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');

  /* styles start */
  ReactStyleSheets.createGlobalTagStyles({
    ul: {
      listStyle: 'none',
      margin: [10, 'auto'],
      padding: 0
    },
    li: {
      margin: [10, 'auto'],
      before: {
        content: '""',
        display: 'block',
        width: 5,
        height: 5,
        borderRadius: '50%',
        backgroundColor: '#ccc',
        float: 'left',
        margin: {
          right: 5,
          top: 5
        }
      }
    }
  });
  /* styles end */

  var Example = React.createClass({
    render: function () {
      return (
        /* markup start */
        <ul>
          <li>
            Item 1
          </li>
          <li>
            Item 2
          </li>
          <li>
            Item 3
          </li>
        </ul>
        /* markup end */
      );
    }
  });

  module.exports = Example;

})();
