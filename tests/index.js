'use strict';

(function () {

  var chai = require('chai');
  var sinon = require('sinon');
  var expect = chai.expect;
  var spy = sinon.spy;

  var ReactStyleSheets;

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
      if (query === 'head') {
        return headTags;
      }
    },
    createElement: function (type) {
      if (type === 'style') {
        return styleTag;
      }
    }
  };

  global.document = doc;

  describe('React Style Sheets', function () {

    it('should create a style tag and append it to the head tag', function () {
      var getElementsByTagNameSpy = spy(document, 'getElementsByTagName');
      var createElementSpy = spy(document, 'createElement');
      var setAttributeSpy = spy(styleTag, 'setAttribute');
      var appendChildSpy = spy(headTags[0], 'appendChild');

      ReactStyleSheets = require('../lib/index');

      expect(getElementsByTagNameSpy).to.have.been.calledWith('head');
      expect(createElementSpy).to.have.been.calledWith('style');
      expect(setAttributeSpy).to.have.been.calledWith('type', 'text/css');
      expect(appendChildSpy).to.have.been.calledWith(styleTag);
    });

  });

})();
