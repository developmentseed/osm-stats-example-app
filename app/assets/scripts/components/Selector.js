import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {
  setlastTyped,
  updateUserSuggestor,
  updateCountrySuggestor
} from '../actions/action-creators';
import { connect } from 'react-redux';

class Selector extends Component {
  render () {
    let formInput = () => {
      if (this.props.usersFetched && this.props.countriesFetched) {
        return (
          <div>
            <div>
              <div className="select--form--ui">
                <div>
                  <h3>Find a user</h3>
                  <div className="select--form--ui">
                    <div className="form__input-group">
                      <input
                        type="text"
                        className="form__control form__control--medium"
                        placeholder="username"
                        onChange={(e) => {
                          this.props._updateUserSuggestor(e.target.value);
                          this.props._setLastTyped('users');
                        }}>
                      </input>
                      <div className="form__input-addon">
                        <button type="button" className="button button--primary-raised-dark button--text-hidden button--medium" title="Delete fieldset"><i className="uisi-magnifier-right icon"></i><span>Delete</span></button>
                      </div>
                    </div>
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
                    onChange={(e) => {
                      this.props._updateCountrySuggestor(e.target.value);
                      this.props._setLastTyped('countries');
                    }}>
                  </input>
                  <div className="form__input-addon">
                    <button type="button" className="button button--primary-raised-dark button--text-hidden" title="Delete fieldset"><i className="uisi-magnifier-right icon"></i><span>Delete</span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className='select--loading'>
            <h3>Loading Users and Countries..</h3>
            <ReactLoading
              className='select--loading-svg'
              type={'spinningBubbles'} color={'rgb(250,250,250)'}
              heigth= '30' width='35' />
          </div>
        );
      }
    };
    return (
      <div className="Selector--main">
        <div className="select--header">
          <h1>osm-stats-api analysis</h1>
        </div>
        {formInput()}
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
  return {
    countriesFetched: state.missingmapsCountries.fetched,
    usersFetched: state.missingmapsUsers.fetched
  };
};

const dispatcher = (dispatch) => {
  return {
    _setLastTyped: (text) => dispatch(setlastTyped(text)),
    _updateUserSuggestor: (text) => dispatch(updateUserSuggestor(text)),
    _updateCountrySuggestor: (text) => dispatch(updateCountrySuggestor(text))
  };
};

export default connect(selector, dispatcher)(Selector);
