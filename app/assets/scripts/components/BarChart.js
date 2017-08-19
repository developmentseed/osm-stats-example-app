import React, { Component } from 'react';

class BarChart extends Component  {
  render() {
    return (
      <svg width={this.props.width} height={this.props.height}>
        {this.props.bars}
      </svg>
    )
  }
}

export default BarChart;
