/* global __dirname */

'use strict';

(function () {

  var React = require('react');
  var ReactStyleSheets = require('../../../../lib/index');
  var fs = require('fs');
  var Example = require('./example');

  var examples = [
    {
      name: 'Tag Styles Example',
      component: require('../examples/1-tag-styles-example'),
      source: fs.readFileSync(__dirname + '/../examples/1-tag-styles-example.js', 'utf8')
    },
    {
      name: 'Class Styles Example',
      component: require('../examples/2-class-styles-example'),
      source: fs.readFileSync(__dirname + '/../examples/2-class-styles-example.js', 'utf8')
    },
    {
      name: 'Media Query Example',
      component: require('../examples/3-media-query-example'),
      source: fs.readFileSync(__dirname + '/../examples/3-media-query-example.js', 'utf8')
    },
    {
      name: 'Keyframe Animation Example',
      component: require('../examples/4-keyframe-animation-example'),
      source: fs.readFileSync(__dirname + '/../examples/4-keyframe-animation-example.js', 'utf8')
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
          <hr />
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
