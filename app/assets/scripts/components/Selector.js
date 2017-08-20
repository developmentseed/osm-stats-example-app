import React, { Component } from 'react';
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
              <input type="text" id="inputText5" name="inputText5" className="form__control form__control--medium" placeholder="Input text">
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
              <input type="text" id="inputText5" name="inputText5" className="form__control" placeholder="Input text">
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

export default Selector;
