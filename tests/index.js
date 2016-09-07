'use strict';

(function () {

  var chai = require('chai');
  var sinon = require('sinon');
  var expect = chai.expect;
  var spy = sinon.spy;
  var stub = sinon.stub;

  var ReactStyleSheets;
  var warnStub = stub(console, 'warn');
  var anError = /^ReactStyleSheets:\s.*/;

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

    afterEach(function () {
      warnStub.reset();
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

    it('should warn if options are set twice', function () {
      ReactStyleSheets.setOptions({
        obfuscate: true
      });

      expect(warnStub).not.to.have.been.called;

      ReactStyleSheets.setOptions({
        obfuscate: true
      });

      expect(warnStub).to.have.been.calledOnce;
    });

    it('should error if invalid options are provided', function () {
      expect(ReactStyleSheets.setOptions).to.throw(anError);
      expect(ReactStyleSheets.setOptions.bind(null, {vendorPrefixes: 'nope'})).to.throw(anError);
      expect(ReactStyleSheets.setOptions.bind(null, {vendorPrefixes: []})).to.throw(anError);
    });

    it('should error if the same class name is defined twice when not obfuscating', function () {
      ReactStyleSheets.setOptions({
        obfuscate: false
      });

      var styles = {
        myClass: {
          color: 'red'
        }
      };

      ReactStyleSheets.createUniqueClassStyles(styles);

      expect(ReactStyleSheets.createUniqueClassStyles.bind(null, styles)).to.throw(anError);

      ReactStyleSheets.setOptions({
        obfuscate: true
      });
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

    it('should spinal-case style names', function () {
      var expected = [
        '',
        'p {',
        '  box-sizing: border-box;',
        '  font-family: arial;',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          boxSizing: 'border-box',
          fontFamily: 'arial'
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
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

    it('should handle nesting object styles', function () {
      var expected = [
        '',
        'p {',
        '  margin-top: 10px;',
        '  margin-bottom: 20px;',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          margin: {
            top: 10,
            bottom: 20
          }
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should suffix time values with ms', function () {
      var expected = [
        '',
        'p {',
        '  transition: ease-in-out 1000ms 0 all;',
        '  animation: name 500ms linear infinite;',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          transition: ['ease-in-out', 1000, 0, 'all'],
          animation: ['name', 500, 'linear', 'infinite']
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should suffix pixel values with px', function () {
      var expected = [
        '',
        'p {',
        '  opacity: 0.5;',
        '  margin: 10px auto;',
        '  padding-left: 20px;',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          opacity: 0.5,
          margin: [10, 'auto'],
          paddingLeft: 20
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should auto prefix predefined styles', function () {
      var expected = [
        '',
        'p {',
        '  -webkit-transform: rotate(45deg);',
        '  -moz-transform: rotate(45deg);',
        '  -ms-transform: rotate(45deg);',
        '  -o-transform: rotate(45deg);',
        '  transform: rotate(45deg);',
        '  -webkit-box-sizing: border-box;',
        '  -moz-box-sizing: border-box;',
        '  box-sizing: border-box;',
        '}',
        ''
      ];

      ReactStyleSheets.setOptions({
        vendorPrefixes: {
          transform: ['webkit', 'moz', 'ms', 'o'],
          boxSizing: ['webkit', 'moz']
        }
      });

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          transform: 'rotate(45deg)',
          boxSizing: 'border-box'
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should create styles for nested selectors', function () {
      var expected = [
        '',
        'a {',
        '  text-decoration: none;',
        '}',
        '',
        'a:hover {',
        '  text-decoration: underline;',
        '}',
        '',
        'a::before {',
        '  content: ">";',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        a: {
          textDecoration: 'none',
          hover: {
            textDecoration: 'underline'
          },
          before: {
            content: '">"'
          }
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should allow nesting selectors', function () {
      var expected = [
        '',
        'a {',
        '}',
        '',
        'a:hover {',
        '}',
        '',
        'a:hover::before {',
        '  content: ">";',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        a: {
          hover: {
            before: {
              content: '">"'
            }
          }
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

  });

})();
