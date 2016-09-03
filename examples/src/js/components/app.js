'use strict';

(function () {

  var React = require('react');
  var ReactDOM = require('react-dom');
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
            React Style Sheets allows defining styles in your javascript similarly to React Native,
            but unlike React Native (or libraries like {
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
                  '  myClass: \'myClass_hfseo\'\n' +
                  '}\n\n' +

                  '// You can then use this in your React components\n\n' +

                  '<div classNames={classNames.myClas}>\n' +
                  '  Hello, World!\n' +
                  '</div>\n\n' +

                  '// Which references the styles generated in the style tag\n\n' +

                  '<style type="text/css">\n' +
                  '  .myClass_hfsoe {\n' +
                  '    color: red;\n' +
                  '  }\n' +
                  '</style>'
                }
              </pre>
            </li>
            <li>
              You can easily define styles with our intuative API
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
                  '</style>\n\n' +

                  '// or\n\n' +

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
        </div>
      );
    }
  });

  module.exports = App;

})();