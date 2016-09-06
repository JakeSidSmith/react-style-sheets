'use strict';

(function () {

  var chai = require('chai');

  // Head tags mock
  var headTags = [
    {
      appendChild: function () {}
    }
  ];

  var styleTag = {
    setAttribute: function () {},
    innerHTML: ''
  };

  // Document mock
  var doc = {
    getElementsByTagName: function (query) {
      if (query !== 'head') {
        throw new Error('No mocks for getElementsByTagName with query: ' + query);
      }

      return headTags;
    },
    createElement: function (type) {
      if (type !== 'style') {
        throw new Error('No mocks for createElement with type: ' + type);
      }

      return styleTag;
    }
  };

  // Add document to global
  global.document = doc;

  chai.expect();

})();
