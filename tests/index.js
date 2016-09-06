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

  var expectLinesToMatch = function expectLinesToMatch (str, arr) {
    var lines = str.split('\n');

    expect(lines.length).to.equal(arr.length);

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      var matcher = arr[i];

      if (typeof matcher === 'string') {
        expect(line).to.equal(matcher);
      } else {
        expect(line).to.match(matcher);
      }
    }
  };

  describe('React Style Sheets', function () {

    beforeEach(function () {
      styleTag.innerHTML = '';
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
      var expected = [
        '',
        'p {',
        '  color: red;',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          color: 'red'
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should create class styles & add them to the style tag', function () {
      var expected = [
        '',
        /^\.myClass_[a-z]{5}\s{$/,
        '  color: red;',
        '}',
        ''
      ];

      ReactStyleSheets.createUniqueClassStyles({
        myClass: {
          color: 'red'
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should create keyframe animations & add them to the style tag', function () {
      var expected = [
        '',
        /^@keyframes\smyAnimation_[a-z]{5}\s{$/,
        '',
        '0% {',
        '  opacity: 0;',
        '}',
        '',
        '100% {',
        '  opacity: 1;',
        '}',
        '',
        '}',
        ''
      ];

      ReactStyleSheets.createUniqueKeyframeAnimation({
        myAnimation: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
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

    it('should create keyframe animations with their unique names as values', function () {
      var expected = /^myAnimation_[a-z]{5}$/;

      var animationNames = ReactStyleSheets.createUniqueKeyframeAnimation({
        myAnimation: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        }
      });

      expect(animationNames.myAnimation).to.match(expected);
    });

    it('should join arrays provided as style values', function () {
      var expected = [
        '',
        'p {',
        '  margin: 10px auto;',
        '  font-family: arial, helvetica, sans-serif;',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          margin: ['10px', 'auto'],
          fontFamily: ['arial', 'helvetica', 'sans-serif']
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

  });

})();
