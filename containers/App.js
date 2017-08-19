import React, { Component } from 'react';
import Selector from '../components/Selector';
import Visualization from '../components/Visualization';
import userStats from '../constants/UserData.json';
import countryStats from '../constants/CountryStats.json'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fireViz: false,
      fireType: null,
      filterType: null,
      user: 'piaco',
      country: 'nga',
      userStats: userStats,
      countryStats: countryStats,
      vizJSON: {}
    };
    this.setFilter = this.setFilter.bind(this);
    this.setViz = this.setViz.bind(this);
    this.setOffViz = this.setOffViz.bind(this);
  }
  setFilter(filterArray) {
    const toChange = filterArray[0];
    const filter = filterArray[1];
    if (toChange === 'select--user') {
      this.setState({
        user: filter,
        filterType: 'user'
      })
    } else {
      this.setState({
        country: filter,
        filterType: 'country'
      })
    }
  }
  setViz(filter, vizType, fireType) {
    if (vizType === 'user' && fireType === 'user') {
      this.setState({
        vizJSON: userStats[filter]
      })
    } else if (vizType === 'country' && fireType === 'country') {
      this.setState({
        vizJSON: countryStats[filter]
      })
    }
  }
  setOffViz(name) {
    if (name === "input--user") {
      name = "user"
    } else {
      name ="country"
    }
    this.setState({
      fireViz: !this.state.fireViz,
      fireType: name
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.fireViz !== this.state.fireViz) {
      if (this.state.filterType) {
        if (this.state.filterType === 'user') {
          this.setViz(this.state.user, this.state.filterType, this.state.fireType);
        } else {
          this.setViz(this.state.country, this.state.filterType, this.state.fireType);
        }

      }
    }
  }
  render() {
    console.log('surf')
    return (
      <div className="App">
        <div className="Selector">
          <Selector
            fireViz={this.state.fireViz}
            setOffViz={this.setOffViz}
            setFilter={this.setFilter}/>
        </div>
        <div className="Visualization">
          <Visualization
            vizJSON={this.state.vizJSON}/>
        </div>
      </div>
    );
  }
}

export default App;
