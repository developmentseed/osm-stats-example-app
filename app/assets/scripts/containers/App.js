'use strict';
// main app including selector, suggestor and visualization components
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Visualization from '../components/Visualization';
import Selector from '../components/Selector';
import Suggestor from '../components/Suggestor';
import {
  fetchUsers,
  fetchCountries
} from '../actions/action-creators';
class App extends Component {
  // on mount, fetch users an countries.
  componentDidMount () {
    this.props._fetchUsers();
    this.props._fetchCountries();
  }
  render () {
    /**
     * conditionally returns suggestor or visualization component depending on whether stats are being fetcched or not
     */
    const showVisualizationSuggestor = () => {
      // only if the countries and users have been fetched, show (based on condition) the suggestor or visualization component
      if (this.props.countriesFetched && this.props.usersFetched) {
        // if the stats have not been fetched or if suggested (countries or users)
        // have been set, show the suggestor component
        if (!this.props.statsFetched || this.props.setSuggestor) {
          return (
            <Suggestor className="Suggestor"/>
          );
        }
        // if neither of the conditions are met,
        // meaning stats are ready to be visualized, show the visualization component
        return (
          <Visualization className='Visualization'/>
        );
      }
    };
    return (
      <div className="App">
        <div className="Selector">
          <Selector/>
        </div>
        <div className="main">
          {showVisualizationSuggestor()}
        </div>
      </div>
    );
  }
}

App.PropTypes = {
  _fetchCountries: PropTypes.func,
  _fetchUsers: PropTypes.func,
  countriesFetched: PropTypes.bool,
  usersFetched: PropTypes.bool,
  statsFetched: PropTypes.bool,
  setSuggestor: PropTypes.bool
};

const selector = (state) => {
  return {
    // boolean === true if countries ahve been fetched
    countriesFetched: state.missingmapsCountries.fetched,
    // boolean === true if users have been fetched
    usersFetched: state.missingmapsUsers.fetched,
    // boolean === true if stats have been fetched
    statsFetched: state.stats.statsFetched,
    // boolean === true if suggestor has been selected
    setSuggestor: state.setSuggestor.setSuggestor
  };
};

const dispatcher = (dispatch) => {
  return {
    _fetchUsers: () => dispatch(fetchUsers()),
    _fetchCountries: () => dispatch(fetchCountries())
  };
};

export default connect(selector, dispatcher)(App);
