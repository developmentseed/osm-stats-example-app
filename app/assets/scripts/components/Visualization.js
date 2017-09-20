'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Bar } from 'nivo';
import ReactLoading from 'react-loading';
import PropTypes form 'prop-types;

class Visualizaiton extends Component {
  render () {
    // set data to visualized based on what has been typed last
    // TOFIX: find better logic. this creates bugs any interaction with the input
    // removes what is being visualized.
    const visualizationData = () => {
      if (this.props.lastTyped === 'countries') {
        return this.props.countryStats;
      } else {
        return this.props.userStats;
      }
    };
    // generates the nivo bar component to-be-visualized
    const visualizationContent = () => {
      return (
        <Bar
          data={visualizationData()}
          keys={['edits']}
          layout='horizontal'
          height={2100}
          width={700}
          margin={{
            'top': 100,
            'right': 20,
            'bottom': 30,
            'left': 50
          }}
          enableLabels={false}
          xPadding={0.2}
          colorBy='code'
          colors='nivo'
          indexBy="code"/>
      );
    };
    // visualized the nivo bar component
    return (
      <div>
       {visualizationContent()}
      </div>
    );
  }
}

Visualizaiton.PropTypes = {
  countryStats: PropTypes.array,
  userStats: PropTypes.userStats,
  lastTyped: PropTypes.string
}

const selector = (state) => {
  return {
    // list of country stats
    countryStats: state.stats.countryStats,
    // list of user stats
    userStats: state.stats.userStats,
    // either admin or country, telling what the user is currently searching for.
    // should just hold stats in its a single bit of state and only change it on
    // actual input into either countries or users search.
    lastTyped: state.lastTyped.lastTyped
  };
};

export default connect(selector)(Visualizaiton);
