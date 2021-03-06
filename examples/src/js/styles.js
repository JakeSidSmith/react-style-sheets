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
    margin: [20, 'auto']
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
    hr: {
      margin: {
        vertical: 40
      },
      height: 0,
      border: {
        horizontal: 'none',
        top: 'none',
        bottom: [1, 'solid', '#ccc']
      }
    },
    pre: {
      padding: 5,
      borderRadius: 2,
      border: [1, 'solid', '#eee'],
      backgroundColor: '#fafafa',
      overflow: 'auto',
      fontFamily: 'monospace',
      fontSize: 14
    },
    textarea: {
      width: '100%',
      maxWidth: '100%',
      fontFamily: 'monospace',
      fontSize: 14
    }
  });

  ReactStyleSheets.createGlobalTagStyles({
    h1: {
      fontSize: 28
    },
    h2: {
      fontSize: 24
    },
    h3: {
      fontSize: 20
    },
    h4: {
      fontSize: 16
    },
    h5: {
      fontSize: 14
    }
  });

})();
