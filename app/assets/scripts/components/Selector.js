import React, { Component } from 'react';
import { updateUserSuggestor, updateCountrySuggestor } from '../actions/action-creators';
import { connect } from 'react-redux';

class Selector extends Component {
  render () {
    return (
      <div className="Selector--main">
        <div className="select--header">
          <h1>osm-stats-api analysis</h1>
        </div>
        <div>
          <div className="select--form--ui">
            <h3>Find a user</h3>
            <div className="form__input-group">
              <input
                type="text"
                className="form__control form__control--medium"
                placeholder="username"
                onChange={(e) => { this.props._updateUserSuggestor(e.target.value); }}>
              </input>
              <div className="form__input-addon">
                <button type="button" className="button button--primary-raised-dark button--text-hidden button--medium" title="Delete fieldset"><i className="uisi-magnifier-right icon"></i><span>Delete</span></button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="select--form--ui">
            <h3>Find a country</h3>
            <div className="form__input-group">
              <input
                type="text"
                className="form__control"
                placeholder="country name"
                onChange={(e) => { this.props._updateCountrySuggestor(e.target.value); }}>
              </input>
              <div className="form__input-addon">
                <button type="button" className="button button--primary-raised-dark button--text-hidden" title="Delete fieldset"><i className="uisi-magnifier-right icon"></i><span>Delete</span></button>
              </div>
            </div>
          </div>
        </div>
        <div className="select--section select--bottom">
          <div className="project--link">
            <img className="project--link--logo"
              src="assets/graphics/layout/devseed-logo-symbol.svg" />
            <a href="https://github.com/AmericanRedCross/osm-stats-api"><h3>
             <mark>osm-stats-api <span className="uisi-github icon"></span></mark>
            </h3></a>
          </div>
        </div>
      </div>
    );
  }
}

const selector = (state) => {
  return {};
};

const dispatcher = (dispatch) => {
  return {
    _updateUserSuggestor: (text) => dispatch(updateUserSuggestor(text)),
    _updateCountrySuggestor: (text) => dispatch(updateCountrySuggestor(text))
  };
};

export default connect(selector, dispatcher)(Selector);
