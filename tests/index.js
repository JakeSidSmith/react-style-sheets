'use strict';

(function () {

  var chai = require('chai');
  var sinon = require('sinon');
  var expect = chai.expect;
  var spy = sinon.spy;
  var stub = sinon.stub;

  var ReactStyleSheets;
  var aReactStyleSheetsError = /^ReactStyleSheets:\s.{10,}/;

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

  var getElementsByTagNameSpy = spy(document, 'getElementsByTagName');
  var createElementSpy = spy(document, 'createElement');
  var setAttributeSpy = spy(styleTag, 'setAttribute');
  var appendChildSpy = spy(headTags[0], 'appendChild');

  var warnOriginal = console.warn;
  var warnStub = stub(console, 'warn', function (message) {
    if (!aReactStyleSheetsError.test(message)) {
      warnOriginal(message);
    }
  });

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

  var clearModuleCache = function clearModuleCache (path) {
    delete require.cache[require.resolve(path)];
  };

  describe('React Style Sheets', function () {

    beforeEach(function () {
      styleTag.innerHTML = '';
    });

    afterEach(function () {
      warnStub.reset();
      getElementsByTagNameSpy.reset();
      createElementSpy.reset();
      setAttributeSpy.reset();
      appendChildSpy.reset();
    });

    it('should create a style tag and append it to the head tag', function () {
      ReactStyleSheets = require('../lib/index');

      expect(getElementsByTagNameSpy).to.have.been.calledWith('head');
      expect(createElementSpy).to.have.been.calledWith('style');
      expect(setAttributeSpy).to.have.been.calledWith('type', 'text/css');
      expect(appendChildSpy).to.have.been.calledWith(styleTag);
    });

    it('should error if there is no head tag available', function () {
      clearModuleCache('../lib/index');
      var orignalHeadTags = headTags;
      headTags = [];

      expect(require.bind(null, '../lib/index')).to.throw(aReactStyleSheetsError);

      headTags = orignalHeadTags;
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
      expect(ReactStyleSheets.setOptions).to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.setOptions.bind(null, {vendorPrefixes: 'nope'})).to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.setOptions.bind(null, {vendorPrefixes: []})).to.throw(aReactStyleSheetsError);
    });

    it('should error if the same class / keyframe animation name is defined twice when not obfuscating', function () {
      ReactStyleSheets.setOptions({
        obfuscate: false
      });

      var styles = {
        myClass: {
          color: 'red'
        }
      };

      var keyframes = {
        myAnimation: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 0
          }
        }
      };

      ReactStyleSheets.createUniqueClassStyles(styles);
      expect(ReactStyleSheets.createUniqueClassStyles.bind(null, styles)).to.throw(aReactStyleSheetsError);

      ReactStyleSheets.createUniqueKeyframeAnimations(keyframes);
      expect(ReactStyleSheets.createUniqueKeyframeAnimations.bind(null, keyframes)).to.throw(aReactStyleSheetsError);

      ReactStyleSheets.setOptions({
        obfuscate: true
      });
    });

    it('should error if a style name has hyphens in it', function () {
      var mediaQuery = {
        myClass: {
          '@media all and (min-width: 758px)': {
            backgroundColor: 'red'
          }
        }
      };

      var hyphenatedClassName = {
        'my-class': {
          backgroundColor: 'red'
        }
      };

      var hyphenatedStyleName = {
        myClass: {
          'background-color': 'red'
        }
      };

      expect(ReactStyleSheets.createUniqueClassStyles.bind(null, mediaQuery))
        .not.to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.createUniqueClassStyles.bind(null, hyphenatedClassName))
        .not.to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.createUniqueClassStyles.bind(null, hyphenatedStyleName))
        .to.throw(aReactStyleSheetsError);
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
        '  0% {',
        '    opacity: 0;',
        '  }',
        '',
        '  100% {',
        '    opacity: 1;',
        '  }',
        '',
        '}',
        ''
      ];

      ReactStyleSheets.createUniqueKeyframeAnimations({
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

      var animationNames = ReactStyleSheets.createUniqueKeyframeAnimations({
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
        '  padding-top: 10px;',
        '  padding-bottom: 10px;',
        '  padding-right: 0;',
        '  padding-left: 0;',
        '  border: 1px solid transparent;',
        '  border-top: 1px solid red;',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        p: {
          margin: {
            top: 10,
            bottom: 20
          },
          padding: {
            vertical: 10,
            horizontal: 0
          },
          border: {
            all: [1, 'solid', 'transparent'],
            top: [1, 'solid', 'red']
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

    it('should throw an error if a nested selectors value is not an object', function () {
      var nullValue = {
        a: {
          hover: null
        }
      };

      var arrayValue = {
        a: {
          hover: []
        }
      };

      var numberValue = {
        a: {
          hover: 1
        }
      };

      expect(ReactStyleSheets.createGlobalTagStyles.bind(null, nullValue)).not.to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.createGlobalTagStyles.bind(null, arrayValue)).to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.createGlobalTagStyles.bind(null, numberValue)).to.throw(aReactStyleSheetsError);
    });

    it('should create styles containing media queries', function () {
      var expected = [
        '',
        'h1 {',
        '  color: black;',
        '}',
        '',
        '@media all and (min-width: 768px) {',
        '',
        '  h1 {',
        '    color: red;',
        '  }',
        '',
        '}',
        ''
      ];

      ReactStyleSheets.createGlobalTagStyles({
        h1: {
          color: 'black',
          '@media all and (min-width: 768px)': {
            color: 'red'
          }
        }
      });

      expectLinesToMatch(styleTag.innerHTML, expected);
    });

    it('should throw an error if media queries are not nested', function () {
      var nonNestedMediaQuery = {
        '@media all and (min-width: 768px)': {
          h1: {
            color: 'black',
          }
        }
      };

      expect(ReactStyleSheets.createGlobalTagStyles.bind(null, nonNestedMediaQuery)).to.throw(aReactStyleSheetsError);
    });

    it('should throw an error if a media queries value is not an object', function () {
      var nullValue = {
        a: {
          '@media all and (min-width: 768px)': null
        }
      };

      var arrayValue = {
        a: {
          '@media all and (min-width: 768px)': []
        }
      };

      var numberValue = {
        a: {
          '@media all and (min-width: 768px)': 1
        }
      };

      expect(ReactStyleSheets.createGlobalTagStyles.bind(null, nullValue)).not.to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.createGlobalTagStyles.bind(null, arrayValue)).to.throw(aReactStyleSheetsError);
      expect(ReactStyleSheets.createGlobalTagStyles.bind(null, numberValue)).to.throw(aReactStyleSheetsError);
    });

    it('should minify the created styles if minify is set to true', function () {
      var expectedNotMinified = [
        '',
        'p {',
        '  color: red;',
        '}',
        ''
      ];

      var expectedMinified = 'p{color:red;}';

      var styles = {
        p: {
          color: 'red'
        }
      };

      ReactStyleSheets.setOptions({
        minify: false
      });

      ReactStyleSheets.createGlobalTagStyles(styles);
      expectLinesToMatch(styleTag.innerHTML, expectedNotMinified);

      styleTag.innerHTML = '';

      ReactStyleSheets.setOptions({
        minify: true
      });

      ReactStyleSheets.createGlobalTagStyles(styles);
      expect(styleTag.innerHTML).to.equal(expectedMinified);
    });

  });

})();
