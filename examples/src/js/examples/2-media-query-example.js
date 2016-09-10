'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');

  /* styles start */
  var classNames = ReactStyleSheets.createUniqueClassStyles({
    deviceDetection: {
      after: {
        content: '" mobile phone."'
      },
      '@media all and (min-width: 500px)': {
        after: {
          content: '" tablet."'
        }
      },
      '@media all and (min-width: 800px)': {
        after: {
          content: '" laptop or desktop computer."'
        }
      },
      '@media all and (min-width: 1500px)': {
        after: {
          content: '" laptop or desktop computer with a large external monitor."'
        }
      }
    }
  });
  /* styles end */

  var Example = React.createClass({
    render: function () {
      return (
        /* markup start */
        <p className={classNames.deviceDetection}>
          You are probably using a
        </p>
        /* markup end */
      );
    }
  });

  module.exports = Example;

})();
