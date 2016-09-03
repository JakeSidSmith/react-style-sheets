'use strict';

(function () {

  // Stored options
  var vendorPrefixes, obfuscate, optionsSet = false;
  var existingClassNames = [];
  var shouldNotHaveValueSuffix = /^(opacity)$/;
  var indent = '  ';
  var messagePrefix = 'ReactStyleSheets: ';

  var headTag = document.getElementsByTagName('head')[0];

  if (!headTag) {
    throw new Error(
      messagePrefix + 'Could not locate head tag. Ensure your javascript is included after the closing head tag.'
    );
  }

  var styleTag = document.createElement('style');
  styleTag.setAttribute('type', 'text/css');
  headTag.appendChild(styleTag);

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

  function toSpinalCase (value) {
    return value.replace(/(^|[a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function formatValue (key, value) {
    if (Array.isArray(value)) {
      return value.map(formatValue.bind(null, key)).join(' ');
    } else if (typeof value === 'number') {
      if (value === 0 || shouldNotHaveValueSuffix.test(key)) {
        return value;
      }

      return value + 'px';
    }

    return value;
  }

  function createStyles (tag, style) {
    var prefix = '\n' + tag + ' {\n';
    var nested = '';

    if (tag.indexOf('-') >= 0) {
      throw new Error(messagePrefix + 'Found "-" in a tag or class name. Tag and class names must be camelcase.');
    }

    for (var key in style) {
      if (key.indexOf('-') >= 0) {
        throw new Error(messagePrefix + 'Found "-" in a style property name. Style property names must be defined in camelcase.');
      }

      var value = style[key];

      // Vendor prefixes
      if (key in vendorPrefixes) {
        for (var i = 0; i < vendorPrefixes[key].length; i += 1) {
          var vendorKey = '-' + vendorPrefixes[key][i] + '-' + key;
          prefix += indent + toSpinalCase(vendorKey) + ': ' + formatValue(vendorKey, value) + ';\n';
        }

        prefix += indent + toSpinalCase(key) + ': ' + formatValue(key, value) + ';\n';
      // Nested styles
      } else if (nestedStyles.indexOf(key) >= 0) {
        if (typeof value !== 'object') {
          throw new Error(messagePrefix + 'Nested styles such as hover must be an object.');
        }

        var colon = doubleColonStyles.indexOf(key) >= 0 ? '::' : ':';
        nested += createStyles(tag + colon + key, value);
      // Sub styles e.g. {margin: {left, right}}
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        for (var subKey in value) {
          var keySubKey = key + '-' + subKey;
          prefix += indent + toSpinalCase(keySubKey) + ': ' + formatValue(keySubKey, value[subKey]) + ';\n';
        }
      // Basic values & arrays
      } else {
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

  function generateClassName () {
    var obfuscatedClassName = generateRandomString(5);

    while (existingClassNames.indexOf(obfuscatedClassName) >= 0) {
      obfuscatedClassName = generateRandomString(5);
    }

    return obfuscatedClassName;
  }

  var ReactStyleSheets = {
    setOptions: function (options) {
      if (optionsSet) {
        warn('You tried to set options more than once. This is not advised.');
      }

      if (typeof options !== 'object') {
        throw new Error(messagePrefix + 'Options must be an object.');
      }

      if (typeof options.vendorPrefixes !== 'undefined') {
        if (typeof options.vendorPrefixes !== 'object' || Array.isArray(options.vendorPrefixes)) {
          throw new Error(
            messagePrefix +
            'vendorPrefixes must be an object with style property names as keys, ' +
            'and arrays of prefixes as values.'
          );
        } else {
          vendorPrefixes = options.vendorPrefixes;
        }
      }

      if (typeof options.obfuscate !== 'undefined') {
        obfuscate = options.obfuscate;
      }

      optionsSet = true;
    },
    createTagStyleString: function (styles) {
      var concat = '';

      for (var tag in styles) {
        concat += createStyles(tag, styles[tag]);
      }

      return concat;
    },
    createClassStyleString: function (styles) {
      var concat = '';

      for (var className in styles) {
        var obfuscatedClassName = obfuscate ? generateClassName() : className;

        concat += createStyles('.' + className, styles[obfuscatedClassName]);

        existingClassNames.push(obfuscatedClassName);
      }

      return concat;
    },
    createGlobalTagStyles: function (styles) {
      styleTag.innerHTML = styleTag.innerHTML + ReactStyleSheets.createTagStyleString(styles);
    },
    createUniqueClassStyles: function (styles) {
      var classNames = {};
      var concat = '';

      for (var className in styles) {
        var obfuscatedClassName = obfuscate ? generateClassName() : className;

        concat += createStyles('.' + obfuscatedClassName, styles[className]);

        classNames[className] = obfuscatedClassName;
        existingClassNames.push(obfuscatedClassName);
      }

      styleTag.innerHTML = styleTag.innerHTML + concat;

      return classNames;
    }
  };

  module.exports = ReactStyleSheets;

})();
