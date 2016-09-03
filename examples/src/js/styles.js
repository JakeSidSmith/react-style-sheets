'use strict';

(function () {

  var ReactStyleSheets = require('../../../lib/index');

  ReactStyleSheets.setOptions({
    minify: false,
    obfuscate: true
  });

  var htmlBody = {
    margin: 0,
    padding: 0,
    fontFamily: ['arial', 'helvetica', 'sans-serif'],
    fontSize: 14
  };

  ReactStyleSheets.createGlobalTagStyles({
    '*': {
      boxSizing: 'border-box'
    },
    html: htmlBody,
    body: htmlBody,
    a: {
      textDecoration: 'none',

      hover: {
        textDecoration: 'underline'
      }
    },
    img: {
      border: 'none'
    }
  });

})();
