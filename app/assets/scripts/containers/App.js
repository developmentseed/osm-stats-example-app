'use strict';
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
  componentDidMount () {
    this.props._fetchUsers();
    this.props._fetchCountries();
  }
  render () {
    const showVisualizationSuggestor = () => {
      if (this.props.countriesFetched && this.props.usersFetched) {
        if (!(this.props.visualization)) {
          return (
            <Suggestor/>
          );
        }
        return (
          <Visualization/>
        );
      }
    };
    return (
      <div className="App">
        <div className="Selector">
          <Selector/>
        </div>
        <div className="Visualization">
          {showVisualizationSuggestor()}
        </div>
      </div>
    );
  }
}

const selector = (state) => {
  return {
    countriesFetched: state.missingmapsCountries.fetched,
    usersFetched: state.missingmapsUsers.fetched
  };
};

const dispatcher = (dispatch) => {
  return {
    _fetchUsers: () => dispatch(fetchUsers()),
    _fetchCountries: () => dispatch(fetchCountries()),
  };
};

export default connect(selector, dispatcher)(App);
