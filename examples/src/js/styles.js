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

  var text = {
    margin: [10, 'auto']
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
    },
    p: text,
    h1: text,
    h2: text,
    h3: text,
    h4: text,
    h5: text,
    li: text,
    ul: {
      margin: [10, 'auto'],
      paddingLeft: 20
    },
    pre: {
      padding: 5,
      borderRadius: 2,
      border: [1, 'solid', '#ccc'],
      backgroundColor: '#eee',
      overflow: 'auto'
    }
  });

})();
