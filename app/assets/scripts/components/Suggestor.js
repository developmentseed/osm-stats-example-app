import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, detect } from 'async';
import {
  updateSuggestions,
  fetchCountryStats,
  fetchUserStats,
  setSuggestor
 } from '../actions/action-creators';
import ScrollArea from 'react-scrollbar';

class Suggestor extends Component {
  constructor (props) {
    super(props);
    this.getSuggestion = this.getSuggestion.bind(this);
    this.getStatsParam = this.getStatsParam.bind(this);
  }
  // find item(s) in list with either country name or user name slice matching slice typed
  getSuggestion (filterable, suggestables, key) {
    const inputVal = filterable.trim().toLowerCase();
    const inputLen = inputVal.length;
    if (inputLen === 0) {
      this.props._updateSuggestions([]);
    }
    filter(suggestables, (suggestable, truth) => {
      return truth(null, suggestable[Object.keys(suggestable)[key]].toLowerCase().slice(0, inputLen) === inputVal);
    }, (err, filterResults) => {
      if (err) {
        return this.props._updateSuggestions([]);
      }
      return this.props._updateSuggestions(filterResults);
    });
  }
  // finds and dispatches to fetchCountryStats the selected country's code
  getStatsParam (param) {
    detect(this.props[this.props.lastTyped], (country, truth) => {
      truth(null, country.name === param);
    }, (err, foundParam) => {
      if (!err) {
        if (this.props.lastTyped === 'countries') {
          return this.props._fetchCountryStats(foundParam.code);
        } else {
          return this.props._fetchUserStats(foundParam.name);
        }
      }
    });
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
      <section className="panel">
        <header className="panel__header">
          <h1 className="panel__title">{this.props.lastTyped}</h1>
        </header>
        <div className="scrollarea panel__body">
          <div className="scrollarea-inner">
            <ScrollArea
              scroll={1}
              style={{'max-height': '20rem'}}
              className='panel__body'
              contentClassName='panel__body-inner'
              smoothScrolling={true}
              horizontal={false} >
              <div className='panel__body-inner-left'>
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
                  }}><a onClick={(e) => {
                    this.getStatsParam(e.target.textContent);
                    this.props._setSuggestor(false);
                  }}><mark style={{
                    background: 'rgba(207, 63, 2, 0.30)',
                    padding: '.2rem .3rem'
                  }}>{suggestion.name}</mark></a></li>;
                })}
              </ul>
              </div>
              <div className='panel__body-inner-right'>
              </div>
            </ScrollArea>
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
    currentSuggestions: state.currentSuggestions.currentSuggestions
  };
};

const dispatcher = (dispatch) => {
  return {
    _updateSuggestions: (suggestions) => dispatch(updateSuggestions(suggestions)),
    _fetchCountryStats: (countryCode) => dispatch(fetchCountryStats(countryCode)),
    _fetchUserStats: (userId) => dispatch(fetchUserStats(userId)),
    _setSuggestor: (bool) => dispatch(setSuggestor(bool))
  };
};
// export default Suggestor;
export default connect(selector, dispatcher)(Suggestor);
