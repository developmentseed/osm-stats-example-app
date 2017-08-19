import React, { Component } from 'react';
import d3 from 'd3';
console.log(d3);
console.log('yo')
class Visualizaiton extends Component {
  shouldComponentUpdate(prevProps, prevState) {
    if (this.props.vizJSON === prevProps.vizJSON) {
      return false
    }
    return true
  }
  render() {
    // var margin = {top: 20, right: 20, bottom: 30, left: 40},
    //     width = 960 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;
    // var x = d3.scale.ordinal()
    //   .rangeRoundBands([0, width], .1, 1);
    // var formatPercent = d3.format(".0%");
    // var y = d3.scale.linear()
    //   .range([height, 0]);
    //   var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom");
    //
    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left")
    //     .tickFormat(formatPercent);
    return (
      <div>
        {JSON.stringify(this.props.vizJSON)}
      </div>
    );
  }
}

export default Visualizaiton;
