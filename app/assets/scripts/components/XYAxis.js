import React, { Component } from 'react';
import Axis from './Axis';

class XYAxis extends Component {
  render() {
    const xAxisSettings = {
      translate: `translate(0, ${this.props.height -  this.props.padding})`,
      scale: this.props.x,
      orient: `bottom`
    }
    const yAxisSettings = {
      translate: `translate(${this.props.padding}, 0)`,
      scale: this.props.y,
      orient: 'left'
    }
    return (
      <g className="xyAxis" >
        <Axis {...xAxisSettings} />
        <Axis {...yAxisSettings} />
      </g>
    )
  }
}

export default XYAxis;
