import React, { Component } from 'react';
import { connect } from 'react-redux';
class Visualizaiton extends Component {
  render () {
    return (
      <div>
        <span>VIZ!</span>
      </div>
    );
  }
}

const selector = (state) => {
  return {
    countryStats: state.stats.countryStats,
    userStats: state.stats.userStats
  };
};

const dispatcher = (dispatch) => {
  return {};
};

export default connect(selector, dispatcher)(Visualizaiton);
