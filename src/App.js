import React, { Component } from 'react';
import { includesAny, search } from 'utils';
import { FILTER_KEY } from './constants';

import Header from 'components/Header/Header.jsx';
import FilterBar from 'components/FilterBar/FilterBar.jsx';
import PlanetCards from 'components/PlanetCards/PlanetCards.jsx';

import planets from 'planets.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        media: 'All',
        era: [],
        myCanon: false
      },
      searchQuery: ''
    };
  }

  handleSearchQueryChange = event => {
    const { searchQuery } = this.state;
    const { value } = event.target;

    if (value !== searchQuery) {
      this.setState({
        searchQuery: value
      });
    }
  };

  handleFilterChange = event => {
    const { filters } = this.state;
    const { name: filterName, value, checked } = event.target;

    const updatedFilters = { ...filters };

    if (filterName === FILTER_KEY.MY_CANON) {
      updatedFilters.myCanon = checked;
    } else if (filterName === FILTER_KEY.ERA) {
      const currentEra = filters.era;

      /**
       * if the newly selected era is already included in filter.era, remove it
       * otherwise, append it to the end of filter.era
       */
      updatedFilters.era = currentEra.includes(value)
        ? currentEra.filter(filter => filter !== value)
        : [...currentEra, value];
    } else {
      updatedFilters[filterName] = value;
    }

    this.setState({
      filters: updatedFilters
    });
  };

  myCanonAppearances = planet =>
    planet.appearances.filter(
      ({ title }) =>
        title !== 'Star Wars: The Clone Wars' &&
        title !== 'Star Wars Resistance' &&
        !title.startsWith('Episode VII') &&
        !title.startsWith('Episode VIII') &&
        !title.startsWith('Episode IX')
    );

  get filteredPlanets() {
    const { filters, searchQuery } = this.state;

    const searchedPlanets = searchQuery.length
      ? planets.filter(({ name }) => search(searchQuery, name))
      : planets;

    const activeFilterKeys = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        /**
         * if key is media and value is not All
         * OR
         * if key is era and value array has a length
         * add filter key to accumulator
         */
        if (
          (key === FILTER_KEY.MEDIA && value !== 'All') ||
          (key === FILTER_KEY.ERA && value.length)
        ) {
          acc.push(key);
        }

        return acc;
      },
      []
    );

    // first determine if myCanon was selected, if so, reduce and modify the planets array
    const filteredPlanets = filters.myCanon
      ? searchedPlanets.reduce((acc, planet) => {
          const appearances = this.myCanonAppearances(planet);

          if (appearances.length) {
            acc.push({
              ...planet,
              appearances
            });
          }

          return acc;
        }, [])
      : searchedPlanets;

    // if both filters are applied check both conditions
    if (activeFilterKeys.length) {
      const { media: selectedMedia, era: selectedEras } = filters;

      if (activeFilterKeys.length > 1) {
        return filteredPlanets.filter(({ appearances }) => {
          if (!appearances.length) {
            return false;
          }

          const matchingAppearances = appearances
            .filter(({ media, title }) =>
              selectedMedia === 'Film (Episodes Only)'
                ? media === 'Film' && title.startsWith('Episode')
                : media === selectedMedia
            )
            .map(({ era }) => era);

          return includesAny(selectedEras, matchingAppearances);
        });
      }

      // if only one filter is applied
      const activeFilterKey = activeFilterKeys[0];

      return filteredPlanets.filter(({ appearances }) => {
        // a map of either all of the eras or all of the media values associated with all of the appearances
        const appearanceValues = appearances.map(
          appearance => appearance[activeFilterKey]
        );

        if (activeFilterKey === 'era') {
          return includesAny(selectedEras, appearanceValues);
        }

        // check if any of the film titles start with "Episode"
        return selectedMedia === 'Film (Episodes Only)'
          ? appearances
              .filter(({ media }) => media === 'Film')
              .some(({ title }) => title.startsWith('Episode'))
          : appearanceValues.includes(selectedMedia);
      });
    }

    return filteredPlanets;
  }

  render() {
    return (
      <div className="App">
        <Header />
        <FilterBar
          searchFormHandler={this.handleSearchQueryChange}
          filterFormHandler={this.handleFilterChange}
        />
        <PlanetCards planets={this.filteredPlanets} />
      </div>
    );
  }
}

export default App;
