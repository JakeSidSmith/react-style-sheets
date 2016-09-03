'use strict';

(function () {

  require('./styles');
  var React = require('react');
  var ReactDOM = require('react-dom');
  var App = require('./components/app');

  ReactDOM.render(<App />, document.getElementById('app'));

})();
