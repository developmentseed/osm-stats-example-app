import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { fetchUsers, fetchCountries } from '../actions/action-creators';

class Suggestor extends Component {
  // find item(s) in list with either country name or user name slice matching slice typed
  getSuggestion (value, suggestables) {
    const inputVal = value.trim().toLowerCase();
    const inputLen = inputVal.lenght;
    return inputLen === 0 ? [] : suggestables.filter(suggestable =>
      suggestable[Object.keys(suggestable)[0]].toLowerCase().slice(0, inputLen) === inputVal);
  }
  // onclick, populate input with matching suggestion
  getSuggestionValue (suggestion) {
    return suggestion[Object.keys(suggestion)[0]];
  }
  componentDidMount () {
    this.props._fetchUsers();
    this.props._fetchCountries();
  }
  render () {
    console.log(this.props)
    return (
      <div/>
    );
  }
}

const selector = (state) => {
  return {
    users: state.missingmapsUsers,
    countries: state.missingmapsCountries
  };
};

const dispatcher = (dispatch) => {
  return {
    _fetchUsers: () => dispatch(fetchUsers()),
    _fetchCountries: () => dispatch(fetchCountries())
  };
};
// export default Suggestor;
export default connect(selector, dispatcher)(Suggestor);
