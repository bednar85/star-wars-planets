import React, { Component } from 'react';
import './App.scss';
import { includesAny, search } from './utils';
import logo from './assets/imgs/star-wars-logo-yellow.png';

import FilterBar from './components/FilterBar/FilterBar.jsx';
import PlanetCards from './components/PlanetCards/PlanetCards.jsx';

import planets from './planets.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.ryanApprovedAppearances = this.ryanApprovedAppearances.bind(this);

    this.state = {
      filters: {
        media: 'All',
        era: [],
        myCanon: false
      },
      searchQuery: ''
    };
  }

  handleSearchQueryChange(event) {
    const { searchQuery } = this.state;

    if (event.target.value !== searchQuery) {
      this.setState({
        searchQuery: event.target.value
      });
    }
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
    const { filters, searchQuery } = this.state;

    console.log('');
    console.log('get filteredPlanets');
    console.log('searchQuery:', searchQuery);

    const searchedPlanets = searchQuery.length
      ? planets.filter(planet => search(searchQuery, planet.name))
      : planets;

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
      ? searchedPlanets.reduce((reducedPlanets, planet) => {
          const appearances = this.ryanApprovedAppearances(planet) || [];

          if (appearances.length) {
            reducedPlanets.push({
              ...planet,
              appearances: this.ryanApprovedAppearances(planet)
            });
          }

          return reducedPlanets;
        }, [])
      : searchedPlanets;

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

          return includesAny(selectedEras, matchingAppearances);
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
          return includesAny(selectedEras, appearanceValues);
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

  get header() {
    return (
      <header className="header">
        <img className="app-logo" src={logo} alt="Star Wars" />
        <span className="image-attribution">
          Illustration by{' '}
          <a
            href="https://www.artstation.com/pabloolivera"
            target="_blank"
            rel="noreferrer noopener"
          >
            Pablo Olivera
          </a>
        </span>
      </header>
    );
  }

  render() {
    return (
      <div className="App">
        {this.header}
        {this.searchAndFilterForms}
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
