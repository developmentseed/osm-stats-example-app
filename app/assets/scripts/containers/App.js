'use strict';
import React, { Component } from 'react';
import Visualization from '../components/Visualization';
import Selector from '../components/Selector';

class App extends Component {
  render () {
    return (
      <div className="App">
        <div className="Selector">
          <Selector/>
        </div>
        <div className="Visualization">
          <Visualization/>
        </div>
      </div>
    );
  }
}

export default App;
