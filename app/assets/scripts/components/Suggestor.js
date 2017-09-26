'use strict';
// component that reduces and renders users & countries (condition on which of the two a user is searching for)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, detect } from 'async';
import PropTypes from 'prop-types';
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
  /**
   * @function getSuggestion
   * @param {string} filterable the input typed by user that can be used as a 'filterable' to 'filter' a list of 'suggestables' that possibly
   * @param {array} suggestables list of objects with property string that are filtered by the 'filterable' for matches
   * @param {Number} key numeric key to match Object key that helps access the strings in 'filterable''s objects the function tries to match to the filterab
   */
  getSuggestion (filterable, suggestables, key) {
    // trim the input value of any leading spaces and force it lowercase
    // all strings will be compared as lowercases
    const inputVal = filterable.trim().toLowerCase();
    // get the input value's length. if it is zero, it means there is nothing to filter.
    // so set the suggestions to zer
    const inputLen = inputVal.length;
    if (inputLen === 0) {
      this.props._updateSuggestions([]);
    }
    // when there is something to filter, filter each record aysnchronously
    // returned matches are those records in suggestables that equal inputVal when mapped to lowercase letters and substringed to be of equal length 
    filter(suggestables, (suggestable, truth) => {
      return truth(null, suggestable[Object.keys(suggestable)[key]].toLowerCase().slice(0, inputLen) === inputVal);
    }, (err, filterResults) => {
      if (err) {
        //  if there is an error, the  don't update anything
        return this.props._updateSuggestion([]);
      }
      // otherwise update the state and thus this component's props with the new filtered values
      return this.props._updateSuggestions(filterResults);
    });
  }
  /**
   * @function getStatsParam finds the record in suggestables array (either users or countries) that matches param, generates stats accordingly
   * @param param {string} (either user or country) that the function is getting stats for
   */
  getStatsParam (param) {
    // asyn'c equivalent to find. here, finding the record that matches param
    detect(this.props[this.props.lastTyped], (country, truth) => {
      truth(null, country.name === param);
    }, (err, foundParam) => {
      if (!err) {
        // conditional to lastTyped, fetch the correct country or user stats
        if (this.props.lastTyped === 'countries') {
          return this.props._fetchCountryStats(foundParam.code);
        } else {
          return this.props._fetchUserStats(foundParam.id);
        }
      }
    });
  }
  componentDidUpdate (prevProps, prevState) {
    // on each update in which the user filter or country filter has been changed (via user input),
    // get & render new suggestions to suggest to them as what they are looking for
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
          {/* set the header to the last typed (so the user knows what the suggestables are) */}
          <h1 className="panel__title">{this.props.lastTyped}</h1>
        </header>
        <div className="scrollarea panel__body">
          {/*
             ScrollArea taken from a react plugin, makes an area that users can scroll through
             TODO: put all of this styling in the sass. I put this together quickly and as a hotfix to 
             the immediate reason for sass not being applied, I did all the styling inline. Fully aware 
             that this makes the code unreadable.
           */}
          <div className="scrollarea-inner">
            <ScrollArea
              scroll={1}
              style={{'max-height': '20rem'}}
              className='panel__body'
              contentClassName='panel__body-inner'
              smoothScrolling={true}
              horizontal={false} >
              {/* 
                inside the container, add a ul of the current suggestions.
              */}
              <div className='panel__body-inner-left'>
              <ul className="suggestions--list" style={
                {
                  'list-style-type': 'none',
                  'font-size': '18px',
                  'padding': '1rem'
                }
              }>
                {/*
                  clicking any of the li here will fire the getStatsParam action,
                  which generates the stats array to be visalized
                */}
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
    // users suggestables list
    users: state.missingmapsUsers,
    // countries suggestables list
    countries: state.missingmapsCountries,
    // filter used to filter countries
    countryFilter: state.countrySuggestorFilter.countryname,
    // filter used to filter users
    userFilter: state.userSuggestorFilter.username,
    // last typed is used to decide which suggestable array to filter and also helps make the header
    lastTyped: state.lastTyped.lastTyped,
    // list of fitlered suggestables shown in scroll area
    currentSuggestions: state.currentSuggestions.currentSuggestions
  };
};

const dispatcher = (dispatch) => {
  return {
    // updates current suggestions. used in the component solely to show no suggestions so it appears.
    _updateSuggestions: (suggestions) => dispatch(updateSuggestions(suggestions)),
    // fires utils script that generates country stats
    _fetchCountryStats: (countryCode) => dispatch(fetchCountryStats(countryCode)),
    // fires utils script that generates user stats
    _fetchUserStats: (userId) => dispatch(fetchUserStats(userId)),
    // sets the suggestor part of state to true/false to guide whether
    // to show the suggestor or the visualization
    _setSuggestor: (bool) => dispatch(setSuggestor(bool))
  };
};

Suggestor.PropTypes = {
  users: PropTypes.array,
  countries: PropTypes.array,
  countryFilter: PropTypes.string,
  userFilter: PropTypes.string,
  lastTyped: PropTypes.string,
  currentSuggestions: PropTypes.array
};
// export default Suggestor;
export default connect(selector, dispatcher)(Suggestor);
