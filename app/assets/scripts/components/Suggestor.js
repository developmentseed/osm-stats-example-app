import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchUsers,
  fetchCountries,
  updateUsersSuggestions,
  updateCountriesSuggestions
 } from '../actions/action-creators';

class Suggestor extends Component {
  constructor (props) {
    super(props);
    this.getSuggestion = this.getSuggestion.bind(this);
    this.suggestedUsers;
    this.suggestedCountries;
  }
  // find item(s) in list with either country name or user name slice matching slice typed
  getSuggestion (filter, suggestables, key) {
    const inputVal = filter.trim().toLowerCase();
    const inputLen = inputVal.length;
    return inputLen === 0 ? [] : suggestables.filter(suggestable =>
      suggestable[Object.keys(suggestable)[key]].toLowerCase().slice(0, inputLen) === inputVal
    );
  }
  componentDidMount () {
    this.props._fetchUsers();
    this.props._fetchCountries();
  }
  componentDidUpdate (prevProps, prevState) {
    console.log(this);
    if (prevProps.userFilter !== this.props.userFilter) {
      const userSuggestions = this.getSuggestion(this.props.userFilter, this.props.users, 1);
      console.log(userSuggestions);
      this.props._updateUsersSuggestions(userSuggestions);
    }
    if (prevProps.countryFilter !== this.props.countryFilter) {
      const countriesSuggestions = this.getSuggestion(this.props.countryFilter, this.props.countries, 0);
      this.props._updateCountriesSuggestions(countriesSuggestions);
    }
  }
  render () {
    return (
      <section className="panel">
        <header className="panel__header">
          <h1 className="panel__title">Users</h1>
        </header>
        <div className="scrollarea panel__body">
          <div className="scrollarea-inner">
            {this.props.userSuggestions.length ? this.props.userSuggestions : ''}
          </div>
        </div>
      </section>
    );
  }
}

const selector = (state) => {
  return {
    users: state.missingmapsUsers,
    countries: state.missingmapsCountries,
    countryFilter: state.countrySuggestorFilter.countryname,
    countrySuggestions: state.countrySuggestions,
    userFilter: state.userSuggestorFilter.username,
    userSuggestions: state.userSuggestions
  };
};

const dispatcher = (dispatch) => {
  return {
    _fetchUsers: () => dispatch(fetchUsers()),
    _fetchCountries: () => dispatch(fetchCountries()),
    _updateUsersSuggestions: (suggestions) => dispatch(updateUsersSuggestions(suggestions)),
    _updateCountriesSuggestions: (suggestions) => dispatch(updateCountriesSuggestions(suggestions))
  };
};
// export default Suggestor;
export default connect(selector, dispatcher)(Suggestor);
