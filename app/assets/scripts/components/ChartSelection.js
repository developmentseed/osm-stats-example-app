import React, { Component } from 'react';

class ChartSelection extends Component  {
  constructor(props) {
    super(props)
    this.statement;
  }
  shouldComponentUpdate(prevProps, prevState) {
    if(this.props !== prevProps) {
      this.statement = `${this.props.name}: ${this.props.value}%`
      if (this.props.name) {
        console.log(this.props.name.length)
      }
      return true
    }
  }
  render() {
    return (
      <h3 className="viz--sub">{this.statement}</h3>
    )
  }
}

export default ChartSelection;
