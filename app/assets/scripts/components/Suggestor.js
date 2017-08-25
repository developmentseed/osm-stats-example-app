import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, map } from 'async';
import {
  fetchUsers,
  fetchCountries,
  updateSuggestions
 } from '../actions/action-creators';

class Suggestor extends Component {
  constructor (props) {
    super(props);
    this.getSuggestion = this.getSuggestion.bind(this);
  }
  // find item(s) in list with either country name or user name slice matching slice typed
  getSuggestion (filterable, suggestables, key) {
    const inputVal = filterable.trim().toLowerCase();
    const inputLen = inputVal.length;
    if (inputLen === 0) {
      this.props._updateSuggestions([]);
    }
    filter(suggestables, (suggestable, truth) => {
      this._setUpdating(true);
      return truth(null, suggestable[Object.keys(suggestable)[key]].toLowerCase().slice(0, inputLen) === inputVal);
    }, (err, filterResults) => {
      if (err) {
        this._setUpdating(false);
        return this.props._updateSuggestions([]);
      }
      map(filterResults, (result, truth) => {
        return truth(null, result.name);
      }, (err, mappedResults) => {
        if (err) {
          this._setUpdating(false);
          return this.props._updateSuggestions([]);
        }
        this._setUpdating(false);
        return this.props._updateSuggestions(mappedResults);
      });
    });
  }
  componentDidMount () {
    this.props._fetchUsers();
    this.props._fetchCountries();
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.userFilter !== this.props.userFilter) {
      if (this.props.userFilter.length > 0) {
        this.getSuggestion(this.props.userFilter, this.props.users, 1);
      } else {
        this.props._updateSuggestions([]);
      }
    }
    if (prevProps.countryFilter !== this.props.countryFilter) {
      if (this.props.countryFilter.length > 0) {
        this.getSuggestion(this.props.countryFilter, this.props.countries, 0);
      } else {
        this.props._updateSuggestions([]);
      }
    }
  }
  render () {
    return (
      {this.props.suggestionsUpdating}
      <section className="panel">
        <header className="panel__header">
          <h1 className="panel__title">{this.props.lastTyped}</h1>
        </header>
        <div className="scrollarea panel__body">
          <div className="scrollarea-inner">
            <ul className="suggestions--list" style={
              {
                'list-style-type': 'none',
                'font-size': '18px',
                'padding': '1rem'
              }
            }>
              {this.props.currentSuggestions.map((suggestion, i) => {
                return <li key={i} style={{
                'margin': '.1rem 0'
                }}><a onClick={(e) => { console.log(e.target.textContent); }}><mark style={{
                  background: 'rgba(207, 63, 2, 0.30)',
                  padding: '.2rem .3rem'
                }}>{suggestion}</mark></a></li>;
              })}
            </ul>
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
    userFilter: state.userSuggestorFilter.username,
    lastTyped: state.lastTyped.lastTyped,
    currentSuggestions: state.currentSuggestions.currentSuggestions,
    suggestionsUpdating: state.suggestionsUpdating.suggestionsUpdating
  };
};

const dispatcher = (dispatch) => {
  return {
    _fetchUsers: () => dispatch(fetchUsers()),
    _fetchCountries: () => dispatch(fetchCountries()),
    _updateSuggestions: (suggestions) => dispatch(updateSuggestions(suggestions))
  };
};
// export default Suggestor;
export default connect(selector, dispatcher)(Suggestor);
