'use strict';

(function () {

  var ReactStyleSheets = require('../../../lib/index');

  ReactStyleSheets.setOptions({
    obfuscate: true,
    minify: false,
    vendorPrefixes: {
      transform: ['webkit', 'moz', 'ms', 'o'],
      transformOrigin: ['webkit', 'moz', 'ms', 'o']
    }
  });

  var bodyHtml = {
    margin: 0,
    padding: 0,
    fontFamily: ['arail', 'helvetica', 'sans-serif'].join(', '),
    fontSize: 14
  };

  ReactStyleSheets.createGlobalTagStyles({
    '*': {
      boxSizing: 'border-box'
    },
    body: bodyHtml,
    html: bodyHtml,
    p: {
      margin: [10, 0],
      transform: 'rotate(10deg)',
      transformOrigin: '0 0',
      opacity: 0.5,
      hover: {
        color: 'red',
        before: {
          content: '">"'
        }
      }
    },
    h1: {
      margin: {
        top: 10,
        bottom: 10
      }
    }
  });

  var classNames = ReactStyleSheets.createUniqueClassStyles({
    myClass: {
      color: 'green'
    }
  });

  console.log(classNames);

})();
