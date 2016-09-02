'use strict';

(function () {

  var ReactStyleSheets = require('../../../lib/index');

  var bodyHtml = {
    margin: 0,
    padding: 0,
    fontFamily: ['arail', 'helvetica', 'sans-serif']
  };

  ReactStyleSheets.createGlobalTagStyles({
    '*': {
      boxSizing: 'border-box'
    },
    body: bodyHtml,
    html: bodyHtml,
    p: {
      margin: [10, 0]
    },
    h1: {
      margin: {
        left: 0,
        right: 10
      }
    }
  });

})();
