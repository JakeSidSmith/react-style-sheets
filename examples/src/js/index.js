'use strict';

(function () {

  var ReactStyleSheets = require('../../../lib/index');

  ReactStyleSheets.setVendorPrefixes({
    transform: ['webkit', 'moz', 'ms', 'o'],
    transformOrigin: ['webkit', 'moz', 'ms', 'o']
  });

  var bodyHtml = {
    margin: 0,
    padding: 0,
    fontFamily: ['arail', 'helvetica', 'sans-serif'],
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
      transform: 'rotate(45deg)',
      transformOrigin: '0 0'
    },
    h1: {
      margin: {
        top: 10,
        bottom: 10
      }
    }
  });

})();
