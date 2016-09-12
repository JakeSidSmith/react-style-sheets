'use strict';

(function () {

  var React = require('react');
  var SyntaxHighlighter = require('react-syntax-highlighter').default;

  function createRegex (type) {
    return new RegExp(
      '(\\/\\/|\\/\\*)\\s*' + type + '\\sstart(\\s\\*\\/)*' +
      '((\\n|.)*?)' +
      '(\\/\\/|\\/\\*)\\s*' + type + '\\send(\\s\\*\\/)*'
    );
  }

  var styles = createRegex('styles');
  var markup = createRegex('markup');
  var emptyLines = /^([\r\n]+|[\r\n\s]+$)/gm;

  function filterFor (source, regex) {
    source = regex.exec(source)[3] || '';
    source = source.replace(emptyLines, '');

    var initialIndentation = /(\s*)/.exec(source)[0] || '';
    var indentation = new RegExp('^\\s{' + initialIndentation.length + '}', 'gm');

    return source.replace(indentation, '');
  }

  var Example = React.createClass({
    render: function () {
      var Component = this.props.component;

      return (
        <div>
          <h3>
            {this.props.name}
          </h3>
          <h4>
            The styles
          </h4>
          <SyntaxHighlighter language="javascript" useInlineStyles={false}>
            {filterFor(this.props.source, styles)}
          </SyntaxHighlighter>
          <h4>
            The markup
          </h4>
          <SyntaxHighlighter language="html" useInlineStyles={false}>
            {filterFor(this.props.source, markup)}
          </SyntaxHighlighter>
          <h4>
            The result
          </h4>
          <Component />
          <hr />
        </div>
      );
    }
  });

  module.exports = Example;

})();
