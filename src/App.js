import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.scss';
// import uniqBy from 'lodash/uniqBy';
// import { sortByKey } from './utils';
import { findAny } from './utils';

import planets from './planets.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.renderPlanets = this.renderPlanets.bind(this);
    this.renderAppearances = this.renderAppearances.bind(this);

    this.state = {
      filters: {
        media: 'All',
        era: []
      }
    };
  }

  handleFilterChange(event) {
    const { filters } = this.state;

    const [key, value] = event.target.value.split(':');

    // console.log('');
    // console.log('key:', key);
    // console.log('value:', value);

    let newFilterValue;

    if (key === 'era') {
      const targetFilterGroup = filters.era;

      /**
       * if the filter already exists in the targetFilterGroup, remove it with .filter
       * else use the spread operator, create a copy of the targetFilterGroup and append the new filter to the end
       */
      newFilterValue = targetFilterGroup.includes(value)
        ? targetFilterGroup.filter(filter => filter !== value)
        : [...targetFilterGroup, value];
    } else {
      newFilterValue = value;
    }

    const updatedFilters = { ...filters, [key]: newFilterValue };

    this.setState({
      filters: updatedFilters
    });
  }

  get filteredPlanets() {
    const { filters } = this.state;

    // console.log('');
    // console.log('get filteredPlanets');
    // console.log('Object.entries(filters):', Object.entries(filters));

    const activeFilterKeys = Object.entries(filters).reduce((acc, curr) => {
      const [key, value] = curr;

      /**
       * if key is media and value is not All
       * OR
       * if key is era and value array has a length
       * add filter key to accumulator
       */
      if (
        (key === 'media' && value !== 'All') ||
        (key === 'era' && value.length)
      ) {
        acc.push(key);
      }

      return acc;
    }, []);

    // if both filters are applied check both conditions
    if (activeFilterKeys.length > 1) {
      return planets.filter(planet => {
        const matchingAppearances = planet.appearances
          .filter(appearance =>
            filters.media === 'Film (Episodes Only)'
              ? appearance.media === 'Film' &&
                appearance.title.startsWith('Episode')
              : appearance.media === filters.media
          )
          .map(appearance => appearance.era);

        return findAny(filters.era, matchingAppearances);
      });
    }

    // if only one filter is applied
    if (activeFilterKeys.length === 1) {
      return planets.filter(planet => {
        const activeFilterKey = activeFilterKeys[0];
        const planetValues = planet.appearances.map(p => p[activeFilterKey]);

        if (
          activeFilterKey === 'media' &&
          filters.media === 'Film (Episodes Only)'
        ) {
          return planet.appearances
            .filter(appearance => appearance.media === 'Film')
            .some(appearance => appearance.title.startsWith('Episode'));
        }

        return activeFilterKey === 'era'
          ? findAny(filters.era, planetValues)
          : planetValues.includes(filters.media);
      });
    }

    return planets;
  }

  renderAppearances(planet) {
    return (
      <ul className="planet-card-appearances-list">
        {planet.appearances.map((appearance, index) => {
          const eraModifier = appearance.era.split(' ')[0].toLowerCase();

          return (
            <li
              key={`appearance-${index}`}
              className={`planet-card-appearances-list-item planet-card-appearances-list-item--${eraModifier}`}
            >
              {appearance.title} ({appearance.year})
            </li>
          );
        })}
      </ul>
    );
  }

  renderPlanets() {
    return this.filteredPlanets.map((planet, index) => {
      return (
        <div key={`planet-${index}`} className="planet-card">
          <h3 className="planet-card-heading">{planet.name}</h3>
          <div className="planet-card-appearances">
            <h4 className="planet-card-appearances-heading">Appearances:</h4>
            {this.renderAppearances(planet)}
          </div>
        </div>
      );
    });
  }

  get filterForm() {
    return (
      <header className="header">
        <form className="filter-form" onChange={this.handleFilterChange}>
          <fieldset className="filter-form-fieldset">
            <h2 className="filter-form-heading">Media:</h2>
            <div className="filter-form-input-wrapper">
              <input
                type="radio"
                className="filter-form-input"
                id="media-all"
                name="media"
                value="media:All"
                defaultChecked
              />
              <label className="filter-form-label" htmlFor="media-all">
                All
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="radio"
                className="filter-form-input"
                id="media-film"
                name="media"
                value="media:Film"
              />
              <label className="filter-form-label" htmlFor="media-film">
                Film
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="radio"
                className="filter-form-input"
                id="media-film-episodes-only"
                name="media"
                value="media:Film (Episodes Only)"
              />
              <label
                className="filter-form-label"
                htmlFor="media-film-episodes-only"
              >
                Film (Episodes Only)
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="radio"
                className="filter-form-input"
                id="media-tv"
                name="media"
                value="media:TV Series"
              />
              <label className="filter-form-label" htmlFor="media-tv">
                TV Series
              </label>
            </div>
          </fieldset>
          <fieldset className="filter-form-fieldset">
            <h2 className="filter-form-heading">Era:</h2>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="era-prequel-trilogy"
                name="era"
                value="era:Prequel Trilogy"
              />
              <label
                className="filter-form-label"
                htmlFor="era-prequel-trilogy"
              >
                Prequel Trilogy
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="era-original-trilogy"
                name="era"
                value="era:Original Trilogy"
              />
              <label
                className="filter-form-label"
                htmlFor="era-original-trilogy"
              >
                Original Trilogy
              </label>
            </div>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="era-sequel-trilogy"
                name="era"
                value="era:Sequel Trilogy"
              />
              <label className="filter-form-label" htmlFor="era-sequel-trilogy">
                Sequel Trilogy
              </label>
            </div>
          </fieldset>
        </form>
      </header>
    );
  }

  render() {
    return (
      <div className="App">
        {this.filterForm}
        <div className="planet-cards">{this.renderPlanets()}</div>
      </div>
    );
  }
}

export default App;
