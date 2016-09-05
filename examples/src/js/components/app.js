'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');

  var classNames = ReactStyleSheets.createUniqueClassStyles({
    container: {
      margin: [0, 'auto'],
      padding: {
        left: 15,
        right: 15
      },
      maxWidth: 768
    }
  });

  var App = React.createClass({
    render: function () {
      return (
        <div className={classNames.container}>
          <h1>
            React Style Sheets
          </h1>
          <h2>
            About
          </h2>
          <p>
            React Style Sheets allows defining styles in your javascript in a similar way to React Native.
          </p>
          <pre>
            {
              '// Define your styles\n\n' +

              'var classNames = ReactStyleSheets.createUniqueClassStyles({\n' +
              '  myClass: {\n' +
              '    color: \'red\'\n' +
              '  }\n' +
              '});\n\n' +

              '// You can then use this in your React components\n\n' +

              '<div className={classNames.myClass}>\n' +
              '  Hello, World!\n' +
              '</div>'
            }
          </pre>
          <p>
            Unlike React Native (or libraries like {
              <a href="https://github.com/js-next/react-style">
                React Style
              </a>
            }), it has the following benefits:
          </p>
          <ul>
            <li>
              Styles are only generated once, when the script is first loaded
            </li>
            <li>
              The styles are not inlined, instead they are added in a style tag and either available globally,
              or accessed by a unique class name (more info below)
            </li>
            <li>
              No need to manually implement hover, active, etc states in javascript (more info below)
            </li>
            <li>
              You can still use inline styles without the need for complex extending of styles
            </li>
            <li>
              Easily extend / override reusable components styles by concatenating classNames
              <pre>
                {
                  'render: function () {\n' +
                  '  return (\n' +
                  '    <div className={classNames.myClass + \' \' + this.props.className} />\n' +
                  '  );\n' +
                  '}'
                }
              </pre>
            </li>
            <li>
              You can add global styles for all HTML elements (by tag name)
              <pre>
                {
                  'ReactStyleSheets.createGlobalTagStyles({\n' +
                  '  p: {\n' +
                  '    margin: \'10px auto\'\n' +
                  '  }\n' +
                  '});'
                }
              </pre>
            </li>
            <li>
              You can create and utilize CSS animations
              <pre>
                {
                  'ReactStyleSheets.createUniqueKeyframeAnimation({\n' +
                  '  animationName: {\n' +
                  '    \'0%\': {\n' +
                  '      opacity: 0;\n' +
                  '    },\n' +
                  '    \'100%\': {\n' +
                  '      opacity: 1;\n' +
                  '    }\n' +
                  '  }\n' +
                  '});'
                }
              </pre>
            </li>
            <li>
              You can use advanced selectors like hover, active, disabled, firstChild, etc
              <pre>
                {
                  'ReactStyleSheets.createGlobalTagStyles({\n' +
                  '  a: {\n' +
                  '    textDecoration: \'none\',\n' +
                  '    hover: {\n' +
                  '      textDecoration: \'underline\'\n' +
                  '    }\n' +
                  '  }\n' +
                  '});'
                }
              </pre>
            </li>
            <li>
              You can use selectors for pseudo elements like before, after, and selection
              <pre>
                {
                  'ReactStyleSheets.createGlobalTagStyles({\n' +
                  '  li: {\n' +
                  '    before: {\n' +
                  '      content: \'">"\'\n' +
                  '    }\n' +
                  '  }\n' +
                  '});'
                }
              </pre>
            </li>
            <li>
              You can nest selectors
              <pre>
                {
                  'ReactStyleSheets.createGlobalTagStyles({\n' +
                  '  li: {\n' +
                  '    firstChild: {\n' +
                  '      before: {\n' +
                  '        content: \'">"\'\n' +
                  '      }\n' +
                  '    }\n' +
                  '  }\n' +
                  '});'
                }
              </pre>
            </li>
            <li>
              You can easily define styles with our intuative API
              (automatically adds units, joins arrays, and more)
              <pre>
                {
                  'ReactStyleSheets.createGlobalTagStyles({\n' +
                  '  p: {\n' +
                  '    margin: [10, \'auto\']\n' +
                  '  }\n' +
                  '});\n\n' +

                  '// Outputs\n\n' +

                  '<style type="text/css">\n' +
                  '  p {\n' +
                  '    margin: 10px auto;\n' +
                  '  }\n' +
                  '</style>'
                }
              </pre>
              Break up styles with nesting
              <pre>
                {
                  'ReactStyleSheets.createGlobalTagStyles({\n' +
                  '  p: {\n' +
                  '    margin: {\n' +
                  '      top: 10,\n' +
                  '      bottom: 10\n' +
                  '    }\n' +
                  '  }\n' +
                  '});\n\n' +

                  '// Outputs\n\n' +

                  '<style type="text/css">\n' +
                  '  p {\n' +
                  '    margin-top: 10px;\n' +
                  '    margin-bottom: 10px;\n' +
                  '  }\n' +
                  '</style>'
                }
              </pre>
            </li>
          </ul>
          <p>
            Benefits of React Style Sheets over using CSS, and CSS pre/post-processors include
          </p>
          <ul>
            <li>
              Keep your styles, component logic, and markup in the same file
            </li>
            <li>
              Automatically add vendor prefixes
            </li>
            <li>
              No additional dependencies - parse and bundle your styles with your chosen javascript build tools
            </li>
            <li>
              Class names are unique (and obfuscated by default) preventing accidental style inheritance
              <pre>
                {
                  '// Define your styles\n\n' +

                  'var classNames = ReactStyleSheets.createUniqueClassStyles({\n' +
                  '  myClass: {\n' +
                  '    color: \'red\'\n' +
                  '  }\n' +
                  '});\n\n' +

                  '// And you end up with some classNames like the following\n\n' +

                  '{\n' +
                  '  myClass: \'myClass_obfus\'\n' +
                  '}\n\n' +

                  '// You can then use this in your React components\n\n' +

                  '<div className={classNames.myClass}>\n' +
                  '  Hello, World!\n' +
                  '</div>\n\n' +

                  '// Which references the styles generated in the style tag\n\n' +

                  '<style type="text/css">\n' +
                  '  .myClass_obfus {\n' +
                  '    color: red;\n' +
                  '  }\n' +
                  '</style>'
                }
              </pre>
            </li>
          </ul>
        </div>
      );
    }
  });

  module.exports = App;

})();
