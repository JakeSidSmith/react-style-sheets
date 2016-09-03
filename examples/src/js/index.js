'use strict';

(function () {

  var React = require('react');
  var ReactDOM = require('react-dom');
  var App = require('./components/app');

  require('./styles');

  ReactDOM.render(<App />, document.getElementById('app'));

})();
