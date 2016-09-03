'use strict';

(function () {

  var headTag = document.getElementsByTagName('head')[0];

  if (!headTag) {
    throw new Error('Could not locate head tag. Ensure your javascript is included after the closing head tag.');
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

  var vendorPrefixes;
  var shouldNotHaveValueSuffix = /^(opacity)$/;
  var indent = '  ';

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
    if (tag.indexOf('-') >= 0) {
      throw new Error('Found "-" in a style property name. Style property names must be defined in camelcase.');
    }

    var prefix = '\n' + tag + ' {\n';
    var nested = '';

    for (var key in style) {
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
          throw new Error('Nested styles such as hover must be an object.');
        }

        var colon = doubleColonStyles.indexOf(key) >= 0 ? '::' : ':';
        nested += createStyles(tag + colon, value) + '}\n\n';
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

  var ReactStyleSheets = {
    setVendorPrefixes: function (obj) {
      vendorPrefixes = obj;
    },
    createGlobalTagStyles: function (styles) {
      var concat = '';

      for (var tag in styles) {
        concat += createStyles(tag, styles[tag]);
      }

      styleTag.innerHTML = styleTag.innerHTML + concat;
    }
  };

  module.exports = ReactStyleSheets;

})();
