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

  // Style tag mock
  var styleTag = {
    setAttribute: function () {},
    innerHTML: ''
  };

  // Document mock
  var doc = {
    getElementsByTagName: function (query) {
      if (query !== 'head') {
        throw new Error('No mocks for getElementsByTagName with arguments: ' + headTags);
      }

      return headTags;
    },
    createElement: function (type) {
      if (type !== 'style') {
        throw new Error('No mocks for createElement with arguments: ' + styleTag);
      }

      return styleTag;
    }
  };

  // Add document to global
  global.document = doc;

  describe('React Style Sheets', function () {

    beforeEach(function () {
      styleTag.innerHTML = '';
      expect(styleTag.innerHTML).to.equal('');
    });

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

    it('should create tag styles & add them to the style tag', function () {
      var expected = '\np {\n  color: red;\n}\n';

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          color: 'red'
        }
      });

      expect(styleTag.innerHTML).to.equal(expected);
    });

    it('should create class styles & add them to the style tag', function () {
      var expected = /^\n\.myClass_[a-z]{5}\s{\n\s\scolor:\sred;\n}\n$/;

      ReactStyleSheets.createUniqueClassStyles({
        myClass: {
          color: 'red'
        }
      });

      expect(styleTag.innerHTML).to.match(expected);
    });

    it('should create an object for class styles with their unique names as values', function () {
      var expected = /^myClass_[a-z]{5}$/;

      var classNames = ReactStyleSheets.createUniqueClassStyles({
        myClass: {
          color: 'red'
        }
      });

      expect(classNames.myClass).to.match(expected);
    });

  });

})();
