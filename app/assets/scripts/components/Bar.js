import React, { Component } from 'react';

class Bar extends Component  {
  constructor(props) {
    super(props)
    this.handleHover=this.handleHover.bind(this);
  }
  handleHover() {}
  render() {
    return (
      <rect className ="bar" width={this.props.width}
        height={this.props.height}
        x={this.props.offset}
        y={this.props.availableHeight - this.props.height}
        fill={this.props.fill}
        onMouseOver={(e) => {
          this.props.setHoverInfo([this.props.name, this.props.val])
        }}
        onMouseOut={(e) => {
          this.props.setHoverInfo([])
        }}/>
    )
  }
}

export default Bar;
