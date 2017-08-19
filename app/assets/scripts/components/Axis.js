import React, { Component } from 'react';
import * as d3 from 'd3';

class Axis extends Component {
  constructor(props) {
    super(props)
    this.renderAxis=this.renderAxis.bind(this)
    this.textDY;
    this.textTrasform;
  }
  compoenntDidMount() {
    this.renderAxis()
  }
  componentDidUpdate() {
    this.renderAxis()
  }
  renderAxis() {
    let axis;
    let node = this.refs.axis;
    if (this.props.orient === 'left') {
      axis = d3.axisLeft(this.props.scale)

    } else {
      axis = d3.axisBottom(this.props.scale)
    }
    d3.select(node).call(axis)
  }
  render() {
    return (
      <g className="axis" ref="axis" transform={this.props.translate}></g>
    )
  }
}

export default Axis;
