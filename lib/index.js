'use strict';

(function () {

  // Stored options
  var vendorPrefixes = {},
    obfuscate = true,
    minify = false,
    optionsSet = false;
  var existingClassNames = [];
  var existingAnimationNames = [];
  var isMediaQuery = /^@media/;
  var whitespace = /[\n\r\s]/g;
  var indent = '  ';
  var messagePrefix = 'ReactStyleSheets: ';
  var headTag = document.getElementsByTagName('head')[0];
  var styleTag;

  var commaSeparatedProperties = [
    'fontFamily'
  ];

  var noSuffixProperties = [
    'opacity',
    'animationIterationCount'
  ];

  var timeSuffixProperties = [
    'transition',
    'transitionDuration',
    'transitionDelay',
    'animation',
    'animationDuration',
    'animationDelay'
  ];

  var doubleColonStyles = [
    'before',
    'after',
    'firstLetter',
    'firstLine',
    'selection'
  ];

  var nestedStyles = [
    'active',
    'after',
    'before',
    'checked',
    'disabled',
    'empty',
    'enabled',
    'firstChild',
    'firstLetter',
    'firstLine',
    'firstOfType',
    'focus',
    'hover',
    'inRange',
    'invalid',
    // 'lang', // Takes arguments
    'lastChild',
    'lastOfType',
    'link',
    // 'not', // Takes arguments
    // 'nthChild', // Takes arguments
    // 'nthLastChild', // Takes arguments
    // 'nthLastOfType', // Takes arguments
    // 'nthOfType', // Takes arguments
    'onlyOfType',
    'onlyChild',
    'optional',
    'outOfRange',
    'readOnly',
    'readWrite',
    'required',
    'root',
    'selection',
    'target',
    'valid',
    'visited'
  ];

  function warn (message) {
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn(messagePrefix + message);
    }
  }

  function error (message) {
    throw new Error(messagePrefix + message);
  }

  if (!headTag) {
    error('Could not locate head tag. Ensure your javascript is included after the closing head tag.');
  }

  styleTag = document.createElement('style');
  styleTag.setAttribute('type', 'text/css');
  headTag.appendChild(styleTag);

  function toSpinalCase (value) {
    return value.replace(/(^|[a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function formatValue (key, value) {
    if (Array.isArray(value)) {
      var separator = commaSeparatedProperties.indexOf(key) >= 0 ? ', ' : ' ';
      return value.map(formatValue.bind(null, key)).join(separator);
    } else if (typeof value === 'number') {
      if (value === 0 || noSuffixProperties.indexOf(key) >= 0) {
        return value;
      }

      if (timeSuffixProperties.indexOf(key) >= 0) {
        return value + 'ms';
      }

      return value + 'px';
    }

    return value;
  }

  function createStyles (tag, style) {
    var prefix = '\n' + tag + ' {\n';
    var nested = '';

    for (var key in style) {
      if (!isMediaQuery.test(key) && key.indexOf('-') >= 0) {
        error('Found "-" in a style property name. Style property names must be defined in camelcase.');
      }

      var value = style[key];

      if (key in vendorPrefixes) {
        // Vendor prefixes
        for (var i = 0; i < vendorPrefixes[key].length; i += 1) {
          var vendorKey = '-' + vendorPrefixes[key][i] + '-' + key;
          prefix += indent + toSpinalCase(vendorKey) + ': ' + formatValue(key, value) + ';\n';
        }

        prefix += indent + toSpinalCase(key) + ': ' + formatValue(key, value) + ';\n';
      } else if (nestedStyles.indexOf(key) >= 0) {
        // Nested styles
        if (typeof value !== 'object') {
          error('Nested styles such as hover must be an object.');
        }

        var colon = doubleColonStyles.indexOf(key) >= 0 ? '::' : ':';
        nested += createStyles(tag + colon + toSpinalCase(key), value);
      } else if (isMediaQuery.test(key)) {
        // Media queries
        if (typeof value !== 'object') {
          error('Media queries must be an object.');
        }

        nested += '\n' + key + '{\n';
        nested += createStyles(tag, value);
        nested += '\n}\n'
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // Sub styles e.g. {margin: {left, right}}
        for (var subKey in value) {
          var keySubKey = key + '-' + subKey;
          prefix += indent + toSpinalCase(keySubKey) + ': ' + formatValue(keySubKey, value[subKey]) + ';\n';
        }
      } else {
        // Basic values & arrays
        prefix += indent + toSpinalCase(key) + ': ' + formatValue(key, value) + ';\n';
      }
    }

    return prefix + '}\n' + nested;
  }

  function generateRandomString (length) {
    var concat = '';

    for (var i = 0; i < length; i += 1) {
      concat += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }

    return concat;
  }

  function generateUniqueName (className) {
    if (obfuscate) {
      var obfuscatedClassName = className + '_' + generateRandomString(5);

      while (existingClassNames.indexOf(obfuscatedClassName) >= 0) {
        obfuscatedClassName = className + '_' + generateRandomString(5);
      }

      return obfuscatedClassName;
    }

    if (existingClassNames.indexOf(className) >= 0) {
      error('The class name "' + className + '" is already in use, please choose another.');
    }

    return className;
  }

  function removeWhitespace (value) {
    return minify ? value.replace(whitespace, '') : value;
  }

  var ReactStyleSheets = {
    setOptions: function (options) {
      if (optionsSet) {
        warn('You tried to set options more than once. This is not advised.');
      }

      if (typeof options !== 'object') {
        error('Options must be an object.');
      }

      if (typeof options.vendorPrefixes !== 'undefined') {
        if (typeof options.vendorPrefixes !== 'object' || Array.isArray(options.vendorPrefixes)) {
          error('vendorPrefixes must be an object with style property names as keys, ' +
            'and arrays of prefixes as values.');
        } else {
          vendorPrefixes = options.vendorPrefixes;
        }
      }

      if (typeof options.obfuscate !== 'undefined') {
        obfuscate = options.obfuscate;
      }

      if (typeof options.minify !== 'undefined') {
        minify = options.minify;
      }

      optionsSet = true;
    },
    createTagStyleString: function (styles) {
      var concat = '';

      for (var tag in styles) {
        concat += createStyles(tag, styles[tag]);
      }

      return removeWhitespace(concat);
    },
    createClassStyleString: function (styles) {
      var concat = '';

      for (var className in styles) {
        var obfuscatedClassName = generateUniqueName(className);

        concat += createStyles('.' + className, styles[obfuscatedClassName]);

        existingClassNames.push(obfuscatedClassName);
      }

      return removeWhitespace(concat);
    },
    createGlobalTagStyles: function (styles) {
      var styleString = ReactStyleSheets.createTagStyleString(styles);
      styleTag.innerHTML = styleTag.innerHTML + removeWhitespace(styleString);
    },
    createUniqueClassStyles: function (styles) {
      var classNames = {};
      var concat = '';

      for (var className in styles) {
        var obfuscatedClassName = generateUniqueName(className);

        concat += createStyles('.' + obfuscatedClassName, styles[className]);

        classNames[className] = obfuscatedClassName;
        existingClassNames.push(obfuscatedClassName);
      }

      styleTag.innerHTML = styleTag.innerHTML + removeWhitespace(concat);

      return classNames;
    },
    createUniqueKeyframeAnimation: function (styles) {
      var animations = {};
      var concat = '';

      for (var animationName in styles) {
        var obfuscatedAnimationName = obfuscate ? generateUniqueName(animationName) : animationName;

        concat += '\n@keyframes ' + obfuscatedAnimationName + ' {\n';
        concat += ReactStyleSheets.createTagStyleString(styles[animationName]);
        concat += '\n}\n';

        animations[animationName] = obfuscatedAnimationName;
        existingAnimationNames.push(obfuscatedAnimationName);
      }

      styleTag.innerHTML = styleTag.innerHTML + removeWhitespace(concat);

      return animations;
    }
  };

  /* istanbul ignore next */

  // Export for commonjs / browserify
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = ReactStyleSheets;
  // Export for amd / require
  } else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
    define([], function () { // eslint-disable-line no-undef
      return ReactStyleSheets;
    });
  // Export globally
  } else {
    var root;

    if (typeof window !== 'undefined') {
      root = window;
    } else if (typeof global !== 'undefined') {
      root = global;
    } else if (typeof self !== 'undefined') {
      root = self;
    } else {
      root = this;
    }

    root.ReactStyleSheets = ReactStyleSheets;
  }

})();
