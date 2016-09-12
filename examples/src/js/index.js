'use strict';

(function () {

  var fs = require('fs');
  var highlightStyles = fs.readFileSync(__dirname + '/../../../node_modules/highlight.js/styles/github.css', 'utf8');

  var headTag = document.getElementsByTagName('head')[0];

  var styleTag = document.createElement('style');
  styleTag.setAttribute('type', 'text/css');

  styleTag.innerHTML = highlightStyles;

  headTag.appendChild(styleTag);

  require('./styles');
  var React = require('react');
  var ReactDOM = require('react-dom');
  var App = require('./components/app');

  ReactDOM.render(<App />, document.getElementById('app'));

})();
