import React, { Component } from 'react';
class Selector extends Component {
  render () {
    return (
      <div className="Selector--main">
        <div className="select--header">
          <h1>osm-stats-api analysis</h1>
        </div>
        <div className="select--section select--sub-header">
          <h4>Select a User or Country</h4>
        </div>
        <div className="select--section">
          <div className='form__label'>
            <h4>User Stats</h4>
          </div>
          <div className="select--form--ui">
          <form className="form">
            <div className="form__section">
            <select className="form__control form__control--small" name="select--user"
              onChange={(e) => {
              }}>
              <option></option>
              <option value="piaco">piaco_dk</option>
              <option value="giblet">giblet</option>
              <option value="sawan">Sawan Shariadr</option>
            </select>
            </div>
            <div className="form__section">
            <input/>
            </div>
          </form>
          </div>
        </div>
        <div className="select--section select--form--bottom">
          <div className='form__label'>
            <h4>Country Stats </h4>
          </div>
          <div className="select--form--ui">
            <form className="form">
              <select ref="countryDropdown" className="form__control form__control--small" name="select--country"
                onChange={(e) => {}}>
                <option></option>
                <option value="nga">Nigeria</option>
                <option value="moz">Mozambique</option>
                <option value="zwe">Zimbabwe</option>
              </select>
              <input type="submit" value="Submit"
                className="button button--base-raised-light button--small"
                name="input-country"
                onClick={(e) => {}}/>
            </form>
          </div>
        </div>
        <div className="select--section select--bottom">
          <div className="select--break" />
          <div className="project--link">
            <img className="project--link--logo"
              src="assets/graphics/layout/devseed-logo-symbol.svg" />
            <h3><a href="https://github.com/AmericanRedCross/osm-stats-api">
             <mark>osm-stats-api <span className="uisi-github"></span></mark>
         </a></h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Selector;
