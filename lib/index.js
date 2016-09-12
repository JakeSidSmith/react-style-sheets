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

  var doubleColonSelectors = [
    'before',
    'after',
    'firstLetter',
    'firstLine',
    'selection'
  ];

  var nestedSelectors = [
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
    /* istanbul ignore else */
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

  function removeWhitespace (value) {
    return minify ? value.replace(whitespace, '') : value;
  }

  function generateRandomString (length) {
    var concat = '';

    for (var i = 0; i < length; i += 1) {
      concat += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }

    return concat;
  }

  function generateUniqueName (name, existingNames, type) {
    if (obfuscate) {
      var obfuscatedName = name + '_' + generateRandomString(5);

      while (existingNames.indexOf(obfuscatedName) >= 0) {
        /* istanbul ignore next */
        obfuscatedName = name + '_' + generateRandomString(5);
      }

      existingNames.push(obfuscatedName);
      return obfuscatedName;
    }

    if (existingNames.indexOf(name) >= 0) {
      error('The ' + type + ' name "' + name + '" is already in use, please choose another.');
    }

    existingNames.push(name);
    return name;
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

  function createStyles (tag, style, indentation) {
    indentation = indentation || '';
    var containsStyles = false;
    var prefix = '\n' + indentation + tag + ' {\n';
    var concat = '';
    var suffix = indentation + '}\n';
    var nested = '';

    if (isMediaQuery.test(tag)) {
      error('Media queries must be nested inside your tag / class.');
    }

    for (var key in style) {
      if (!isMediaQuery.test(key) && key.indexOf('-') >= 0) {
        error('Found "-" in a style property name. Style property names must be defined in camelcase.');
      }

      var value = style[key];

      if (key in vendorPrefixes) {
        containsStyles = true;
        // Vendor prefixes
        for (var i = 0; i < vendorPrefixes[key].length; i += 1) {
          var vendorKey = '-' + vendorPrefixes[key][i] + '-' + key;
          concat += indentation + indent + toSpinalCase(vendorKey) + ': ' +
            formatValue(key, value) + ';\n';
        }

        concat += indentation + indent + toSpinalCase(key) + ': ' +
          formatValue(key, value) + ';\n';
      } else if (nestedSelectors.indexOf(key) >= 0) {
        // Nested styles
        if (typeof value !== 'object' || Array.isArray(value)) {
          error('Nested selectors such as hover, active, before, firstChild, etc, must be an object.');
        }

        var colon = doubleColonSelectors.indexOf(key) >= 0 ? '::' : ':';
        nested += createStyles(tag + colon + toSpinalCase(key), value, indentation);
      } else if (isMediaQuery.test(key)) {
        // Media queries
        if (typeof value !== 'object' || Array.isArray(value)) {
          error('Media queries must be an object.');
        }

        nested += '\n' + indentation + key + ' {\n';
        nested += createStyles(tag, value, indentation + indent);
        nested += indentation + '\n' + indentation + '}\n';
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        containsStyles = true;
        // Sub styles e.g. {margin: {left, right}}
        for (var subKey in value) {
          var keySubKey;

          if (subKey === 'all') {
            concat += indentation + indent + toSpinalCase(key) + ': ' +
              formatValue(key, value[subKey]) + ';\n';
          } else if (subKey === 'vertical') {
            keySubKey = key + '-' + 'top';
            concat += indentation + indent + toSpinalCase(keySubKey) + ': ' +
              formatValue(keySubKey, value[subKey]) + ';\n';

            keySubKey = key + '-' + 'bottom';
            concat += indentation + indent + toSpinalCase(keySubKey) + ': ' +
              formatValue(keySubKey, value[subKey]) + ';\n';
          } else if (subKey === 'horizontal') {
            keySubKey = key + '-' + 'right';
            concat += indentation + indent + toSpinalCase(keySubKey) + ': ' +
              formatValue(keySubKey, value[subKey]) + ';\n';

            keySubKey = key + '-' + 'left';
            concat += indentation + indent + toSpinalCase(keySubKey) + ': ' +
              formatValue(keySubKey, value[subKey]) + ';\n';
          } else {
            keySubKey = key + '-' + subKey;
            concat += indentation + indent + toSpinalCase(keySubKey) + ': ' +
              formatValue(keySubKey, value[subKey]) + ';\n';
          }
        }
      } else {
        containsStyles = true;
        // Basic values & arrays
        concat += indentation + indent + toSpinalCase(key) + ': ' +
          formatValue(key, value) + ';\n';
      }
    }

    return (containsStyles ? prefix + concat + suffix : '') + nested;
  }

  function createUnmodifiedIndentedStyles (styles, indentation) {
    var concat = '';

    for (var tag in styles) {
      concat += createStyles(tag, styles[tag], indentation);
    }

    return {
      keys: null,
      values: removeWhitespace(concat)
    };
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
    _createGlobalTagStyles: function (styles) {
      return createUnmodifiedIndentedStyles(styles);
    },
    createGlobalTagStyles: function (styles) {
      var generated = ReactStyleSheets._createGlobalTagStyles(styles);

      styleTag.innerHTML = styleTag.innerHTML + generated.values;
    },
    _createUniqueClassStyles: function (styles) {
      var classNames = {};
      var concat = '';

      for (var className in styles) {
        var obfuscatedClassName = generateUniqueName(className, existingClassNames, 'class');

        concat += createStyles('.' + obfuscatedClassName, styles[className]);

        classNames[className] = obfuscatedClassName;
      }

      return {
        keys: classNames,
        values: removeWhitespace(concat)
      };
    },
    createUniqueClassStyles: function (styles) {
      var generated = ReactStyleSheets._createUniqueClassStyles(styles);

      styleTag.innerHTML = styleTag.innerHTML + generated.values;

      return generated.keys;
    },
    _createUniqueKeyframeAnimations: function (styles) {
      var animations = {};
      var concat = '';

      for (var animationName in styles) {
        var obfuscatedAnimationName = generateUniqueName(animationName, existingAnimationNames, 'keyframe animation');

        var generated = createUnmodifiedIndentedStyles(styles[animationName], indent);

        if (generated.values) {
          concat += '\n@keyframes ' + obfuscatedAnimationName + ' {\n';
          concat += generated.values;
          concat += '\n}\n';
        }

        animations[animationName] = obfuscatedAnimationName;
      }

      return {
        keys: animations,
        values: removeWhitespace(concat)
      };
    },
    createUniqueKeyframeAnimations: function (styles) {
      var generated = ReactStyleSheets._createUniqueKeyframeAnimations(styles);

      styleTag.innerHTML = styleTag.innerHTML + generated.values;

      return generated.keys;
    }
  };

  /* istanbul ignore else */

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
