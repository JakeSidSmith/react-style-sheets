'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');

  /* styles start */
  var animations = ReactStyleSheets.createUniqueKeyframeAnimations({
    spin: {
      '0%': {
        transform: 'rotate(0deg)'
      },
      '100%': {
        transform: 'rotate(360deg)'
      }
    }
  });

  var classNames = ReactStyleSheets.createUniqueClassStyles({
    loadingSpinner: {
      position: 'relative',
      margin: 'auto',
      width: 48,
      height: 48,
      before: {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: {
          all: [2, 'solid', 'transparent'],
          top: [2, 'solid', '#13a889']
        },
        animation: [animations.spin, 1000, 'linear', 'infinite']
      },
      after: {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '25%',
        width: '50%',
        height: '50%',
        borderRadius: '50%',
        border: {
          all: [2, 'solid', 'transparent'],
          bottom: [2, 'solid', '#13a889']
        },
        animation: [animations.spin, 2000, 'linear', 'infinite', 'reverse']
      }
    }
  });
  /* styles end */

  var Example = React.createClass({
    render: function () {
      return (
        /* markup start */
        <div className={classNames.loadingSpinner} />
        /* markup end */
      );
    }
  });

  module.exports = Example;

})();
