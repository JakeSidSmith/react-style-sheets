'use strict';

(function () {

  var chai = require('chai');

  // Head tags mock
  var head = [
    {
      innerHTML: ''
    }
  ];

  // Document mock
  var doc = {
    getElementsByTagName: function (query) {
      if (query === 'head') {
        return head;
      }

      return null;
    }
  };

  // Add document to global
  global.document = doc;

  chai.expect();

})();
