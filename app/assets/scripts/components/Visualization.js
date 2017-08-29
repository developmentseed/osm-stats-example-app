import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Bar } from 'nivo';
import ReactLoading from 'react-loading';

class Visualizaiton extends Component {
  render () {
    const visualizationData = () => {
      if (this.props.lastTyped === 'countries') {
        return this.props.countryStats;
      } else {
        return this.props.userStats;
      }
    };
    console.log(visualizationData());
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
    return (
      <div>
       {visualizationContent()}
      </div>
    );
  }
}

const selector = (state) => {
  return {
    countryStats: state.stats.countryStats,
    userStats: state.stats.userStats,
    lastTyped: state.lastTyped.lastTyped
  };
};

const dispatcher = (dispatch) => {
  return {};
};

export default connect(selector, dispatcher)(Visualizaiton);
