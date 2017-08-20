'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Visualization from '../components/Visualization';
import Selector from '../components/Selector';
import Suggestor from '../components/Suggestor';

class App extends Component {
  render () {
    return (
      <div className="App">
        <div className="Selector">
          <Selector/>
        </div>
        <div className="Visualization">
          <Visualization/>
          <Suggestor />
        </div>
      </div>
    );
  }
}

export default App;
