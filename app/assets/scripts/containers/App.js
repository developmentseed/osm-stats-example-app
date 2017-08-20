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
        </div>
        <Suggestor />
      </div>
    );
  }
}

//  Connect! //
// const selector = (state) => {
//   return {
//     users: state.missingmapsUsers,
//     countries: state.missingmapsCountries
//   };
// };

// const dispatcher = (dispatch) => {
//   return {
//     _fetchUsers: () => dispatch(fetchUsers()),
//     _fetchCountries: () => dispatch(fetchCountries())
//   };
// };
//
// // set PropTypes //
// App.PropTypes = {
//   _fetchUsers: PropTypes.func
// };
//
// export default connect(selector, dispatcher)(App);

export default App;
