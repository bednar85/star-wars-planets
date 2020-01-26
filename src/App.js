import React, { Component, Fragment } from 'react';
import './App.scss';
import { findAny } from './utils';

import planets from './planets.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.appearancesGroupedByEra = this.appearancesGroupedByEra.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.renderAppearances = this.renderAppearances.bind(this);
    this.renderEraVisualizer = this.renderEraVisualizer.bind(this);
    this.renderPlanets = this.renderPlanets.bind(this);
    this.ryanApprovedAppearances = this.ryanApprovedAppearances.bind(this);

    this.state = {
      filters: {
        media: 'All',
        era: [],
        myCanon: false
      }
    };
  }

  handleFilterChange(event) {
    const { filters } = this.state;

    if (event.target.value === 'my-canon') {
      this.setState({
        filters: { ...filters, myCanon: !filters.myCanon }
      });

      return;
    }

    const [key, value] = event.target.value.split(':');

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

  ryanApprovedAppearances(planet) {
    return planet.appearances.filter(appearance => {
      const { title } = appearance;

      return (
        title !== 'Star Wars: The Clone Wars' &&
        title !== 'Star Wars Resistance' &&
        !title.startsWith('Episode VII') &&
        !title.startsWith('Episode VIII') &&
        !title.startsWith('Episode IX')
      );
    });
  }

  get filteredPlanets() {
    const { filters } = this.state;

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

    // first determine if myCanon was selected, if so, reduce and modify the planets array
    const filteredPlanets = filters.myCanon
      ? planets.reduce((reducedPlanets, planet) => {
          const appearances = this.ryanApprovedAppearances(planet) || [];

          if (appearances.length) {
            reducedPlanets.push({
              ...planet,
              appearances: this.ryanApprovedAppearances(planet)
            });
          }

          return reducedPlanets;
        }, [])
      : planets;

    // if both filters are applied check both conditions
    if (activeFilterKeys.length) {
      const { media: selectedMedia, era: selectedEras } = filters;

      if (activeFilterKeys.length > 1) {
        return filteredPlanets.filter(planet => {
          if (!planet.appearances.length) {
            return false;
          }

          const matchingAppearances = planet.appearances
            .filter(appearance =>
              selectedMedia === 'Film (Episodes Only)'
                ? appearance.media === 'Film' &&
                  appearance.title.startsWith('Episode')
                : appearance.media === selectedMedia
            )
            .map(appearance => appearance.era);

          return findAny(selectedEras, matchingAppearances);
        });
      }

      // if only one filter is applied
      const activeFilterKey = activeFilterKeys[0];

      return filteredPlanets.filter(planet => {
        // a map of either all of the eras or all of the media values associated with all of the appearances
        const appearanceValues = planet.appearances.map(
          appearance => appearance[activeFilterKey]
        );

        if (activeFilterKey === 'era') {
          return findAny(selectedEras, appearanceValues);
        }

        // check if any of the film titles start with "Episode"
        return selectedMedia === 'Film (Episodes Only)'
          ? planet.appearances
              .filter(appearance => appearance.media === 'Film')
              .some(appearance => appearance.title.startsWith('Episode'))
          : appearanceValues.includes(selectedMedia);
      });
    }

    return filteredPlanets;
  }

  appearancesGroupedByEra(appearances, media) {
    const appearancesByMedia = media
      ? appearances.filter(appearance => appearance.media === media)
      : appearances;

    const prequelAppearances = appearancesByMedia.filter(
      appearance => appearance.era === 'Prequel Trilogy'
    );

    const originalAppearances = appearancesByMedia.filter(
      appearance => appearance.era === 'Original Trilogy'
    );

    const sequelAppearances = appearancesByMedia.filter(
      appearance => appearance.era === 'Sequel Trilogy'
    );

    return [
      ...prequelAppearances,
      ...originalAppearances,
      ...sequelAppearances
    ];
  }

  renderAppearances(planet) {
    const { appearances } = planet;

    const filmAppearances = this.appearancesGroupedByEra(appearances, 'Film');
    const tvAppearances = this.appearancesGroupedByEra(
      appearances,
      'TV Series'
    );

    const renderEntries = appearances =>
      appearances.map((appearance, index) => {
        const eraModifier = appearance.era.split(' ')[0].toLowerCase();

        return (
          <li
            key={`appearance-${index}`}
            className={`planet-card-appearances-list-item planet-card-appearances-list-item--${eraModifier}`}
          >
            {appearance.title} ({appearance.year})
          </li>
        );
      });

    return (
      <div className="planet-card-appearances">
        {filmAppearances.length ? (
          <Fragment>
            <h4 className="planet-card-appearances-heading">Film</h4>
            <ul className="planet-card-appearances-list">
              {renderEntries(filmAppearances)}
            </ul>
          </Fragment>
        ) : null}
        {tvAppearances.length ? (
          <Fragment>
            <h4 className="planet-card-appearances-heading">TV</h4>
            <ul className="planet-card-appearances-list">
              {renderEntries(tvAppearances)}
            </ul>
          </Fragment>
        ) : null}
      </div>
    );
  }

  renderEraVisualizer(planet) {
    const { appearances } = planet;

    const renderSegments = this.appearancesGroupedByEra(appearances).map(
      (appearance, index) => {
        const eraModifier = appearance.era.split(' ')[0].toLowerCase();

        return (
          <div
            key={`appearance-${index}`}
            className={`planet-card-era-visualizer-segment planet-card-era-visualizer-segment--${eraModifier}`}
          />
        );
      }
    );

    return <div className="planet-card-era-visualizer">{renderSegments}</div>;
  }

  renderPlanets() {
    return this.filteredPlanets.map((planet, index) => {
      return (
        <div key={`planet-${index}`} className="planet-card">
          {this.renderEraVisualizer(planet)}
          <h3 className="planet-card-heading">{planet.name}</h3>
          {this.renderAppearances(planet)}
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
          <fieldset className="filter-form-fieldset">
            <h2 className="filter-form-heading">Canon:</h2>
            <div className="filter-form-input-wrapper">
              <input
                type="checkbox"
                className="filter-form-input"
                id="my-canon"
                name="my-canon"
                value="my-canon"
              />
              <label className="filter-form-label" htmlFor="my-canon">
                My Canon
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
