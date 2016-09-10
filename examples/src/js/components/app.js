'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');
  var fs = require('fs');
  var Example = require('./example');

  var examples = [
    {
      name: 'Basic Header Example',
      component: require('../examples/1-basic-header-example'),
      source: fs.readFileSync(__dirname + '/../examples/1-basic-header-example.js', 'utf8')
    },
    {
      name: 'Media Query Example',
      component: require('../examples/2-media-query-example'),
      source: fs.readFileSync(__dirname + '/../examples/2-media-query-example.js', 'utf8')
    }
  ];

  var classNames = ReactStyleSheets.createUniqueClassStyles({
    container: {
      margin: [0, 'auto'],
      padding: {
        left: 15,
        right: 15
      },
      maxWidth: 768
    },
    center: {
      textAlign: 'center',
      marginTop: '40%'
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
            Examples
          </h2>
          {
            examples.map(function (example) {
              return (
                <Example
                  key={example.name}
                  name={example.name}
                  component={example.component}
                  source={example.source}
                />
              );
            })
          }
        </div>
      );
    }
  });

  module.exports = App;

})();
